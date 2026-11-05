const SKIPPED_TAGS = new Set(["BUTTON", "NAV", "SCRIPT", "STYLE", "SVG", "CANVAS"])
const FENCE = "```"

function inline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/\s+/g, " ")
  }
  if (!(node instanceof HTMLElement) || SKIPPED_TAGS.has(node.tagName) || node.hasAttribute("data-copy-skip")) {
    return ""
  }
  const children = Array.from(node.childNodes).map(inline).join("")
  switch (node.tagName) {
    case "A": {
      const href = node.getAttribute("href")
      return href ? `[${children.trim()}](${new URL(href, window.location.href).href})` : children
    }
    case "CODE":
      return `\`${node.textContent ?? ""}\``
    case "STRONG":
    case "B":
      return `**${children}**`
    case "EM":
    case "I":
      return `_${children}_`
    case "BR":
      return "\n"
    default:
      return children
  }
}

function table(element: HTMLElement): string {
  const rows = Array.from(element.querySelectorAll("tr")).map((row) =>
    Array.from(row.children).map((cell) => inline(cell).trim().replace(/\|/g, "\\|"))
  )
  if (rows.length === 0) {
    return ""
  }
  const [head, ...body] = rows
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`
  return [line(head), line(head.map(() => "---")), ...body.map(line)].join("\n")
}

function list(element: HTMLElement): string {
  const ordered = element.tagName === "OL"
  return Array.from(element.children)
    .map((item, index) => `${ordered ? `${index + 1}.` : "-"} ${inline(item).trim()}`)
    .join("\n")
}

function block(node: Node, out: string[]): void {
  if (!(node instanceof HTMLElement) || SKIPPED_TAGS.has(node.tagName) || node.hasAttribute("data-copy-skip")) {
    return
  }
  const tag = node.tagName
  if (/^H[1-6]$/.test(tag)) {
    out.push(`${"#".repeat(Number(tag[1]))} ${inline(node).trim()}`)
  } else if (tag === "PRE") {
    out.push(`${FENCE}\n${(node.textContent ?? "").replace(/\n$/, "")}\n${FENCE}`)
  } else if (tag === "TABLE") {
    out.push(table(node))
  } else if (tag === "UL" || tag === "OL") {
    out.push(list(node))
  } else if (tag === "P") {
    out.push(inline(node).trim())
  } else if (node.hasAttribute("data-code-block")) {
    const title = node.querySelector("span")?.textContent?.trim()
    if (title) {
      out.push(`\`${title}\``)
    }
    Array.from(node.querySelectorAll("pre")).forEach((pre) => block(pre, out))
  } else {
    Array.from(node.childNodes).forEach((child) => block(child, out))
  }
}

export function domToMarkdown(root: HTMLElement): string {
  const out: string[] = []
  block(root, out)
  return `${out.filter((chunk) => chunk.length > 0).join("\n\n")}\n`
}
