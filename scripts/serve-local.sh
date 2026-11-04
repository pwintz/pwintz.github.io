#!/usr/bin/env bash
# Serve the site locally, including unpublished pages, using the local clone of the UnicodeIt fork (../unicodeit).
# Usage: npm run serve
# Extra arguments are passed to `jekyll serve`, e.g., `npm run serve -- --livereload`.
set -euo pipefail
cd "$(dirname "$0")/.."

# Link node_modules/unicodeit to ../unicodeit, unless it is already linked.
# (A plain `npm install` replaces the link with the version pinned in package.json.)
if [ "$(readlink -f node_modules/unicodeit 2>/dev/null)" != "$(readlink -f ../unicodeit)" ]; then
  echo "Linking node_modules/unicodeit to ../unicodeit"
  npm run --silent link:unicodeit
fi

# Rebuild the TypeScript bundles whenever a source file changes, including files in ../unicodeit.
npm run --silent watch &
watcher=$!
trap 'kill "$watcher" 2>/dev/null || true' EXIT

bundle exec jekyll serve --incremental --unpublished "$@"
