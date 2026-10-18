import { test } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"

/**
 * Graphic Realism track — built-output pins.
 * Run after `npm run build:components && npx quartz build`.
 */

const root = path.resolve(import.meta.dirname, "..")
const indexPath = path.join(root, "public", "index.html")

function readIndex(): string {
  assert.ok(fs.existsSync(indexPath), `missing ${indexPath} — run the build first`)
  return fs.readFileSync(indexPath, "utf-8")
}

test("landing marker present in built index", () => {
  const html = readIndex()
  assert.match(html, /gr-landing/)
})

test("no legacy design-layer classes in built index", () => {
  const html = readIndex()
  for (const legacy of ["r-card", "a-hero", "a-cards", "theme-a", "site-nav-link"]) {
    assert.ok(!html.includes(legacy), `built index still contains legacy "${legacy}"`)
  }
})
