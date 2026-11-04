# Roadmap

What dither-ui has shipped and what is left. A box is ticked when the component is a registry item in `registry.json` with a showcase demo. `npm run check:style` fails if a tick here disagrees with the registry.

## shadcn components

Every `registry:ui` component in shadcn's `radix-nova` style (64 as of November 2026). Each ships as a drop-in reskin: same file name, exports and variant names.

21 of 64 done.

- [x] accordion
- [x] alert
- [ ] alert-dialog
- [ ] aspect-ratio
- [ ] attachment
- [ ] avatar
- [x] badge
- [ ] breadcrumb
- [ ] bubble
- [x] button
- [ ] button-group
- [ ] calendar
- [x] card
- [ ] carousel
- [ ] chart
- [x] checkbox
- [ ] code-block
- [ ] collapsible
- [ ] combobox
- [ ] command
- [ ] context-menu
- [x] dialog
- [ ] direction
- [ ] drawer
- [x] dropdown-menu
- [ ] empty
- [ ] field
- [ ] form
- [ ] hover-card
- [x] input
- [ ] input-group
- [ ] input-otp
- [ ] item
- [ ] kbd
- [x] label
- [ ] marker
- [x] menubar
- [ ] message
- [ ] message-scroller
- [ ] native-select
- [ ] navigation-menu
- [ ] pagination
- [ ] popover
- [x] progress
- [ ] questionnaire
- [x] radio-group
- [ ] resizable
- [x] scroll-area
- [x] select
- [x] separator
- [ ] sheet
- [ ] sidebar
- [ ] skeleton
- [x] slider
- [ ] sonner
- [ ] spinner
- [x] switch
- [ ] table
- [x] tabs
- [x] textarea
- [ ] toggle
- [ ] toggle-group
- [x] tooltip
- [ ] trace

## dither-ui originals

Shipped components with no shadcn counterpart.

- [x] dither-image
- [x] dither-shine
- [x] cta-button
- [x] window
- [x] error-dialog
- [x] terminal
- [x] taskbar
- [x] desktop-icon

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
