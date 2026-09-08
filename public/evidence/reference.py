"""Independent modified nodal analysis of the ideal C7 DC circuit.
No import from model.py. Ideal op amps enforce V+=V- with an output current unknown.
Pot wipers are unloaded by ideal op-amp inputs. Supplies have no modeled limiting.
"""
import math
class Circuit:
    def __init__(self): self.nodes={};self.resistors=[];self.constraints=[]
    def node(self,n):
        if n!="0" and n not in self.nodes:self.nodes[n]=len(self.nodes)
    def resistor(self,a,b,r):
        self.node(a);self.node(b);self.resistors.append((a,b,r))
    def constraint(self,out,terms,value=0):
        self.node(out)
        for n in terms:self.node(n)
        self.constraints.append((out,terms,value))
    def voltage(self,out,v):self.constraint(out,{out:1},v)
    def opamp(self,out,plus,minus):self.constraint(out,{plus:1,minus:-1})
    def solve(self):
        n=len(self.nodes);m=n+len(self.constraints);a=[[0.]*(m+1) for _ in range(m)]
        for x,y,r in self.resistors:
            for u,v,sgn in [(x,x,1),(y,y,1),(x,y,-1),(y,x,-1)]:
                if u!="0" and v!="0":a[self.nodes[u]][self.nodes[v]]+=sgn/r
        for k,(out,terms,value) in enumerate(self.constraints):
            j=n+k;a[self.nodes[out]][j]=1
            for node,coefficient in terms.items():
                if node!="0":a[j][self.nodes[node]]+=coefficient
            a[j][-1]=value
        original=[row[:] for row in a]
        for col in range(m):
            pivot=max(range(col,m),key=lambda row:abs(a[row][col]))
            if abs(a[pivot][col])<1e-14:raise ArithmeticError("singular reference circuit")
            a[col],a[pivot]=a[pivot],a[col];v=a[col][col];a[col]=[x/v for x in a[col]]
            for row in range(m):
                if row==col:continue
                v=a[row][col]
                a[row]=[x-v*y for x,y in zip(a[row],a[col])]
        solution=[row[-1] for row in a]
        residual=max(abs(sum(row[i]*solution[i] for i in range(m))-row[-1]) for row in original)
        return {node:solution[i] for node,i in self.nodes.items()},residual

def solve(a,b,gain,offset,mode,source_a=0.,source_b=0.,load=math.inf):
    c=Circuit()
    for label,v,rs in [('a',a,source_a),('b',b,source_b)]:
        if rs:c.voltage(label+'_source',v);c.resistor(label+'_source',label,rs)
        else:c.voltage(label,v)
        c.resistor(label,'0',100000)
    c.voltage('ref',2.5);c.resistor('ref','divider',4990);c.resistor('divider','0',20000)
    c.opamp('ref_plus','divider','ref_plus')
    c.resistor('ref_plus','ref_inv',1000);c.resistor('ref_minus','ref_inv',1000);c.opamp('ref_minus','0','ref_inv')
    c.constraint('offset_wiper',{'offset_wiper':1,'ref_plus':-offset,'ref_minus':-(1-offset)})
    c.opamp('offset','offset_wiper','offset')
    # S1 connects R10 to offset and R11 to ground, or the reverse.
    sa,sb=('offset','0') if mode=='offset_input' else ('0','offset')
    c.resistor('a','a_plus',499);c.resistor(sa,'a_minus',1000);c.resistor('a_out','a_minus',1000);c.opamp('a_out','a_plus','a_minus')
    c.resistor('b','b_plus',499);c.resistor(sb,'b_minus',1000);c.resistor('b_out','b_minus',1000);c.opamp('b_out','b_plus','b_minus')
    c.resistor('a_out','0',10000) # R4 pot total resistance
    c.constraint('gain_wiper',{'gain_wiper':1,'a_out':-gain})
    c.resistor('a_out','gain_minus',10000);c.resistor('gain_out','gain_minus',10000);c.opamp('gain_out','gain_wiper','gain_minus')
    c.resistor('gain_out','sum',1000);c.resistor('b_out','sum',1000)
    c.resistor('preout','feedback',1000);c.opamp('preout','sum','feedback')
    c.resistor('preout','output',499)
    if not math.isinf(load):c.resistor('output','0',load)
    return c.solve()
