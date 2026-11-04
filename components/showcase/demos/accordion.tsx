import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import type { ShowcaseDemo } from "../types"

const ENTRIES = [
  { value: "hardware", title: "Hardware", body: "486DX2 66 MHz, 8 MB RAM, turbo button." },
  { value: "software", title: "Software", body: "DOS 6.22, a paint program, three games." },
  { value: "network", title: "Network", body: "None. The modem is in a drawer." },
] as const

function renderItems(disabledValue?: string) {
  return ENTRIES.map(({ value, title, body }) => (
    <AccordionItem key={value} value={value} disabled={value === disabledValue}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{body}</AccordionContent>
    </AccordionItem>
  ))
}

export const demo: ShowcaseDemo = {
  span: "tall",
  variants: [
    {
      label: "single, collapsible",
      render: () => (
        <Accordion type="single" collapsible defaultValue="hardware">
          {renderItems()}
        </Accordion>
      ),
    },
    {
      label: "multiple, disabled item",
      render: () => (
        <Accordion type="multiple" defaultValue={["software"]}>
          {renderItems("network")}
        </Accordion>
      ),
    },
  ],
}
