/* Представление услуг. Все редакционные данные и цены находятся в services-data.js. */
(function(){
  const {services,categories}=window.AVTO_SERVICES;
  const categoryName=id=>categories.find(category=>category.id===id).name;
  const price=service=>new Intl.NumberFormat('ru-RU').format(service.price)+' ₽';
  const url=service=>'service-'+service.id+'.html';
  function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
  function link(text,href,className){const node=el('a',className,text);node.href=href;return node;}
  function booking(){const button=el('button','service-button','Записаться на СТО');button.type='button';button.dataset.panel='Запись на СТО';return button;}
  const cards=document.getElementById('service-cards');
  if(cards) services.forEach((service,index)=>{
    const card=el('article','service-card');
    const svgNS='http://www.w3.org/2000/svg';
    const icon=document.createElementNS(svgNS,'svg');
    icon.classList.add('service-icon-art');icon.setAttribute('viewBox','0 0 48 48');
    icon.setAttribute('aria-hidden','true');icon.setAttribute('focusable','false');
    const use=document.createElementNS(svgNS,'use');
    use.setAttribute('href','assets/service-icons.svg#'+service.id);
    icon.append(use);card.append(icon);
    card.append(el('span','service-number',String(index+1).padStart(2,'0')),el('h3','',service.name),el('p','',service.description),link('Подробнее →',url(service),'service-more'));
    cards.append(card);
  });
  const results=document.getElementById('catalog-results');
  if(results){
    const search=document.getElementById('service-search');
    const select=document.getElementById('service-category');
    categories.forEach(category=>{const option=el('option','',category.name);option.value=category.id;select.append(option);});
    const normalize=text=>text.toLocaleLowerCase('ru-RU').replace(/ё/g,'е').trim().replace(/\s+/g,' ');
    function render(){
      const query=normalize(search.value);
      const selected=services.filter(service=>(!select.value||service.category===select.value)&&normalize(service.name).includes(query));
      results.replaceChildren();
      document.getElementById('catalog-status').textContent='Найдено услуг: '+selected.length;
      if(!selected.length){results.append(el('p','catalog-empty','Ничего не найдено. Измените запрос или сбросьте фильтры'));return;}
      categories.forEach(category=>{
        const items=selected.filter(service=>service.category===category.id);if(!items.length)return;
        const group=el('section','catalog-group');group.append(el('h2','',category.name));
        items.forEach(service=>{
          const row=el('article','catalog-row');const title=el('div','catalog-service');title.append(link(service.name,url(service),'catalog-service-name'),el('p','',service.description));
          const amount=el('div','catalog-price');amount.append(el('strong','',price(service)),el('span','','Цена уточняется'));
          const actions=el('div','catalog-actions');actions.append(link('Подробнее',url(service),'service-more'),booking());row.append(title,amount,actions);group.append(row);
        });results.append(group);
      });
    }
    search.addEventListener('input',render);select.addEventListener('change',render);
    const form=document.querySelector('.catalog-filters');form.addEventListener('submit',event=>event.preventDefault());
    form.addEventListener('reset',event=>{event.preventDefault();search.value='';select.value='';render();search.focus();});render();
  }
  const detail=document.getElementById('service-detail');
  if(detail){
    const service=services.find(item=>item.id===document.body.dataset.service);
    if(!service){detail.replaceChildren(el('h1','','Услуга не найдена'),link('Вернуться к услугам','services.html','back-link'));return;}
    document.title=service.name+' — Авто-Проф';
    document.getElementById('detail-category').textContent=categoryName(service.category);
    document.getElementById('detail-title').textContent=service.name;
    document.getElementById('detail-description').textContent=service.description;
    service.works.forEach(work=>document.getElementById('detail-works').append(el('li','',work)));
    document.getElementById('detail-price').textContent=price(service);
  }
})();
