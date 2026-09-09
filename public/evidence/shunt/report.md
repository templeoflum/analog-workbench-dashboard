# Frozen-TL431 diagnostic

Recorded 2026-09-09T01:53:32.859497+00:00. This is a deliberately changed circuit, not a substitute qualified model.

## Result

All six nominal runs complete. All six jointly tightened runs still fail. Holding the TL431 reference voltage fixed does not remove the observed tolerance failure in any of these six cases. This rules out freezing the shunt alone as a sufficient remedy under these settings; it does not identify a unique root cause or exonerate the full TL431 model under other conditions.

Maximum nominal output difference from the original full-model baseline:0.382878768 µV over0–500ns. Maximum initial-output difference:2.033901e-12V. Six different-circuit comparisons were independently reproduced using NumPy interpolation, agreeing within1e-14V with the standard-library comparison. Jointly tightened partial traces are excluded from whole-trace differences. No within-substituted-circuit nominal/tight comparison is possible because all tight runs failed.

## Controlled change

One instance line, XU4 ref 0 ref TL431, is replaced with VSHUNT ref 0 <anchor>. Each anchor is the initial V(ref) from that configuration's full-model finest-step baseline. The script asserts exactly one line changes and verifies the original stage boundary before substitution. R18, reference divider, all four TL074 sections and four LM6172 sections remain. Original TI files are unchanged; previously documented TL074 syntax normalization remains in use.

The substituted source constrains reference voltage and may source or sink current. This intentionally removes shunt dynamics and loading response. Similar outputs are not hardware agreement and cannot qualify the omitted behavior.

## Conditions and gates

Same XyceNF7.10.0, Gear, .00625ns maximum timestep, ideal±12V rails,499Ω sources,100k output load, offset.6, gain0/.5/1, input/thru routes, A0→.2V at100ns with1ns edges and200ns pulse width, B0,500ns duration. GMIN1e-16. Nominal RELTOL1e-4/ABSTOL1e-7; tight1e-5/1e-8 in both timeint and nonlin-tran. Acceptance for a complete run requires successful exit, full endpoint, finite strictly increasing samples and eight TL074 JFETs. Failures and exact netlists are retained.

| Route | Gain position | Setting | Outcome | Last time ns |
|---|---:|---|---|---:|
| offset_input | 0 | nominal | completed | 500.000000 |
| offset_input | 0 | both | failed | 116.860988 |
| offset_input | 0.5 | nominal | completed | 500.000000 |
| offset_input | 0.5 | both | failed | 113.935149 |
| offset_input | 1 | nominal | completed | 500.000000 |
| offset_input | 1 | both | failed | 105.017697 |
| offset_thru | 0 | nominal | completed | 500.000000 |
| offset_thru | 0 | both | failed | 117.403235 |
| offset_thru | 0.5 | nominal | completed | 500.000000 |
| offset_thru | 0.5 | both | failed | 305.839992 |
| offset_thru | 1 | nominal | completed | 500.000000 |
| offset_thru | 1 | both | failed | 113.032948 |

## Next decision

The current qualification gate remains open. Next isolate the TL074 buffer family using an explicitly diagnostic replacement while keeping the original full-model baseline. If failures persist, continue to the signal-path model and solver interaction. Do not use a substituted circuit as fidelity evidence for the original one.

## Repeat

Download this fixture archive and the [prior tolerance study archive](/evidence/tolerance/repeatable-study.zip), then extract both into the same directory, preserving sibling folder names. The prior archive supplies the six full-model baseline waveforms and source helper files. This archive adds the substitution study, copied models, exact case netlists, results, failure logs and independent-check script. New waveforms are regenerated.

Set XYCE_EXECUTABLE and XYCE_LIBRARY_DIRECTORY for your Xyce installation. Run study.py, then analyze.py from this study folder. Run verify.py with NumPy installed. Simulator binaries are not included; model normalization and runtime provenance are recorded in the sibling reference-stage folder. Full-model waveform differences describe different circuits. No hardware measurements were added.
