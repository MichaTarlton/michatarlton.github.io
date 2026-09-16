Here's your complete answer — one tiny step from you, then it's all automatic:

## One-time (30 seconds, you)

GitHub → **Settings → SSH and GPG keys → New SSH key**, paste this:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIo2WMpW1tqFeDIs4T+Fqz2plW0Kx1O3fZQ+n28o7ieG maxcorbetti@gmail.com
```

(I've already switched your repo's remote to SSH. After the key is added, `git push` just works — no passwords, no tokens, ever again.)

## Your daily deploy flow

**To production (live at tarlton.info in ~1 minute):**
```bash
cd ~/Projects/website_overhaul/michatarlton.github.io
git add -A
git commit -m "content: what's new"
git push origin v5
```

**To preview safely first (live preview URL in ~1 minute):**
```bash
git checkout -b my-change
# ...edit, commit...
git push origin my-change
```
The preview appears at `https://my-change-tarlton-info.maxcorbetti.workers.dev` (branch name hyphenated). When you're happy: `git checkout v5 && git merge my-change && git push origin v5`.

**To watch a build:** Workers & Pages dashboard → `tarlton-info` → Builds, or just ask me — I can list builds and their logs via the API.

Two notes:
- **Never push the vault-synced stuff manually** — when the Phase 2 sync pipeline lands, vault content flows through `npm run sync` → branch → preview → merge, per the Blueprint. Hand-authored pages (landing, CV, research) you edit and push exactly as above.
- The PATs can be retired whenever you like — SSH replaces them for git. (I'd still keep the Cloudflare API token for MCP/dashboard work.)