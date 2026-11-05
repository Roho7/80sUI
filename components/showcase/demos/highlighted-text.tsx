import { HighlightedText } from "@/components/ui/highlighted-text"
import { Plate } from "@/components/ui/plate"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "inline",
      render: () => (
        <p className="text-xl leading-loose">
          Every window here is <HighlightedText>built from the registry</HighlightedText>, so the
          code is yours.
        </p>
      ),
    },
    {
      label: "heading",
      render: () => (
        <h3 className="self-start py-3 font-pixel text-[32px] leading-none uppercase">
          <HighlightedText>New!</HighlightedText>
        </h3>
      ),
    },
    {
      label: "on a plate",
      render: () => (
        <Plate variant="tag" className="my-3 self-start">
          <HighlightedText>Shareware edition</HighlightedText>
        </Plate>
      ),
    },
  ],
}
