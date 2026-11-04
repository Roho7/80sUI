import { demo as buttonDemo } from "./demos/button"
import { demo as checkboxDemo } from "./demos/checkbox"
import { demo as dialogDemo } from "./demos/dialog"
import { demo as ditherImageDemo } from "./demos/dither-image"
import { demo as errorDialogDemo } from "./demos/error-dialog"
import { demo as progressDemo } from "./demos/progress"
import { demo as sliderDemo } from "./demos/slider"
import { demo as windowDemo } from "./demos/window"
import type { ShowcaseEntry } from "./types"

export const SHOWCASE_ENTRIES: readonly ShowcaseEntry[] = [
  {
    name: "dither-image",
    title: "Dither image",
    description: "Ordered Bayer dithering quantized to the theme inks.",
    demo: ditherImageDemo,
  },
  {
    name: "button",
    title: "Button",
    description: "shadcn button reskinned with pixel borders and offset shadows.",
    demo: buttonDemo,
  },
  {
    name: "checkbox",
    title: "Checkbox",
    description: "shadcn checkbox with a pixel check.",
    demo: checkboxDemo,
  },
  {
    name: "slider",
    title: "Slider",
    description: "shadcn slider with a dithered range.",
    demo: sliderDemo,
  },
  {
    name: "progress",
    title: "Progress",
    description: "shadcn progress drawn as segmented blocks.",
    demo: progressDemo,
  },
  {
    name: "dialog",
    title: "Dialog",
    description: "shadcn dialog with a striped title bar and a dithered overlay.",
    demo: dialogDemo,
  },
  {
    name: "window",
    title: "Window",
    description: "Draggable retro window with a striped title bar, close button and optional status bar. Drags snap to --pixel.",
    demo: windowDemo,
  },
  {
    name: "error-dialog",
    title: "Error dialog",
    description: "Stackable error dialogs that cascade diagonally.",
    demo: errorDialogDemo,
  },
]
