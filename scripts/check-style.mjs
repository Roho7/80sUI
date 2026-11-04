import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const REGISTRY = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"))
const COMPONENT_DIRS = ["components/ui", "components/retro"]
const SOURCE_DIRS = ["app", "components", "hooks", "lib", "scripts"]
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".mjs"]
const PLATFORM_PACKAGES = new Set(["react", "react-dom", "next"])

const CLASS_RULES = [
  {
    id: "no-rounded-corners",
    pattern: /\brounded(?!-none\b)(-[a-z0-9]+)?\b/g,
    why: "corners are square; the 1-bit look has no radius",
  },
  {
    id: "no-smooth-motion",
    pattern: /\b(transition(-[a-z]+)?|duration-\d+|ease-(in|out|in-out|linear)|animate-(in|out|spin|pulse|bounce|ping))\b|\b(fade|zoom|slide)-(in|out)\b/g,
    why: "motion is stepped at a low frame rate; use steps() or a stepped timer, never tweened transitions",
  },
  {
    id: "no-alpha-colors",
    pattern: /\b(bg|text|border|ring|fill|stroke|outline|from|to|via|decoration|divide|placeholder)-[a-z0-9-]+\/\d+\b|\bopacity-\d+\b/g,
    why: "colors are the four inks; shades come from dither-25/50/75, never alpha",
  },
  {
    id: "no-soft-effects",
    pattern: /\bshadow-(xs|sm|md|lg|xl|2xl|inner)\b|\b(backdrop-)?blur(-[a-z0-9]+)?\b|\bbg-(gradient|linear|radial|conic)-[a-z-]+\b|\bdrop-shadow(-[a-z0-9]+)?\b/g,
    why: "edges are hard: offset-shadow-*, bevel-raised/sunken or pixel-border instead",
  },
  {
    id: "no-off-system-fonts",
    pattern: /\bfont-(sans|serif)\b/g,
    why: "type is font-pixel for labels and titles, font-mono for body",
  },
  {
    id: "no-raw-border-widths",
    pattern: /\bborder(-[xytblr])?-(2|4|8)\b/g,
    why: "borders are --pixel multiples: pixel-border or border-(length:--pixel)",
  },
  {
    id: "no-literal-colors",
    pattern: /#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/g,
    why: "colors come from tokens (--ink-*, shadcn tokens, --keycap-*), never literals",
  },
  {
    id: "no-framer-or-gsap",
    pattern: /from\s+["'](framer-motion|motion\/react|gsap|react-spring)["']/g,
    why: "animations are stepped CSS or the shader mount's stepped clock",
  },
]

const COMMENT_PATTERN = /(^|[^:"'`\\])\/\/(?!\/?\s*<reference)|\/\*|\{\s*\/\*/

function listFiles(directory) {
  if (!existsSync(directory)) {
    return []
  }
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? listFiles(path) : [path]
  })
}

function isSourceFile(path) {
  return SOURCE_EXTENSIONS.some((extension) => path.endsWith(extension)) && !path.endsWith(".generated.ts")
}

function stripStrings(line) {
  return line.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, '""')
}

function findClassViolations(path, text) {
  const violations = []
  text.split("\n").forEach((line, index) => {
    for (const rule of CLASS_RULES) {
      for (const match of line.matchAll(rule.pattern)) {
        violations.push({ path, line: index + 1, rule: rule.id, found: match[0], why: rule.why })
      }
    }
  })
  return violations
}

function findComments(path, text) {
  const violations = []
  let isInTemplate = false
  text.split("\n").forEach((line, index) => {
    const backticks = (line.match(/`/g) ?? []).length
    const code = isInTemplate ? "" : stripStrings(line)
    if (backticks % 2 === 1) {
      isInTemplate = !isInTemplate
    }
    if (COMMENT_PATTERN.test(code) || (isInTemplate && /^\s*\/\//.test(line))) {
      violations.push({ path, line: index + 1, rule: "no-comments", found: line.trim().slice(0, 60), why: "the codebase carries no comments at all, GLSL included" })
    }
  })
  return violations
}

function listImports(text) {
  return [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1])
}

function readPackageName(specifier) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function findRegistryViolations() {
  const violations = []
  const itemByFile = new Map()
  for (const item of REGISTRY.items) {
    for (const file of item.files ?? []) {
      itemByFile.set(file.path, item.name)
      if (file.target?.startsWith("~/")) {
        itemByFile.set(file.target.slice(2), item.name)
      }
      if (!existsSync(join(ROOT, file.path))) {
        violations.push({ path: "registry.json", line: 0, rule: "registry-file-exists", found: `${item.name}: ${file.path}`, why: "every registry file must exist" })
      }
    }
  }
  for (const directory of COMPONENT_DIRS) {
    for (const path of listFiles(join(ROOT, directory)).filter(isSourceFile)) {
      const file = relative(ROOT, path)
      if (!itemByFile.has(file)) {
        violations.push({ path: file, line: 0, rule: "registry-covers-component", found: file, why: "every component file ships in a registry item; add it to registry.json" })
      }
    }
  }
  for (const item of REGISTRY.items) {
    const declared = new Set(item.registryDependencies ?? [])
    const npmDeclared = new Set(item.dependencies ?? [])
    if ((item.type === "registry:ui" || item.type === "registry:block") && !declared.has("@nostalgui/theme")) {
      violations.push({ path: "registry.json", line: 0, rule: "registry-depends-on-theme", found: item.name, why: "every component needs the theme tokens and utilities" })
    }
    for (const file of item.files ?? []) {
      const filePath = join(ROOT, file.path)
      if (!existsSync(filePath)) {
        continue
      }
      for (const specifier of listImports(readFileSync(filePath, "utf8"))) {
        if (specifier.startsWith("@/")) {
          const target = ["", ".tsx", ".ts", "/index.ts"].map((extension) => `${specifier.slice(2)}${extension}`).find((candidate) => itemByFile.has(candidate))
          const owner = target ? itemByFile.get(target) : undefined
          if (owner === undefined) {
            if (specifier !== "@/lib/utils") {
              violations.push({ path: file.path, line: 0, rule: "registry-import-shipped", found: specifier, why: "an imported local file must ship in some registry item" })
            }
            continue
          }
          if (owner !== item.name && !declared.has(`@nostalgui/${owner}`)) {
            violations.push({ path: file.path, line: 0, rule: "registry-declares-import", found: `${item.name} imports ${specifier} but does not list @nostalgui/${owner}`, why: "an install would miss that file" })
          }
          continue
        }
        if (specifier.startsWith(".") || specifier.startsWith("node:")) {
          continue
        }
        const packageName = readPackageName(specifier)
        if (!PLATFORM_PACKAGES.has(packageName) && !npmDeclared.has(packageName)) {
          violations.push({ path: file.path, line: 0, rule: "registry-declares-package", found: `${item.name} imports ${packageName}`, why: "list it in the item's dependencies so the CLI installs it" })
        }
      }
    }
  }
  return violations
}

function findRoadmapViolations() {
  const roadmapPath = join(ROOT, "ROADMAP.md")
  if (!existsSync(roadmapPath)) {
    return []
  }
  const shipped = new Set(REGISTRY.items.filter((item) => item.type === "registry:ui" || item.type === "registry:block").map((item) => item.name))
  const violations = []
  readFileSync(roadmapPath, "utf8").split("\n").forEach((line, index) => {
    const entry = line.match(/^- \[( |x)\] ([a-z0-9-]+)/)
    if (entry === null) {
      return
    }
    const [, mark, name] = entry
    if (mark === "x" && !shipped.has(name)) {
      violations.push({ path: "ROADMAP.md", line: index + 1, rule: "roadmap-matches-registry", found: name, why: "ticked but not a registry:ui or registry:block item" })
    }
    if (mark === " " && shipped.has(name)) {
      violations.push({ path: "ROADMAP.md", line: index + 1, rule: "roadmap-matches-registry", found: name, why: "shipped in registry.json but not ticked" })
    }
  })
  return violations
}

function checkStyle() {
  const violations = []
  for (const directory of SOURCE_DIRS) {
    for (const path of listFiles(join(ROOT, directory)).filter(isSourceFile)) {
      const text = readFileSync(path, "utf8")
      const file = relative(ROOT, path)
      violations.push(...findComments(file, text))
      if (file.startsWith("components/") || file.startsWith("app/")) {
        violations.push(...findClassViolations(file, text))
      }
    }
  }
  violations.push(...findRegistryViolations())
  violations.push(...findRoadmapViolations())
  return violations
}

const violations = checkStyle()
if (violations.length > 0) {
  for (const violation of violations) {
    const location = violation.line > 0 ? `${violation.path}:${violation.line}` : violation.path
    console.error(`${location}  [${violation.rule}]  ${violation.found}\n    ${violation.why}`)
  }
  console.error(`\ncheck-style: ${violations.length} violation(s)`)
  process.exit(1)
}
console.log("check-style: clean")
