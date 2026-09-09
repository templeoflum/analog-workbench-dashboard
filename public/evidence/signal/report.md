# Cadet VII partial signal-path envelope

Recorded 2026-09-09T02:33:03.224613+00:00.

All48 ngspice47/KLU Gear runs complete. Both routes × gain positions0/.5/1 × loads1k/100k produce12 configurations, each run at .0125,.00625,.003125ns maximum timesteps and a separate tighter-tolerance setting at the finest step. Successive timestep differences decrease12/12. All36 comparisons independently reproduced with NumPy interpolation on the union of sample times, agreeing within1e-14V with the standard-library comparator.

## Working scope

Four original LM6172/NS instances and traced gain/routing/loading circuitry; ideal±12V rails; ideal offset source at position.6, voltage(2×.6−1)×2.5×20000/24990V. Source499Ω, original100k input terminations, output499Ω resistor before1k/100k load. InputA0→.2V at100ns,1ns edges,200ns pulse width;B0;500ns duration. TL431/TL074 reference dynamics, real power-entry circuitry and hardware measurements are excluded.

Nominal RELTOL1e-6 ABSTOL1e-12 VNTOL1e-9; tighter1e-7/1e-13/1e-10. GMIN1e-16, KLU, Gear, PSpice compatibility. Electrical cards match across numerical settings. Accepted traces require successful exit, no fatal errors,500ns endpoint, finite strictly increasing samples and confirmed KLU use. Original model bytes unchanged.

## Numerical sensitivity

| Comparison | Pairs | Maximum output difference |
|---|---:|---:|
| .0125→.00625ns |12|15.196774860µV|
| .00625→.003125ns |12|3.793143402µV|
| Fine timestep, tighter tolerances |12|0.102073665µV|

These are observed numerical sensitivities, not exact-error or hardware-accuracy bounds. No convergence-order or physical acceptance claim.

## Separate coupled re-entry

Six additional cases restore the corrected TL431 and four TL074 sections:offset.6,100k load, both routes and gain0/.5/1, same candidate settings and.003125ns max timestep. Existing stage-node checks pass. None completes. One fails the DC operating-point calculation; five produce partial transient traces then stop within0.313ps. The failures are excluded from the48-run count and the successful refinement comparisons.

| Route | Gain | Failure phase | Last time ns | Rows |
|---|---:|---|---:|---:|
| offset_input | 0 | operating point | none | 0 |
| offset_input | 0.5 | early transient | 0.0003125991821289063 | 54 |
| offset_input | 1 | early transient | 1.394653506577015e-05 | 15 |
| offset_thru | 0 | early transient | 4.470923717599364e-05 | 35 |
| offset_thru | 0.5 | early transient | 4.470923717599364e-05 | 35 |
| offset_thru | 1 | early transient | 7.787942886352542e-07 | 15 |

An initial conversational update described all six as operating-point failures. Inspection of every log corrected that classification before publication: one operating-point failure and five early-transient failures. Signal-path results are unaffected.

## Decision

Use this as a working partial signal-path numerical reference inside the named envelope. Full coupled-model qualification remains open. Next distinguish the reference's DC initialization problem from the very early transient failures, retaining both classes of evidence. Earlier Xyce experiments are unchanged; no substituted reference is promoted as a faithful full circuit.

## Recorded curves and repeat

The dashboard selects12 fine-step traces by route, gain and output load. Each of300 display bins retains minimum/maximum samples, plus original endpoints. Connecting lines are a display approximation. The Live example remains ideal DC.

Extract this archive alongside the [prior tolerance archive](/evidence/tolerance/repeatable-study.zip), supplying reference-stage helpers/runtime metadata. With ngspice47 installed, run study.py offset_input and study.py offset_thru, then analyze.py and verify.py (NumPy required). coupled_reentry.py repeats the six separate restored-reference attempts. Original models, scripts, exact circuits, logs, results and independent checks are included. Raw waveforms are regenerated; use a separate extracted copy for reruns. No simulator binaries or hardware measurements included.
