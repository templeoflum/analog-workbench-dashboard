# Corrected Cadet VII integration record

## Correction and withdrawal

The first combined generator used `wiper` for both gain and offset pots. That unintentionally joined R4 and R20. All combined f0 DC, frozen-shunt and early cross-simulator results are withdrawn as Cadet evidence. Historical dashboard version 5 reported 495 combined DC points from that erroneous topology. This corrected f1 uses `offset_wiper` for R20. Standalone reference-stage and earlier signal-path-only results do not contain the connection and are retained.

A new schematic-derived boundary test verifies that the signal and reference stages share only ground, board rails and the offset-buffer output. It checks 18 control configurations and rejects a deliberate extra wiper bridge. The corrected fixtures are preserved separately from the erroneous ones.

## Corrected results

- ngspice combined DC: 32 of 36 sweeps complete, 480 points; four rejected sweeps retained. Each sweep requests input A=-0.2..1.2 V in 0.1 V steps, B=.25 V; both routes, gain/offset positions 0/.5/1, loads1k/100k. Separate seeded probes are not added to this headline count.
- ngspice frozen-shunt diagnostic: 16 of 18 configurations complete at two timesteps (32 transients); two full-model DC anchors fail. The TL431 is replaced only for this diagnostic by its computed DC voltage. Initial-output differences from the corresponding full DC computation are at most 0.554 nV; this is a numerical observation, not hardware accuracy. Reference buffers and signal path remain active. This does not validate TL431 dynamics.
- Corrected coupled Xyce core: all 18 runs complete (6 configurations × 3 maximum timesteps: .025, .0125, .00625 ns). All four LM6172 models, four TL074 amplifier sections and TL431 are present. Same signal case as the first transient bench: offset .6, 100k output load, 499Ω sources, A=0→.2V pulse, B=0, 500ns. Ideal ±12V board rails.
- Xyce uses Gear with time integration and transient nonlinear RELTOL=1e-4, ABSTOL=1e-7, device GMIN=1e-16. All accepted traces are finite, strictly increasing and reach500ns; all have8 JFETs in the simulator's device count, guarding against missing TL074 sections. Device-topology warnings for unused internal TL431 nodes are retained.
- Two successive timestep comparisons decrease in all six Xyce cases. Largest differences across cases:57.054847µV, then14.540248µV. Linear interpolation on the union of both sample grids over0–500ns. These are numerical sensitivity observations, not exact-error or hardware bounds.
- One center-gain thru-offset case at.00625ns completes when tightening relative tolerance alone or absolute tolerance alone tenfold; tightening both aborts near306ns. Several earlier tighter settings also abort. Thus the dynamic reference remains experimental, with no acceptance threshold assigned.
- Five nominal cases permit comparison of the Xyce coupled core with the ngspice frozen-shunt diagnostic; maximum output difference2.315µV. These are different circuits, so this supports a bounded diagnostic comparison, not identical-netlist cross-simulator validation.

## Simulator and syntax compatibility

[Xyce official executables](https://xyce.sandia.gov/downloads/executables/), XyceNF7.10.0 serial ARM64, extracted to a temporary folder without system installation. Runtime path, binary/package hashes and capability output retained. No Xyce executable is distributed in the fixture. See [Xyce7.10 reference guide](https://xyce.sandia.gov/download/2068/?tmstv=1754510749) for option semantics; Xyce and ngspice tolerance values do not have identical meanings.

The original manufacturer files are retained unchanged. For Xyce, TL074 syntax needs normalization: remove the final DOS EOF byte, remove leading indentation from device lines, and rewrite the EGND POLY control-node pairs `(3,0) (4,0)` as `3 0 4 0`. No element values, connections or equations change. Removing only EOF resulted in a parsed circuit with zero TL074 JFETs, which is rejected. Normalization loads8 JFETs. The separate algebra diagnostic changed two LM6172 controlled-source forms but did not solve the problem and is NOT used in the accepted Xyce runs.

ngspice still fails corrected full coupled transients. These failures remain documented; none of its partial traces is counted as complete.

## Supply-current limitation

The original TL074 macro draws14.194067mA at ±15V/25°C in an unloaded grounded-follower check. [TI's TL074 datasheet](https://www.ti.com/lit/ds/symlink/tl074.pdf), section5.8, gives1.4mA typical /2.5mA maximum per amplifier for the original family. The macro's2.143k rail-to-rail resistor alone accounts for about14mA at30V. Do not predict physical board current or diode/rail droop with this model. No undocumented parameter edit was made to force agreement.

## Repeat

Requires ngspice47 and, for coupled runs, XyceNF7.10.0 (or a separately qualified build). Run `python3 check_connections.py`, `python3 core_dc.py`, `python3 frozen_shunt_study.py`. For Xyce: run `python3 normalize_xyce_models.py`, then set `XYCE_EXECUTABLE` and, on this extracted macOS runtime, `XYCE_LIBRARY_DIRECTORY`, and run `python3 xyce_study.py`, then `python3 analyze_xyce.py`. Runtime file records this machine's temporary paths; supply overrides elsewhere. Logs/netlists are included; large raw waveforms can be regenerated. The Xyce binary itself remains an external prerequisite.

## Remaining gates

More tolerance and operating-domain checks, identical-circuit cross-simulator qualification, rail/load model qualification and physical-board measurements remain. Power-entry protection, ferrites, bypass-capacitor imperfections and layout parasitics remain omitted. Live image example is still ideal DC. No hardware-fidelity claim.

## Retained standalone reference work

# Cadet VII reference-stage milestone

The TL431 shunt and four TL074 amplifier sections are now traced and simulated separately. This is a manufacturer-model study with ideal board rails, not a hardware measurement or completed full-module dynamic reference.

## Circuit and sources

Pinned [LZX C7 v1.1 schematic](https://github.com/lzxindustries/lzxdocs/blob/83dd46578b5ea394816b4151b791355cbbb3a345/static/pdf/cadet-vii-processor/cadet-vii-processor-schematics.pdf), March 1 2016. R18 (4.99k) feeds U4; TL431 cathode and feedback tied, anode grounded. R21 (4.99k)/R22 (20k) feed U5.1 follower; R16/R15 (1k each) form U5.2 inverter; R20 (10k) spans both outputs; U5.3 buffers its wiper; U5.4 is the grounded unused follower. Pot fractions are electrical positions. Trace read visually by one agent, not authenticated against a board.

Models: [TI TL431 SLVM071](https://www.ti.com/lit/zip/SLVM071), 2017 unencrypted PSpice; [TI TL074 SLOJ068](https://www.ti.com/lit/zip/SLOJ068), original-family 1989 macro; existing [TI LM6172 SNOM234](https://www.ti.com/lit/zip/SNOM234). All model bytes unchanged, including TL074's trailing DOS EOF byte. ngspice 47, `-n -D ngbehavior=ps`: compatibility mode handles the TL431 IF expressions. Without that mode parsing fails. TINA alternative was encrypted and was not used; legacy TL431 model not selected. source hashes and original packages retained locally.

## Completed experiments

- 45 standalone DC cases: ideal symmetric rails ±11, ±12, ±15 V; offset positions 0, .25, .5, .75, 1; resistive buffer loads 1k, 10k, 1M. SPARSE solver. No warnings. Shunt voltage range 2.495507584–2.495761318 V. These are model outputs, not tolerance bounds.
- 24 reference-stage transient runs: offset positions 0, .5, 1; loads 1k and 1M; three maximum timesteps (10, 5, 2.5 ns) plus tighter tolerances at 2.5 ns. SPARSE + Gear, ideal positive rail pulse 12→12.1 V at 10 µs, 1 µs edges, 30 µs width; negative rail fixed -12 V; duration 60 µs. All complete without warnings, finite and strictly increasing outputs. Initial operating point, not startup from zero. Default temperature 27°C.
- Refinement comparison covers the union of adaptive sample grids using linear interpolation. Timestep differences do not decrease monotonically in every reference case. Tightening reltol/abstol/vntol tenfold changes the finest traces by at most 1.912227 µV. No numerical acceptance gate assigned.
