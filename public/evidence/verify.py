import json,math,random
from pathlib import Path
from model import evaluate
from reference import solve

def verify():
    rng=random.Random(6172);cases=[]
    for mode in ['offset_input','offset_thru']:
        for g in [0,.5,1]:
            for o in [0,.5,1]:
                for a,b in [(0,0),(1,0),(0,1),(.25,.75),(-.5,.5)]:
                    for rs,load in [(0,math.inf),(499,100000),(1000,1000)]:
                        cases.append((a,b,g,o,mode,rs,rs,load))
    for _ in range(200):cases.append((rng.uniform(-1,1),rng.uniform(-1,1),rng.random(),rng.random(),rng.choice(['offset_input','offset_thru']),rng.uniform(0,2000),rng.uniform(0,2000),rng.uniform(1000,1000000)))
    max_error=0;max_residual=0
    for case in cases:
        fast=evaluate(*case);nodes,residual=solve(*case)
        pairs=[(fast['output'],nodes['output']),(fast['input_stage'],nodes['a_out']),(fast['thru_stage'],nodes['b_out']),(fast['attenuated'],nodes['gain_out']),(fast['offset_voltage'],nodes['offset'])]
        max_error=max(max_error,max(abs(a-b) for a,b in pairs));max_residual=max(max_residual,residual)
    assert max_error<1e-10
    # Hand anchors independent of reference implementation.
    assert evaluate(1,0,gain=1)['output']==1
    assert evaluate(1,0,gain=0)['output']==-1
    assert evaluate(1,.3,gain=.5)['output']==.3
    assert abs(evaluate(1,0,gain=1,load=499)['output']-.5)<1e-12
    assert evaluate(0,0,gain=.5,offset=1,mode='offset_input')['output']==0
    assert evaluate(0,0,gain=.5,offset=1,mode='offset_thru')['output']< -1
    rejected=0
    for kwargs in [dict(gain=2),dict(offset=-1),dict(mode='invented'),dict(load=0),dict(source_a=-1),dict(a=math.nan)]:
        args=dict(a=0,b=0);args.update(kwargs)
        try:evaluate(**args)
        except ValueError:rejected+=1
    assert rejected==6
    return dict(dc_cases=len(cases),hand_anchors=6,invalid_cases_rejected=rejected,max_node_error_volts=max_error,max_linear_equation_residual=max_residual,numerical_tolerance_volts=1e-10,tolerance_scope='Floating-point agreement only; not hardware accuracy.',dynamic_tests_run=0,hardware_tests_run=0,model_scope='Ideal linear DC, ideal 2.5V reference and op amps; no rail limiting.')
if __name__=='__main__':
    result=verify();print(json.dumps(result,indent=2));Path(__file__).with_name('verification.json').write_text(json.dumps(result,indent=2)+'\n')
