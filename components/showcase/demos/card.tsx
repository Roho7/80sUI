import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { ShowcaseDemo } from "../types"

function renderCard(size: "default" | "sm") {
  return (
    <Card size={size}>
      <CardHeader>
        <CardTitle>My Computer</CardTitle>
        <CardDescription>3 drives, 1 printer</CardDescription>
      </CardHeader>
      <CardContent>Free space on C: is 12 MB. Consider deleting your memories.</CardContent>
    </Card>
  )
}

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    { label: "default", render: () => renderCard("default") },
    { label: "sm", render: () => renderCard("sm") },
    {
      label: "action, footer",
      render: () => (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Inbox</CardTitle>
            <CardDescription>You have new mail</CardDescription>
            <CardAction>
              <Badge>3</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>Re: Re: Fwd: chain letter</CardContent>
          <CardFooter className="justify-end">
            <Button size="sm" variant="outline">
              Later
            </Button>
            <Button size="sm">Read</Button>
          </CardFooter>
        </Card>
      ),
    },
  ],
}
