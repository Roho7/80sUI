import { PALETTES } from "@/app/_site/palettes"
import { findDoc } from "@/lib/docs/registry-docs"
import registry from "@/registry.json"

type CssDeclarations = Record<string, string>
type CssTree = { [selector: string]: string | CssTree }

type ThemeItem = {
  docs?: string
  cssVars: { theme: CssDeclarations; light: CssDeclarations; dark: CssDeclarations }
  css: CssTree
}

export type TokenGroupId =
  | "inks"
  | "surfaces"
  | "actions"
  | "lines"
  | "depth"
  | "window"
  | "keycap"
  | "charts"
  | "sidebar"
  | "type"
  | "other"

export type ThemeToken = {
  name: string
  light: string
  dark: string | null
  note: string | null
  usedBy: readonly string[]
  isColor: boolean
}

export type TokenGroup = {
  id: TokenGroupId
  title: string
  summary: string
  tokens: readonly ThemeToken[]
}

export type ThemeUtility = {
  name: string
  note: string | null
  usedBy: readonly string[]
}

export type PaletteInks = {
  value: string
  label: string
  light: readonly string[]
  dark: readonly string[]
}

const GROUPS: readonly { id: TokenGroupId; title: string; summary: string; match: (name: string) => boolean }[] = [
  { id: "inks", title: "Inks", summary: "The raw palette. Every other color token points at one of these.", match: (name) => /^ink-\d$/.test(name) || name === "desktop" },
  { id: "surfaces", title: "Surfaces", summary: "Where content sits.", match: (name) => /^(background|foreground|card|popover)(-foreground)?$/.test(name) },
  { id: "actions", title: "Actions and states", summary: "Emphasis, hover and error.", match: (name) => /^(primary|secondary|muted|accent|destructive)(-foreground)?$/.test(name) },
  { id: "lines", title: "Lines and focus", summary: "Borders, field outlines and focus rings.", match: (name) => ["border", "input", "ring"].includes(name) },
  { id: "depth", title: "Depth", summary: "Light comes from the top-left. Bevels and wells are drawn from these.", match: (name) => name.startsWith("bevel-") || name.startsWith("well") },
  { id: "window", title: "Windows", summary: "Title bars of windows, dialogs and caption plates.", match: (name) => name.startsWith("titlebar") },
  { id: "keycap", title: "Keycaps", summary: "The CTA button's raised key.", match: (name) => name.startsWith("keycap") },
  { id: "charts", title: "Charts", summary: "Chart series, one ink each.", match: (name) => name.startsWith("chart-") },
  { id: "sidebar", title: "Sidebar", summary: "The Sidebar component's own surface, actions and lines.", match: (name) => name.startsWith("sidebar") },
  { id: "type", title: "Type and scale", summary: "Fonts, the pixel unit and the (zero) radius.", match: (name) => name.startsWith("font-") || name === "pixel" || name === "radius" },
]

const TOKEN_NOTES: Record<string, string> = {
  "ink-0": "Darkest ink. Text, borders and shadows in light mode.",
  "ink-1": "Dark midtone. Lowlights and the well surface.",
  "ink-2": "Light midtone. Secondary fills and the bevel shade.",
  "ink-3": "Lightest standard ink. Cards and faces in light mode.",
  "ink-4": "A fifth tone per palette for glints and fills; it is not a surface color.",
  desktop: "The ground behind every window.",
  background: "The page behind everything.",
  foreground: "Default text and offset shadows.",
  card: "Window faces, cards and panels.",
  "card-foreground": "Text on cards and windows.",
  popover: "Menus, popovers and other overlays.",
  "popover-foreground": "Text inside overlays.",
  primary: "High-emphasis fills and selected states.",
  "primary-foreground": "Text on primary fills.",
  secondary: "Lower-emphasis fills such as secondary buttons and badges.",
  "secondary-foreground": "Text on secondary fills.",
  muted: "Subdued and disabled surfaces.",
  "muted-foreground": "Helper text and disabled labels.",
  accent: "Hover and highlighted rows.",
  "accent-foreground": "Text on accent fills.",
  destructive: "Invalid states and destructive actions.",
  border: "Every pixel border and separator.",
  input: "Legacy field surface; fields now use the well tokens.",
  ring: "Focus outlines.",
  "bevel-hi": "Legacy highlight kept for compatibility.",
  "bevel-lo": "Lowlight on the bottom-right of raised surfaces.",
  "bevel-glint": "Highlight on the top-left of raised surfaces and window frames.",
  "bevel-shade": "Midtone lip outside the bottom-right of wells and sunken plates.",
  well: "Surface of fields, tracks and readouts.",
  "well-foreground": "Text inside a well.",
  "well-muted": "Placeholders and icons inside a well.",
  "well-rim": "Inner shadow along the top-left of a well.",
  "well-fill": "Progress fills, slider ranges and checkbox ticks.",
  titlebar: "Active title bars and caption tags.",
  "titlebar-foreground": "Text and stripes on a title bar.",
  pixel: "One pixel unit. Borders, offsets and dither cells are multiples of it.",
  keycap: "Face of the CTA button's raised key.",
  "keycap-foreground": "Label on the key.",
  "keycap-wall-hi": "Lit walls of the key, top and left.",
  "keycap-wall-lo": "Shaded walls of the key, right and bottom.",
  "keycap-outline": "Outline around the whole key.",
  "chart-1": "First chart series.",
  "chart-2": "Second chart series.",
  "chart-3": "Third chart series.",
  "chart-4": "Fourth chart series.",
  "chart-5": "Fifth chart series, reusing an ink.",
  sidebar: "The sidebar's surface.",
  "sidebar-foreground": "Default text in the sidebar.",
  "sidebar-primary": "Active items and high-emphasis actions in the sidebar.",
  "sidebar-primary-foreground": "Text on the sidebar's primary fills.",
  "sidebar-accent": "Hovered and open rows in the sidebar.",
  "sidebar-accent-foreground": "Text on hovered sidebar rows.",
  "sidebar-border": "Sidebar headers, groups and dividers.",
  "sidebar-ring": "Focus outlines inside the sidebar.",
  radius: "Always 0. Corners are square.",
  "font-pixel": "Titles, labels and buttons. Reads --font-display.",
  "font-mono": "Body text and code. Reads --font-body.",
}

const UTILITY_NOTES: Record<string, string> = {
  "dither-25": "Masks a surface to a 25% Bayer pattern.",
  "dither-50": "Masks a surface to a 50% checkerboard.",
  "dither-75": "Masks a surface to a 75% Bayer pattern.",
  stripes: "Horizontal title-bar stripes in the current text color.",
  segments: "Vertical segments, as in the progress bar.",
  "pixel-border": "A solid border one pixel unit wide.",
  "bevel-raised": "Glint top-left, lowlight bottom-right.",
  "bevel-sunken": "The raised bevel inverted, for pressed states.",
  well: "A dark recessed field with a rim and an outer shade.",
  "dither-shadow": "A dithered drop shadow drawn only outside the element.",
  "bevel-frame": "A glint and lowlight frame drawn above the element's children.",
  "offset-shadow-*": "A hard drop shadow N pixel units down and right.",
  "offset-shadow-none": "Removes the offset shadow and keeps any bevel.",
  pixelated: "Nearest-neighbour image scaling.",
  "animate-blink": "A stepped on-off blink, for cursors.",
}

const THEME = registry.items.find((item) => item.name === "theme") as unknown as ThemeItem
const INK_NAMES = ["ink-0", "ink-1", "ink-2", "ink-3", "ink-4", "desktop"] as const

function readComponentSources(): { name: string; source: string }[] {
  return registry.items
    .filter((item) => item.type === "registry:ui" || item.type === "registry:block")
    .map((item) => ({
      name: item.name,
      source: (findDoc(item.name)?.files ?? []).map((file) => file.source).join("\n"),
    }))
}

const SOURCES = readComponentSources()

function escapePattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function findUsers(pattern: RegExp): string[] {
  return SOURCES.filter(({ source }) => pattern.test(source)).map(({ name }) => name)
}

function findTokenUsers(name: string): string[] {
  const token = escapePattern(name)
  return findUsers(new RegExp(`(?:[a-z]-|--)${token}(?![\\w-])|-\\(--${token}\\)`))
}

function findUtilityUsers(name: string): string[] {
  const utility = escapePattern(name).replace("\\*", "\\d+")
  return findUsers(new RegExp(`(?:^|[\\s"'\`:])${utility}(?![\\w-])`, "m"))
}

function readUtilityNames(): string[] {
  return Object.keys(THEME.css)
    .filter((key) => key.startsWith("@utility "))
    .map((key) => key.slice("@utility ".length))
}

function findUsersThroughUtilities(token: string): string[] {
  const reference = new RegExp(`var\\(--${escapePattern(token)}[,)]`)
  return readUtilityNames()
    .filter((name) => reference.test(JSON.stringify(THEME.css[`@utility ${name}`])))
    .flatMap(findUtilityUsers)
}

function findAllTokenUsers(token: string): string[] {
  return [...new Set([...findTokenUsers(token), ...findUsersThroughUtilities(token)])].sort()
}

function isColorValue(name: string, value: string): boolean {
  return !/^(font-|pixel$|radius$)/.test(name) && !/^\d/.test(value)
}

export function readThemeNotes(): string | null {
  return THEME.docs ?? null
}

export function readTokenGroups(): TokenGroup[] {
  const tokens = Object.entries(THEME.cssVars.light).map(([name, light]) => ({
    name,
    light,
    dark: THEME.cssVars.dark[name] ?? null,
    note: TOKEN_NOTES[name] ?? null,
    usedBy: findAllTokenUsers(name),
    isColor: isColorValue(name, light),
  }))
  const grouped = new Map<TokenGroupId, ThemeToken[]>()
  for (const token of tokens) {
    const id = GROUPS.find((group) => group.match(token.name))?.id ?? "other"
    grouped.set(id, [...(grouped.get(id) ?? []), token])
  }
  const other = { id: "other" as const, title: "Other", summary: "Tokens without a group yet.", match: () => false }
  return [...GROUPS, other].flatMap(({ id, title, summary }) => {
    const groupTokens = grouped.get(id) ?? []
    return groupTokens.length === 0 ? [] : [{ id, title, summary, tokens: groupTokens }]
  })
}

export function readThemeUtilities(): ThemeUtility[] {
  return readUtilityNames().map((name) => ({
    name,
    note: UTILITY_NOTES[name] ?? null,
    usedBy: findUtilityUsers(name).sort(),
  }))
}

function readDeclarations(selector: string): CssDeclarations {
  const block = THEME.css[selector]
  return typeof block === "object" ? (block as CssDeclarations) : {}
}

function readInk(declarations: CssDeclarations, name: string): string | undefined {
  return declarations[name] ?? declarations[`--${name}`]
}

function readPaletteInks(light: CssDeclarations, dark: CssDeclarations, base: PaletteInks | null) {
  return {
    light: INK_NAMES.map((name, index) => readInk(light, name) ?? base?.light[index] ?? ""),
    dark: INK_NAMES.map((name, index) => readInk(dark, name) ?? base?.dark[index] ?? ""),
  }
}

export function readPalettes(): PaletteInks[] {
  const base: PaletteInks = {
    value: PALETTES[0].value,
    label: PALETTES[0].label,
    ...readPaletteInks(THEME.cssVars.light, THEME.cssVars.dark, null),
  }
  return PALETTES.map((palette, index) =>
    index === 0
      ? base
      : {
          value: palette.value,
          label: palette.label,
          ...readPaletteInks(
            readDeclarations(`[data-theme="${palette.value}"]`),
            readDeclarations(`.dark[data-theme="${palette.value}"]`),
            base
          ),
        }
  )
}

export const PALETTE_INK_NAMES = INK_NAMES

function serializeBlock(selector: string, body: CssTree | CssDeclarations, depth: number): string {
  const indent = "  ".repeat(depth)
  const lines = Object.entries(body).map(([key, value]) =>
    typeof value === "string" ? `${indent}  ${key}: ${value};` : serializeBlock(key, value, depth + 1)
  )
  return `${indent}${selector} {\n${lines.join("\n")}\n${indent}}`
}

function prefixVariables(declarations: CssDeclarations): CssDeclarations {
  return Object.fromEntries(Object.entries(declarations).map(([name, value]) => [`--${name}`, value]))
}

export function readPaletteCss(value: string): string {
  return [`[data-theme="${value}"]`, `.dark[data-theme="${value}"]`]
    .filter((selector) => typeof THEME.css[selector] === "object")
    .map((selector) => serializeBlock(selector, readDeclarations(selector), 0))
    .join("\n\n")
}

export function readThemeCss(): string {
  return [
    serializeBlock("@theme inline", prefixVariables(THEME.cssVars.theme), 0),
    serializeBlock(":root", prefixVariables(THEME.cssVars.light), 0),
    serializeBlock(".dark", prefixVariables(THEME.cssVars.dark), 0),
    ...Object.entries(THEME.css).map(([selector, body]) =>
      typeof body === "string" ? `${selector}: ${body};` : serializeBlock(selector, body, 0)
    ),
  ].join("\n\n")
}
