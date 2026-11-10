/* Desktop left group tracks the actual header logo coordinate.
   Do not move or resize the car or change the second screen. */
(function(){
  const root=document.documentElement;
  const selectors=['.hero','.service-blocks','.actions'];
  function fitApprovedHero(){
    const home=document.getElementById('home');
    const stage=home&&home.querySelector('.hero-reference-stage');
    const content=home&&home.querySelector('.composition');
    const isDesktop=window.matchMedia('(min-width:761px)').matches;
    if(!isDesktop){
      root.style.removeProperty('--hero-reference-scale');
      root.style.removeProperty('--hero-required-height');
      if(content)for(const selector of selectors){
        const element=content.querySelector(selector);
        if(element)element.style.removeProperty('left');
      }
      return;
    }
    const width=home?home.clientWidth:root.clientWidth;
    const scale=width>=1200?1:width/1366;
    root.style.setProperty('--hero-reference-scale',String(scale));
    root.style.setProperty('--hero-required-height',(768*scale)+'px');
    if(!stage||!content)return;
    const brand=document.querySelector('body > .site-header .brand');
    if(!brand)return;
    const stageRect=stage.getBoundingClientRect();
    const logoRect=brand.getBoundingClientRect();
    const renderedScale=stageRect.width/1366;
    if(!renderedScale)return;
    const left=Math.round((logoRect.left-stageRect.left)/renderedScale*100)/100;
    for(const selector of selectors){
      const element=content.querySelector(selector);
      if(element)element.style.left=left+'px';
    }
  }
  window.addEventListener('resize',fitApprovedHero);
  document.addEventListener('DOMContentLoaded',()=>{
    fitApprovedHero();
    const home=document.getElementById('home');
    if(home&&typeof ResizeObserver!=='undefined')new ResizeObserver(fitApprovedHero).observe(home);
  });
})();
