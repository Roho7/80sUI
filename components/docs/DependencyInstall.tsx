"use client"

import { CopyCommand } from "@/components/showcase/CopyCommand"
import { buildDependencyCommand } from "@/lib/docs/package-managers"

import { usePackageManager } from "./use-package-manager"

type DependencyInstallProps = {
  dependencies: readonly string[]
}

function DependencyInstall({ dependencies }: DependencyInstallProps) {
  const [manager] = usePackageManager()

  return (
    <CopyCommand
      command={buildDependencyCommand(manager, dependencies)}
      label="dependency install command"
    />
  )
}

export { DependencyInstall }
