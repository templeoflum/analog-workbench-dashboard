# Reference timestep and formulation audit

Recorded 2026-09-09T02:53:47.955072+00:00.44 bounded diagnostic attempts;7 complete. Counts include repeated controlled conditions, not44 different circuits.

## Findings

1. Timestep size alone is not sufficient to explain the failures. With original model files, the standalone reference at offset.6 and1k load completes at2.5,.0125 and.003125ns maximum steps using SPARSE. Corresponding KLU runs fail. These500ns tests have constant rails and no changing input; they are initialization/steady-state numerical checks, not new dynamic-response qualification.
2. Explicitly running .op before .tran is not a sufficient remedy. Standalone-reference SPARSE runs complete with and without it; KLU fails with both. All six DC-first coupled attempts fail.
3. Rewriting the tested linear behavioral sources is not a sufficient remedy. Six coupled trials with TL431's three current-proportional E expressions expressed as native H sources fail. A TL074 candidate decomposes its two linear polynomial sources into native E/F sources; its standalone and six coupled trials fail. Combining both candidates also fails in one standalone and six coupled cases. None is adopted.
4. Shunt-only probes are also sensitive to numerical conditions: both tested solvers finish the coarse case and fail the fine case. The full standalone reference can behave differently from a resistor-loaded shunt-only model. No unique root cause is established by these removals.
5. An unchanged coupled case with no input pulse still fails. The failure does not require the scheduled input edge in this case.

## Interpretation and decision

The partial signal path and standalone reference have working numerical setups in their named tests; no tested setup here qualifies their full coupling. Keep the successful partial reference and previous evidence. Reject the tested candidates as fixes. Further full-circuit sweeps are not justified by these results; next inspect internal state/residual behavior on the smallest failing original-model case, including the shunt-only fine-step failure, before choosing another intervention. No full-module or hardware-fidelity promotion.

## Conditions and records

Original TL431/TL074 models, ideal±12V rails, offset.6,1k/100k standalone loads as recorded. Coupled cases retain the corrected four-LM6172 path,100k output load,499Ω sources, gain0/.5/1 and both routes. KLU/Gear nominal controls RELTOL1e-6 ABSTOL1e-12 VNTOL1e-9 GMIN1e-16. SPARSE comparison removes only the KLU option; explicit .op sequencing is separately recorded. All complete traces pass exit, error, endpoint, finite/monotone and selected-solver checks.

| Batch | Attempts | Complete |
|---|---:|---:|
| results.json | 7 | 0 |
| sequence.json | 10 | 2 |
| boundary.json | 7 | 5 |
| ccvs-trial.json | 6 | 0 |
| poly-trial.json | 7 | 0 |
| combined-native.json | 7 | 0 |

## Candidate transformations, not adopted

TL431: E_E23,E_E24,E_E25 each have V(out+,out−)=gain×I(sense), with gains15.6,10,100. Native H devices express the same signed linear relation; this is documented in [ngspice's manual, current-controlled voltage sources](https://ngspice.sourceforge.io/docs/ngspice-manual.pdf). Polarity, control sources and values retained. Original file and exact replacement manifest included.

TL074: EGND has V99=.5V3+.5V4, decomposed into two series E sources. FB has five linear current terms and zero intercept, decomposed into five parallel F sources with signs/gains retained. Original file and replacement manifest included. Failed trials do not validate the candidate representations in this simulator, and no model values were fitted to results.

## Repeat

Extract alongside the [prior tolerance archive](/evidence/tolerance/repeatable-study.zip), which supplies original reference-stage runtime metadata. Run study.py, sequence.py and boundary.py with ngspice47. Candidate diagnostics are ccvs_trial.py, poly_trial.py and combined_native.py. Exact generated circuits, models, logs, results and transformation manifests are included. Transient raw data regenerate on rerun. Preserve the recorded copy; use a separate extraction for reruns. No simulator binary or physical measurements included.
