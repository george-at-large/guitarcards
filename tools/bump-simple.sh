#!/bin/sh
# Stamp a new Simple build: the app compares its own stamp with simple-version.json on every open and, if the
# site has moved on, clears its offline cache and reloads. Run before committing a change to Simple.
cd "$(dirname "$0")/.." || exit 1
v=$(date -u +%Y%m%d-%H%M)
printf "// written by tools/bump-simple.sh\nexport const BUILD = '%s';\n" "$v" > src/simple/build.js
printf '{ "v": "%s" }\n' "$v" > simple-version.json
echo "Simple build $v"
