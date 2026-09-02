// Seeed Studio XIAO nRF52840 Plus — Ergogen footprint (KiCad 8+)
//
// Pad positions are taken verbatim from Seeed's official KiCad library
// (New_XIAO_Series_Footprints.zip / XIAO-nRF52840-Plus-SMD.kicad_mod,
//  pin functions from XIAO_Series_SCH_Symbols.zip), rotated 90° so the
// USB connector faces "up" (-Y) like the ceoloide pro-micro footprints.
//
// Orientation (top view, USB up):
//   Left column  (castellated SMD): D0 D1 D2 D3 D4 D5 D6  (top -> bottom)
//   Right column (castellated SMD): VBUS GND 3V3 D10 D9 D8 D7 (top -> bottom)
//   Bottom-center pads: VBAT / GND — exposed here as PLATED THROUGH-HOLES so
//   the battery net can be soldered from the back of the PCB into the
//   module's underside pads (hand-assembly friendly).
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

    // castellated side pads: official offsets ±8.255, pitch 2.54, pad 0.95 x 2.032
    const main_pads = [
      // [x, y, net]  (local frame: USB up at -Y)
      [-8.255, -7.62, p.D0], [-8.255, -5.08, p.D1], [-8.255, -2.54, p.D2],
      [-8.255,  0.00, p.D3], [-8.255,  2.54, p.D4], [-8.255,  5.08, p.D5],
      [-8.255,  7.62, p.D6],
      [ 8.255, -7.62, p.VBUS], [ 8.255, -5.08, p.GND], [ 8.255, -2.54, p.V3V3],
      [ 8.255,  0.00, p.D10],  [ 8.255,  2.54, p.D9],  [ 8.255,  5.08, p.D8],
      [ 8.255,  7.62, p.D7],
    ]
    const labels = [
      ['D0', -8.255, -7.62], ['D1', -8.255, -5.08], ['D2', -8.255, -2.54],
      ['D3', -8.255, 0], ['D4', -8.255, 2.54], ['D5', -8.255, 5.08], ['D6', -8.255, 7.62],
      ['VBUS', 8.255, -7.62], ['GND', 8.255, -5.08], ['3V3', 8.255, -2.54],
      ['D10', 8.255, 0], ['D9', 8.255, 2.54], ['D8', 8.255, 5.08], ['D7', 8.255, 7.62],
    ]

    let pads = ''
    let n = 0
    for (const [x, y, net] of main_pads) {
      n += 1
      pads += `
    (pad "${n}" smd roundrect (at ${sx * x} ${y} ${p.r}) (size 0.95 2.032) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.25) ${net.str})`
    }

    // module underside battery pads (official: VBAT & GND, pad 2.5 x 1.1)
    // exposed as PTH so they can be soldered from the opposite PCB face
    pads += `
    (pad "28" thru_hole circle (at ${sx * -0.994} 5.518 ${p.r}) (size 1.6 1.6) (drill 0.8) (layers "*.Cu" "*.Mask") ${p.VBAT.str})
    (pad "29" thru_hole circle (at ${sx * 1.006} 5.518 ${p.r}) (size 1.6 1.6) (drill 0.8) (layers "*.Cu" "*.Mask") ${p.GND.str})`

    let silk_labels = ''
    if (p.show_silk_labels) {
      for (const [txt, x, y] of labels) {
        const right = (sx * x) > 0
        silk_labels += `
    (fp_text user "${txt}" (at ${sx * x + (right ? 2.2 : -2.2)} ${y} ${p.r}) (layer "${side}.SilkS")
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
    (attr smd)
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
