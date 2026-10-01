const heroSlides=Array.from(document.querySelectorAll('.hero-slide'));const heroDots=Array.from(document.querySelectorAll('.hero-dots button'));let currentHeroSlide=0;
function showHeroSlide(index){currentHeroSlide=(index+heroSlides.length)%heroSlides.length;heroSlides.forEach((slide,i)=>slide.classList.toggle('active',i===currentHeroSlide));heroDots.forEach((dot,i)=>{const active=i===currentHeroSlide;dot.classList.toggle('active',active);dot.setAttribute('aria-current',active?'true':'false')})}
heroDots.forEach((dot,index)=>dot.addEventListener('click',()=>showHeroSlide(index)));
setInterval(()=>showHeroSlide(currentHeroSlide+1),7200);

const cart=document.querySelector('.cart');const count=document.querySelector('.cart-count');const items=document.querySelector('.cart-items');const subtotal=document.querySelector('.subtotal b:last-child');const bar=document.querySelector('.progress span');const note=document.querySelector('.tier-note');let basket=[];
function openCart(){cart.classList.add('open');cart.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeCart(){cart.classList.remove('open');cart.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function render(){count.textContent=basket.length;const total=basket.reduce((s,x)=>s+x.price,0);subtotal.textContent=`₹${total}`;items.innerHTML=basket.length?basket.map((x,i)=>`<div class="cart-line"><div><b>${x.name}</b><div>₹${x.price}</div></div><button data-remove="${i}" aria-label="Remove ${x.name}">Remove</button></div>`).join(''):'<p class="empty">Your cart is empty.</p>';const steps=[0,1,2,3,5],target=basket.length<1?1:basket.length<2?2:basket.length<3?3:5;bar.style.width=`${Math.min(100,basket.length/5*100)}%`;note.textContent=basket.length>=5?'Your 5-product bundle saving is unlocked.':`Add ${target-basket.length} more item${target-basket.length===1?'':'s'} to reach the next saving.`}
document.querySelector('.cart-open').addEventListener('click',openCart);document.querySelector('.cart-close').addEventListener('click',closeCart);document.querySelector('.scrim').addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});
function syncVariant(p){const sel=p.querySelector('.variant-select');const o=sel.selectedOptions[0];const price=Number(o.dataset.price),mrp=Number(o.dataset.mrp)||0,soldOut=o.hasAttribute('data-soldout');const off=mrp>price?Math.round((1-price/mrp)*100):0;p.dataset.price=price;p.dataset.variant=sel.options.length>1?o.textContent:'';p.querySelector('.price').innerHTML=`₹${price}${off?` <del>₹${mrp}</del>`:''}`;let em=p.querySelector('.product-img em');if(off){if(!em){em=document.createElement('em');p.querySelector('.product-tags').append(em)}em.innerHTML=`<span class="off-sign">-</span>${off}%<span class="off-word"> OFF</span>`}else em?.remove();const add=p.querySelector('.add');add.disabled=soldOut;add.textContent=soldOut?'Sold Out':'Add To Cart';p.classList.toggle('sold-out',soldOut)}
document.querySelectorAll('.product').forEach(p=>{syncVariant(p);p.querySelector('.variant-select').addEventListener('change',()=>syncVariant(p))});
document.querySelectorAll('.add').forEach(btn=>btn.addEventListener('click',()=>{const p=btn.closest('.product');basket.push({name:p.dataset.variant?`${p.dataset.name} · ${p.dataset.variant}`:p.dataset.name,price:Number(p.dataset.price)});render();openCart()}));
document.querySelectorAll('.bundle-add').forEach(btn=>btn.addEventListener('click',()=>{basket.push({name:btn.dataset.name,price:Number(btn.dataset.price)});render();openCart()}));
items.addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;basket.splice(Number(b.dataset.remove),1);render()});

const reels=document.querySelector('.reel-row');document.querySelector('.reel-prev').addEventListener('click',()=>reels.scrollBy({left:-260,behavior:'smooth'}));document.querySelector('.reel-next').addEventListener('click',()=>reels.scrollBy({left:260,behavior:'smooth'}));
document.querySelectorAll('.reel-row button').forEach(button=>button.addEventListener('click',()=>{button.textContent=button.textContent==='▶'?'❚❚':'▶'}));
render();

const shop=document.querySelector('#bestsellers');const pills=Array.from(shop.querySelectorAll('.pill'));const glider=shop.querySelector('.pill-glider');const searchInput=shop.querySelector('#productSearch');const clearBtn=shop.querySelector('.search-clear');const cards=Array.from(shop.querySelectorAll('.product'));const emptyState=shop.querySelector('.products-empty');const resultsNote=shop.querySelector('.results-note');let activeFilter='all';
const pillLabels={all:'all bestsellers',bathroom:'Bathroom',kitchen:'Kitchen',home:'Home',skin:'Skin'};
const norm=t=>t.toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
cards.forEach(c=>{c.searchText=norm(`${c.dataset.name} ${c.dataset.category} ${c.dataset.keywords||''}`)});
const inFilter=(c,f)=>f==='all'||c.dataset.category.split(' ').includes(f);
const matches=(c,q)=>!q||q.split(' ').every(w=>c.searchText.includes(w));
pills.forEach(p=>{p.querySelector('small').textContent=cards.filter(c=>inFilter(c,p.dataset.filter)).length});
function moveGlider(){const a=pills.find(p=>p.dataset.filter===activeFilter);glider.style.width=`${a.offsetWidth}px`;glider.style.transform=`translateX(${a.offsetLeft}px)`}
function applyFilters(){const q=norm(searchInput.value);let shown=0;cards.forEach(c=>{const show=inFilter(c,activeFilter)&&matches(c,q);c.hidden=!show;c.classList.remove('pop');if(show){c.style.setProperty('--i',shown++);void c.offsetWidth;c.classList.add('pop')}});clearBtn.hidden=!searchInput.value;emptyState.hidden=shown>0;
  if(!shown){const elsewhere=cards.filter(c=>matches(c,q)).length;emptyState.querySelector('p').textContent=activeFilter!=='all'&&elsewhere?`Nothing in ${pillLabels[activeFilter]} matches “${searchInput.value.trim()}”, but ${elsewhere} other product${elsewhere===1?' does':'s do'}.`:`We couldn't find “${searchInput.value.trim()}”. Try a surface or problem like grease, tiles or copper.`;emptyState.querySelector('button').textContent=activeFilter!=='all'&&elsewhere?'Search all bestsellers':'Clear search'}
  resultsNote.textContent=q||activeFilter!=='all'?`Showing ${shown} of ${cards.length} products`:''}
function setFilter(f){activeFilter=f;pills.forEach(p=>{const on=p.dataset.filter===f;p.classList.toggle('active',on);p.setAttribute('aria-selected',on)});moveGlider();pills.find(p=>p.dataset.filter===f).scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});applyFilters()}
pills.forEach(p=>p.addEventListener('click',()=>setFilter(p.dataset.filter)));
searchInput.addEventListener('input',applyFilters);searchInput.addEventListener('keydown',e=>{if(e.key==='Escape'&&searchInput.value){e.stopPropagation();searchInput.value='';applyFilters()}});
clearBtn.addEventListener('click',()=>{searchInput.value='';applyFilters();searchInput.focus()});
emptyState.querySelector('button').addEventListener('click',()=>{const q=norm(searchInput.value);if(activeFilter!=='all'&&cards.some(c=>matches(c,q)))setFilter('all');else{searchInput.value='';applyFilters()}});
window.addEventListener('resize',moveGlider);document.fonts?.ready.then(moveGlider);moveGlider();
