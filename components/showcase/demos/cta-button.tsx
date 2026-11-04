import { CtaButton } from "@/components/ui/cta-button"

import type { ShowcaseDemo } from "../types"

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const
const SIZES = ["sm", "default", "lg"] as const

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "hero",
      render: () => <CtaButton variant="destructive">Install dither-ui</CtaButton>,
    },
    {
      label: "variants",
      render: () => (
        <div className="flex flex-wrap items-center gap-3">
          {VARIANTS.map((variant) => (
            <CtaButton key={variant} variant={variant} size="default">
              {variant}
            </CtaButton>
          ))}
        </div>
      ),
    },
    {
      label: "sizes",
      render: () => (
        <div className="flex flex-wrap items-center gap-3">
          {SIZES.map((size) => (
            <CtaButton key={size} size={size}>
              {size}
            </CtaButton>
          ))}
        </div>
      ),
    },
    {
      label: "still and disabled",
      render: () => (
        <div className="flex flex-wrap items-center gap-3">
          <CtaButton isShining={false}>No shine</CtaButton>
          <CtaButton disabled>Disabled</CtaButton>
        </div>
      ),
    },
    {
      label: "as link",
      render: () => (
        <CtaButton asChild variant="destructive">
          <a href="#showcase-cta-button">Get started</a>
        </CtaButton>
      ),
    },
  ],
}
