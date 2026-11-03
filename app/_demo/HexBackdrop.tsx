const MODULES = ["ntoskrnl.exe", "ncrc710.sys", "scsidisk.sys", "Floppy.SYS", "atd.sys", "i8042prt.SYS", "SCSIPORT.SYS"]

function buildHexLines(count: number): string[] {
  return Array.from({ length: count }, (_, index) => {
    const address = (0x80100000 + index * 0x2f3a1).toString(16).padStart(8, "0")
    const base = (0x2bd49666 + index * 0x1f4b).toString(16).padStart(8, "0")
    return `${address} ${base} - ${MODULES[index % MODULES.length]}`
  })
}

const HEX_LINES = buildHexLines(64)

function HexBackdrop() {
  return (
    <pre
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden p-6 text-xl leading-tight text-foreground opacity-40 select-none"
    >
      {"*** STOP: 0x0000001E (0xC0000047,0x8013D1E2,0x00000000)\n"}
      {"Unhandled Kernel exception c0000047\n\n"}
      {HEX_LINES.join("\n")}
    </pre>
  )
}

export { HexBackdrop }
