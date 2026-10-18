#!/usr/bin/env bash
# Compile every local component plugin (components-local/<name>/src/index.ts
# → components-local/<name>/dist/components/index.js). Run by `npm run build:components`
# (also wired into prebuild).
set -euo pipefail

for dir in components-local/*/; do
  name="$(basename "$dir")"
  [ -f "$dir/src/index.ts" ] || continue
  echo "→ building local component: $name"
  npx esbuild "$dir/src/index.ts" \
    --bundle \
    --format=esm \
    --platform=node \
    --jsx=automatic \
    --jsx-import-source=preact \
    --packages=external \
    --outfile="$dir/dist/components/index.js"
done

# Browser-side bundles: self-init scripts copied to /static/ by the Static
# emitter and loaded by a component's afterDOMLoaded loader (SPA-safe because
# the engine re-adds head scripts on nav; the bundle itself guards + is
# idempotent, so double-execution is harmless).
if [ -f "components-local/landing/src/simView.ts" ]; then
  echo "→ building browser bundle: landing simView"
  npx esbuild "components-local/landing/src/simView.ts" \
    --bundle \
    --format=esm \
    --outfile="quartz/static/js/gr-sim.js"
fi
