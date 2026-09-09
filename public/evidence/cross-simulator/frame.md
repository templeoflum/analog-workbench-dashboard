# One Cadet cross-simulator case

210 → 211 → 221 → 222 · layout positions work → motion builds form → trace audits path → sign hands record

User approved one unchanged-circuit, unchanged-model independent-simulator case, stopping on failure. Xyce7.10 official retained executable; Cadet offset_input gain pot1, offset.6, input0→.16 V10 ns pulse, B0,499 ohm sources,100k load, ideal±12 V. Original TI library bytes, source PWL, resistors and four amplifier instances identical to existing tighter ngspice reference. Only simulator analysis/options/output syntax changes.

One Xyce run, hard60 second limit. Gear, gmin1e-16, timeint/nonlin-tran reltol1e-5 abstol1e-8, maxstep.003125 ns. These are disclosed engine-specific settings, not claimed equivalent to ngspice tolerances. Reference is previously completed tighter ngspice run, sampled at4001 points0..1 us.

Predeclared engineering screen: peak<=10 mV, RMS<=2 mV, overshoot difference<=1 percentage point, observed settling difference<=2 ns. No fitted timing/offset/gain. Must complete with finite, strictly increasing time and endpoint; any error, convergence failure or timeout prevents acceptance. No retries with numerical tweaks. Even passing only supports one cross-simulator model case, not hardware accuracy or full module qualification.
