const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';});}
const filters=document.querySelectorAll('.filter');
const cards=document.querySelectorAll('.all-recipes .recipe-card');
const search=document.querySelector('#search');
const empty=document.querySelector('.empty-state');
let activeFilter='all';
function updateRecipes(){
 let shown=0;
 const term=(search?.value||'').trim().toLowerCase();
 cards.forEach(card=>{
  const categoryMatch=activeFilter==='all'||card.dataset.category===activeFilter;
  const text=(card.dataset.search||card.innerText).toLowerCase();
  const searchMatch=!term||text.includes(term);
  const visible=categoryMatch&&searchMatch;
  card.hidden=!visible;
  if(visible)shown++;
 });
 if(empty)empty.hidden=shown!==0;
}
filters.forEach(button=>button.addEventListener('click',()=>{
 filters.forEach(b=>b.classList.remove('active'));
 button.classList.add('active');activeFilter=button.dataset.filter;updateRecipes();
}));
if(search)search.addEventListener('input',updateRecipes);

// --- Доработки: цели для счётчиков, избранное, ссылки на рецепты ---
function goal(name){if(window.trackGoal)window.trackGoal(name);}

// recipes.html#pancakes раскрывает рецепт, recipes.html#breakfast включает фильтр
const hash=decodeURIComponent(location.hash.slice(1));
const target=hash&&document.getElementById(hash);
if(target&&target.classList.contains('recipe-card')){const d=target.querySelector('details');if(d)d.open=true;target.scrollIntoView();}
const hashFilter=[...filters].find(b=>b.dataset.filter===hash);
if(hashFilter)hashFilter.click();

// recipe_details — раскрыт блок «Ингредиенты и приготовление» (один раз на карточку)
document.querySelectorAll('.recipe-card details').forEach(d=>d.addEventListener('toggle',()=>{
 if(d.open&&!d.dataset.sent){d.dataset.sent='1';goal('recipe_details');}
}));

// recipe_search — посетитель воспользовался поиском (от 3 символов, один раз за просмотр)
let searchSent=false;
if(search)search.addEventListener('input',()=>{
 if(!searchSent&&search.value.trim().length>=3){searchSent=true;goal('recipe_search');}
});

// Избранное ♡ хранится в браузере; favorite_add — рецепт добавлен в избранное
let favs=[];
try{favs=JSON.parse(localStorage.getItem('favs')||'[]');}catch(e){}
document.querySelectorAll('.fav').forEach(btn=>{
 const id=btn.closest('.recipe-card').id;
 const paint=()=>{const on=favs.includes(id);btn.textContent=on?'♥':'♡';btn.setAttribute('aria-pressed',String(on));btn.setAttribute('aria-label',on?'Убрать из избранного':'Добавить в избранное');};
 paint();
 btn.addEventListener('click',()=>{
  const on=favs.includes(id);
  favs=on?favs.filter(f=>f!==id):favs.concat(id);
  try{localStorage.setItem('favs',JSON.stringify(favs));}catch(e){}
  if(!on)goal('favorite_add');
  paint();
 });
});

// suggest_recipe — отправлена форма «Предложить рецепт» (данные никуда не уходят)
const suggest=document.querySelector('#suggest-form');
if(suggest)suggest.addEventListener('submit',e=>{
 e.preventDefault();goal('suggest_recipe');
 suggest.hidden=true;document.querySelector('.form-ok').hidden=false;
});
