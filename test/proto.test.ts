import test from "node:test"
import assert from "node:assert/strict"
import { resolveProto, PROTO_BOOT_SCRIPT } from "../components-local/hero/src/proto"

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
