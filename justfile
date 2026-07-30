# tabular-recipes — recipes as one table each

# Show the recipes on localhost.
dev:
    npm run dev

# Everything that has to pass: parse, test, build.
verify:
    npm run verify

# Re-read recipes/**/*.cook into src/generated/recipes.json.
recipes:
    npm run recipes

# Say what is wrong with one recipe, or all of them. Writes nothing.
check *files:
    node scripts/check-recipes.mjs {{files}}

# Pull the shared b28 style kit. Falls back to the local design-system checkout.
sync-kit:
    #!/usr/bin/env bash
    set -euo pipefail
    dest=src/styles/b28-clay.css
    if curl -fsS --max-time 10 https://b28.dev/kit/b28-clay.css -o "$dest.tmp"; then
        mv "$dest.tmp" "$dest"
        echo "synced $dest from b28.dev"
    elif [ -f ../design-system/epochs/clay/b28-clay.css ]; then
        rm -f "$dest.tmp"
        cp ../design-system/epochs/clay/b28-clay.css "$dest"
        echo "synced $dest from ../design-system (b28.dev unreachable)"
    else
        rm -f "$dest.tmp"
        echo "could not reach b28.dev and no local design-system checkout" >&2
        exit 1
    fi
