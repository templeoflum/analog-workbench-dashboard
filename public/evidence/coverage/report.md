# Component load and timestep coverage

Recorded 2026-09-09T02:23:35.205870+00:00. Original LM6172 model; isolated circuits, not a full Cadet or hardware qualification.

## Decision

Use ngspice47/KLU as the working component-reference candidate within this tested envelope. All24 runs complete: six configurations at three maximum timesteps plus a tighter-tolerance run at the finest step. Successive timestep differences decrease in all six cases. This is evidence for a bounded numerical reference, not an exact-error bound or physical-model accuracy.

Do not promote Xyce as the refined component reference yet. Its12 coarse/middle runs complete; all6 fine runs stop near100ns. The failure is at the start of the pulse; its underlying cause remains unresolved. Full-module qualification stays open.

## Envelope and method

Follower, gain2 non-inverting and inverting circuits; ideal±12V rails; resistive output loads1k and100k;499Ω source; input0→.2V at100ns,1ns edges,200ns pulse width;500ns total. Gain2 uses1k feedback/ground resistors; inverter uses1k input/feedback resistors, with source resistance included. Tests do not cover other loads, rails, amplitudes, temperatures, noise or bandwidth across a frequency sweep.

Maximum timesteps:.0125,.00625,.003125ns. XyceNF7.10.0 Gear, GMIN1e-16, timeint/nonlin-tran RELTOL1e-4 ABSTOL1e-7. ngspice47 KLU Gear, GMIN1e-16, RELTOL1e-6 ABSTOL1e-12 VNTOL1e-9; separate finest-step check tightens these to1e-7/1e-13/1e-10. Same initial DC convention. Cross-simulator tolerances have different meanings.

Every accepted trace has successful simulator exit, full500ns endpoint, finite strictly increasing samples. ngspice logs confirm KLU. Electrical cards match across all48 requested comparisons after removing simulator directives; same model bytes.36 comparisons have complete traces on both sides; the12 unavailable comparisons remain null, not zero. All36 available differences independently reproduced with NumPy interpolation on the union of sample times to within1e-14V of the standard-library result.

## Observed maxima across six cases

| Comparison | Complete pairs | Maximum output difference |
|---|---:|---:|
| ngspice coarse→middle |6|4.548477860µV|
| ngspice middle→fine |6|1.178935278µV|
| ngspice fine→tighter tolerances |6|0.099349793µV|
| Xyce coarse→middle |6|4.935135469µV|
| Xyce middle→fine |0|Unavailable: fine runs fail|
| Cross-simulator coarse |6|2.526270764µV|
| Cross-simulator middle |6|0.526913273µV|
| Cross-simulator fine |0|Unavailable: Xyce fine runs fail|

These differences are sensitivity observations, not a preassigned acceptance limit. No convergence order or absolute numerical error is asserted.

## Case results

| Circuit | LoadΩ | ngspice completed | Xyce completed | ngspice differences decrease |
|---|---:|---:|---:|---|
| gain1 | 1000 | 4/4 | 2/3 | True |
| gain1 | 100000 | 4/4 | 2/3 | True |
| gain2 | 1000 | 4/4 | 2/3 | True |
| gain2 | 100000 | 4/4 | 2/3 | True |
| inverting | 1000 | 4/4 | 2/3 | True |
| inverting | 100000 | 4/4 | 2/3 | True |

## Next work and remaining limits

The isolated component bench now has a working candidate across the named load/timestep envelope. Next transfer the qualified numerical setup back into a bounded signal-path case and compare with this component evidence before attempting the full coupled reference again. The original full-module failure records remain unresolved; do not treat this component result as their solution. Hardware measurements remain zero. Power-supply-current limitations of other models remain unchanged.

## Repeat

Extract this archive alongside the [previous tolerance archive](/evidence/tolerance/repeatable-study.zip); the latter supplies reference-stage helper code and runtime metadata. Set XYCE_EXECUTABLE and XYCE_LIBRARY_DIRECTORY for a separately installed Xyce runtime. Run study.py xyce and study.py ngspice, then analyze.py and verify.py (NumPy required for the independent check). Scripts, original model files, exact circuits, all simulator logs, results and independent checks are included. Raw waveforms are regenerated. Use a separate extracted copy for reruns to preserve the records.

Original TI model bytes are unchanged. No simulator binaries are distributed. The report and dashboard describe the tested envelope only.
