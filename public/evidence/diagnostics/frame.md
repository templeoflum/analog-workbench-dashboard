# Diagnostic source and comparison bench

210 → 211 → 221 → 222 · layout positions work → motion builds form → trace audits path → sign hands record

User approved deliberately designed diagnostic inputs as an engineering tool. Deliver six deterministic sources: flat .1 V; five-step 0/.05/.1/.15/.2 V staircase with 10 ns transitions; 0→.2→0 V ramp; .16 V pulse with 10 ns edges; .1±.08 V sine at 1 and 5 MHz. Duration 1 us, 4001 samples including endpoints, .25 ns spacing. Piecewise-linear reconstruction between samples is the reference source contract. DC initial state per source. No repeating waveform or hidden pre-roll.

Reuse existing six kernels unchanged: both offset routes, gain pot 0/.5/1, offset .6, B=0, sources499 ohm, load100 kohm, ideal±12 V supplies/reference. Original installed ngspice and original four-LM6172 topology; no solver work or model fitting. Reference maximum timestep .003125 ns with previously used tight settings.

Predeclared gates remain peak<=1 mV and RMS<=.1 mV at all 4001 samples, all 36 cases. Report failures without fitting or relaxing limits. Independently verify actual JS output and split-block history, source limits/landmarks and reproducibility. UI exposes deterministic source, same-scale input/output/reference, voltage/time axes, residual, cursor and sample export. Grayscale is a time strip replicated vertically, not a claimed video raster. No physical calibration claim. Counts describe these fixtures only.
