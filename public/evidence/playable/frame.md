# Bounded playable signal-path attempt

210 → 211 → 221 · layout positions work → motion builds form → trace audits path

User authorized the proposed playable channel. Solver work stays paused. Scope: A=0..0.2 V, B=0, gain pot 0/0.5/1, both offset routes, offset pot 0.6, ideal +/-12 V supplies and ideal offset source, 499-ohm inputs, 100k-ohm output load. Candidate runtime is a causal finite impulse response derived from small-signal AC analysis plus recorded DC bias; no fitting to held-out waveforms. Fixed sample interval 0.25 ns. This is an approximation to the partial reference, not a complete or physically qualified Cadet.

Predeclared gates: peak output error <=1 mV and RMS <=0.1 mV on all six settings for three held-out families (pulse, ramp, sine), evaluated at every runtime sample against fine-step reference traces. Inputs have >=10 ns linear transition edges; sine <=5 MHz; durations 1 us. DC starting state; no clipping outside the fixed voltage range. Additional moving-pattern input is checked as a held-out demonstration stimulus. A 30-fps processing target is measured separately from numerical agreement. No new solver patches, no adaptive loosening of limits, no switch to an ideal-DC-only demo if the dynamic core fails. If this bounded candidate cannot pass, report the specific shortfall and stop for a scope decision.
