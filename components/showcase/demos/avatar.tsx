import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

import type { ShowcaseDemo } from "../types"

const SIZES = ["sm", "default", "lg"] as const

export const demo: ShowcaseDemo = {
  span: "single",
  variants: [
    ...SIZES.map((size) => ({
      label: `${size} fallback`,
      render: () => (
        <Avatar size={size}>
          <AvatarFallback>DU</AvatarFallback>
        </Avatar>
      ),
    })),
    {
      label: "image",
      render: () => (
        <Avatar size="lg">
          <AvatarImage src="/eye1.png" alt="eye" />
          <AvatarFallback>EY</AvatarFallback>
        </Avatar>
      ),
    },
    {
      label: "badge",
      render: () => (
        <Avatar size="lg">
          <AvatarFallback>RO</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      ),
    },
    {
      label: "group",
      render: () => (
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      ),
    },
  ],
}
