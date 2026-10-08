const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-');
const products=[
 {id:1,name:"Wireless Earbuds",cat:"Tech",price:49.99,e:"🎧",bg:"#d6e8f2"},
 {id:2,name:"Smart Watch",cat:"Tech",price:89.00,e:"⌚",bg:"#dfe3f5"},
 {id:3,name:"Phone Stand",cat:"Tech",price:14.50,e:"📱",bg:"#d9efe6"},
 {id:4,name:"Running Shoes",cat:"Fashion",price:64.00,e:"👟",bg:"#f5e1d9"},
 {id:5,name:"Canvas Backpack",cat:"Fashion",price:39.90,e:"🎒",bg:"#e8e3d4"},
 {id:6,name:"Sunglasses",cat:"Fashion",price:22.00,e:"🕶️",bg:"#e4dcf0"},
 {id:7,name:"Coffee Mug",cat:"Home",price:11.00,e:"☕",bg:"#f2e0e0"},
 {id:8,name:"Desk Lamp",cat:"Home",price:27.75,e:"💡",bg:"#f4efc9"},
 {id:9,name:"Plant Pot",cat:"Home",price:16.00,e:"🪴",bg:"#d5ecd4"}
];
const cats=["All",...new Set(products.map(p=>p.cat))];
let cat="All",query="",cart={};
const $=id=>document.getElementById(id);
const money=n=>"$"+n.toFixed(2);

function renderChips(){
  $("chips").innerHTML="";
  cats.forEach(c=>{
    const b=document.createElement("button");
    b.className="chip";b.textContent=c;b.setAttribute("aria-pressed",c===cat);
    b.onclick=()=>{cat=c;renderChips();renderGrid()};
    b.style.marginRight="6px";
    $("chips").append(b);
  });
}
function renderGrid(){
  const g=$("grid");g.innerHTML="";
  const list=products.filter(p=>(cat==="All"||p.cat===cat)&&p.name.toLowerCase().includes(query));
  if(!list.length){g.innerHTML='<div class="none">No products match. Try a different search or category.</div>';return}
  list.forEach(p=>{
    const d=document.createElement("div");d.className="card";
    d.innerHTML=`<div class="thumb" style="background:${p.bg}"><img src="images/${slug(p.name)}.svg" alt="${p.name}"></div>
      <div class="info"><h3>${p.name}</h3><small>${p.cat}</small><div class="price">${money(p.price)}</div>
      <button class="add">Add to cart</button></div>`;
    d.querySelector(".add").onclick=()=>{cart[p.id]=(cart[p.id]||0)+1;renderCart();openCart()};
    g.append(d);
  });
}
function renderCart(){
  const ids=Object.keys(cart);
  let total=0,count=0;
  const box=$("items");box.innerHTML="";
  if(!ids.length)box.innerHTML='<p class="msg">Your cart is empty. Add something from the shop.</p>';
  ids.forEach(id=>{
    const p=products.find(x=>x.id==id),q=cart[id];
    total+=p.price*q;count+=q;
    const r=document.createElement("div");r.className="it";
    r.innerHTML=`<span class="e">${p.e}</span><div class="n">${p.name}<small>${money(p.price)}</small></div>
      <div class="qty"><button aria-label="Remove one">−</button><span>${q}</span><button aria-label="Add one">+</button></div>`;
    const [m,pl]=r.querySelectorAll("button");
    m.onclick=()=>{cart[id]--;if(!cart[id])delete cart[id];renderCart()};
    pl.onclick=()=>{cart[id]++;renderCart()};
    box.append(r);
  });
  $("total").textContent=money(total);
  $("count").textContent=count;
  $("pay").disabled=!count;
}
function openCart(){$("drawer").classList.add("open");$("veil").classList.add("open")}
function closeCart(){$("drawer").classList.remove("open");$("veil").classList.remove("open")}
$("open").onclick=openCart;$("close").onclick=closeCart;$("veil").onclick=closeCart;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
$("q").oninput=e=>{query=e.target.value.trim().toLowerCase();renderGrid()};
$("pay").onclick=()=>{
  $("items").innerHTML='<p class="msg">Order placed. Thank you for shopping with Cartly!</p>';
  cart={};$("total").textContent=money(0);$("count").textContent=0;$("pay").disabled=true;
};
renderChips();renderGrid();renderCart();
