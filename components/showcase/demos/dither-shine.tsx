import { DitherShine } from "@/components/ui/dither-shine"
import { ditherShinePresets,type DitherShineType } from "@/lib/shaders/dither-shine"

import type { ShowcaseDemo } from "../types"

const TYPES: readonly DitherShineType[] = ["2x2", "4x4", "8x8"]

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    ...ditherShinePresets.map(({ name, params }) => ({
      label: `${name} preset`,
      render: () => <DitherShine className="h-16 w-full" {...params} />,
    })),
    ...TYPES.map((type) => ({
      label: `bayer ${type}`,
      render: () => <DitherShine className="h-16 w-full" type={type} bandWidth={0.6} />,
    })),
  ],
}
