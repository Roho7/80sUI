import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckGlyph, CloseGlyph } from "@/components/ui/pixel-glyphs"

import type { ShowcaseDemo } from "../types"

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "default",
      render: () => (
        <Alert>
          <AlertTitle>Disk check complete</AlertTitle>
          <AlertDescription>No bad sectors were found on drive C:.</AlertDescription>
        </Alert>
      ),
    },
    {
      label: "with icon",
      render: () => (
        <Alert>
          <CheckGlyph />
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>untitled.bmp was written to A:.</AlertDescription>
        </Alert>
      ),
    },
    {
      label: "destructive",
      render: () => (
        <Alert variant="destructive">
          <CloseGlyph />
          <AlertTitle>General protection fault</AlertTitle>
          <AlertDescription>The application performed an illegal operation.</AlertDescription>
        </Alert>
      ),
    },
    {
      label: "with action",
      render: () => (
        <Alert>
          <AlertTitle>Update ready</AlertTitle>
          <AlertDescription>Restart to finish installing.</AlertDescription>
          <AlertAction>
            <Button size="xs">Restart</Button>
          </AlertAction>
        </Alert>
      ),
    },
  ],
}
