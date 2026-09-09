# Two-diode failure reproduction and voltage-reference sensitivity

## Outcome

A two-diode clamp reproduces the fine-step failure without the TL431 storage network or closed feedback loop. Two fresh replays of the unchanged self-contained KLU circuit fail at the same recorded endpoint, 2.22022643632954 ps. This is a smaller numerical reproduction, not proof of a simulator defect or a physical failure.

A uniform voltage-reference translation lets the clamp finish the corresponding cases, while a matched zero-shift control still fails. Stronger tests reject the translated result as a qualified reference: KLU refinement disagreement grows and both solvers fail the tighter pulse run. No model or solver workaround is adopted.

## Accounting and boundaries

58 valid primary simulator attempts: 43 complete, 15 fail. There are also 2 exact failing-circuit replays and 8 preserved harness attempts rejected before analysis because a top-level IF expression was not accepted. Total simulator invocations: 68. The rejected syntax attempts are not numerical evidence.

The original f0 full-shunt cases remain valid: closed feedback completes 4/8; externally held feedback completes 3/8. Both use the original TI model. The corrected isolated clamp completes 6/8; its KLU fine constant and pulse cases fail before the pulse. The clamp preserves the original D11/D12 model and power/load values, and replaces the prescribed negative, constant control with the exact current of its selected branch: 1.73*(-0.0010426776807624719)-1e-6 A from ground to the internal node. This is a diagnostic boundary, not a full-device model.

Single original diode with an ideal current bias completes 8/8 cases across both solvers, coarse/fine steps and two cathode-reference voltages. The shifted bias shows about 87.86 nV initial settling; this does not establish a cause. A lone diode under this forcing is insufficient to reproduce the two-diode failure.

## Coordinate translation and matched control

The translated clamp introduces an ideal local ground at -2.49507803358587 V. Every previously grounded circuit terminal is connected to local ground; recorded voltages are relative to it. All element voltage/current relations remain unchanged. Eight original/translated deck pairs pass exact tokenized component-card equivalence after undoing this coordinate mapping and removing the added reference source. This equivalence applies to this isolated native-diode circuit; it does not automatically apply to the full TL431 macro, whose internal global references require a separate derivation.

All 8 translated coarse/fine constant/pulse runs complete. Four matched controls use the identical added-node arrangement with its voltage set to zero: KLU fine constant and pulse both still fail at 2.22022643632954 ps, while SPARSE completes both. Thus adding that node alone is not a sufficient remedy. Reference-sensitive numerical behavior is demonstrated; the unique underlying mechanism is not identified.

## Stronger checks

Translated KLU pulse maximum differences under successive step refinement are 18.098013772 microvolts and 3.600125364 millivolts: worsening disagreement. Translated SPARSE differences decrease from 8.611733993 to 2.232840579 nanovolts, but its tighter run fails. KLU also fails its tighter run. Requested maximum steps are 0.0125, 0.00625, 0.003125 ns. Relative, current and voltage tolerances are tightened together by tenfold, from 1e-6/1e-12/1e-9 to 1e-7/1e-13/1e-10.

The two translated solvers differ by up to 3.600123293 mV at the finest step. Original-coordinate versus translated SPARSE differs by up to 16.550243156 mV. All six waveform maxima were independently reproduced from full records with Decimal interpolation within 1e-13 V of NumPy. Comparisons use the union of recorded times, no extrapolation. These are numerical comparisons, not physical accuracy bounds. Supply pulse: 12→12.1 V at 100 ns, 1 ns edges, 200 ns high; 500 ns duration, 4990-ohm feed and 24990-ohm load.

## Charge-storage ablations — not fixes

Eight additional primary cases separately set either transit time TT to zero or junction capacitance CJO to zero in the shared DCLAMP model. Both diodes use that shared model. All eight altered-model fine-step runs complete. Exact deck checks confirm only the intended parameter changes; the recorded initial reference voltage matches the original to the written precision.

This narrows the investigation to a charge-storage interaction under this fixture; it does not show that either term is individually wrong, identify a unique cause, or preserve original transient behavior. No ablated model is accepted. Fitting away the behavior would defeat the emulator's purpose.

## Repeating and preserving

The small reproduction archive contains self-contained original-failure, zero-shift, translated and SPARSE-control circuits with their logs. Model parameters are inline, so no external model path is needed. Run ngspice 47 with -n -D ngbehavior=ps -b circuit.cir inside each case directory. It writes state.txt; inspect both run status and last time, because a process exit code of zero can accompany a failed transient.

The full archive preserves f0 rejected syntax attempts and valid full-model trials, plus the corrected f1 scripts, cases, logs, original TI library, comparisons and replay records. Raw tables remain local and are regenerated for download users. In f1 run study.py, single_diode.py, translated.py, refinement.py, zero_shift.py, charge_ablation.py, repeat.py, compare.py, verify.py, ablation_check.py. Python standard library and NumPy are required for analysis. Failed input attempts and parameter ablations stay distinct from model evidence.

## Decision and next step

Keep the analytically checked linear benchmark and working partial signal path. Preserve this two-diode reproduction for source-level or cross-simulator investigation. Next examine the interaction of the two original charge-storage terms and their numerical representation while retaining both terms. Do not broaden whole-module parameter sweeps or adopt a shifted/ablated model on run completion alone. The coupled-model and hardware qualification gates remain open.
