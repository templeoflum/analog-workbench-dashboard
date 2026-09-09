# Source-level charge arithmetic audit

## Outcome

The untouched local build of ngspice 47 reproduces the two-diode KLU failure at exactly the earlier recorded endpoint, 2.22022643632954 ps. Three source-arithmetic candidates do not recover that failure. No simulator patch is adopted, and the system simulator is unchanged.

24 controlled circuit runs: 14 complete, 10 fail. Each of four builds runs the same six preserved circuit decks: two solvers, coarse constant input, fine constant input and fine supply pulse. All 24 generated decks are byte-identical to the preceding study's inputs. The baseline uses the original release sources; optional build features differ from Homebrew, so this is not a claim of identical build configuration. Matching failure behavior establishes the local baseline for these tests.

## Source provenance and scope

The [official ngspice 47 source archive](https://downloads.sourceforge.net/project/ngspice/ng-spice-rework/47/ngspice-47.tar.gz) has SHA-256 894e649651f1838a14095e5a5439e7d3aa63e87ede14d283173fda4fcdef675f, checked against the installed Homebrew formula. Original relevant source files and licensing are retained. The diode loader adds diffusion and depletion charge before NIintegrate computes its current. The original Gear path accumulates coefficient-times-charge products from multiple history states.

Builds remain isolated in temporary storage. The recorded compiler is Apple clang; build configuration, source patches, logs and executable hashes are included. Initial configuration with XSPICE disabled failed to compile because OPT_ENH_RSHUNT was undeclared; that failed build log is preserved. Enabling standard XSPICE support allowed the untouched source to build. No system installation or replacement occurred.

## Arithmetic experiments

A small C harness compiles the original NIcomCof and NIintegrate functions with a minimal circuit-state structure. It evaluates 45 synthetic histories per build: five time scales, three previous-step ratios and constant/ramp/quadratic charge. This directly exercises release C functions; it is not a full simulator run.

All 15 constant-charge histories produce a nonzero computed current in the original compiled harness. The largest is about 3.6774 mA at an extreme diagnostic step. A charge-difference evaluation produces exactly zero for these constant histories. At extremely small steps, double-stored ramp/quadratic charges can also lose their small increments; the candidate cannot recover information already lost in state storage. These arithmetic probes demonstrate a numerical invariant problem in the sampled calculation, not that it causes the observed circuit failure. The preliminary Python coefficient probe is preserved as exploration; the compiled C results are the reported measurements, and floating-point contraction/rounding can differ between implementations.

Candidate A evaluates a0*(q0−q1) + sum(i=2..order, ai*(qi−q1)). It enforces the intended zero derivative of constant charge, with the current-state derivative remaining a0 as used in the matrix contribution. This changes finite-precision arithmetic and implicitly reconstructs the coefficient of q1; it is not bitwise equivalent arithmetic. Circuit/device parameters and both diode charge terms remain intact.

Candidate B evaluates the below-knee depletion charge with log1p/expm1, avoiding a subtraction of near-equal quantities. Its capacitance calculation uses the corresponding logarithm. At 14 sampled diode voltages, the charge expression was checked against a 70-digit Decimal reference; maximum absolute charge error changes from about 8.956e-27 C to 3.374e-27 C, and 13 nonzero points improve. This scalar comparison does not qualify the full model.

Candidate C combines A and B without another change.

## Circuit results

| Build | Complete / attempted | KLU fine constant endpoint | SPARSE fine pulse |
|---|---:|---:|---|
| Original release baseline | 4 / 6 | 2.220226436330 ps, failed | Complete |
| Charge differences | 4 / 6 | 2.220226343721 ps, failed | Complete |
| Stable depletion expression | 3 / 6 | 2.220280878919 ps, failed | Failed near 484.371 ns |
| Both candidates | 3 / 6 | 2.220280878919 ps, failed | Failed near 484.371 ns |

The same KLU fine failures remain with either constant input or the delayed supply pulse. The depletion rewrite introduces a failure in the tested SPARSE pulse case that completed in the baseline. This is evidence against adopting these candidates as fixes. No additional full-module or hardware qualification was attempted.

## Repeating and preserving

Download the verified release archive; configure with --without-x --with-readline=no --enable-xspice --disable-cider --disable-openmp, then build without installing. Save a baseline executable outside the build tree. Apply anchored.patch for A; restore original niinteg.c and apply depletion.patch for B; apply both for C. Save each executable separately. The included case circuits have inline diode models and can be replayed directly with each executable using -n -D ngbehavior=ps -b circuit.cir inside their directories. Check logs and final time; a successful process exit can accompany a failed transient.

The batch run.py expects the previous clamp-feedback f1 study as a sibling. Alternatively, replay the included self-contained cases directly. build_micro.py reproduces the compiled arithmetic probes; depletion_check.py performs the independent charge-expression checks. Source licenses are in source/COPYING. The compact archive retains inputs, logs, metadata, patches, source excerpts and probe data; full transient state tables are regenerated and remain in the local fold. Executables are not distributed as accepted simulator releases.

## Decision and next step

Keep the source audit and original local build as diagnostic tools. Reject the tested arithmetic candidates as remedies for the small circuit. Next record the linear-solve residuals and diode convergence decisions on the untouched baseline at the failing step. Rounding sensitivity is measurable, but a unique root cause remains unproven. The working partial signal path and analytical storage benchmark remain intact; the coupled-model gate stays open.
