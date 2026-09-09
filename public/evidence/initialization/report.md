# Coupled initialization: DC recipe, unresolved transient

Recorded 2026-09-09T02:43:47.125452+00:00.

## Result and decision

Unseeded DC solves5/6 cases. Providing initial iteration guesses for ref, offset and output from the corresponding recorded Xyce initial samples solves6/6. These are .nodeset hints, not ideal replacement sources or forced final voltages. Final seeded outputs differ from Xyce guesses by up to1.242µV; the guesses are not simply copied into the answer.

Starting-guess sensitivity: multiplying all three guesses by1.1 completes6/6; multiplying by0.9 completes3/6. Across the9 successful perturbation runs, final output changes from the base seeded DC solution are at most6.569711442e-11V. Decimal arithmetic against raw output files independently reproduces all9 differences within1e-14V. This supports a reproducible recipe, not convergence from arbitrary guesses or physical accuracy.

No completed coupled transient was found in30 separately recorded attempts. Six seeded KLU/Gear trials fail very early.18 method/linear-solver variants and6 candidate exact node-elimination trials also fail. The original manufacturer models remain the accepted baseline; the unsuccessful formulation candidate is not adopted. The previous48-run partial signal-path result is unaffected.

The full coupled qualification gate remains open. Stop the broad solver sweep. Next inspect the reference-model/solver interface using the established DC state and failing early-time records before expanding the circuit or claiming full behavior. No hardware measurements or new physical accuracy claims.

## Fixed conditions

Corrected Cadet VII core, original LM6172/TL074/TL431 models, offset.6, gain0/.5/1, input/thru routes,100k output load,499Ω source,ideal±12V rails,A0→.2V at100ns with1ns edges and200ns width,B0. Original node-boundary guard passes. ngspice47, GMIN1e-16, RELTOL1e-6 ABSTOL1e-12 VNTOL1e-9, .003125ns max timestep,500ns requested. KLU/Gear baseline; additional KLU/Trap, SPARSE/Gear, SPARSE/Trap variants retain identical electrical circuits and hints.

## Case record

| Route | Gain | Unseeded DC | Base guesses | 0.9× guesses | 1.1× guesses | Seeded transient |
|---|---:|---|---|---|---|---|
| offset_input | 0 | failed | completed | failed | completed | failed |
| offset_input | 0.5 | completed | completed | failed | completed | failed |
| offset_input | 1 | completed | completed | completed | completed | failed |
| offset_thru | 0 | completed | completed | failed | completed | failed |
| offset_thru | 0.5 | completed | completed | completed | completed | failed |
| offset_thru | 1 | completed | completed | completed | completed | failed |

Total54 numerical attempts:24 DC (20 complete) and30 transient (none complete). The counts include repeated configurations under controlled changes; they are not a project-completion percentage. Of the30 transient attempts,14 produce no rows and16 produce partial traces. The latest partial endpoint is below0.098ps. Full logs distinguish operating-point and early-integration failures; partial traces never count as complete.

## Formulation diagnostic

A separate LM6172 candidate eliminates four unobserved unity-source node constraints using10=17,50=5,40=4,42=4. Device-node fields are rewritten, component values retained, and removed source currents checked for F/H references. Original model and full transformation manifest are preserved. Its6 trial failures establish no qualified replacement or unique root cause. This candidate is excluded from the DC recipe and previously accepted numerical references.

## Repeat

Extract alongside the [prior tolerance archive](/evidence/tolerance/repeatable-study.zip), which supplies the recorded Xyce initial samples and reference-stage runtime metadata. With ngspice47 installed, study.py records DC and base seeded transients; seed_sensitivity.py records ±10% guess changes; alternatives.py tests the three additional numerical methods; alias_trial.py records the formulation diagnostic. Exact fixtures, outputs for DC, logs, model files and result records are included. Transient raw traces are regenerated. Use a separate extracted copy to preserve records. No simulator binary included.
