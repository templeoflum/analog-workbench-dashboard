# Cadet VII reference-stage milestone

The TL431 shunt and four TL074 amplifier sections are now traced and simulated separately. This is a manufacturer-model study with ideal board rails, not a hardware measurement or completed full-module dynamic reference.

## Circuit and sources

Pinned [LZX C7 v1.1 schematic](https://github.com/lzxindustries/lzxdocs/blob/83dd46578b5ea394816b4151b791355cbbb3a345/static/pdf/cadet-vii-processor/cadet-vii-processor-schematics.pdf), March 1 2016. R18 (4.99k) feeds U4; TL431 cathode and feedback tied, anode grounded. R21 (4.99k)/R22 (20k) feed U5.1 follower; R16/R15 (1k each) form U5.2 inverter; R20 (10k) spans both outputs; U5.3 buffers its wiper; U5.4 is the grounded unused follower. Pot fractions are electrical positions. Trace read visually by one agent, not authenticated against a board.

Models: [TI TL431 SLVM071](https://www.ti.com/lit/zip/SLVM071), 2017 unencrypted PSpice; [TI TL074 SLOJ068](https://www.ti.com/lit/zip/SLOJ068), original-family 1989 macro; existing [TI LM6172 SNOM234](https://www.ti.com/lit/zip/SNOM234). All model bytes unchanged, including TL074's trailing DOS EOF byte. ngspice 47, `-n -D ngbehavior=ps`: compatibility mode handles the TL431 IF expressions. Without that mode parsing fails. TINA alternative was encrypted and was not used; legacy TL431 model not selected. source hashes and original packages retained locally.

## Completed experiments

- 45 standalone DC cases: ideal symmetric rails ±11, ±12, ±15 V; offset positions 0, .25, .5, .75, 1; resistive buffer loads 1k, 10k, 1M. SPARSE solver. No warnings. Shunt voltage range 2.495507584–2.495761318 V. These are model outputs, not tolerance bounds.
- 24 reference-stage transient runs: offset positions 0, .5, 1; loads 1k and 1M; three maximum timesteps (10, 5, 2.5 ns) plus tighter tolerances at 2.5 ns. SPARSE + Gear, ideal positive rail pulse 12→12.1 V at 10 µs, 1 µs edges, 30 µs width; negative rail fixed -12 V; duration 60 µs. All complete without warnings, finite and strictly increasing outputs. Initial operating point, not startup from zero. Default temperature 27°C.
- Refinement comparison covers the union of adaptive sample grids using linear interpolation. Timestep differences do not decrease monotonically in every reference case. Tightening reltol/abstol/vntol tenfold changes the finest traces by at most 1.912227 µV. No numerical acceptance gate assigned.
- Integrated core DC sweep: 36 configurations (both offset routes × 3 gain positions × 3 offset positions × loads 1k/100k), each requests 15 input-A voltages from -0.2 to 1.2 V, B=.25 V, sources499Ω. KLU. 33 sweeps complete (495 points); three fail and are not accepted. Warnings retained on completed runs. Differences from the ideal model are observations, not errors against hardware.

## Failed attempts remain evidence

KLU supports integrated DC but the selected TL431 reference fails transient analysis in the combined core. SPARSE handles the standalone reference but fails the combined core with LM6172. Gear stabilizes this standalone reference study but has not solved the combined core. Initial trapezoidal reference tests include a failed tightened run. Added shunts, alternate pivots and iteration probes did not establish a usable combined reference; none is silently incorporated. Failed logs and shortened output files must not be used as complete traces. A frozen TL431 voltage diagnostic runs, but does not validate TL431 dynamics in the combined module.

## Supply-current limitation

At ±15 V and 25°C, a single unloaded grounded-follower TL074 macro draws 14.194067 mA from its positive rail. TI's [current TL074 datasheet](https://www.ti.com/lit/ds/symlink/tl074.pdf), section 5.8, lists 1.4 mA typical / 2.5 mA maximum quiescent current per amplifier for the original family. The macro contains a 2.143k rail-to-rail resistor; its current alone is about 14 mA at 30 V. Do not use this macro to predict board supply current or diode/rail droop. No undocumented model edit was made to force agreement. Both amplifier model headers describe ±15 V operation; accuracy at ±12 V is not established by circuit operating limits.

## Repeat and scope

Run `python3 reference_study.py` for the 45 DC cases and original trapezoidal probes (expected failure recorded); `python3 reference_dynamics.py` for the 24 Gear runs; `python3 core_dc.py` for the 36 integrated DC attempts; `python3 component_checks.py` for the three idle-current checks. Requires ngspice 47 with KLU. Each script retains netlists/logs and raw output. The downloadable fixture omits large raw traces and datasheets; rerun to regenerate traces. See source URLs and hashes.

Power-entry protection diodes/ferrites, bypass capacitor imperfections, board parasitics, tolerances and hardware measurement remain outside this model. Live image example remains ideal DC. Dynamic milestone stays in progress. Next: isolate the combined solver boundary and test the reference buffer's effect without silently substituting a different TL431 model.
