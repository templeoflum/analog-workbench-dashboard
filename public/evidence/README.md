# Cadet VII v1.1 — first DC bench

This is a schematic-derived **ideal linear DC model**, not a completed analog emulator. User approval on this turn authorized the C7 implementation. The previous target audit and source copies are preserved.

## Source and trace

Lars Larsen / LZX Industries, Cadet VII Processor v1.1, March 1 2016, schematic page 1. Pinned source: https://github.com/lzxindustries/lzxdocs/blob/83dd46578b5ea394816b4151b791355cbbb3a345/static/pdf/cadet-vii-processor/cadet-vii-processor-schematics.pdf

BOM at the same directory: cadet-vii-processor-bom.csv. The fixed resistor values used here were manually cross-checked against that list. R4/R20 are B10K pots. Reference voltage is explicitly idealized to the sheet's nominal 2.5V; it is not a measured TL431 output. Manufacturer part tolerances do not become a claimed module error bound.

Signal trace: J1/R3/R1 → U3.1 (R7/R10 feedback); R4 wiper → U3.2 (R8/R9); J3/R14/R12 → U2.1 (R2/R11); R5/R6 average into U2.2; R13 feedback; R19 to J4. Input jack normals are grounded in the drawing. An unpatched input is modeled as 0V. This trace has been checked visually by one agent, not independently authenticated against a board.

S1 has two complementary poles. We use electrical names instead of claiming a physical toggle direction: `offset_input` connects R10 to the offset buffer and R11 to ground; `offset_thru` reverses those connections. The manufacturer's In/Thru labels are retained as A/B in the API. Reference path: R21/R22 divider, U5.1 buffer, U5.2 inverter (R16/R15), R20 wiper, U5.3 buffer. Power network and unused U5.4 are outside this ideal DC model.

## Equations and assumptions

All values are volts/ohms. Let a/b be voltages at the input jacks after the 100k input load, p/q be pot positions from 0 to 1. Knob endpoints are electrical fractions, not verified panel rotation directions.

    reference = 2.5 × 20000 / (4990 + 20000)
    offset = (2q − 1) × reference
    A = 2a − selected_offset_A
    B = 2b − selected_offset_B
    Vbefore_R19 = ((2p − 1)A + B) / 2
    Vout = Vbefore_R19 × Rload / (Rload + 499)

Unloaded output uses load=inf. Finite source resistance attenuates each source by 100000/(100000+Rsource). The 499-ohm input series resistors carry no current into ideal op-amp inputs; they are retained in the nodal reference. Ideal buffers give unloaded pot wipers. R13 carries no current in this limit. These facts change with real component behavior.

No saturation, bandwidth, noise, slew, supply droop, parasitics, temperature or component spread is modeled. Inputs outside the tested operating region do not gain physical credibility because the ideal equations return a number. The reference solver shares the schematic interpretation and idealizations; agreement cannot independently validate those assumptions.

## Repeat

Run `python3 verify.py` in this directory. It compares the fast equations with modified nodal analysis assembled from the circuit connections. Both are standard-library Python. Tests check internal nodes as well as output; 6 hand anchors and 6 invalid-input cases accompany 470 numerical comparisons. The 1e-10 V threshold checks arithmetic agreement only. `verification.json` records results.

Run `render_demo.py` using Python with Pillow. It feeds two independent synthetic images into the same model and writes `dc-image-demo.png`. Display conversion clips to 0–1V, but that clipping is not part of the circuit model. The image is an illustration of DC sample mapping, not a timed NTSC/video simulation.

## Next slice

Obtain and inspect manufacturer models for LM6172, TL074 and TL431; check simulator compatibility before use. Establish loaded DC and transient reference cases with explicit supplies and tolerances. A simulator was not installed here (ngspice unavailable), so this pass used an independent linear circuit solver and makes no SPICE claim. Hardware comparison requires an identified module and measurement setup. Do not release a physical-fidelity claim from the present bench.
