import { demo as accordionDemo } from "./demos/accordion"
import { demo as alertDemo } from "./demos/alert"
import { demo as badgeDemo } from "./demos/badge"
import { demo as buttonDemo } from "./demos/button"
import { demo as cardDemo } from "./demos/card"
import { demo as checkboxDemo } from "./demos/checkbox"
import { demo as ctaButtonDemo } from "./demos/cta-button"
import { demo as desktopIconDemo } from "./demos/desktop-icon"
import { demo as dialogDemo } from "./demos/dialog"
import { demo as ditherImageDemo } from "./demos/dither-image"
import { demo as ditherShineDemo } from "./demos/dither-shine"
import { demo as dropdownMenuDemo } from "./demos/dropdown-menu"
import { demo as errorDialogDemo } from "./demos/error-dialog"
import { demo as inputDemo } from "./demos/input"
import { demo as labelDemo } from "./demos/label"
import { demo as menubarDemo } from "./demos/menubar"
import { demo as progressDemo } from "./demos/progress"
import { demo as radioGroupDemo } from "./demos/radio-group"
import { demo as scrollAreaDemo } from "./demos/scroll-area"
import { demo as selectDemo } from "./demos/select"
import { demo as separatorDemo } from "./demos/separator"
import { demo as sliderDemo } from "./demos/slider"
import { demo as switchDemo } from "./demos/switch"
import { demo as tabsDemo } from "./demos/tabs"
import { demo as taskbarDemo } from "./demos/taskbar"
import { demo as terminalDemo } from "./demos/terminal"
import { demo as textareaDemo } from "./demos/textarea"
import { demo as tooltipDemo } from "./demos/tooltip"
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
    name: "dither-shine",
    title: "Dither shine",
    description: "A two-color Bayer-dithered band that sweeps corner to corner at a stepped frame rate, with a pointer spotlight.",
    demo: ditherShineDemo,
  },
  {
    name: "button",
    title: "Button",
    description: "shadcn button reskinned with pixel borders and offset shadows.",
    demo: buttonDemo,
  },
  {
    name: "cta-button",
    title: "CTA Button",
    description: "Call-to-action button over a WebGL dither shine that sweeps at 10 fps and follows the pointer on hover.",
    demo: ctaButtonDemo,
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
    name: "input",
    title: "Input",
    description: "shadcn input as a sunken 1-bit field.",
    demo: inputDemo,
  },
  {
    name: "textarea",
    title: "Textarea",
    description: "shadcn textarea as a sunken 1-bit field that grows with its content.",
    demo: textareaDemo,
  },
  {
    name: "label",
    title: "Label",
    description: "shadcn label set in the pixel font.",
    demo: labelDemo,
  },
  {
    name: "radio-group",
    title: "Radio group",
    description: "shadcn radio group with a pixel ring and dot.",
    demo: radioGroupDemo,
  },
  {
    name: "switch",
    title: "Switch",
    description: "shadcn switch as a two-state pixel toggle with a dithered on side.",
    demo: switchDemo,
  },
  {
    name: "select",
    title: "Select",
    description: "shadcn select as a Win95 combo box that drops a menu with no animation.",
    demo: selectDemo,
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "shadcn tabs as folder tabs or an underline.",
    demo: tabsDemo,
  },
  {
    name: "tooltip",
    title: "Tooltip",
    description: "shadcn tooltip as a cream box with a hard offset shadow.",
    demo: tooltipDemo,
  },
  {
    name: "dropdown-menu",
    title: "Dropdown menu",
    description: "shadcn dropdown menu with Win95 inverted highlight, etched separators and pixel indicators.",
    demo: dropdownMenuDemo,
  },
  {
    name: "menubar",
    title: "Menubar",
    description: "shadcn menubar with Win95 menus.",
    demo: menubarDemo,
  },
  {
    name: "scroll-area",
    title: "Scroll area",
    description: "shadcn scroll area with a dithered track and a beveled thumb.",
    demo: scrollAreaDemo,
  },
  {
    name: "separator",
    title: "Separator",
    description: "shadcn separator as an etched line.",
    demo: separatorDemo,
  },
  {
    name: "badge",
    title: "Badge",
    description: "shadcn badge as a pixel tag.",
    demo: badgeDemo,
  },
  {
    name: "alert",
    title: "Alert",
    description: "shadcn alert as a 1-bit message box.",
    demo: alertDemo,
  },
  {
    name: "card",
    title: "Card",
    description: "shadcn card as a pixel panel with an offset shadow.",
    demo: cardDemo,
  },
  {
    name: "accordion",
    title: "Accordion",
    description: "shadcn accordion with beveled chevron toggles and no easing.",
    demo: accordionDemo,
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
  {
    name: "terminal",
    title: "Terminal",
    description: "Terminal screen that types commands after a prompt, prints output and blinks a block cursor.",
    demo: terminalDemo,
  },
  {
    name: "taskbar",
    title: "Taskbar",
    description: "Beveled taskbar with a Start button, a start menu built on dropdown-menu, a task area and a clock slot.",
    demo: taskbarDemo,
  },
  {
    name: "desktop-icon",
    title: "Desktop icon",
    description: "Selectable desktop icon with a pixel icon and label that opens on double click or Enter.",
    demo: desktopIconDemo,
  },
]
