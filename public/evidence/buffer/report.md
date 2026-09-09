# TL074-family substitution diagnostic

Recorded 2026-09-09T02:00:09.443862+00:00. This is a changed-circuit diagnostic, not a replacement emulator.

## Observation

All6 nominal cases complete; all6 jointly tightened cases fail. Removing the four TL074 macros and replacing them with memoryless differential voltage sources at gain1e6 does not eliminate the observed tolerance failure in any of the six tested configurations.

Maximum nominal output change from the full-model baseline:52.453107598mV over0–500ns. Maximum initial-output change1.929936691902334e-6V. Six different-circuit trace comparisons independently reproduced with NumPy interpolation on the union of sample times, agreeing with the standard-library comparator within1e-14V. No complete nominal/tight comparison within the substituted circuit is available because every tight run failed.

## Exact intervention

Four instance lines are replaced; surrounding resistor/feedback connections are retained:

```
XU51 div pos vcc vee pos TL074 -> EDIAG51 pos 0 div pos 1e6
XU52 0 inv vcc vee neg TL074 -> EDIAG52 neg 0 0 inv 1e6
XU53 offset_wiper offset vcc vee offset TL074 -> EDIAG53 offset 0 offset_wiper offset 1e6
XU54 0 unused vcc vee unused TL074 -> EDIAG54 unused 0 0 unused 1e6
```

The script asserts exactly these four changed lines, the original stage-node boundary, all four LM6172/NS instances and the unchanged TL431 instance. Simulator device summaries contain no TL074 JFETs, as intended for this substitution. This is different from the earlier accidental model-omission case: explicit replacement sources are present and guarded.

Gain1e6 is an arbitrary declared diagnostic control, not an extracted TL074 parameter. The substitutes omit bandwidth, slew, rail limits, bias currents and output impedance. Manufacturer model files are copied unchanged; the earlier syntax normalization remains documented. The substantial output differences demonstrate that this diagnostic cannot be treated as the original circuit's response.

## Conditions

Six cases:input/thru offset routes × gain positions0/.5/1, offset.6,499Ω sources,100k output load, ideal±12V rails. A0→.2V at100ns,1ns edges,200ns pulse width; B0;500ns duration. XyceNF7.10.0, Gear, max timestep.00625ns, GMIN1e-16. Nominal RELTOL1e-4 ABSTOL1e-7; joint tighter1e-5 and1e-8 applied to timeint and nonlin-tran.

Completed results require successful exit, full endpoint, finite strictly increasing samples and the intended device substitution. Failed traces are partial, retained and excluded from whole-trace comparisons.

| Route | Gain position | Setting | Outcome | Last time ns |
|---|---:|---|---|---:|
| offset_input | 0 | nominal | completed | 500.000000 |
| offset_input | 0 | both | failed | 110.376019 |
| offset_input | 0.5 | nominal | completed | 500.000000 |
| offset_input | 0.5 | both | failed | 114.064419 |
| offset_input | 1 | nominal | completed | 500.000000 |
| offset_input | 1 | both | failed | 105.009808 |
| offset_thru | 0 | nominal | completed | 500.000000 |
| offset_thru | 0 | both | failed | 117.403203 |
| offset_thru | 0.5 | nominal | completed | 500.000000 |
| offset_thru | 0.5 | both | failed | 113.885803 |
| offset_thru | 1 | nominal | completed | 500.000000 |
| offset_thru | 1 | both | failed | 113.033503 |

## Decision

Both individual interventions tested so far—fixed TL431 voltage and simplified TL074 buffers—leave joint-tolerance failures in all six cases. Neither is a sufficient remedy by itself. This does not prove that either model is uninvolved, establish a unique root cause, or test the combined intervention.

Next build a smaller failure reproducer: remove both reference-model dynamics together, then isolate the LM6172 path if failure persists. Keep every reduced circuit labeled diagnostic. Qualification remains open; no hardware measurements or physical-fidelity claims added.

## Repeat

Extract this archive and the [prior tolerance-study archive](/evidence/tolerance/repeatable-study.zip) into the same directory, preserving sibling names. The earlier archive supplies baseline waveforms, core generator and helper files. This archive supplies the new study, exact netlists, model copies, results, failure logs and independent check.

Set XYCE_EXECUTABLE and XYCE_LIBRARY_DIRECTORY for Xyce. Run study.py then analyze.py; run verify.py with NumPy installed. New raw waveforms are regenerated. No simulator binary included. Runtime and original model provenance live in the sibling reference-stage folder.

Two preflight model-count assertions initially stopped before simulator execution: broad text counting included the title, then an exact-name check omitted the /NS suffix. Both were corrected against the generator before any numerical runs. Their record is preserved in harness-note.md; they are not convergence failures.
