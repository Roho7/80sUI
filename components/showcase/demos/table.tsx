import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { ShowcaseDemo } from "../types"

const ROWS = [
  { name: "Alpha", status: "Ready", qty: "12" },
  { name: "Beta", status: "Busy", qty: "7" },
  { name: "Gamma", status: "Idle", qty: "3" },
] as const

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "default",
      render: () => (
        <Table>
          <TableCaption>Units in stock</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.name} data-state={row.name === "Beta" ? "selected" : undefined}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>22</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ),
    },
  ],
}
