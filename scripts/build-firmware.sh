#!/usr/bin/env bash
# ZMK firmware local build (Docker). Usage:
#   scripts/build-firmware.sh            # build left + right
#   scripts/build-firmware.sh left       # build one side
#   scripts/build-firmware.sh --update   # also refresh ZMK/Zephyr sources (west update)
# Output: firmware/first_{left,right}.uf2
set -euo pipefail
cd "$(dirname "$0")/.."

IMAGE=zmkfirmware/zmk-build-arm:stable
VOLUME=zmk-first-workspace        # caches ZMK + Zephyr sources (~2GB) between runs
BOARD='xiao_ble//zmk'

UPDATE=0; SIDES=()
for a in "$@"; do
  case "$a" in
    --update) UPDATE=1 ;;
    left|right) SIDES+=("$a") ;;
    *) echo "unknown arg: $a" >&2; exit 2 ;;
  esac
done
[ ${#SIDES[@]} -eq 0 ] && SIDES=(left right)
mkdir -p firmware

docker run --rm \
  -v "$VOLUME":/zmk \
  -v "$PWD/config":/zmk/config:ro \
  -v "$PWD/firmware":/out \
  -e UPDATE="$UPDATE" -e SIDES="${SIDES[*]}" -e BOARD="$BOARD" \
  -w /zmk "$IMAGE" bash -euo pipefail -c '
    if [ ! -d .west ]; then
      echo ">> first run: west init + update (downloads ~2GB, takes a while)"
      west init -l config
      UPDATE=1
    fi
    if [ "$UPDATE" = 1 ]; then west update --fetch-opt=--filter=tree:0; fi
    west zephyr-export >/dev/null
    for side in $SIDES; do
      echo ">> building first_$side"
      west build -p auto -s zmk/app -d "build/$side" -b "$BOARD" -- \
        -DSHIELD="first_$side" -DZMK_CONFIG=/zmk/config
      cp "build/$side/zephyr/zmk.uf2" "/out/first_$side.uf2"
    done
  '
ls -la firmware/*.uf2
