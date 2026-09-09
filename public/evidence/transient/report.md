# Cadet VII — first manufacturer-model signal-path runs

20260909-001542 UTC. Scope: partial signal-path reference, not a complete analog emulator.

## Established

ngspice 47 installed. TI's SNOM234 LM6172 package acquired; original library bytes retained unchanged, including its notice. Its five-terminal subcircuit models one amplifier; four instances represent the C7 signal amplifiers. TL074 original-family package SLOJ068 acquired but not yet validated. TL431 model selection remains open.

The included TI reference circuit has ±15V rails, gain 2, 2k feedback resistors, a 1k load and a 50MHz sine. Its printed initial transient output is 0.0084 V. KLU runs produce 0.008371727 V, within the ±0.00005 V rounding interval of that printed value. This is one coarse cross-simulator initial-condition check, not a full comparison with TI's waveform data.

The initial SPARSE-solver experiments gave convergence warnings and inconsistent OP/transient bias values. Tighter settings stalled and were terminated after bounded timeouts. PSpice compatibility mode and starting-value seeds did not resolve that. KLU resolved the component example without changing the model. Both standard and tighter component runs reproduce the same printed OP value. Preserve failed-attempt logs; they are not valid reference runs.

## Cadet circuit coverage

run_cadet.py assembles R1/R12, R3/R14, R7/R10, R2/R11, R4, R8/R9, R5/R6, R13/R19 and four LM6172 instances following the previous schematic trace. R4 retains its actual 10k division with direct endpoint contacts. Switch naming remains electrical, not verified panel direction. Source resistances are 499 ohms; receiving load 100k; input B 0 V. Input A is a 0→0.2V pulse with 1ns ramps. Offset pot fraction is 0.6, modeled by an ideal voltage source derived from the prior ideal reference stage. Rails are ideal ±12 V after the unmodeled power-input network. No TL074/TL431 dynamics, shared-package coupling, supply impedance or board parasitics included.

Six configurations: both switch states × gain-pot fractions 0, 0.5, 1. Each has an OP, AC sweep (1kHz–1GHz) and 500ns transient; each repeated with maximum timestep halved from 0.1ns to 0.05ns and tighter solver tolerances. The 1GHz sweep is exploratory model output, not a claim of hardware bandwidth. Library header highlights ±15V operation; no ±12V accuracy qualification was performed.

All 12 runs completed. Four runs (two configurations repeated) report dynamic-gmin failure followed by successful true-gmin stepping. They are disclosed rather than silently classified as warning-free. We do not claim numerical convergence has been fully established from two settings.

Largest interpolated difference between base/tighter time series: 0.000236703937 V. No physical acceptance threshold is inferred from this number. Static offsets and finite response remain simulated observations. Browser curves are decimated for display; raw data is retained here. Browser live image processing remains the earlier ideal model.

## Repeat

Requirements: ngspice 47 with KLU, Python 3. From this folder: `python3 run_cadet.py`, then `python3 summarize.py`. The runner uses explicit ngspice `-n` (no user settings), model-required GMIN=1e-16, and a 30-second timeout per run. Check the logs as well as process status. `results.json` is the analysis; `dashboard-results.json` is the captured dashboard data. The latter is a recorded export and does not automatically regenerate with the two commands.

Next: refine numerical convergence, qualify component behavior at the actual rails and loads, add the TL074/TL431 reference stage, and assess a reduced dynamic emulator against those reference traces. Hardware calibration still requires a real identified module and measurements.

C — Created unmodified-model SPICE fixtures and response data. O — Solver choice materially affected convergence; KLU recovered the component initial condition. D — Keep signal-path results provisional and separate from full-module/hardware claims.
