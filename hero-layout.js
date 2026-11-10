/* Preserve exact reference layout on desktop, regardless of browser window height.
   Only narrower desktop windows use a proportional uniform scale. */
(function(){
  const root=document.documentElement;
  function fitApprovedHero(){
    if(!window.matchMedia('(min-width:761px)').matches){
      root.style.removeProperty('--hero-reference-scale');
      root.style.removeProperty('--hero-required-height');
      return;
    }
    const home=document.getElementById('home');
    const width=home?home.clientWidth:root.clientWidth;
    const scale=width>=1200?1:width/1366;
    root.style.setProperty('--hero-reference-scale',String(scale));
    root.style.setProperty('--hero-required-height',(768*scale)+'px');
  }
  fitApprovedHero();
  window.addEventListener('resize',fitApprovedHero);
  document.addEventListener('DOMContentLoaded',()=>{
    fitApprovedHero();
    const home=document.getElementById('home');
    if(home&&typeof ResizeObserver!=='undefined')new ResizeObserver(fitApprovedHero).observe(home);
  });
})();
