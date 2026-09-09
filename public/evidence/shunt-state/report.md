# Shunt internal-state and algebraic-reduction audit

## Outcome

28 attempts; 17 complete, 11 fail (including one 45-second timeout). These count named attempts, not unique circuits or qualified behavior. No candidate is adopted and the full coupled-model gate remains open.

The original shunt fails at the fine step with both solvers. In the recorded SPARSE trace, the E24 source-law residual reaches 41.437780549 mV while external KCL stays below 5e-19 A. The error appears well before the last recorded row. The C19 differential voltage stays within 3.28e-15 V of DC even as its two terminal voltages move together by about 48.74 mV. KLU exhibits a different pattern: its source-law residual stays tiny, but the cathode drifts about 30.61 mV before failure. This does not identify one common root cause.

These are residuals recomputed from recorded transient rows, not direct observation of rejected Newton iterations. Logging uses an explicit DC solve before transient and omits an unrelated isolated zero-voltage recorder source from the prior fixture. Failure times are not claimed invariant to bookkeeping or matrix ordering.

## Experiments

- Original-model internal capture: 4 attempts, 2 coarse runs complete; both fine runs fail.
- Native H controlled-source candidates (E24 alone, then all three linear sources): 8 attempts, 4 coarse complete; all fine fail.
- Algebraic resistor candidate: 4 attempts, SPARSE coarse and fine complete; KLU coarse and fine fail.
- Original versus resistor-candidate supply pulse: 6 attempts, all complete at 2.5, 1.25 and 0.625 ns maximum steps over 30 microseconds.
- Resistor-candidate fine supply pulse: 3 attempts, all complete at 0.0125, 0.00625 and 0.003125 ns over 500 ns.
- Jointly ten-times tighter tolerances at the finest step: 1 attempt fails at about 121.139 ns.
- Representative full coupled re-entry, gain 0.5, offset 0.6, offset-through, 100k load: 2 attempts, KLU fails early and SPARSE times out. No six-case coverage claim.

## What the reduction means

Each removed group has a 1-ohm resistor, zero-volt sense source and linear current-controlled voltage source. Its terminal relation is V = (1 + gain) I. The three equivalent resistances are 16.6 ohms (2 to anode), 11 ohms (4 to anode), and 101 ohms (3 to 2). Capacitors, nonlinear sources and diode parameters are preserved. The transform manifest lists removed and added cards and file hashes. These are equivalent ideal port equations; numerical qualification of the rewritten model is a separate question.

## Comparison results

Original-versus-candidate maximum cathode differences at 2.5, 1.25, 0.625 ns are 0.007185457, 0.316865676, and 86.835558990 microvolts. The supply pulse is 12 to 12.1 V, delayed 1 microsecond, 10 ns edges, 10 microseconds high, over a 30 microsecond recording. The original cathode excursion is about 80 mV. Agreement worsens at the finer setting; these comparisons do not establish convergence.

For the separate 500 ns candidate-only pulse (100 ns delay, 1 ns edges, 200 ns high), successive refinement differences are 1.832595411 and 13.916858139 mV. Increasing disagreement and the tighter-tolerance failure disqualify this as a converged reference. Finishing a run is insufficient.

All five waveform comparison maxima were independently reproduced from raw records using Decimal interpolation, within 1e-13 V of NumPy. E24 and C19 calculations were separately recomputed with Decimal. Differences use the union of recorded time samples and piecewise linear interpolation, with no extrapolation. They are numerical comparisons, not physical accuracy bounds.

## Repeat and preservation

Requires ngspice 47 with PSpice compatibility; Python standard library plus NumPy for compare.py and fine_compare.py. Run study.py, candidates.py, resistor_trial.py, dynamic.py, dynamic_refinement.py, fine_pulse.py, fine_pulse_tight.py, coupled_trial.py, compare.py, fine_compare.py, verify.py, verify_fine.py. The coupled runner's inherited helper reads xyce-runtime.json from the sibling reference-stage f1 study even though these runs use ngspice; extract the earlier reference/tolerance repeat bundle alongside if needed. Original source model files are retained byte-for-byte from the prior study. Failed traces and all generated circuits/logs remain in the local fold; the downloadable archive contains scripts, models, records, circuits and logs. Raw state tables are regenerated, not included in the compact archive. Display curves preserve per-bin minima and maxima and endpoints; comparisons use full records.

## Decision and next step

Keep the working partial signal path. Keep all model reductions as diagnostic candidates only. Next isolate the C19 floating-capacitor/resistor subnetwork and measure conditioning and equation residuals at the recorded time scales. The observed near-constant differential state with drifting common voltage motivates this hypothesis; it does not prove the cause. No physical-board data or full-module fidelity claim was added.
