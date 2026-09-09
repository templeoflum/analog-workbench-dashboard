# Channel characterization

210 → 211 → 221 → 222 · layout positions work → motion builds form → trace audits path → sign hands record

User approved measured level, pulse and frequency behavior for the existing six circuit settings. Reuse diagnostic pulse/staircase references and unchanged runtime. Do not tune models or resume solver debugging.

Plateau method: arithmetic mean over inclusive 140–180, 340–380, 540–580, 740–780, 940–980 ns windows. Each window must span <=0.1 mV to support an estimated plateau gain/offset. Fit ordinary least squares to five input/output means; report maximum residual and reference/runtime differences. This is a finite-window estimate, not universal DC accuracy.

Pulse method: baseline mean100–180 ns; target mean540–590 ns, both span<=0.1 mV. Response magnitude must be >=1 mV for normalized overshoot and settling. Rising input edge ends210 ns; observe through599.75 ns before next edge. Overshoot is signed excess beyond target divided by absolute step amplitude. Settling band=max(0.1 mV,2% response amplitude). Earliest sample after the last excursion outside this band is an observed settling candidate only if >=50 ns remains in the observation hold. Report not established otherwise. Ringing indicator counts alternating positive/negative residual excursions outside that band; it is not a fitted frequency.

Frequency method: new original-model small-signal AC points at1,2,3,4,5 MHz, A_DC=0, B=0, AC_A=1 V, same ideal supplies/reference/source/load. Runtime response is exact finite-kernel transfer sum h[n]exp(-jωn dt). Report magnitude, phase and complex difference; phase withheld below .001 V/V response in either model, no phase unwrapping or timing fitting. These are small-signal comparisons to the same reference family used for derivation, not independent large-signal validation. No extrapolated bandwidth or delay claim from five points.

Verification: exact synthetic gain/offset, inverted and positive pulse overshoot, bounded/no-settling and low-response guards, known sinusoidal transfer/delay and phase wrap; six AC completions; unchanged runtime/model/source bytes. Existing waveform error limits stay intact; characterization differences are reported without inventing new hardware pass criteria.
