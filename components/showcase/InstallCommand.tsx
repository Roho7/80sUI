"use client"

import { usePackageManager } from "@/components/docs/use-package-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { buildAddCommand, isPackageManagerName, PACKAGE_MANAGERS } from "@/lib/docs/package-managers"

import { CopyCommand } from "./CopyCommand"

type InstallCommandProps = {
  name: string
}

function InstallCommand({ name }: InstallCommandProps) {
  const [manager, chooseManager] = usePackageManager()

  return (
    <Tabs
      value={manager.name}
      onValueChange={(value) => isPackageManagerName(value) && chooseManager(value)}
      className="gap-1"
    >
      <TabsList variant="line" aria-label="Package manager">
        {PACKAGE_MANAGERS.map(({ name: managerName }) => (
          <TabsTrigger key={managerName} value={managerName}>
            {managerName}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={manager.name} className="pt-0">
        <CopyCommand command={buildAddCommand(manager, name)} label={`install command for ${name}`} />
      </TabsContent>
    </Tabs>
  )
}

export { InstallCommand }
