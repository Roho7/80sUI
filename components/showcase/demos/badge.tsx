import { Badge } from "@/components/ui/badge"
import { CheckGlyph } from "@/components/ui/pixel-glyphs"

import type { ShowcaseDemo } from "../types"

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    {
      label: "variants",
      render: () => (
        <div className="flex flex-wrap items-center gap-2">
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      label: "as link",
      render: () => (
        <div className="flex flex-wrap items-center gap-2">
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant} asChild>
              <a href="#badge">{variant}</a>
            </Badge>
          ))}
        </div>
      ),
    },
    {
      label: "with icon",
      render: () => (
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <CheckGlyph data-icon="inline-start" />
            Verified
          </Badge>
          <Badge variant="secondary">
            v0.0.1
            <CheckGlyph data-icon="inline-end" />
          </Badge>
        </div>
      ),
    },
  ],
}
