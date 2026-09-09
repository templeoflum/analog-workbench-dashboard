# Cadet diagnostic acquisition v1

Six deliberately defined diagnostic sources, evaluated in six fixed circuit configurations. All 36 cases pass the original <=1 mV peak and <=0.1 mV RMS limits. Worst peak 0.104803790 mV; worst RMS 0.015738835 mV. This is simulation-reference verification, not hardware calibration.

## Acquisition contract

4001 samples including both endpoints, 0 to 1000 ns, 0.25 ns spacing. Values between samples are reconstructed by linear interpolation, including the sampled sine sources. Each acquisition starts from the source's initial DC value and runs once. No looping, warm-up exclusion, timing realignment, amplitude normalization, or fitted correction. Full-interval RMS includes startup and plateaus; peak examines every sample. Circuit runtime kernels are unchanged from the prior playable prototype and were not fitted to these diagnostics.

- Flat: 0.100 V throughout.
- Staircase: 0, .05, .10, .15, .20 V; 10 ns transitions at 190–200, 390–400, 590–600, 790–800 ns.
- Ramp: 0 V through 100 ns; rise to .2 V at 450 ns; fall to 0 V at 800 ns; hold through 1000 ns.
- Pulse: 0 V through 200 ns; rise to .16 V at 210 ns; hold to 600 ns; fall to 0 V at 610 ns; hold.
- 1 MHz sine: .1 + .08 sin(2π t/1000 ns), one cycle, starts at .1 V.
- 5 MHz sine: .1 + .08 sin(2π 5t/1000 ns), five cycles, starts at .1 V.

Fixed gain pot 0/.5/1 (nominal -1/0/+1), input/thru offset routes, offset pot .6, B=0 V, 499 ohm source resistances, 100 kohm load, ideal +/-12 V supplies and offset reference. No general claims about other control positions or inputs.

## Reference and numerical checks

Original four-LM6172 topology and retained TI macro model; unchanged installed ngspice 47; Gear/KLU, maximum step .003125 ns, gmin1e-16, reltol1e-6, abstol1e-12, vntol1e-9. Each run checks successful completion, finite rows, end time and error text. Reference output is linearly interpolated onto runtime sample times. Recorded source voltage agrees with the generated source to <1e-10 V at those times. This study reuses prior reference refinement work; it does not perform a new cross-simulator or physical validation.

Independent NumPy direct convolution checks all 36 references. Actual JavaScript FFT runtime checks each at block lengths 257 and 4096: 72/72 pass and agree with direct convolution within 1e-12 V. Twenty deterministic-source checks cover limits, repeatability, landmarks and invalid selection. Six comparison guard checks exercise zero error, RMS failure, peak failure, peak index, incomplete traces and nonfinite traces.

## Reading the instrument

Input/runtime/reference strips share black=-.4 V and white=+.3 V. Each horizontal position is time, replicated vertically, never wrapped into a video raster. Browser image scaling can hide narrow detail; traces use all samples and CSV exports preserve numeric precision. Waveforms use a fixed -.4 to +.3 V scale. Residual is runtime minus reference, fixed +/-1 mV. A movable sample cursor reports exact underlying values and can jump to the worst sample. Decimal display precision is not physical accuracy.

References load separately per selection; absent, malformed or mismatched data cannot produce a pass. Runtime output is computed in the browser from the selected source, not replayed from the reference. The moving demonstration remains separately available.

## Reproduce

Extract proof.tar.gz. Requirements: ngspice 47, Python with NumPy, Node22. sources.json contains exact source values generated from diagnostic-source.mjs. Run python3 reference.py, Python-with-NumPy validate.py, then node test-runtime.mjs. Reference simulation runs at most two cases concurrently. The bundle includes source generator, original topology/model, immutable runtime kernel/core, scripts, run logs, netlists, reference samples and full comparison CSVs. Dense raw solver traces remain local and can be regenerated. sha256.json identifies the delivered evidence. No new solver patch or parameter fit was introduced.

## Results by acquisition

| Route | Gain pot | Source | Peak mV | RMS mV | Result |
|---|---:|---|---:|---:|---|
| offset_input | 0 | flat | 0.000692399 | 0.000692385 | PASS |
| offset_input | 0 | staircase | 0.011187753 | 0.002290970 | PASS |
| offset_input | 0 | ramp | 0.001802777 | 0.000692141 | PASS |
| offset_input | 0 | pulse | 0.036884920 | 0.005094766 | PASS |
| offset_input | 0 | sine1 | 0.001424338 | 0.000851887 | PASS |
| offset_input | 0 | sine5 | 0.004328273 | 0.000908911 | PASS |
| offset_input | 0.5 | flat | 0.000146258 | 0.000146258 | PASS |
| offset_input | 0.5 | staircase | 0.005964242 | 0.001331900 | PASS |
| offset_input | 0.5 | ramp | 0.000984186 | 0.000174615 | PASS |
| offset_input | 0.5 | pulse | 0.019314344 | 0.003007650 | PASS |
| offset_input | 0.5 | sine1 | 0.000457659 | 0.000182458 | PASS |
| offset_input | 0.5 | sine5 | 0.001847160 | 0.000257742 | PASS |
| offset_input | 1 | flat | 0.000000013 | 0.000000008 | PASS |
| offset_input | 1 | staircase | 0.032750573 | 0.006956606 | PASS |
| offset_input | 1 | ramp | 0.004834441 | 0.000553144 | PASS |
| offset_input | 1 | pulse | 0.104780616 | 0.015738775 | PASS |
| offset_input | 1 | sine1 | 0.002125994 | 0.000199063 | PASS |
| offset_input | 1 | sine5 | 0.010583254 | 0.001050235 | PASS |
| offset_thru | 0 | flat | 0.000692393 | 0.000692392 | PASS |
| offset_thru | 0 | staircase | 0.011183773 | 0.002290255 | PASS |
| offset_thru | 0 | ramp | 0.001802785 | 0.000691927 | PASS |
| offset_thru | 0 | pulse | 0.036896434 | 0.005093884 | PASS |
| offset_thru | 0 | sine1 | 0.001424669 | 0.000851784 | PASS |
| offset_thru | 0 | sine5 | 0.004329955 | 0.000908331 | PASS |
| offset_thru | 0.5 | flat | 0.000146258 | 0.000146256 | PASS |
| offset_thru | 0.5 | staircase | 0.005964110 | 0.001331791 | PASS |
| offset_thru | 0.5 | ramp | 0.000983761 | 0.000174611 | PASS |
| offset_thru | 0.5 | pulse | 0.019319800 | 0.003007599 | PASS |
| offset_thru | 0.5 | sine1 | 0.000457734 | 0.000182457 | PASS |
| offset_thru | 0.5 | sine5 | 0.001846575 | 0.000257726 | PASS |
| offset_thru | 1 | flat | 0.000000003 | 0.000000003 | PASS |
| offset_thru | 1 | staircase | 0.032752145 | 0.006955746 | PASS |
| offset_thru | 1 | ramp | 0.004837347 | 0.000553171 | PASS |
| offset_thru | 1 | pulse | 0.104803790 | 0.015738835 | PASS |
| offset_thru | 1 | sine1 | 0.002126684 | 0.000199067 | PASS |
| offset_thru | 1 | sine5 | 0.010586852 | 0.001050236 | PASS |

Recorded 2026-09-09T11:00:23.462685+00:00. Full-module reference/supply behavior and physical-board agreement remain open; solver investigation stays paused.
