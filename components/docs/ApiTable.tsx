import { cn } from "cn"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ComponentApi } from "@/lib/docs/types"

type ApiTableProps = {
  api: readonly ComponentApi[]
}

const CELL_WRAP = "whitespace-normal break-words"

function ApiTable({ api }: ApiTableProps) {
  return (
    <div className="flex flex-col gap-6">
      {api.map((component) => (
        <div key={component.name} className="flex flex-col gap-2">
          <h3 className="font-pixel text-base leading-none uppercase">{component.name}</h3>
          {component.props.length === 0 ? (
            <p className="text-xl leading-tight">
              No props of its own. It forwards the props of the element or primitive it wraps.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prop</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {component.props.map((prop) => (
                  <TableRow key={prop.name}>
                    <TableCell className="align-top font-mono">
                      {prop.name}
                      {prop.required && <span aria-label="required"> *</span>}
                    </TableCell>
                    <TableCell className={cn(CELL_WRAP, "min-w-48 align-top font-mono")}>{prop.type}</TableCell>
                    <TableCell className={cn(CELL_WRAP, "align-top font-mono")}>{prop.defaultValue ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ))}
    </div>
  )
}

export { ApiTable }
