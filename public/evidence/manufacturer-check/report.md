# LM6172 manufacturer example: full-waveform check

The retained LM6172 model in ngspice reproduces TI's packaged PSpice example within the predeclared engineering screen. This establishes one same-model, different-simulator comparison. It does not establish physical accuracy or qualify the four-amplifier Cadet at±12 V.

## Source and exact fixture

[TI's LM6172 product page](https://www.ti.com/product/LM6172) lists the PSpice model package SNOM234A. This study uses the previously retained TI archive, not a freshly substituted version. Model library, saved DAT waveform and printed OUT file were checked byte-for-byte against their original ZIP members; all match. package-provenance.json records ZIP SHA256. Included example waveform metadata identifies PSpice17.4, May27 2021,27°C.

One amplifier,±15 V rails,2k feedback and2k to ground for nominal gain2,1k output load,1 V peak50 MHz sine,100 ns acquisition. The original circuit and analysis profile are retained. ngspice47 uses the same model/circuit with explicit27°C, KLU/Gear, gmin1e-16 per model notice, reltol1e-6, abstol1e-12,vntol1e-9,max step.01 ns. Original PSpice maximum step is.1 ns. PSpice ADVCONV is engine-specific; no equivalent is asserted. These solver settings are disclosed, not presented as identical engines.

## Reference extraction and its limits

The package contains a binary Probe DAT, not an ASCII export. A fixture-specific inferred reader extracts labeled64-bit columns using the alias table and per-column offsets/counts. It is restricted to this exact file SHA256: f15456cc811fef4269e72278b7bb945bca1bc7ff7d3ebea2edb893790a24be4b. It is not a general or manufacturer-certified parser.

Checks before comparing outputs:28 labeled columns,1009 samples, contiguous bounded blocks, matching per-block counts/minimum/maximum, all finite samples, strictly increasing time0–100 ns, VIN matching the analytic50 MHz sine to<1e-12 V, rails/ground matching their sources, three external resistor currents matching Ohm's law to<1e-12 A, and initial output within the printed .0084 V rounding interval. The file's trailing1880 bytes are not interpreted or used as waveform data. The labeled block samples pass independent circuit invariants; the original binary is retained for review or comparison with an official export.

## Comparison fixed in advance

Screen: peak<=10 mV and RMS<=2 mV at all1009 manufacturer sample times. These are declared engineering screening limits, not TI specifications or the tighter Cadet runtime-fitting limits. No time shift, amplitude scaling, offset subtraction, steady-state exclusion or fitting. New output is interpolated onto original reference times. One run; no retuning after comparison.

Result: peak 0.660730961 mV, RMS 0.403474128 mV. Screen passed. New run10028 rows, endpoint reached and no error/aborted/timestep-too-small markers. Initial TI output 0.008371304110 V; ngspice 0.008371727444 V. Largest difference at 50.797984851 ns. Previously only the rounded initial-voltage check had been performed; this extends it to the full saved waveform.

## What remains unresolved

TI's published datasheet pulse plots are useful context, but were not treated as exact waveform references by inventing missing fixture details or extracting false precision from a plot. The chosen package supplies exact circuit and simulation samples. Agreement tests this simulator/model combination at one±15 V setup, not silicon measurements,±12 V accuracy, arbitrary gain/load, the Cadet reference supply or its large overshoot. Hardware fidelity remains open.

## Reproduce

Extract proof.tar.gz. Requires Python+NumPy and ngspice47. Run decode.py with NumPy-enabled Python; ngspice -n -D ngbehavior=ps -b circuit.cir (retain output as run.log); then compare.py with NumPy-enabled Python. decoder-validation.json lists aliases, block offsets and checks. comparison.csv includes every reference sample and residual. Original TI ZIP and model notice are preserved. sha256.json inventories this study. No change was made to dashboard runtime kernels, model or acceptance limits.

Recorded 2026-09-09T12:00:44.091570+00:00.
