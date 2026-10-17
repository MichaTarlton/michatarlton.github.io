import test from "node:test"
import assert from "node:assert/strict"
import { resolveProto, PROTO_BOOT_SCRIPT } from "../components-local/hero/src/proto"
import { existsSync, readFileSync } from "node:fs"

test("resolveProto: query param wins", () => {
  assert.equal(resolveProto("?proto=gr", null), "gr")
  assert.equal(resolveProto("?proto=nat", "gr"), "nat")
  assert.equal(resolveProto("?proto=off", "nat"), "off")
})

test("resolveProto: unknown or missing param falls back to stored", () => {
  assert.equal(resolveProto("?proto=bogus", "gr"), "gr")
  assert.equal(resolveProto("?proto=bogus", null), null)
  assert.equal(resolveProto("", "nat"), "nat")
  assert.equal(resolveProto("", null), null)
})

test("PROTO_BOOT_SCRIPT touches data-proto and localStorage", () => {
  assert.ok(PROTO_BOOT_SCRIPT.includes("data-proto"))
  assert.ok(PROTO_BOOT_SCRIPT.includes("localStorage"))
})

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const PAIRS: Array<[string, string, string, number]> = [
  ["GR link text", "#1b3fd8", "#f7f6f4", 4.5],
  ["GR secondary text", "#6a6a6a", "#f7f6f4", 4.5],
  ["GR mark (non-text)", "#e5231b", "#f7f6f4", 3],
  ["Natural gold mark (non-text)", "#a97b1f", "#f6f0e4", 3],
  ["Natural lapis link", "#3a4a8f", "#f6f0e4", 4.5],
  ["Natural accent text", "#8f5c08", "#fcf8f0", 4.5],
]

for (const [label, fg, bg, min] of PAIRS) {
  test(`contrast: ${label} ${fg} on ${bg} >= ${min}`, () => {
    const ratio = contrast(fg, bg)
    console.log(`  ${label}: ${ratio.toFixed(2)}:1`)
    assert.ok(ratio >= min, `${ratio.toFixed(2)} < ${min}`)
  })
}

test("built landing: door mark replaces fake recency", (t) => {
  const path = new URL("../public/index.html", import.meta.url)
  if (!existsSync(path)) return t.skip("public/index.html not built")
  const html = readFileSync(path, "utf8")
  assert.ok(!html.includes("a-recent"), "a-recent section still present")
  assert.ok(html.includes("cortex-door"), "cortex-door missing")
  assert.ok(html.includes('data-placeholder="true"'), "placeholder marginalia missing")
  assert.ok(html.includes("Enter the Cortex"), "nav door link missing")
})
