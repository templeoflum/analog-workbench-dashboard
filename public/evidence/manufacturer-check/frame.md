# Manufacturer example check

210 → 211 → 221 → 222 · layout positions work → motion builds form → trace audits path → sign hands record

Use retained TI SNOM234 exact example: one LM6172, ±15 V, gain2 with2k feedback/ground resistors,1k load,1 V peak50 MHz sine,100 ns duration,27 C. Reference is TI-packaged PSpice17.4 binary waveform, not physical measurements. One narrow decoder attempt must verify labeled columns,1009 rows, block bounds/count/min/max, monotone time, analytic input, fixed rails/ground, external resistor laws and printed initial output before output comparison. Any ambiguity fails extraction; do not guess data.

One ngspice47 run with unchanged model, gmin1e-16 per macro notice, KLU/Gear, reltol1e-6, abstol1e-12,vntol1e-9, max step.01 ns. PSpice ADVCONV is engine-specific and has no asserted equivalent. Acceptance screen fixed before output comparison: peak<=10 mV and RMS<=2 mV over all reference sample times, no phase/amplitude/bias fitting. These are explicit engineering screen limits, not TI specs. Record any failure without retuning. Datasheet curves alone are not chosen as quantitative ground truth without matching fixture details. Keep whole-Cadet/hardware fidelity open regardless of result.
