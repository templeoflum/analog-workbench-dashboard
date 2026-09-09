# Floating-capacitor analytical benchmark and nonlinear re-entry

## Outcome

The isolated linear storage network does not reproduce the nonlinear shunt failure. All 36 linear simulations finish and are compared with analytical solutions at every recorded time. The largest node-3 error is 1.270766 nanovolts across these specific coarse/fine fixtures. The grounded-state rewrite remains an unaccepted full-shunt candidate: its numerical disagreements grow under refinement even though almost all runs finish.

50 primary simulator attempts: 36 linear fixtures, 4 constant full-shunt candidate trials, 6 original/candidate slow-pulse comparisons, 3 fine candidate pulses, and 1 tighter fine candidate pulse. 49 finish; 1 fails. Four additional same-case replays verified a portable runner path, for 54 simulator executions total. Those replays reproduce three completions and one failure and are counted separately. Completion is not qualification. No full coupled Cadet run or hardware measurement was added.

## Derived reference equations

The original C19=80 nF sits between nodes 3 and 4. Original source/resistor/sense groups have equivalent resistances 101 ohms from node 3 to node 2 and 11 ohms from node 4 to the grounded anode. With node 2 ideally driven to u, let x=V3−V4. Then:

- tau = (101+11)*80 nF = 8.96 microseconds.
- dx/dt = (u−x)/tau.
- V4 = (11/112)*(u−x), V3 = x+V4.

Three representations are tested: original controlled-source groups, literal floating R/C, and a grounded state capacitor with reconstructed output voltages. Constant and pulse forcing, KLU/SPARSE, and 2.5 ns/0.003125 ns maximum steps give 24 runs. The prescribed voltage starts at −0.0010426776807624719 V and rises by 1 mV after 100 ns, with 1 ns edges and 200 ns high time; duration 500 ns.

The second fixture adds C18=500 nF and the original equivalent 16.6-ohm branch. Node 2 is now current-driven by u/16.6, not fixed by an ideal voltage source. Its two-state equations are:

- 500 nF * dV2/dt = u/16.6 − V2/16.6 − (V2−x)/112.
- 80 nF * dx/dt = (V2−x)/112.

The same three representations, two solvers and two steps give 12 further pulse runs. Analytical references use exact piecewise-linear forcing, a scalar exponential for the first fixture and a two-state matrix exponential for the second. These equations describe the isolated fixture, not the nonlinear shunt or the full Cadet module.

## Independent checks and numerical limits

All 36 recorded node-3 worst-error locations were checked against an independently evaluated 60-digit Decimal reference. The largest reference discrepancy is below 9.2e-19 V. This checks the reference values at the reported worst locations; it is not a second full-trace search for maxima. The main comparison evaluates every recorded point. The largest fine-step node-3 error is about 47.36 picovolts, in the two-state original-source SPARSE case.

A separate backward-Euler companion-matrix experiment calculates conditioning with 70-digit Decimal arithmetic. For the floating two-node matrix, the condition number rises from about 1.27e3 at h=2.5 ns to 1.02e8 at h=3.125e-14 s and 8.13e17 at h=3.90625e-24 s. A double-precision direct solve is singular at the last scale. This is a controlled matrix experiment; it is not the simulator's full matrix, does not reproduce its variable-order Gear iteration, and does not establish that conditioning caused the original failure. The successful isolated runs rule out floating C19 alone as a sufficient explanation under the tested forcing.

## Nonlinear model candidate

The grounded-state candidate replaces the two source/resistor groups and floating C19 with R112/C80n and output reconstruction sources. E23, C18, nonlinear sources and diode parameters remain unchanged. Only the grounded-anode, unloaded internal sensing boundary used here is claimed algebraically equivalent. Original node 3 is sensed by the nonlinear current source; there is no added physical load on its reconstructed output. The transform manifest preserves exact removed/added cards and hashes. No parameters were fitted, and the original model is retained.

Constant shunt fixture: KLU coarse, SPARSE coarse, and SPARSE fine finish. KLU fine fails at approximately 0.1603 ps. This candidate does not remove solver sensitivity.

Original-versus-candidate 30-microsecond supply-pulse maximum cathode differences at 2.5, 1.25, 0.625 ns are 0.002381396, 0.318440482, and 86.835564804 microvolts. Agreement worsens at the finer step. Supply is 12→12.1 V at 1 microsecond, 10 ns edges, 10 microseconds high.

For the separate 500 ns SPARSE candidate pulse, successive refinement differences grow from 1.771079740 mV to 93.090002251 mV. Tightening relative, current and voltage tolerances tenfold completes but changes the recorded cathode curve by as much as 248.188951196 mV. The candidate fails numerical qualification despite completing these runs. Six waveform maxima (three original/candidate, two refinements, one tolerance comparison) were independently reproduced using Decimal interpolation within 1e-13 V of NumPy. Comparisons use the union of recorded times without extrapolation; they are numerical differences, not physical accuracy bounds.

## Repeating and preserving

Requires ngspice 47 with PSpice compatibility, Python, and NumPy for analytical and waveform comparisons. Run study.py, analyze.py, two_state.py, two_state_analyze.py, independent.py, conditioning.py, shunt_grounded.py, fine_pulse.py, fine_pulse_tight.py, dynamic.py, compare.py, fine_compare.py, verify.py, verify_fine.py, verify_tolerance.py. shunt_grounded.py reads the prior shunt-state study's baseline circuits; extract the previous study alongside this one. The compact archive retains scripts, model sources, generated circuits, logs, records and derived comparisons; full state tables are regenerated. The local fold retains those tables as well.

## Decision

Keep the analytical linear benchmark as a reusable verification reference. Do not adopt the nonlinear rewrite or advance the coupled-model gate. Next isolate the diode clamp and nonlinear feedback separately, using the now-checked linear storage equations as a control. Conditioning is a plausible contributor at extreme steps, not a proven root cause. Preserve the working partial signal path and all earlier failure records.
