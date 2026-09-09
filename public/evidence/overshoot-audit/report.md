# Bounded overshoot audit

Outcome: no transcription mismatch found in the retained four-amplifier path; overshoot persists under the one predeclared numerical repeat. Physical fidelity remains unresolved. No model correction was justified or applied, and the audit stops here.

## Schematic comparison

Visually inspected the retained LZX Cadet VII Processor v1.1, March1 2016, against run_cadet.py and the actual pulse netlist. [Pinned source schematic](https://github.com/lzxindustries/lzxdocs/blob/83dd46578b5ea394816b4151b791355cbbb3a345/static/pdf/cadet-vii-processor/cadet-vii-processor-schematics.pdf).

- J1/J3 signal inputs: R3/R14=100k shunts; R1/R12=499 ohm series into noninverting inputs.
- U3.1/U2.1: negative-feedback R7/R2=1k; R10/R11=1k to selected offset/ground routes. S1 selects complementary input/thru offset routing.
- U3.2: R4=10k pot from a_out to ground, wiper into positive input; R8/R9=10k feedforward/feedback into negative input. Endpoint and midpoint connections checked.
- U2.2: R5/R6=1k sum into positive input, R13=1k from output to negative input, R19=499 ohm output series resistance.
- Macro invocation follows declared order noninverting, inverting, positive supply, negative supply, output. Package section numbering is distinct from macro argument numbering.
- No external feedback compensation capacitors appear in the audited schematic signal path; none were omitted from this partial netlist. Adding one would change the modeled design.

check-wiring.py encodes that visual interpretation and checks all six existing control configurations. It is repeatable transcription checking, not an independent second interpretation of the schematic.

Declared reductions remain: ideal offset replaces the TL431/TL074 reference path; ideal rails replace power filtering/decoupling; fixture adds499 ohm source resistances and100k load. Board, cable and package parasitics are not reproduced as a physical assembly. Switch/jack mechanical behavior is not modeled. No claim that these reductions preserve physical transient response.

## Documented operating context

TI specifies a5.5–36 V total recommended supply range, so ideal±12 V is within that device range; electrical tables characterize±5/±15 V. TI discusses input-capacitance/feedback-resistance peaking and capacitive-load ringing, and recommends feedback resistance below1k for optimized high-frequency performance. The schematic uses10k at U3.2. These provide reasons to examine model/design fidelity, not proof of the cause or permission to alter the schematic. [TI LM6172 datasheet, sections5.3,7.1 and7.4](https://www.ti.com/lit/ds/symlink/lm6172.pdf).

The retained macro header advertises±15 V operation and requires gmin1e-16, which the experiment uses. Its bundled TI example also uses±15 V. Neither establishes accuracy for this±12 V four-stage case in ngspice. The model has1pF input capacitors; this is a possible interaction with10k feedback, not an experimentally isolated cause. Header pin order matches all four invocations.

## One tighter repeat

offset_input, gain pot1, offset.6, original diagnostic pulse0→.16 V with10 ns edges; B0,499 ohm sources,100k load, ideal±12 V and offset. Retained original model and installed ngspice47. Same1 µs duration; max step halved from.003125 ns to.0015625 ns; reltol1e-6→1e-7, abstol1e-12→1e-13, vntol1e-9→1e-10. Gear/KLU and gmin unchanged. One new run only;652525 finite rows, endpoint reached, no error/aborted/timestep-too-small log markers.

Compared at all4001 original sample times after linear interpolation. Largest difference 0.260623333 µV; RMS 0.045535347 µV. Baseline overshoot 172.926200318%; tighter 172.926246618%. Change 0.000046300 percentage points. Observed settling stays99.25 ns after edge end; alternating excursions stay9.

The predeclared persistence screen (<=.1 mV waveform difference,<=.1 percentage point overshoot change,<=.5 ns settling change) passes. This checks sensitivity to this one joint refinement; it is not a convergence proof, independent-simulator validation, or hardware match. No tolerance tuning or extra sensitivity sweep followed.

## Reproduce and decision

Extract proof.tar.gz; run ngspice -n -D ngbehavior=ps -b circuit.cir, retaining its output as run.log; Python-with-NumPy compare.py then node compare.mjs. python3 check-wiring.py checks the audited mapping. Baseline samples, original model, exact tighter circuit, scripts, results and checks are included; dense new tran.txt stays local and is regenerated. Prior diagnostic evidence supplies the original baseline acquisition provenance.

Decision: treat this as repeatable model behavior with unresolved physical accuracy. A named independent reference or physical measurements are needed before promoting fidelity. Do not silently add compensation, change feedback resistors, retune the runtime, or restart open-ended solver debugging.

Recorded 2026-09-09T11:25:52.717907+00:00.
