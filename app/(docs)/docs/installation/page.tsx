import type { Metadata } from "next"

import { CodeBlock } from "@/components/docs/CodeBlock"
import { DocSection } from "@/components/docs/DocSection"
import { JsonLd } from "@/components/docs/JsonLd"
import { PageHeader } from "@/components/docs/PageHeader"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { ProseLink } from "@/components/docs/ProseLink"
import { REGISTRY_URL, RegistrySetup } from "@/components/docs/RegistrySetup"
import { InstallCommand } from "@/components/showcase/InstallCommand"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PACKAGE_MANAGERS } from "@/lib/docs/package-managers"
import { GUIDE_PAGES } from "@/lib/docs/pages"
import { articleJsonLd, pageMetadata } from "@/lib/seo"

const PAGE = GUIDE_PAGES[1]

const REGISTRIES_SNIPPET = JSON.stringify({ registries: { "@nostalgui": REGISTRY_URL } }, null, 2)

export const metadata: Metadata = pageMetadata({ title: PAGE.title, description: PAGE.description, path: PAGE.href })

export default function InstallationPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: PAGE.title,
          description: PAGE.description,
          path: PAGE.href,
          crumbs: [
            { name: "Docs", path: "/docs" },
            { name: PAGE.title, path: PAGE.href },
          ],
        })}
      />
      <PageHeader title={PAGE.title} description={PAGE.description} />
      <DocSection id="prerequisites" title="Prerequisites">
        <p className="max-w-3xl text-xl leading-tight">
          You need a React project with Tailwind CSS 4 and shadcn set up on Radix. Base UI projects are not
          supported yet. Start one if you have none.
        </p>
        <CodeBlock title="Terminal" code="npx shadcn@latest init -b radix" />
      </DocSection>
      <DocSection id="theme" title="Add the theme">
        <p className="max-w-3xl text-xl leading-tight">
          Every component reads the theme tokens, so add it first. The{" "}
          <ProseLink href="/docs/theming">theming guide</ProseLink> covers fonts and palettes.
        </p>
        <InstallCommand name="theme" />
      </DocSection>
      <DocSection id="components" title="Add components">
        <p className="max-w-3xl text-xl leading-tight">
          Every component page has its own command. It installs the files and every item they
          build on.
        </p>
        <InstallCommand name="button" />
      </DocSection>
      <DocSection id="icons" title="Icons">
        <p className="max-w-3xl text-xl leading-tight">
          No icon pack ships with the theme. I recommend{" "}
          <ProseLink href="https://github.com/gitntg/pixelarticons-react">pixelarticons-react</ProseLink>
          . Its icons sit on the same pixel grid, and this site uses it too.
        </p>
        <CodeBlock title="Terminal" code="npm install @nsmr/pixelart-react" />
        <CodeBlock
          title="Example"
          code={`import { Moon } from "@nsmr/pixelart-react"\n\n<Moon size={24} />`}
        />
      </DocSection>
      <DocSection id="namespace" title="Use the @nostalgui namespace">
        <p className="max-w-3xl text-xl leading-tight">
          Register the namespace once and install by name. The CLI fills {"{style}"} from your
          components.json.
        </p>
        <RegistrySetup />
        <p className="max-w-3xl text-xl leading-tight">
          That writes this to components.json. You can also paste it yourself.
        </p>
        <CodeBlock title="components.json" code={REGISTRIES_SNIPPET} />
        <CodeBlock title="Terminal" code="npx shadcn@latest add @nostalgui/button" />
      </DocSection>
      <DocSection id="package-managers" title="Package managers">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Manager</TableHead>
              <TableHead>Run the CLI</TableHead>
              <TableHead>Install a dependency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PACKAGE_MANAGERS.map((manager) => (
              <TableRow key={manager.name}>
                <TableCell className="font-mono">{manager.name}</TableCell>
                <TableCell className="font-mono">{manager.runner}</TableCell>
                <TableCell className="font-mono">{manager.install}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DocSection>
      <PageNeighbors href={PAGE.href} />
    </>
  )
}
