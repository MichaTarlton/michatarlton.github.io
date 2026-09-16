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


# FOr local stuff see here https://quartz.jzhao.xyz/cli/build


Troubleshooting
Home
❯

CLI Reference
❯

quartz build
quartz build
aliases	build
Sep 15, 20262 min read

The build command transforms your Markdown content into a static HTML website. It processes your files through the configured plugins and outputs the final site to a directory of your choice.

Flags
Flag	Shorthand	Description	Default
--directory	-d	The directory containing your Quartz project	Current directory
--verbose	-v	Enable detailed logging for debugging	false
--output	-o	The directory where the built site will be saved	public
--serve		Start a local development server	false
--watch		Rebuild the site when files change	false
--port		The port for the development server	8080
--wsPort		The port for the WebSocket hot-reload server	3001
--baseDir		Set a base directory for the site (e.g. for GitHub Pages)	/
--remoteDevHost		The hostname to use for the development server	localhost
--bundleInfo		Output a JSON file with bundle size information	false
--concurrency	-c	Number of worker threads to use for building	CPU core count
Examples
Basic Build
Generate your site into the public folder.


npx quartz build
Development Mode
Start a local server and watch for changes. This is the most common way to preview your site while writing.


npx quartz build --serve
Custom Output and Port
Build to a specific folder and run the server on a different port.


npx quartz build --serve --output dist --port 3000
Performance Tuning
If you have a very large vault, you can limit the number of concurrent workers to save memory.


npx quartz build --concurrency 2
Serve vs Watch
The --serve and --watch flags control different behaviors:

--serve starts a local development server AND automatically watches for changes (implies --watch). This is the recommended mode for local development.
--watch only watches for file changes and rebuilds automatically, without starting a server. This is useful for CI pipelines or custom server setups where you want automatic rebuilds but handle serving separately.
In most cases, you want --serve:


npx quartz build --serve
Development Server
The --serve flag starts a local web server. This server is intended for development and previewing only. It is not designed for production use. For information on how to deploy your site, see hosting.

Hot Reloading
When running with --serve, Quartz automatically enables --watch. It uses a WebSocket connection (on the port specified by --wsPort) to notify your browser when a file has changed. The browser will then automatically refresh to show the latest version of your content.