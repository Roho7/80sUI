import { registryItemUrl } from "@/lib/site"

export const PACKAGE_MANAGERS = [
  { name: "npm", runner: "npx shadcn@latest", install: "npm install" },
  { name: "pnpm", runner: "pnpm dlx shadcn@latest", install: "pnpm add" },
  { name: "yarn", runner: "yarn dlx shadcn@latest", install: "yarn add" },
  { name: "bun", runner: "bunx --bun shadcn@latest", install: "bun add" },
] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

export type PackageManagerName = PackageManager["name"]

export const DEFAULT_PACKAGE_MANAGER: PackageManagerName = "npm"

export function isPackageManagerName(value: string | null): value is PackageManagerName {
  return PACKAGE_MANAGERS.some((manager) => manager.name === value)
}

export function readPackageManager(name: PackageManagerName): PackageManager {
  return PACKAGE_MANAGERS.find((manager) => manager.name === name) ?? PACKAGE_MANAGERS[0]
}

export function buildAddCommand(manager: PackageManager, itemName: string): string {
  return `${manager.runner} add ${registryItemUrl(itemName)}`
}

export function buildDependencyCommand(manager: PackageManager, dependencies: readonly string[]): string {
  return `${manager.install} ${dependencies.join(" ")}`
}
