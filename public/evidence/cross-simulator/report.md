# One Cadet cross-simulator attempt

Outcome: Xyce did not complete. No whole-waveform, overshoot or settling comparison is accepted. The bounded attempt is finished; no settings retries, model edits or solver patches followed.

## Identical circuit, disclosed solver settings

Selected offset_input, gain pot1, offset.6, input0→.16 V with10 ns edge over200–210 ns, B0,499 ohm sources,100k load, ideal±12 V and ideal offset reference. Four original LM6172 macro instances. The circuit body, including the exact sampled PWL input, was mechanically compared with the retained tighter ngspice netlist after excluding engine analysis/options; it matches. Model bytes also match exactly. Only simulator control/options/output syntax changes.

Second engine: retained official XyceNF7.10.0 executable. Its SHA256 matches the existing runtime provenance record. Gear, device gmin1e-16, timeint/nonlin-tran reltol1e-5 and abstol1e-8, maximum step.003125 ns, requested duration1 µs. These engine-specific tolerances are not asserted equivalent to ngspice's. Reference is the prior completed tighter ngspice pulse (.0015625 ns maximum step), sampled at4001 times.

## Fixed screen and observed failure

Before running: one attempt with60 second cap; peak difference<=10 mV, RMS<=2 mV, overshoot difference<=1 percentage point, observed settling difference<=2 ns, no waveform fitting. Completion, finite monotone output and full endpoint required before comparison.

Xyce exited1 after about4.1 seconds with “Time step too small”. It wrote69463 finite, strictly increasing samples and stopped at 209.100648261 ns during the rising edge, before210 ns edge end. The requested endpoint was1000 ns. The log reports7 nonlinear convergence failures and29 failed step attempts. This was a numerical failure, not the60 second timeout or a parsing/launch failure.

No error metrics were computed from the truncated trace, and missing output was not extrapolated. This is an incomplete run, not a measured failure of the waveform acceptance limits. It cannot confirm or refute the ngspice overshoot. It does not show that every Xyce configuration would fail or identify a physical instability.

## Evidence and reproduction

proof.tar.gz retains exact circuit/model, ngspice circuit/reference samples, runtime provenance, runner, failed trace and log. run.py executes the one preset attempt with timeout and validates completion. It checks executable hash and circuit-body equality. Requires the recorded Xyce runtime/library paths; no global installation was made. compare.py refuses an incomplete run. Comparison scripts are preserved but were not executed on incomplete data. Retained ngspice source comes from the overshoot audit; that audit's evidence remains available.

Decision: preserve the current prototype as provisional. Stop this qualification route under the agreed boundary. Physical measurements or another suitably documented reference remain necessary for fidelity; the manufacturer single-amplifier check does not clear this four-amplifier case. No runtime/circuit changes are justified by this failed attempt alone.

Recorded 2026-09-09T12:07:24.604640+00:00.
