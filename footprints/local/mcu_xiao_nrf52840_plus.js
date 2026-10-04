// Seeed Studio XIAO nRF52840 Plus — Ergogen footprint (KiCad 8+)  rev2 "DIP style"
//
// rev2 (v1.5 boards): hand-assembly friendly. Each of the 14 pins now has TWO
// elements, copied from Seeed's official DIP footprint (XIAO-nRF52840-DIP):
//   - a PLATED THROUGH-HOLE (drill 0.889, pad 1.524) at ±7.62 — aligned exactly
//     under the module's own header holes, so soldering is "fill the hole from
//     the top": solder flows through the module hole into the PCB hole and
//     joins both. Header pins can also be used as alignment jigs (or soldered
//     outright). This fixes the rev1 mistake where the SMD pads sat at the
//     castellation line (±8.255) while the module holes are at ±7.62 — solder
//     through the holes barely reached the pads.
//   - an SMD "lip" pad at ±8.455 extending ~0.3mm past the module edge (8.89),
//     so the castellation can alternatively be drag-soldered from outside.
//
// Pin functions verified from XIAO_Series_SCH_Symbols.zip. Frame rotated 90°
// so the USB connector faces "up" (-Y) like the ceoloide pro-micro footprints.
//
// Orientation (top view, USB up):
//   Left column : D0 D1 D2 D3 D4 D5 D6  (top -> bottom)
//   Right column: VBUS GND 3V3 D10 D9 D8 D7 (top -> bottom)
//   Bottom-center: VBAT / GND battery pads as PTH — solder from the back of
//   the PCB into the module's underside pads.
//
// Notes:
// - The Plus' extra interleaved castellations (D11..D19) and the SWD/EN pads
//   are intentionally NOT included; they are not needed for a keyboard matrix.
// - No RST pad exists on the Plus (unlike nice!nano). Reset = onboard button.
// - side: F places the module on the front; the footprint is single-sided
//   (this project uses dedicated left/right PCBs, not a reversible board).
//
// Params:
//    designator: default 'MCU'
//    side: 'F' (default) or 'B'
//    show_silk_labels: default true — print pin names next to the pads
//    D0..D10: matrix / spare nets (default net names D0..D10)
//    VBAT: net entering the module battery + pad (route: JST -> switch -> VBAT)
//    GND:  ground net
//    VBUS / V3V3: exposed for completeness, default nets VBUS / 3V3

module.exports = {
  params: {
    designator: 'MCU',
    side: 'F',
    show_silk_labels: true,
    D0: { type: 'net', value: 'D0' },
    D1: { type: 'net', value: 'D1' },
    D2: { type: 'net', value: 'D2' },
    D3: { type: 'net', value: 'D3' },
    D4: { type: 'net', value: 'D4' },
    D5: { type: 'net', value: 'D5' },
    D6: { type: 'net', value: 'D6' },
    D7: { type: 'net', value: 'D7' },
    D8: { type: 'net', value: 'D8' },
    D9: { type: 'net', value: 'D9' },
    D10: { type: 'net', value: 'D10' },
    V3V3: { type: 'net', value: '3V3' },
    GND: { type: 'net', value: 'GND' },
    VBUS: { type: 'net', value: 'VBUS' },
    VBAT: { type: 'net', value: 'VBAT' },
  },
  body: p => {
    const side = p.side == 'B' ? 'B' : 'F'
    const mirror = side == 'B' ? ' (justify mirror)' : ''
    // x sign flips when the footprint lives on the back so the module,
    // viewed from its own component side, keeps the correct pinout
    const sx = side == 'B' ? -1 : 1

    // [column sign, y, net] — columns at |X|: holes 7.62 (module header holes),
    // SMD lip 8.455 (castellation, protrudes past module edge 8.89)
    const pins = [
      [-1, -7.62, p.D0], [-1, -5.08, p.D1], [-1, -2.54, p.D2],
      [-1,  0.00, p.D3], [-1,  2.54, p.D4], [-1,  5.08, p.D5],
      [-1,  7.62, p.D6],
      [ 1, -7.62, p.VBUS], [ 1, -5.08, p.GND], [ 1, -2.54, p.V3V3],
      [ 1,  0.00, p.D10],  [ 1,  2.54, p.D9],  [ 1,  5.08, p.D8],
      [ 1,  7.62, p.D7],
    ]
    const labels = [
      ['D0', -1, -7.62], ['D1', -1, -5.08], ['D2', -1, -2.54],
      ['D3', -1, 0], ['D4', -1, 2.54], ['D5', -1, 5.08], ['D6', -1, 7.62],
      ['VBUS', 1, -7.62], ['GND', 1, -5.08], ['3V3', 1, -2.54],
      ['D10', 1, 0], ['D9', 1, 2.54], ['D8', 1, 5.08], ['D7', 1, 7.62],
    ]

    let pads = ''
    let n = 0
    for (const [cs, y, net] of pins) {
      n += 1
      const c = sx * cs
      pads += `
    (pad "${n}" thru_hole circle (at ${c * 7.62} ${y} ${p.r}) (size 1.524 1.524) (drill 0.889) (layers "*.Cu" "*.Mask") ${net.str})
    (pad "${n}" smd roundrect (at ${c * 8.455} ${y} ${p.r}) (size 1.5 2.1) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.25) ${net.str})`
    }

    // module underside battery pads (official: VBAT & GND, pad 2.5 x 1.1)
    // exposed as PTH so they can be soldered from the opposite PCB face
    pads += `
    (pad "28" thru_hole circle (at ${sx * -0.994} 5.518 ${p.r}) (size 1.6 1.6) (drill 0.8) (layers "*.Cu" "*.Mask") ${p.VBAT.str})
    (pad "29" thru_hole circle (at ${sx * 1.006} 5.518 ${p.r}) (size 1.6 1.6) (drill 0.8) (layers "*.Cu" "*.Mask") ${p.GND.str})`

    let silk_labels = ''
    if (p.show_silk_labels) {
      for (const [txt, cs, y] of labels) {
        const right = (sx * cs) > 0
        silk_labels += `
    (fp_text user "${txt}" (at ${sx * cs * 8.455 + (right ? 2.4 : -2.4)} ${y} ${p.r}) (layer "${side}.SilkS")
      (effects (font (size 0.8 0.8) (thickness 0.12))${mirror} (justify ${right != (side == 'B') ? 'left' : 'right'}${side == 'B' ? ' mirror' : ''}))
    )`
      }
      silk_labels += `
    (fp_text user "BAT+" (at ${sx * -0.994} 7.4 ${p.r}) (layer "${side}.SilkS")
      (effects (font (size 0.8 0.8) (thickness 0.12))${mirror})
    )`
    }

    return `
  (footprint "local:mcu_xiao_nrf52840_plus"
    (layer "${side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}" (at 0 -12 ${p.r}) (layer "${side}.SilkS") ${p.ref_hide} (effects (font (size 1 1) (thickness 0.15))${mirror}))
    (attr through_hole)
    ${''/* module outline 17.78 x 21.0 */}
    (fp_line (start -8.89 -10.5) (end 8.89 -10.5) (layer "${side}.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.89 10.5) (end 8.89 10.5) (layer "${side}.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start -8.89 -10.5) (end -8.89 10.5) (layer "${side}.SilkS") (stroke (width 0.12) (type solid)))
    (fp_line (start 8.89 -10.5) (end 8.89 10.5) (layer "${side}.SilkS") (stroke (width 0.12) (type solid)))
    ${''/* USB connector marker (protrudes ~1.2mm past the module edge) */}
    (fp_line (start ${sx * -4.6} -11.7) (end ${sx * 4.6} -11.7) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start ${sx * -4.6} -11.7) (end ${sx * -4.6} -7.2) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start ${sx * 4.6} -11.7) (end ${sx * 4.6} -7.2) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_line (start ${sx * -4.6} -7.2) (end ${sx * 4.6} -7.2) (layer "Dwgs.User") (stroke (width 0.12) (type solid)))
    (fp_text user "USB" (at 0 -9.4 ${p.r}) (layer "${side}.SilkS") (effects (font (size 0.8 0.8) (thickness 0.12))${mirror}))
    ${''/* fab outline */}
    (fp_line (start -8.89 -10.5) (end 8.89 -10.5) (layer "${side}.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -8.89 10.5) (end 8.89 10.5) (layer "${side}.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start -8.89 -10.5) (end -8.89 10.5) (layer "${side}.Fab") (stroke (width 0.1) (type solid)))
    (fp_line (start 8.89 -10.5) (end 8.89 10.5) (layer "${side}.Fab") (stroke (width 0.1) (type solid)))
    ${pads}
    ${silk_labels}
  )`
  }
}
