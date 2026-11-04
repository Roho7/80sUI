import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"

import type { ShowcaseDemo } from "../types"

const RATIOS = [
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
] as const

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    ...RATIOS.map(({ label, ratio }) => ({
      label,
      render: () => (
        <div className="w-40">
          <AspectRatio ratio={ratio} className="flex items-center justify-center font-pixel text-[8px] uppercase">
            {label}
          </AspectRatio>
        </div>
      ),
    })),
    {
      label: "image",
      render: () => (
        <div className="w-40">
          <AspectRatio ratio={16 / 9}>
            <Image src="/eye1.png" alt="eye" fill sizes="160px" className="object-cover" />
          </AspectRatio>
        </div>
      ),
    },
  ],
}
