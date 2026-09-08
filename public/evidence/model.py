"""Cadet VII v1.1: ideal, linear DC analysis only. Volts and ohms."""
import math

def evaluate(a, b, gain=.5, offset=.5, mode="offset_thru", source_a=0., source_b=0., load=math.inf):
    values=(a,b,gain,offset,source_a,source_b)
    if not all(math.isfinite(v) for v in values): raise ValueError("finite inputs required")
    if not 0<=gain<=1 or not 0<=offset<=1: raise ValueError("pot fraction outside [0,1]")
    if mode not in ("offset_input","offset_thru"): raise ValueError("unknown switch state")
    if source_a<0 or source_b<0 or load<=0 or math.isnan(load): raise ValueError("invalid impedance")
    # Unpatched input jack normals go to ground: represent an unpatched source by 0V.
    va=a*100000/(100000+source_a)
    vb=b*100000/(100000+source_b)
    reference=2.5*20000/(4990+20000) # ideal TL431 reference, R21/R22 divider
    shift=(2*offset-1)*reference
    ua=2*va-(shift if mode=="offset_input" else 0)
    ub=2*vb-(shift if mode=="offset_thru" else 0)
    attenuated=(2*gain-1)*ua
    before_r19=(attenuated+ub)/2
    output=before_r19 if math.isinf(load) else before_r19*load/(load+499)
    return dict(output=output, before_r19=before_r19, input_stage=ua, thru_stage=ub, attenuated=attenuated, offset_voltage=shift)
