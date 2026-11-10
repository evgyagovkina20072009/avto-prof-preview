/* Техническое масштабирование от утверждённого эталона, без новых размеров дизайна. */
(function(){
  const root=document.documentElement;
  function fitApprovedHero(){
    if(!window.matchMedia('(min-width:761px)').matches){root.style.removeProperty('--hero-reference-scale');return;}
    const home=document.getElementById('home');
    const width=home?home.clientWidth:root.clientWidth;
    const height=home?home.clientHeight:window.innerHeight;
    root.style.setProperty('--hero-reference-scale',String(Math.min(width/1366,height/768)));
  }
  fitApprovedHero();
  window.addEventListener('resize',fitApprovedHero);
  document.addEventListener('DOMContentLoaded',()=>{
    fitApprovedHero();
    const home=document.getElementById('home');
    if(home&&typeof ResizeObserver!=='undefined')new ResizeObserver(fitApprovedHero).observe(home);
  });
})();
