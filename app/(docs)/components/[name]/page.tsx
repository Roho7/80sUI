import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ApiTable } from "@/components/docs/ApiTable"
import { CodeBlock } from "@/components/docs/CodeBlock"
import { CopyPageButton } from "@/components/docs/CopyPageButton"
import { DemoVariants } from "@/components/docs/DemoPreview"
import { DependencyInstall } from "@/components/docs/DependencyInstall"
import { DocSection } from "@/components/docs/DocSection"
import { PageNeighbors } from "@/components/docs/PageNeighbors"
import { ProseLink } from "@/components/docs/ProseLink"
import { InstallCommand } from "@/components/showcase/InstallCommand"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatUpdatedAt } from "@/lib/docs/format"
import { registryDocToMarkdown } from "@/lib/docs/markdown"
import { findDoc, REGISTRY_DOCS, SECTION_LABELS } from "@/lib/docs/registry-docs"
import { docHref } from "@/lib/docs/routes"
import type { RegistryDoc } from "@/lib/docs/types"
import { absoluteUrl } from "@/lib/site"

type ItemPageProps = {
  params: Promise<{ name: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return REGISTRY_DOCS.map((doc) => ({ name: doc.name }))
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { name } = await params
  const doc = findDoc(name)
  if (!doc) {
    return {}
  }
  const url = absoluteUrl(docHref(doc.name))
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    openGraph: { title: doc.title, description: doc.description, url, type: "article" },
  }
}

function ItemLinks({ names }: { names: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xl leading-tight">
      {names.map((name) => (
        <li key={name}>
          <ProseLink href={docHref(name)}>{findDoc(name)?.title ?? name}</ProseLink>
        </li>
      ))}
    </ul>
  )
}

function InstallSection({ doc }: { doc: RegistryDoc }) {
  return (
    <DocSection id="installation" title="Installation">
      <Tabs defaultValue="cli">
        <TabsList>
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="cli" className="flex flex-col gap-3">
          <InstallCommand name={doc.name} />
          <p className="text-lg leading-tight">
            Run it in a Radix shadcn project that already has the{" "}
            <ProseLink href="/docs/installation">NOSTALGUI theme</ProseLink>
            .
          </p>
        </TabsContent>
        <TabsContent value="manual" className="flex flex-col gap-4">
          {doc.dependencies.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xl leading-tight">Install the dependencies.</p>
              <DependencyInstall dependencies={doc.dependencies} />
            </div>
          )}
          {doc.registryDependencies.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xl leading-tight">Add the items it builds on first.</p>
              <ItemLinks names={doc.registryDependencies} />
            </div>
          )}
          <p className="text-xl leading-tight">Copy the source into your project.</p>
          {doc.files.map((file) => (
            <CodeBlock key={file.path} title={file.path} code={file.source} />
          ))}
        </TabsContent>
      </Tabs>
    </DocSection>
  )
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { name } = await params
  const doc = findDoc(name)
  if (!doc) {
    notFound()
  }
  const href = docHref(doc.name)

  return (
    <>
      <header className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/docs">Docs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/components">{SECTION_LABELS[doc.section]}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{doc.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-pixel text-[32px] leading-none uppercase md:text-[48px]">{doc.title}</h1>
          <CopyPageButton markdown={registryDocToMarkdown(doc)} />
        </div>
        <p className="max-w-2xl text-xl leading-tight">{doc.description}</p>
      </header>
      {doc.hasDemo && doc.demoSource !== null && (
        <DocSection id="examples" title="Examples">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <DemoVariants name={doc.name} />
            </TabsContent>
            <TabsContent value="code">
              <CodeBlock title={`components/showcase/demos/${doc.name}.tsx`} code={doc.demoSource} />
            </TabsContent>
          </Tabs>
        </DocSection>
      )}
      <InstallSection doc={doc} />
      {doc.notes !== null && (
        <DocSection id="notes" title="Notes">
          <p className="max-w-3xl text-xl leading-tight">{doc.notes}</p>
        </DocSection>
      )}
      {doc.api.length > 0 && (
        <DocSection id="api-reference" title="API reference">
          <ApiTable api={doc.api} />
        </DocSection>
      )}
      {doc.registryDependencies.length > 0 && (
        <DocSection id="uses" title="Uses">
          <ItemLinks names={doc.registryDependencies} />
        </DocSection>
      )}
      {doc.usedBy.length > 0 && (
        <DocSection id="used-by" title="Used by">
          <ItemLinks names={doc.usedBy} />
        </DocSection>
      )}
      {doc.sounds.length > 0 && (
        <DocSection id="sounds" title="Sounds">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xl leading-tight">
            {doc.sounds.map((sound) => (
              <li key={sound}>{sound}</li>
            ))}
          </ul>
        </DocSection>
      )}
      {doc.updatedAt !== null && (
        <p className="text-lg leading-tight text-muted-foreground">Updated {formatUpdatedAt(doc.updatedAt)}</p>
      )}
      <PageNeighbors href={href} />
    </>
  )
}
