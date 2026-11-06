import { Plate } from "@/components/ui/plate"

import type { ShowcaseDemo } from "../types"

const COPY = "Every window on this desktop is built from the registry. Install one and own the code."

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "raised",
      render: () => (
        <Plate asChild>
          <p className="text-xl leading-tight">{COPY}</p>
        </Plate>
      ),
    },
    {
      label: "sunken",
      render: () => (
        <Plate variant="sunken" asChild>
          <p className="text-xl leading-tight">C:\UI95&gt; READY</p>
        </Plate>
      ),
    },
    {
      label: "tag",
      render: () => (
        <Plate variant="tag" asChild className="self-start">
          <h3>Text on the desktop</h3>
        </Plate>
      ),
    },
    {
      label: "on the desktop",
      render: () => (
        <div className="flex flex-col gap-3 bg-desktop p-4">
          <Plate variant="tag" asChild className="self-start">
            <h3>About</h3>
          </Plate>
          <Plate asChild>
            <p className="text-xl leading-tight">{COPY}</p>
          </Plate>
        </div>
      ),
    },
  ],
}
