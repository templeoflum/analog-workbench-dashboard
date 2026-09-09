# Cadet channel characterization v1

Measurements describe the retained partial circuit simulation and unchanged runtime. They do not establish physical-board behavior. No model fitting, solver patch or wider control range was introduced.

## Findings

- Both negative-gain settings support a finite-window gain estimate near -0.989971 V/V. Both midpoint settings support a near-zero plateau gain estimate. At positive gain, the staircase windows vary by more than the declared 0.1 mV allowance; gain/offset fits are withheld for both routes.
- The reference pulse response has about 51.545% overshoot at negative gain and 172.926% at positive gain, using the declared signed response convention. These large values expose modeled ringing; numerical agreement is not proof that real hardware behaves this way.
- Observed settling after the 10 ns rising edge ends is 71.75 ns at negative gain and 99.25 ns at positive gain, using a 2%/0.1 mV band and the specified finite observation hold. These values do not describe arbitrary signals or other settings.
- At midpoint gain the final pulse response is below 1 mV, so normalized overshoot/settling are not established. This avoids magnifying a nearly zero denominator.
- Thirty small-signal frequency points (five frequencies x six settings) complete. Largest complex runtime/reference difference is about 7.012e-6 V/V. These are same-model frequency comparisons, not independent large-signal validation or hardware accuracy.

## Plateau method

Staircase from diagnostic acquisition v1. Inclusive 40 ns windows: 140–180, 340–380, 540–580, 740–780, 940–980 ns; 161 samples per window. Arithmetic input/output means. Each output window must span <=0.1 mV to support a fit. When all qualify, ordinary least squares estimates output = gain*input + offset using five means; largest absolute fit residual is reported. Otherwise fit values are null and the window data are retained. No fitted term changes runtime output. Decimal precision does not establish physical accuracy.

## Pulse method

Use the rising input edge 0→.16 V over200–210 ns. Baseline mean100–180 ns (321 samples), target mean540–590 ns (201 samples), each span<=0.1 mV. Absolute final response must be >=1 mV for normalized measurements. Measure samples from210 through599.75 ns, before the falling edge at600 ns.

Overshoot = max(0, sign(target-baseline)*(output-target)) / abs(target-baseline)*100. Settling band = max(.0001 V,.02*abs(response)). Earliest sample after the last out-of-band excursion is reported only if at least50 ns of in-band observation remains; otherwise null. Report time relative to210 ns, with .25 ns sample resolution. This is observed settling under a finite hold, not a guarantee beyond it. Alternating excursions count sign changes among residuals outside the band, a ringing indicator rather than estimated ringing frequency.

## Frequency method

Original four-LM6172 topology and TI model, unchanged ngspice47. Small-signal AC at1,2,3,4,5 MHz, A_DC=0 V, B=0, A_AC=1 V. Same fixed gain positions, offset .6,499 ohm sources,100 kohm load and ideal±12 V supplies/reference. Source AC amplitude is a linearization convention, not a one-volt time-domain stress test.

Runtime transfer is sum h[n]exp(-j2πf n dt), dt=.25 ns. Report amplitude ratio, phase, magnitude difference and complex difference to exact-frequency AC points. Phase differences wrap to[-180,180); phase is withheld when either magnitude<.001 V/V. No transient window, phase alignment or curve fitting. Five points do not establish a cutoff frequency, group delay or continuous-range agreement. Same reference family as the prior AC kernel derivation.

## Verification and reproduction

Twelve analytic/guard tests pass: exact linear gain/offset, unstable plateau suppression, positive/inverted overshoot, sampled settling, insufficient hold, alternating excursions, low response, unstable target, known gain/delay transfer, phase wrapping, phase floor and invalid inputs (some cases grouped). Existing core/kernel bytes are unchanged. The prior waveform acceptance gates are not altered. This characterization presents differences without inventing hardware pass grades.

Extract proof.tar.gz. Requires Node22, Python+NumPy, ngspice47. Run python3 reference.py for six five-point AC analyses; node test-measurements.mjs; node characterize.mjs to regenerate the report from retained diagnostic reference samples. To regenerate those samples too, run python3 diagnostic-reference.py then Python-with-NumPy validate-diagnostics.py before characterize.mjs; this repeats all36 original diagnostic runs. The original diagnostic generators, sources and circuit model are included. The earlier diagnostic proof remains available at ../diagnostics/proof.tar.gz.

characterization.json contains every measured value and window. measurement-tests.json records analytical tests. ac-reference.json, circuit netlists and logs retain the new reference points. sha256.json inventories the reproduction files. UI shows recorded results, and its controls select one of the six records; Test / Diagnostics still computes runtime waveforms interactively.

## Per-setting summary

| Route | Gain pot | Reference gain estimate V/V | Reference offset V | Reference overshoot % | Observed settling ns |
|---|---:|---:|---:|---:|---:|
| offset_input | 0 | -0.989970960 | 0.211558219 | 51.544979559 | 71.750000000 |
| offset_input | 0.5 | 0.000045500 | 0.011822586 | Not established | Not established |
| offset_input | 1 | Not established | Not established | 172.926200318 | 99.250000000 |
| offset_thru | 0 | -0.989970960 | -0.186572697 | 51.544985368 | 71.750000000 |
| offset_thru | 0.5 | 0.000045500 | -0.187241754 | Not established | Not established |
| offset_thru | 1 | Not established | Not established | 172.926210506 | 99.250000000 |

Recorded 2026-09-09T11:16:51.431752+00:00. Full-module qualification, real supply/reference behavior, physical calibration and independently exercised browser interactions remain open.
