import { test } from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import path from "node:path"

/**
 * Track: Natural — built-output pins (Task 1).
 * Run after `npm run build:components && npx quartz build`.
 */

const publicDir = path.resolve(import.meta.dirname, "..", "public")

function read(rel: string): string {
  return fs.readFileSync(path.join(publicDir, rel), "utf-8")
}

test("public/index.html exists (run the quartz build first)", () => {
  assert.ok(
    fs.existsSync(path.join(publicDir, "index.html")),
    "public/index.html missing; run npx quartz build",
  )
})

test("landing marker present in built index", () => {
  const html = read("index.html")
  assert.match(html, /nat-/, "expected nat- landing marker class in public/index.html")
})

for (const forbidden of ["r-card", "a-hero", "a-cards", "theme-a", "site-nav-link"]) {
  test(`no legacy "${forbidden}" in built index`, () => {
    const html = read("index.html")
    assert.ok(!html.includes(forbidden), `public/index.html still contains "${forbidden}"`)
  })
}
