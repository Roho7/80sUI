import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = fileURLToPath(new URL("..", import.meta.url))
const REGISTRY_PATH = join(ROOT, "registry.json")
const DEMOS_DIRECTORY = join(ROOT, "components/showcase/demos")
const SHOWCASE_OUTPUT_PATH = join(ROOT, "components/showcase/demos.generated.ts")
const DOCS_OUTPUT_PATH = join(ROOT, "lib/docs/registry-docs.generated.json")
const TSCONFIG_PATH = join(ROOT, "tsconfig.json")
const DEMOS_PATH_LABEL = "components/showcase/demos"
const NAMESPACE_PREFIX = "@ui95/"
const SHOWCASED_TYPES = new Set(["registry:ui", "registry:block"])
const SECTION_BY_TYPE = {
  "registry:ui": "components",
  "registry:block": "blocks",
  "registry:lib": "utilities",
}
const EXCLUDED_TYPES = new Set(["registry:style"])
const PROJECT_ROOT_TARGET_PREFIX = "~/"
const NULLISH_UNION_MEMBER = /\s\|\s(?:undefined|null)(?![\w$])/g

function toIdentifier(name) {
  return `${name.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase())}Demo`
}

function listDemoNames() {
  return readdirSync(DEMOS_DIRECTORY)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.slice(0, -".tsx".length))
}

function findProblems(items, showcased, demoNames) {
  const showcasedNames = new Set(showcased.map((item) => item.name))
  const demoNameSet = new Set(demoNames)
  const missingDemos = showcased
    .filter((item) => !demoNameSet.has(item.name))
    .map(
      (item) =>
        `registry item "${item.name}" (${item.type}) has no demo. Add ${DEMOS_PATH_LABEL}/${item.name}.tsx exporting \`demo: ShowcaseDemo\`.`
    )
  const orphanDemos = demoNames
    .filter((name) => !showcasedNames.has(name))
    .map((name) => {
      const item = items.find((candidate) => candidate.name === name)
      const reason = item
        ? `registry item "${name}" is ${item.type}, and only ${[...SHOWCASED_TYPES].join(" and ")} items are showcased`
        : `registry.json has no item named "${name}"`
      return `${DEMOS_PATH_LABEL}/${name}.tsx has no showcased registry item: ${reason}. Remove the demo or add the item.`
    })
  const unknownTypes = items
    .filter((item) => !EXCLUDED_TYPES.has(item.type) && !(item.type in SECTION_BY_TYPE))
    .map(
      (item) =>
        `registry item "${item.name}" has type ${item.type}, which has no docs section. Add it to SECTION_BY_TYPE or EXCLUDED_TYPES in scripts/generate-registry-docs.mjs.`
    )
  return [...missingDemos, ...orphanDemos, ...unknownTypes]
}

function buildIndexSource(showcased) {
  const imports = showcased
    .map((item) => ({
      path: `./demos/${item.name}`,
      line: `import { demo as ${toIdentifier(item.name)} } from "./demos/${item.name}"`,
    }))
    .sort((first, second) => first.path.localeCompare(second.path))
    .map(({ line }) => line)
  const entries = showcased.map((item) =>
    [
      "  {",
      `    name: ${JSON.stringify(item.name)},`,
      `    title: ${JSON.stringify(item.title ?? item.name)},`,
      `    description: ${JSON.stringify(item.description ?? "")},`,
      `    demo: ${toIdentifier(item.name)},`,
      "  },",
    ].join("\n")
  )
  return [
    ...imports,
    'import type { ShowcaseEntry } from "./types"',
    "",
    "export const SHOWCASE_ENTRIES: readonly ShowcaseEntry[] = [",
    ...entries,
    "]",
    "",
  ].join("\n")
}

function writeIfChanged(path, source) {
  const isUnchanged = existsSync(path) && readFileSync(path, "utf8") === source
  if (!isUnchanged) {
    writeFileSync(path, source)
  }
  return isUnchanged
}

function readInstalledPath(file) {
  return file.target?.startsWith(PROJECT_ROOT_TARGET_PREFIX)
    ? file.target.slice(PROJECT_ROOT_TARGET_PREFIX.length)
    : file.path
}

function readUpdatedAt(files) {
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    return date === "" ? null : date
  } catch {
    return null
  }
}

function createApiReader(items) {
  const ts = createRequire(import.meta.url)("typescript")
  const config = ts.getParsedCommandLineOfConfigFile(TSCONFIG_PATH, {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic() {},
  })
  const rootNames = items
    .flatMap((item) => item.files ?? [])
    .filter((file) => /\.tsx?$/.test(file.path))
    .map((file) => join(ROOT, file.path))
  const program = ts.createProgram(rootNames, config.options)
  const checker = program.getTypeChecker()

  function findFunction(node) {
    if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
      return node
    }
    if (ts.isVariableDeclaration(node) && node.initializer) {
      return findFunction(node.initializer)
    }
    if (ts.isCallExpression(node)) {
      for (const argument of node.arguments) {
        const found = findFunction(argument)
        if (found) {
          return found
        }
      }
    }
    return undefined
  }

  function readParameterDefaults(declaration) {
    const defaults = new Map()
    const pattern = findFunction(declaration)?.parameters[0]?.name
    if (!pattern || !ts.isObjectBindingPattern(pattern)) {
      return defaults
    }
    for (const element of pattern.elements) {
      if (element.initializer) {
        defaults.set((element.propertyName ?? element.name).getText(), element.initializer.getText())
      }
    }
    return defaults
  }

  function readVariantDefaults(sourceFile) {
    const defaults = new Map()
    function visit(node) {
      if (
        ts.isPropertyAssignment(node) &&
        node.name.getText() === "defaultVariants" &&
        ts.isObjectLiteralExpression(node.initializer)
      ) {
        for (const property of node.initializer.properties) {
          if (ts.isPropertyAssignment(property) && !defaults.has(property.name.getText())) {
            defaults.set(property.name.getText(), property.initializer.getText())
          }
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    return defaults
  }

  function isOwnProp(prop) {
    const declarations = prop.getDeclarations() ?? []
    return (
      declarations.length === 0 ||
      declarations.some((declaration) => {
        const fileName = declaration.getSourceFile().fileName
        return !fileName.includes("node_modules") || fileName.includes("class-variance-authority")
      })
    )
  }

  function stripNullish(text) {
    return text.replace(NULLISH_UNION_MEMBER, "")
  }

  function readProps(symbol, declaration, variantDefaults) {
    const parameter = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures()[0]?.getParameters()[0]
    if (!parameter) {
      return []
    }
    const parameterDefaults = readParameterDefaults(declaration)
    return checker
      .getTypeOfSymbolAtLocation(parameter, declaration)
      .getProperties()
      .filter(isOwnProp)
      .map((prop) => ({
        name: prop.name,
        type: stripNullish(
          checker.typeToString(
            checker.getTypeOfSymbolAtLocation(prop, declaration),
            declaration,
            ts.TypeFormatFlags.NoTruncation
          )
        ),
        required: (prop.flags & ts.SymbolFlags.Optional) === 0,
        defaultValue: parameterDefaults.get(prop.name) ?? variantDefaults.get(prop.name) ?? null,
      }))
  }

  return function readApi(filePath) {
    const sourceFile = program.getSourceFile(join(ROOT, filePath))
    const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile)
    if (!moduleSymbol) {
      return []
    }
    const variantDefaults = readVariantDefaults(sourceFile)
    return checker
      .getExportsOfModule(moduleSymbol)
      .filter((exported) => /^[A-Z]/.test(exported.name))
      .flatMap((exported) => {
        const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
        const declaration = symbol.valueDeclaration
        const isCallable =
          declaration && checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures().length > 0
        return isCallable
          ? [{ name: exported.name, props: readProps(symbol, declaration, variantDefaults) }]
          : []
      })
  }
}

function buildRegistryDocs(items) {
  const documented = items.filter((item) => item.type in SECTION_BY_TYPE)
  const readApi = createApiReader(documented)
  const demoNames = new Set(listDemoNames())
  const toDocName = (registryName) =>
    registryName.startsWith(NAMESPACE_PREFIX) ? registryName.slice(NAMESPACE_PREFIX.length) : registryName
  const documentedNames = new Set(documented.map((item) => item.name))
  const dependenciesByItem = new Map(
    documented.map((item) => [
      item.name,
      (item.registryDependencies ?? []).map(toDocName).filter((name) => documentedNames.has(name)),
    ])
  )
  return documented.map((item) => {
    const files = item.files ?? []
    const demoPath = `${DEMOS_PATH_LABEL}/${item.name}.tsx`
    const hasDemo = demoNames.has(item.name)
    return {
      name: item.name,
      title: item.title ?? item.name,
      description: item.description ?? "",
      section: SECTION_BY_TYPE[item.type],
      notes: item.docs ?? null,
      dependencies: item.dependencies ?? [],
      registryDependencies: dependenciesByItem.get(item.name),
      usedBy: documented
        .filter((other) => other.name !== item.name && dependenciesByItem.get(other.name).includes(item.name))
        .map((other) => other.name),
      sounds: item.meta?.sounds ?? [],
      files: files.map((file) => ({
        path: readInstalledPath(file),
        source: readFileSync(join(ROOT, file.path), "utf8"),
      })),
      demoSource: hasDemo ? readFileSync(join(ROOT, demoPath), "utf8") : null,
      api: files.filter((file) => /\.tsx$/.test(file.path)).flatMap((file) => readApi(file.path)),
      updatedAt: readUpdatedAt(files.map((file) => file.path)),
      hasDemo,
    }
  })
}

const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"))
const showcased = registry.items.filter((item) => SHOWCASED_TYPES.has(item.type))
const problems = findProblems(registry.items, showcased, listDemoNames())

if (problems.length > 0) {
  console.error(`generate-registry-docs: ${problems.length} problem(s)`)
  for (const problem of problems) {
    console.error(`  - ${problem}`)
  }
  process.exit(1)
}

const isIndexUnchanged = writeIfChanged(SHOWCASE_OUTPUT_PATH, buildIndexSource(showcased))
const docs = buildRegistryDocs(registry.items)
const isDocsUnchanged = writeIfChanged(DOCS_OUTPUT_PATH, `${JSON.stringify(docs, null, 2)}\n`)
const propCount = docs.reduce(
  (total, doc) => total + doc.api.reduce((sum, component) => sum + component.props.length, 0),
  0
)
console.log(
  `generate-registry-docs: ${showcased.length} showcased item(s)${isIndexUnchanged ? ", index unchanged" : ", index written"}; ${docs.length} doc page(s), ${propCount} prop(s)${isDocsUnchanged ? ", docs unchanged" : ", docs written"}`
)
