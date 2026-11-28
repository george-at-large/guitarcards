#!/bin/sh
# Stamp a new Scale Driller build: the app compares its own stamp with driller-version.json on every open and, if
# the site has moved on, clears its offline cache and reloads. Run before committing a change to the app.
cd "$(dirname "$0")/.." || exit 1
v=$(date -u +%Y%m%d-%H%M)
printf "// written by tools/bump-driller.sh\nexport const BUILD = '%s';\n" "$v" > src/driller/build.js
printf '{ "v": "%s" }\n' "$v" > driller-version.json
echo "Scale Driller build $v"
