import { CtaButton } from "@/components/ui/cta-button"
import { glintPreset } from "@/lib/shaders/dither-shine"

import type { ShowcaseDemo } from "../types"

const SIZES = ["sm", "default", "lg"] as const

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
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
      label: "disabled",
      render: () => (
        <div className="flex">
          <CtaButton disabled>Disabled</CtaButton>
        </div>
      ),
    },
    {
      label: "as link",
      render: () => (
        <div className="flex">
          <CtaButton asChild size="lg">
            <a href="#cta-button">Get started</a>
          </CtaButton>
        </div>
      ),
    },
    {
      label: "glint preset",
      render: () => (
        <div className="flex">
          <CtaButton size="lg" shine={glintPreset.params}>
            Get UI95
          </CtaButton>
        </div>
      ),
    },
  ],
}
