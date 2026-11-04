import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    {
      label: "horizontal",
      render: () => (
        <ButtonGroup>
          <Button variant="outline">Left</Button>
          <Button variant="outline">Mid</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      ),
    },
    {
      label: "vertical",
      render: () => (
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Mid</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      ),
    },
    {
      label: "text and separator",
      render: () => (
        <ButtonGroup>
          <ButtonGroupText>Zoom</ButtonGroupText>
          <Button variant="outline">-</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">+</Button>
        </ButtonGroup>
      ),
    },
    {
      label: "disabled",
      render: () => (
        <ButtonGroup>
          <Button variant="outline" disabled>
            Left
          </Button>
          <Button variant="outline" disabled>
            Right
          </Button>
        </ButtonGroup>
      ),
    },
  ],
}
