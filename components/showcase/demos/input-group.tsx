import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { ArrowGlyph } from "@/components/ui/pixel-glyphs"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "text addon",
      render: () => (
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
      ),
    },
    {
      label: "button addon",
      render: () => (
        <InputGroup>
          <InputGroupInput placeholder="Search" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="outline" size="icon-xs" aria-label="Go">
              <ArrowGlyph direction="right" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ),
    },
    {
      label: "textarea",
      render: () => (
        <InputGroup>
          <InputGroupTextarea placeholder="Write a note" />
          <InputGroupAddon align="block-end">
            <InputGroupText>0/200</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ),
    },
    {
      label: "disabled",
      render: () => (
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="handle" disabled />
        </InputGroup>
      ),
    },
    {
      label: "invalid",
      render: () => (
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput defaultValue="a b" aria-invalid />
        </InputGroup>
      ),
    },
  ],
}
