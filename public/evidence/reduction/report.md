# Reduced LM6172 failure and same-circuit comparison

Recorded 2026-09-09T02:12:59.516049+00:00.

## Substantial result

A single original LM6172 macro is sufficient to reproduce the tighter Xyce failure, with no Cadet shunt, buffers or four-amplifier integration present. The ±12V voltage follower fails at108.6109271538643ns in the original run and two independent process reruns. A no-pulse control completes500ns. This localizes a reproducible symptom to the one-amplifier/model/solver boundary; it does not prove a unique internal cause or a simulator defect.

Six electrically identical isolated-amplifier circuits now have completed outputs in both Xyce and ngspice. Their largest output difference is0.971626771µV across0–500ns. All six differences independently reproduced with NumPy interpolation, agreeing with the separate standard-library comparator within1e-14V. Electrical cards match exactly after removing simulator directives, and both use the same unchanged LM6172 file. Numerical agreement under these conditions is not physical accuracy.

## The circuit cases

Follower, non-inverting gain2 and inverting amplifier, each at ideal±12V and±15V rails. Input source0→.2V at100ns,1ns rise/fall,200ns pulse width,499Ω source resistor,100k output load. Gain2 uses1k feedback/ground resistors; inverter uses1k input/feedback resistors (source resistance affects its actual gain). Maximum timestep .00625ns, duration500ns, default27°C. Same initial DC solution convention.

XyceNF7.10.0 nominal:Gear, timeint and nonlin-tran RELTOL1e-4/ABSTOL1e-7. Tighter Xyce:1e-5/1e-8. GMIN1e-16. ngspice47:Gear, RELTOL1e-6, ABSTOL1e-12, VNTOL1e-9, GMIN1e-16, PSpice compatibility. Tolerance names/values are not equivalent across simulators. ngspice SPARSE completes the four non-inverting cases; the two inverters time out after45s and complete with a separately recorded KLU fallback. Original failures remain visible.

| Circuit | Rails | Xyce nominal | Xyce tighter | ngspice selected run | Max output difference µV |
|---|---:|---|---|---|---:|
| gain1 | ±12V | completed | failed | default / completed | 0.452256365 |
| gain2 | ±12V | completed | failed | default / completed | 0.620266747 |
| inverting | ±12V | completed | failed | KLU fallback / completed | 0.423510865 |
| gain1 | ±15V | completed | failed | default / completed | 0.655316583 |
| gain2 | ±15V | completed | completed | default / completed | 0.971626771 |
| inverting | ±15V | completed | failed | KLU fallback / completed | 0.423521094 |

## Reduction chain and unsuccessful probes

- Combined fixed-TL431 and memoryless-TL074 intervention:6/6 nominal complete;0/6 tighter complete. This combined reduction still retains the four original LM6172 instances. Six nominal different-circuit comparisons independently checked.
- Isolated original LM6172:6/6 nominal complete;1/6 tighter complete (gain2 at±15V); five tighter cases fail.
- A separately recorded algebraic elimination of the EPSR unity-voltage alias changes no component values, but does not supply a generally successful remedy:1/6 tight cases completes. It is not used in the accepted cross-simulator comparisons.
- Nine valid single-follower solver-option probes fail: current-variable masking, local error scaling, increased nonlinear iteration count, two corrected trapezoidal cases, first-order integration, NOX selection, tighter residual setting, and small-update acceptance disabled. These are specific declared-option experiments, not proof that every configuration of those solvers fails.
- Two additional attempted Trap probes supplied METHOD twice; Xyce used the first Gear value. They are preserved and excluded as Trap evidence. Corrected fixtures use one METHOD value. The runner now rejects duplicate-option warnings.
- The initial ngspice inverter timeout stopped an early runner before it retained partial process output. The missing partial log is disclosed in that case; the45s timeout is preserved, not counted as successful. The resumed runner retains subsequent timeout output. Neither default-solver inverter timeout is hidden by the KLU fallback.

50 numerical attempts are recorded across these experiments, plus two duplicate-option harness attempts. These are diagnostic coverage counts, not progress percentages.

Failure histories frequently name internal LM6172 nodes42 and43 in its power-supply-rejection branch. That is an observation about reported residuals, not a proven cause. The unsuccessful alias experiment is retained precisely because this suspicion was not sufficient to fix the behavior.

## What advances, and what does not

Completed: reproducible one-amplifier failure package, deterministic repeated failure/control contrast, six same-electrical-circuit cross-simulator comparisons, independent numerical checks and explicit solver fallbacks.

Still open: tighter Xyce convergence, component operating-domain and timestep qualification, full coupled Cadet reference, reliable board-power modeling, hardware measurements and faithful real-time instrument behavior. No original manufacturer values were changed to force agreement. No relaxed pass threshold was assigned after seeing outputs.

Next: qualify the stable component comparison across timesteps and loads; use the reduced failure to investigate model/solver behavior before importing a numerical setup back into the full Cadet circuit. Broader parameter sweeps on the unresolved full circuit are not the immediate next task.

## Repeat and inspect

The small failure archive includes the original model, follower netlist, no-pulse control, recorded logs and repeat outcome. With XyceNF7.10.0 available, run the circuit.cir files from their respective case folders. Their relative include paths resolve to the supplied ti folder. No simulator binary is included.

The full diagnostic archive includes all scripts, model files, case netlists/logs, result records and checks. For combined-reduction analysis, extract alongside the [prior tolerance study archive](/evidence/tolerance/repeatable-study.zip), which supplies the original full-model baseline traces and source helper scripts. Set XYCE_EXECUTABLE and XYCE_LIBRARY_DIRECTORY as appropriate. study.py/analyze.py/verify.py cover combined reduction; probe.py covers isolated tight cases; cross_component.py and klu_probe.py record comparison cases; analyze_component.py and verify_component.py reproduce comparisons (NumPy required for the independent check). Raw new waveforms are regenerated. Original logs/results remain in the archives; reruns should use a separate extracted copy.

The [Xyce7.10 reference guide](https://xyce.sandia.gov/download/2068/?tmstv=1754510749), time integration and nonlinear options tables, documents the tested option controls. These settings affect numerical solution strategy, not the physical component specification. Model provenance and hashes are included; LM6172 manufacturer file remains unchanged in the accepted comparison cases.
