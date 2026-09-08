export function evaluate(a,b,p=.5,q=.5,mode="offset_thru",source=0,load=Infinity){
 if(![a,b,p,q,source].every(Number.isFinite)||p<0||p>1||q<0||q>1||source<0||load<=0||Number.isNaN(load)||!["offset_input","offset_thru"].includes(mode))throw new Error("Invalid circuit parameters");
 const shift=(2*q-1)*2.5*20000/24990;
 const A=2*a*100000/(100000+source)-(mode==="offset_input"?shift:0);
 const B=2*b*100000/(100000+source)-(mode==="offset_thru"?shift:0);
 const before=((2*p-1)*A+B)/2;
 return Number.isFinite(load)?before*load/(load+499):before;
}
