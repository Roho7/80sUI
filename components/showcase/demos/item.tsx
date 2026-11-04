import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { DocumentGlyph } from "@/components/ui/pixel-glyphs"

import type { ShowcaseDemo } from "../types"

const VARIANTS = ["default", "outline", "muted"] as const
const SIZES = ["default", "sm", "xs"] as const

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    ...VARIANTS.map((variant) => ({
      label: variant,
      render: () => (
        <Item variant={variant} className="w-full max-w-80">
          <ItemMedia variant="icon">
            <DocumentGlyph />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Report.txt</ItemTitle>
            <ItemDescription>Updated today</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">Open</Button>
          </ItemActions>
        </Item>
      ),
    })),
    ...SIZES.filter((size) => size !== "default").map((size) => ({
      label: size,
      render: () => (
        <Item variant="outline" size={size} className="w-full max-w-80">
          <ItemContent>
            <ItemTitle>Compact</ItemTitle>
            <ItemDescription>Size {size}</ItemDescription>
          </ItemContent>
          <Badge>new</Badge>
        </Item>
      ),
    })),
    {
      label: "group",
      render: () => (
        <ItemGroup className="w-full max-w-80">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>One</ItemTitle>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Two</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      ),
    },
  ],
}
