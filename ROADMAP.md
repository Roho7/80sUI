# Roadmap

What UI95 has shipped and what is left. A box is ticked when the component is a registry item in `registry.json` with a showcase demo. `npm run check:style` fails if a tick here disagrees with the registry.

## shadcn components

Every `registry:ui` component in shadcn's `radix-nova` style (64 as of November 2026). Each ships as a drop-in reskin: same file name, exports and variant names.

52 of 64 done.

- [x] accordion
- [x] alert
- [x] alert-dialog
- [x] aspect-ratio
- [ ] attachment
- [x] avatar
- [x] badge
- [x] breadcrumb
- [ ] bubble
- [x] button
- [x] button-group
- [x] calendar
- [x] card
- [x] carousel
- [ ] chart
- [x] checkbox
- [ ] code-block
- [x] collapsible
- [ ] combobox
- [x] command
- [x] context-menu
- [x] dialog
- [ ] direction
- [x] drawer
- [x] dropdown-menu
- [x] empty
- [x] field
- [ ] form
- [x] hover-card
- [x] input
- [x] input-group
- [x] input-otp
- [x] item
- [x] kbd
- [x] label
- [ ] marker
- [x] menubar
- [ ] message
- [ ] message-scroller
- [x] native-select
- [x] navigation-menu
- [x] pagination
- [x] popover
- [x] progress
- [ ] questionnaire
- [x] radio-group
- [x] resizable
- [x] scroll-area
- [x] select
- [x] separator
- [x] sheet
- [x] sidebar
- [x] skeleton
- [x] slider
- [x] sonner
- [x] spinner
- [x] switch
- [x] table
- [x] tabs
- [x] textarea
- [x] toggle
- [x] toggle-group
- [x] tooltip
- [ ] trace

## UI95 originals

Shipped components with no shadcn counterpart.

- [x] dither-image
- [x] dither-shine
- [x] cta-button
- [x] window
- [x] error-dialog
- [x] terminal
- [x] taskbar
- [x] plate
- [x] highlighted-text
- [x] crt-screen

## Special components

Hardware-flavoured components to build later. Each is its own design exercise: a prototype before the real build, stepped motion, the four inks only.

- [ ] crt-player: a CRT TV video player
- [ ] pov-keyboard: a POV mechanical keyboard with a dithered hand that types as you type on the keys
- [ ] hold-to-speak: a hold to speak component
- [ ] rotary-dial: a rotating dial component
- [ ] lever-switch: a lever switch
- [ ] radial-meter: a radial meter, like a speedometer
- [ ] red-button: a big red button
- [ ] radio-buttons: real radio buttons, the mechanical kind
- [ ] tape-buttons: real tape deck press buttons
