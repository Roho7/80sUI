import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FolderGlyph } from "@/components/ui/pixel-glyphs"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "icon",
      render: () => (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderGlyph />
            </EmptyMedia>
            <EmptyTitle>No files</EmptyTitle>
            <EmptyDescription>Nothing here yet.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Upload</Button>
          </EmptyContent>
        </Empty>
      ),
    },
    {
      label: "default",
      render: () => (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No results</EmptyTitle>
            <EmptyDescription>Try another search.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ),
    },
  ],
}
