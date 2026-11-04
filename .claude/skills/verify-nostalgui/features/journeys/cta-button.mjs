import { join } from "node:path"

async function readWalls(button) {
  return button.evaluate((element) => {
    const style = getComputedStyle(element)
    return ["Top", "Right", "Bottom", "Left"].map((side) => parseFloat(style[`border${side}Width`]))
  })
}

export default async function verifyCtaButton({ page, baseUrl, evidenceDir, expect }) {
  await page.goto(`${baseUrl}/components`, { waitUntil: "networkidle" })
  const card = page.locator("article#cta-button")
  await card.scrollIntoViewIfNeeded()
  const button = card.getByRole("button", { name: "Get NOSTALGUI" })
  const box = await button.boundingBox()
  expect("hero keycap renders", box !== null)

  const outerBefore = `${box.width}x${box.height}`
  const rest = await readWalls(button)
  expect("rest walls are top 2, right 5, bottom 6, left 5 px", rest.join(",") === "2,5,6,5", rest.join(","))
  expect("shine canvas mounts inside the keycap", (await button.locator("canvas").count()) === 1)
  await card.screenshot({ path: join(evidenceDir, "rest.png") })

  await page.mouse.move(box.x + 3, box.y + 3)
  await page.waitForTimeout(350)
  const topLeft = await readWalls(button)
  expect("top-left hover thins the left and top walls", topLeft[3] < rest[3] && topLeft[0] < rest[0], topLeft.join(","))
  expect("top-left hover thickens the right wall and bottom skirt", topLeft[1] > rest[1] && topLeft[2] > rest[2], topLeft.join(","))
  await card.screenshot({ path: join(evidenceDir, "hover-top-left.png") })

  await page.mouse.move(box.x + box.width - 3, box.y + box.height - 3)
  await page.waitForTimeout(350)
  const bottomRight = await readWalls(button)
  expect("bottom-right hover mirrors the tilt", bottomRight[1] < bottomRight[3], bottomRight.join(","))
  await card.screenshot({ path: join(evidenceDir, "hover-bottom-right.png") })

  const after = await button.boundingBox()
  expect("outer size never changes while tilting", `${after.width}x${after.height}` === outerBefore, `${after.width}x${after.height}`)

  await page.mouse.move(box.x + box.width + 200, box.y + 200)
  await page.waitForTimeout(350)
  const released = await readWalls(button)
  expect("leaving restores the rest walls", released.join(",") === rest.join(","), released.join(","))
}
