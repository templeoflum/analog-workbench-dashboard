# Playable partial Cadet signal path

A dynamic FIR runtime now processes fresh moving-pattern samples. This is a bounded approximation of the original four-LM6172 signal circuit with ideal supplies/reference. It is not a qualified full Cadet or physical-board match. Solver investigation remains paused.

## Fixed acceptance and result

Limits declared before held-out comparisons: peak <=1 mV; RMS <=0.1 mV, at 0.25 ns sample intervals over 1 microsecond. Six configurations: gain pot 0/0.5/1 (nominal -1/0/+1), input/thru offset routes. Fixed offset .6, B=0, source resistance 499 ohm, load 100 kohm, ideal +/-12 V supplies and ideal offset source. Input 0..0.2 V; pulse edges >=10 ns; sine 5 MHz.

18 pulse/ramp/sine cases passed. Six additional cases of the animation generator at frame 23 passed: largest pattern peak 0.054210 mV, RMS 0.003978 mV. This samples one animation phase, not every possible phase or inter-frame transition.

Actual JavaScript runtime: 48 comparisons (24 stimuli x block sizes 257 and 4096), all passed. Worst peak 0.130867 mV; RMS 0.023177 mV. The independent NumPy direct-convolution results and FFT runtime agree within 1e-12 V. Chunked processing checks retained history across block boundaries for these inputs.

## Derivation and performance

Six AC sweeps, 8193 bins from 0 to 2 GHz, unchanged installed ngspice 47 and the retained TI LM6172 model. Inverse real transform: 16384 points at .25 ns. Causal truncation independently selected for 10 microvolt maximum tail bound at .2 V input: 1024 or 2048 taps. The initial selector lacked the 2048 option; it was extended before held-out testing, and derive.initial.py is retained. No fitting to pulse/ramp/sine or pattern outputs, no solver patch, no change to acceptance thresholds.

Node benchmark: 540 warm samples; median 0.299 ms, 95th percentile 0.373 ms per 4096-sample block. Environment: v22.23.2 / darwin / arm64. Includes pattern generation, filtering and one image packing; excludes browser canvas rendering and physical refresh. This passes the 33.33 ms processing budget only. Browser draw rate is measured live on the page; independent browser-performance qualification remains open.

## What the display means

Each image contains 4096 consecutive electrical samples in row order, spanning 1.024 microseconds. Frame phase advances for visible motion. Both input/output use fixed black=-.4 V, white=+.3 V; no automatic normalization. Waveforms show the same data. The view slows electrical time and is not an NTSC/PAL stream. Circuit setting changes reset history to a DC starting state; pause/play retains it.

## Reproduce

Download proof.tar.gz and extract. Requirements: ngspice 47, Python with NumPy, Node 22. Run reference.py ac, derive.py, reference.py pulse ramp sine, validate.py, reference-pattern.py pattern, validate-pattern.py, test-runtime.mjs (with Python or Node respectively). The retained pattern.json is the actual patternBlock(23,4001,.1) output. All reference netlists, records and logs plus sample-by-sample comparisons are included. Dense raw AC/transient traces stay in the local study and can be regenerated. runtime-model.json and runtime.mjs are byte-identical to the delivered model/core.

## Remaining boundaries

No physical measurements; no full power/reference path; no saturation, noise, arbitrary input, continuous gain/offset calibration, media IO or standard video timing qualification. AC-derived linear behavior is accepted only against the named tests and fixed settings. Wider Phosphlux remains unfinished.

Recorded 2026-09-09T04:47:44.991455+00:00.
