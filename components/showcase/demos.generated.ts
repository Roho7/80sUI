import { demo as accordionDemo } from "./demos/accordion"
import { demo as alertDemo } from "./demos/alert"
import { demo as alertDialogDemo } from "./demos/alert-dialog"
import { demo as aspectRatioDemo } from "./demos/aspect-ratio"
import { demo as avatarDemo } from "./demos/avatar"
import { demo as badgeDemo } from "./demos/badge"
import { demo as breadcrumbDemo } from "./demos/breadcrumb"
import { demo as buttonDemo } from "./demos/button"
import { demo as buttonGroupDemo } from "./demos/button-group"
import { demo as calendarDemo } from "./demos/calendar"
import { demo as cardDemo } from "./demos/card"
import { demo as checkboxDemo } from "./demos/checkbox"
import { demo as collapsibleDemo } from "./demos/collapsible"
import { demo as commandDemo } from "./demos/command"
import { demo as contextMenuDemo } from "./demos/context-menu"
import { demo as ctaButtonDemo } from "./demos/cta-button"
import { demo as desktopIconDemo } from "./demos/desktop-icon"
import { demo as dialogDemo } from "./demos/dialog"
import { demo as ditherImageDemo } from "./demos/dither-image"
import { demo as ditherShineDemo } from "./demos/dither-shine"
import { demo as dropdownMenuDemo } from "./demos/dropdown-menu"
import { demo as emptyDemo } from "./demos/empty"
import { demo as errorDialogDemo } from "./demos/error-dialog"
import { demo as fieldDemo } from "./demos/field"
import { demo as hoverCardDemo } from "./demos/hover-card"
import { demo as inputDemo } from "./demos/input"
import { demo as inputGroupDemo } from "./demos/input-group"
import { demo as inputOtpDemo } from "./demos/input-otp"
import { demo as itemDemo } from "./demos/item"
import { demo as kbdDemo } from "./demos/kbd"
import { demo as labelDemo } from "./demos/label"
import { demo as menubarDemo } from "./demos/menubar"
import { demo as nativeSelectDemo } from "./demos/native-select"
import { demo as navigationMenuDemo } from "./demos/navigation-menu"
import { demo as paginationDemo } from "./demos/pagination"
import { demo as plateDemo } from "./demos/plate"
import { demo as popoverDemo } from "./demos/popover"
import { demo as progressDemo } from "./demos/progress"
import { demo as radioGroupDemo } from "./demos/radio-group"
import { demo as resizableDemo } from "./demos/resizable"
import { demo as scrollAreaDemo } from "./demos/scroll-area"
import { demo as selectDemo } from "./demos/select"
import { demo as separatorDemo } from "./demos/separator"
import { demo as sheetDemo } from "./demos/sheet"
import { demo as sidebarDemo } from "./demos/sidebar"
import { demo as skeletonDemo } from "./demos/skeleton"
import { demo as sliderDemo } from "./demos/slider"
import { demo as spinnerDemo } from "./demos/spinner"
import { demo as switchDemo } from "./demos/switch"
import { demo as tableDemo } from "./demos/table"
import { demo as tabsDemo } from "./demos/tabs"
import { demo as taskbarDemo } from "./demos/taskbar"
import { demo as terminalDemo } from "./demos/terminal"
import { demo as textareaDemo } from "./demos/textarea"
import { demo as toggleDemo } from "./demos/toggle"
import { demo as toggleGroupDemo } from "./demos/toggle-group"
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
    description: "A two-color Bayer-dithered band that sweeps corner to corner at a stepped frame rate.",
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
    description: "Call-to-action button over a WebGL dither shine that sweeps at 10 fps, with a stepped pixel tilt toward the pointer on hover.",
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
    description: "shadcn tabs as raised bevelled folder tabs joined to a bevelled panel, or an underline.",
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
    name: "plate",
    title: "Plate",
    description: "A surface for text that would otherwise sit on the desktop: a raised panel, a sunken readout or a title-bar caption tag.",
    demo: plateDemo,
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
    description: "shadcn card as a raised bevelled pixel panel.",
    demo: cardDemo,
  },
  {
    name: "accordion",
    title: "Accordion",
    description: "shadcn accordion where each item is a raised bevelled box, with beveled chevron toggles and no easing.",
    demo: accordionDemo,
  },
  {
    name: "kbd",
    title: "Kbd",
    description: "Keyboard keys as small bevelled pixel keycaps, alone or grouped.",
    demo: kbdDemo,
  },
  {
    name: "toggle",
    title: "Toggle",
    description: "shadcn toggle as a pixel button that stays sunk while pressed.",
    demo: toggleDemo,
  },
  {
    name: "toggle-group",
    title: "Toggle Group",
    description: "A row of pixel toggles for one or many choices.",
    demo: toggleGroupDemo,
  },
  {
    name: "collapsible",
    title: "Collapsible",
    description: "Unstyled show and hide region with a trigger, opening in one frame.",
    demo: collapsibleDemo,
  },
  {
    name: "popover",
    title: "Popover",
    description: "Floating pixel panel with an offset shadow, opened from a trigger.",
    demo: popoverDemo,
  },
  {
    name: "hover-card",
    title: "Hover Card",
    description: "Pixel preview card that appears on hover, with no fade.",
    demo: hoverCardDemo,
  },
  {
    name: "alert-dialog",
    title: "Alert Dialog",
    description: "Modal confirmation in the dialog chrome, with action and cancel buttons.",
    demo: alertDialogDemo,
  },
  {
    name: "sheet",
    title: "Sheet",
    description: "Edge panel from any side of the screen that opens in one frame.",
    demo: sheetDemo,
  },
  {
    name: "context-menu",
    title: "Context Menu",
    description: "Right-click menu with the shared menu look: foreground bar highlight, etched separators, left indicators.",
    demo: contextMenuDemo,
  },
  {
    name: "skeleton",
    title: "Skeleton",
    description: "Placeholder block filled with a flowing dithered noise field that steps at 10 fps, shares one timer across every skeleton and holds still under reduced motion.",
    demo: skeletonDemo,
  },
  {
    name: "spinner",
    title: "Spinner",
    description: "Pixel spinner that steps at about 10 fps and holds still under reduced motion.",
    demo: spinnerDemo,
  },
  {
    name: "avatar",
    title: "Avatar",
    description: "Pixel-stepped circle avatar with a 1px ring, a dithered drop shadow, and an image or pixel-font initials.",
    demo: avatarDemo,
  },
  {
    name: "breadcrumb",
    title: "Breadcrumb",
    description: "Path trail with pixel chevron separators.",
    demo: breadcrumbDemo,
  },
  {
    name: "table",
    title: "Table",
    description: "Data table with pixel rules and a font-pixel header.",
    demo: tableDemo,
  },
  {
    name: "pagination",
    title: "Pagination",
    description: "Page links built from NOSTALGUI buttons with pixel arrows.",
    demo: paginationDemo,
  },
  {
    name: "button-group",
    title: "Button Group",
    description: "Buttons joined edge to edge into one pixel-bordered strip.",
    demo: buttonGroupDemo,
  },
  {
    name: "empty",
    title: "Empty",
    description: "Empty state with a pixel icon, title, description and actions.",
    demo: emptyDemo,
  },
  {
    name: "native-select",
    title: "Native Select",
    description: "A native select in the sunken field style with a pixel chevron.",
    demo: nativeSelectDemo,
  },
  {
    name: "aspect-ratio",
    title: "Aspect Ratio",
    description: "Keeps content at a fixed aspect ratio.",
    demo: aspectRatioDemo,
  },
  {
    name: "item",
    title: "Item",
    description: "List row with media, title, description and actions on pixel borders.",
    demo: itemDemo,
  },
  {
    name: "field",
    title: "Field",
    description: "Form field layout: label, control, description and dashed-border errors.",
    demo: fieldDemo,
  },
  {
    name: "input-group",
    title: "Input Group",
    description: "Input or textarea with pixel addons and buttons inside one sunken field.",
    demo: inputGroupDemo,
  },
  {
    name: "navigation-menu",
    title: "Navigation Menu",
    description: "shadcn navigation-menu reskinned for NOSTALGUI.",
    demo: navigationMenuDemo,
  },
  {
    name: "input-otp",
    title: "Input Otp",
    description: "shadcn input-otp reskinned for NOSTALGUI.",
    demo: inputOtpDemo,
  },
  {
    name: "command",
    title: "Command",
    description: "shadcn command reskinned for NOSTALGUI.",
    demo: commandDemo,
  },
  {
    name: "resizable",
    title: "Resizable",
    description: "shadcn resizable reskinned for NOSTALGUI.",
    demo: resizableDemo,
  },
  {
    name: "sidebar",
    title: "Sidebar",
    description: "shadcn sidebar reskinned for NOSTALGUI.",
    demo: sidebarDemo,
  },
  {
    name: "calendar",
    title: "Calendar",
    description: "shadcn calendar reskinned for NOSTALGUI.",
    demo: calendarDemo,
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
