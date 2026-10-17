export type Proto = "gr" | "nat" | "off" | null

const TRACKS = ["gr", "nat"]

export function resolveProto(search: string, stored: string | null): Proto {
  const param = new URLSearchParams(search).get("proto")
  if (param === "off") return "off"
  if (param !== null && TRACKS.includes(param)) return param as "gr" | "nat"
  if (stored !== null && TRACKS.includes(stored)) return stored as "gr" | "nat"
  return null
}

// shortcut: boot duplicates resolveProto inline because beforeDOMLoaded cannot import; consolidate when the toggle graduates.
export const PROTO_BOOT_SCRIPT = `(function(){
  var h=document.documentElement,v=null,s=null;
  try{v=new URLSearchParams(location.search).get("proto");s=localStorage.getItem("proto");}catch(e){}
  if(v==="off"){
    try{localStorage.removeItem("proto");}catch(e){}
    h.removeAttribute("data-proto");
  }else if(v==="gr"||v==="nat"){
    try{localStorage.setItem("proto",v);}catch(e){}
    h.setAttribute("data-proto",v);
  }else if(s==="gr"||s==="nat"){
    h.setAttribute("data-proto",s);
  }else{
    h.removeAttribute("data-proto");
  }
})();`
