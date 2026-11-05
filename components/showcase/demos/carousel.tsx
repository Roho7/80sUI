import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import type { ShowcaseDemo } from "../types"

const SLIDES = ["DISK 1", "DISK 2", "DISK 3", "DISK 4", "DISK 5"] as const

function Slide({ label }: { label: string }) {
  return (
    <div className="flex aspect-square items-center justify-center pixel-border border-border bg-card font-pixel text-[24px] leading-none uppercase">
      {label}
    </div>
  )
}

export const demo: ShowcaseDemo = {
  span: "wide",
  variants: [
    {
      label: "horizontal",
      render: () => (
        <Carousel className="mx-12 w-full max-w-48 self-center">
          <CarouselContent>
            {SLIDES.map((label) => (
              <CarouselItem key={label}>
                <Slide label={label} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ),
    },
    {
      label: "vertical",
      render: () => (
        <Carousel orientation="vertical" className="my-12 w-full max-w-40 self-center">
          <CarouselContent className="h-44">
            {SLIDES.map((label) => (
              <CarouselItem key={label}>
                <Slide label={label} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ),
    },
  ],
}
