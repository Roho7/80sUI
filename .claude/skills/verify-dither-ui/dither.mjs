#!/usr/bin/env node
import { execSync, spawn } from "node:child_process"
import { existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const SKILL_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SKILL_DIR, "..", "..", "..")
const STATE_DIR = join(ROOT, ".verify")
const EVIDENCE_ROOT = join(STATE_DIR, "evidence")
const PID_FILE = join(STATE_DIR, "dev.pid")
const LOG_FILE = join(STATE_DIR, "dev.log")
const PORT = Number(process.env.DITHER_PORT ?? 3000)
const BASE_URL = `http://localhost:${PORT}`
const PALETTES = [
  { slug: "phosphor", label: "Phosphor" },
  { slug: "cyan-pixel", label: "Cyan pixel" },
  { slug: "retro-candy", label: "Retro Candy" },
]
const THEMES = PALETTES.flatMap(({ slug, label }) => [
  { name: `${slug}-light`, slug, palette: label, isDark: false },
  { name: `${slug}-dark`, slug, palette: label, isDark: true },
])
const ROUTES = [
  { path: "/components", minWidth: 0 },
  { path: "/", minWidth: 1280 },
]

function readPortOwnerDirectory() {
  try {
    const pid = execSync(`lsof -t -nP -iTCP:${PORT} -sTCP:LISTEN`, { encoding: "utf8" }).trim().split("\n")[0]
    if (!pid) {
      return null
    }
    const cwd = execSync(`lsof -a -p ${pid} -d cwd -Fn`, { encoding: "utf8" }).split("\n").find((line) => line.startsWith("n"))
    return { pid: Number(pid), cwd: cwd ? cwd.slice(1) : "" }
  } catch {
    return null
  }
}

async function fetchStatus(path) {
  try {
    const response = await fetch(`${BASE_URL}${path}`)
    return { status: response.status, body: await response.text() }
  } catch {
    return { status: 0, body: "" }
  }
}

async function runDoctor() {
  const owner = readPortOwnerDirectory()
  const components = await fetchStatus("/components")
  const registryItem = await fetchStatus("/r/button.json")
  const checks = [
    { name: `port ${PORT} is listening`, isOk: owner !== null, detail: owner ? `pid ${owner.pid}` : "nothing listening; run up" },
    { name: "port owner runs from this repo", isOk: owner !== null && owner.cwd === ROOT, detail: owner?.cwd ?? "" },
    { name: "/components renders the catalogue", isOk: components.status === 200 && components.body.includes("Components / dither-ui") && components.body.includes('id="button"'), detail: `HTTP ${components.status}` },
    { name: "registry serves /r/button.json", isOk: registryItem.status === 200 && registryItem.body.includes('"name": "button"'), detail: `HTTP ${registryItem.status}` },
    { name: "Google Chrome is installed", isOk: existsSync("/Applications/Google Chrome.app"), detail: "playwright-core drives the installed Chrome" },
  ]
  for (const check of checks) {
    console.log(`${check.isOk ? "ok  " : "FAIL"}  ${check.name}  ${check.detail}`)
  }
  const isHealthy = checks.every((check) => check.isOk)
  console.log(isHealthy ? "doctor: healthy" : "doctor: not healthy")
  return isHealthy
}

async function waitForReady(timeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const page = await fetchStatus("/components")
    if (page.status === 200 && page.body.includes('id="button"')) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

async function startServer() {
  const owner = readPortOwnerDirectory()
  if (owner && owner.cwd === ROOT) {
    console.log(`up: reusing the dev server already running from this repo (pid ${owner.pid}); down will not stop it`)
    return waitForReady(60000)
  }
  if (owner) {
    console.error(`up: port ${PORT} belongs to ${owner.cwd}; set DITHER_PORT or stop that server yourself`)
    return false
  }
  mkdirSync(STATE_DIR, { recursive: true })
  const log = openSync(LOG_FILE, "w")
  const child = spawn("npm", ["run", "dev", "--", "--port", String(PORT)], { cwd: ROOT, detached: true, stdio: ["ignore", log, log] })
  child.unref()
  writeFileSync(PID_FILE, String(child.pid))
  console.log(`up: started next dev (pid ${child.pid}), log at ${LOG_FILE}`)
  const isReady = await waitForReady(120000)
  console.log(isReady ? "up: ready" : `up: not ready after 120s, see ${LOG_FILE}`)
  return isReady
}

function stopServer() {
  if (!existsSync(PID_FILE)) {
    console.log("down: no server started by this skill; nothing to stop")
    return true
  }
  const pid = Number(readFileSync(PID_FILE, "utf8"))
  try {
    process.kill(-pid, "SIGTERM")
    console.log(`down: stopped process group ${pid}`)
  } catch {
    console.log(`down: process group ${pid} was already gone`)
  }
  rmSync(PID_FILE, { force: true })
  rmSync(LOG_FILE, { force: true })
  console.log(`down: evidence kept in ${EVIDENCE_ROOT}`)
  return true
}

function runChecks() {
  const commands = ["npm run lint", "npm run typecheck", "npm run check:style", "node scripts/generate-showcase-index.mjs"]
  let isOk = true
  for (const command of commands) {
    try {
      execSync(command, { cwd: ROOT, stdio: "inherit" })
      console.log(`ok    ${command}`)
    } catch {
      console.log(`FAIL  ${command}`)
      isOk = false
    }
  }
  return isOk
}

function createEvidenceDir(label) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const directory = join(EVIDENCE_ROOT, `${stamp}-${label}`)
  mkdirSync(directory, { recursive: true })
  return directory
}

async function launchBrowser() {
  const { chromium } = await import("playwright-core")
  return chromium.launch({ channel: "chrome", headless: true })
}

async function applyTheme(page, theme) {
  await page.getByRole("button", { name: theme.palette, exact: true }).first().click()
  const darkToggle = page.getByRole("checkbox", { name: "Dark mode" }).first()
  const isChecked = (await darkToggle.getAttribute("aria-checked")) === "true"
  if (isChecked !== theme.isDark) {
    await darkToggle.click()
  }
  await page.waitForFunction(
    ({ palette, isDark }) =>
      document.documentElement.dataset.theme === palette && document.documentElement.classList.contains("dark") === isDark,
    { palette: theme.slug, isDark: theme.isDark }
  )
  await page.waitForTimeout(400)
}

function auditPage() {
  const MAX_EXAMPLES = 8
  const probe = document.createElement("span")
  document.body.appendChild(probe)
  const readColor = (value) => {
    probe.style.color = value
    return getComputedStyle(probe).color
  }
  const allowed = new Set(["--ink-0", "--ink-1", "--ink-2", "--ink-3", "--desktop"].map((token) => readColor(`var(${token})`)))
  probe.remove()
  const isTransparent = (color) => color === "transparent" || /rgba\([^)]*,\s*0\)$/.test(color)
  const isAllowed = (color) => isTransparent(color) || allowed.has(color.replace(/rgba\((\d+), (\d+), (\d+), 1\)/, "rgb($1, $2, $3)"))
  const describe = (element) => {
    const slot = element.closest("[data-slot]")?.getAttribute("data-slot")
    const card = element.closest("article")?.id
    return [card, slot, element.tagName.toLowerCase()].filter(Boolean).join(" > ")
  }
  const findings = { offPalette: [], rounded: [], tweened: [], translucent: [], overflow: [] }
  const push = (list, entry) => {
    if (!list.some((existing) => existing.where === entry.where && existing.what === entry.what)) {
      list.push(entry)
    }
  }
  const elements = [...document.body.querySelectorAll("*")].filter(
    (element) => !element.closest("nextjs-portal, script, style, [data-nextjs-toast], [data-next-badge-root]")
  )
  for (const element of elements) {
    const style = getComputedStyle(element)
    const box = element.getBoundingClientRect()
    if (style.display === "none" || style.visibility === "hidden" || box.width === 0 || box.height === 0) {
      continue
    }
    const where = describe(element)
    const colors = [["color", style.color], ["background", style.backgroundColor]]
    for (const side of ["Top", "Right", "Bottom", "Left"]) {
      if (parseFloat(style[`border${side}Width`]) > 0 && style[`border${side}Style`] !== "none") {
        colors.push([`border-${side.toLowerCase()}`, style[`border${side}Color`]])
      }
    }
    if (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) {
      colors.push(["outline", style.outlineColor])
    }
    for (const shadowColor of style.boxShadow.match(/rgba?\([^)]*\)/g) ?? []) {
      colors.push(["box-shadow", shadowColor])
    }
    if (element instanceof SVGGeometryElement && style.fill !== "none") {
      colors.push(["fill", style.fill])
    }
    for (const [property, value] of colors) {
      if (!isAllowed(value)) {
        push(findings.offPalette, { where, what: `${property} ${value}` })
      }
    }
    if (["TopLeft", "TopRight", "BottomLeft", "BottomRight"].some((corner) => parseFloat(style[`border${corner}Radius`]) > 0)) {
      push(findings.rounded, { where, what: style.borderRadius })
    }
    if (style.transitionDuration.split(",").some((duration) => parseFloat(duration) > 0) && !/steps\(/.test(style.transitionTimingFunction)) {
      push(findings.tweened, { where, what: `transition ${style.transitionProperty} ${style.transitionDuration} ${style.transitionTimingFunction}` })
    }
    if (style.animationName !== "none" && !/steps\(/.test(style.animationTimingFunction) && style.animationName !== "blink") {
      push(findings.tweened, { where, what: `animation ${style.animationName} ${style.animationTimingFunction}` })
    }
    if (parseFloat(style.opacity) < 1 && style.animationName !== "blink") {
      push(findings.translucent, { where, what: `opacity ${style.opacity}` })
    }
  }
  for (const figure of document.querySelectorAll("article figure")) {
    const bounds = figure.getBoundingClientRect()
    const label = `${figure.closest("article")?.id} > ${figure.querySelector("figcaption")?.textContent}`
    const scroller = figure.querySelector(":scope > div")
    if (scroller && scroller.scrollWidth > scroller.clientWidth + 1) {
      push(findings.overflow, { where: label, what: `scrolls ${scroller.scrollWidth - scroller.clientWidth}px inside its cell` })
    }
    for (const element of figure.querySelectorAll("*")) {
      let ancestor = element.parentElement
      let isClipped = false
      while (ancestor && ancestor !== figure) {
        if (getComputedStyle(ancestor).overflowX !== "visible") {
          isClipped = true
          break
        }
        ancestor = ancestor.parentElement
      }
      const rect = element.getBoundingClientRect()
      if (!isClipped && rect.width > 0 && (rect.left < bounds.left - 1 || rect.right > bounds.right + 1)) {
        push(findings.overflow, { where: label, what: "paints outside its cell" })
        break
      }
    }
  }
  const pageOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth
  if (pageOverflow > 0) {
    push(findings.overflow, { where: "page", what: `scrolls sideways by ${pageOverflow}px` })
  }
  const summary = Object.fromEntries(Object.entries(findings).map(([key, list]) => [key, { count: list.length, examples: list.slice(0, MAX_EXAMPLES) }]))
  return { allowedColors: [...allowed], cells: document.querySelectorAll("article figure").length, summary }
}

async function runAudit(widths) {
  const evidenceDir = createEvidenceDir("audit")
  const browser = await launchBrowser()
  const report = []
  try {
    for (const width of widths) {
      for (const { path: route, minWidth } of ROUTES) {
        if (width < minWidth) {
          console.log(`skip  ${route} @${width}: designed for ${minWidth}px and wider`)
          continue
        }
        const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
        const page = await context.newPage()
        const consoleErrors = []
        page.on("console", (message) => {
          if (message.type() === "error") {
            consoleErrors.push(message.text())
          }
        })
        page.on("pageerror", (error) => consoleErrors.push(error.message))
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" })
        for (const theme of THEMES) {
          await applyTheme(page, theme)
          const result = await page.evaluate(auditPage)
          const name = `${route === "/" ? "desktop" : "components"}-${width}-${theme.name}`
          await page.screenshot({ path: join(evidenceDir, `${name}.png`), fullPage: route !== "/" })
          report.push({ route, width, theme: theme.name, ...result })
        }
        report.push({ route, width, theme: "all", consoleErrors })
        await context.close()
      }
    }
  } finally {
    await browser.close()
  }
  writeFileSync(join(evidenceDir, "audit.json"), JSON.stringify(report, null, 2))
  let problemCount = 0
  for (const entry of report) {
    if (entry.consoleErrors) {
      problemCount += entry.consoleErrors.length
      console.log(`${entry.route} @${entry.width}  console errors: ${entry.consoleErrors.length}${entry.consoleErrors.length ? `  ${entry.consoleErrors.slice(0, 3).join(" | ")}` : ""}`)
      continue
    }
    const counts = Object.entries(entry.summary).map(([key, value]) => `${key} ${value.count}`).join(", ")
    problemCount += Object.values(entry.summary).reduce((total, value) => total + value.count, 0)
    console.log(`${entry.route} @${entry.width} ${entry.theme}  ${counts}`)
    for (const [key, value] of Object.entries(entry.summary)) {
      for (const example of value.examples) {
        console.log(`    ${key}: ${example.where}  ${example.what}`)
      }
    }
  }
  console.log(`\naudit: ${problemCount === 0 ? "clean" : `${problemCount} problem(s)`}; evidence in ${evidenceDir}`)
  return problemCount === 0
}

async function captureCard(name, themeName) {
  const evidenceDir = createEvidenceDir(`shot-${name}`)
  const theme = THEMES.find((candidate) => candidate.name === themeName) ?? THEMES[0]
  const browser = await launchBrowser()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
    await page.goto(`${BASE_URL}/components`, { waitUntil: "networkidle" })
    await applyTheme(page, theme)
    const card = page.locator(`article#${name}`)
    if ((await card.count()) === 0) {
      console.error(`shot: no card with id "${name}"; card ids are registry item names`)
      return false
    }
    await card.scrollIntoViewIfNeeded()
    const path = join(evidenceDir, `${name}-${theme.name}.png`)
    await card.screenshot({ path })
    console.log(`shot: ${path}`)
    return true
  } finally {
    await browser.close()
  }
}

async function runJourney(name) {
  const journeyPath = join(SKILL_DIR, "features", "journeys", `${name}.mjs`)
  if (!existsSync(journeyPath)) {
    console.error(`journey: no journey "${name}" in features/journeys`)
    return false
  }
  const { default: journey } = await import(journeyPath)
  const evidenceDir = createEvidenceDir(`journey-${name}`)
  const browser = await launchBrowser()
  const steps = []
  const expect = (label, isTrue, detail = "") => {
    steps.push({ label, isOk: Boolean(isTrue), detail })
    console.log(`${isTrue ? "ok  " : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`)
  }
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
    const consoleErrors = []
    page.on("pageerror", (error) => consoleErrors.push(error.message))
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text())
      }
    })
    await journey({ page, baseUrl: BASE_URL, evidenceDir, expect, applyTheme: (themeName) => applyTheme(page, THEMES.find((theme) => theme.name === themeName) ?? THEMES[0]) })
    expect("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "))
  } catch (error) {
    expect("journey ran to the end", false, error instanceof Error ? error.message : String(error))
  } finally {
    await browser.close()
  }
  writeFileSync(join(evidenceDir, "journey.json"), JSON.stringify(steps, null, 2))
  const isOk = steps.every((step) => step.isOk)
  console.log(`\njourney ${name}: ${isOk ? "passed" : "failed"}; evidence in ${evidenceDir}`)
  return isOk
}

const [command, ...args] = process.argv.slice(2)
const COMMANDS = {
  doctor: () => runDoctor(),
  up: () => startServer(),
  down: () => stopServer(),
  check: () => runChecks(),
  audit: () => runAudit(args.length > 0 ? args.map(Number) : [1440, 375]),
  shot: () => captureCard(args[0], args[1]),
  journey: () => runJourney(args[0]),
}
if (!(command in COMMANDS)) {
  console.log(`usage: dither.mjs doctor | up | down | check | audit [widths...] | shot <item> [${THEMES.map((theme) => theme.name).join("|")}] | journey <name>`)
  process.exit(command ? 1 : 0)
}
const isOk = await COMMANDS[command]()
process.exit(isOk ? 0 : 1)
