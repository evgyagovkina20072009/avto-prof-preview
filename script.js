/* Авто-Проф, редакция 02.11.2026: меню, всплывающие окна и демонстрационный календарь.
   Расписание примерное, сервер и отправка заявок НЕ подключены. */



/* Навигация и информационное окно. */
const aboutDetails=`
  <section class="about-section">
    <h2>Адрес</h2>
    <p>Тюмень, Старый Тобольский тракт, 2-й километр, 4а, ворота №2</p>
    <p><a href="https://2gis.ru/tyumen/geo/70000001099008590" target="_blank" rel="noopener noreferrer">Посмотреть на карте 2ГИС</a></p>
  </section>
  <section class="about-section">
    <h2>Телефоны</h2>
    <p><a href="tel:+79829476558">+7 982-947-65-58</a></p>
    <p><a href="tel:+79923106270">+7 992-310-62-70</a></p>
  </section>
  <section class="about-section">
    <h2>Режим работы</h2>
    <p>Понедельник–вторник: 09:00–18:00</p>
    <p>Суббота–воскресенье: выходные</p>
  </section>`;
const info={'Контакты':'Тюмень, Старый Тобольский тракт, 2-й километр, 4а, ворота №2. <a target="_blank" rel="noopener" href="https://2gis.ru/tyumen/geo/70000001099008590">Посмотреть на карте 2ГИС</a>.','Запись на СТО':'Это демонстрационная версия. Форма записи будет подключена позже — заявки сейчас не отправляются.','Как мы работаем':'Здесь разместим подробности обслуживания и фотографии мастерской после согласования.'};
// Only genuine reviews approved for publication may be added here.
// A future backend must enforce authenticity, moderation and spam checks server-side.
const reviews=[];
const reviewsSection=document.getElementById('reviews');
function renderReviews(){
  const published=reviews.filter(review=>review.status==='published' && review.verified===true && Number.isInteger(review.rating) && review.rating>=1 && review.rating<=5 && typeof review.author==='string' && typeof review.text==='string' && review.text.trim());
  document.getElementById('reviews-summary').textContent=published.length
    ? `Средний рейтинг: ${(published.reduce((sum,review)=>sum+review.rating,0)/published.length).toLocaleString('ru-RU',{maximumFractionDigits:1})} из 5 · Отзывов: ${published.length}`
    : 'Средний рейтинг пока не сформирован — нет опубликованных отзывов.';
  document.getElementById('reviews-empty').hidden=published.length>0;
  const list=document.getElementById('review-list');
  list.replaceChildren();
  published.forEach(review=>{
    const item=document.createElement('li');
    const author=document.createElement('strong');author.textContent=review.author;
    const rating=document.createElement('p');rating.textContent='★'.repeat(review.rating)+'☆'.repeat(5-review.rating);rating.setAttribute('aria-label',`Оценка: ${review.rating} из 5`);
    const text=document.createElement('p');text.textContent=review.text;
    item.append(author,rating,text);list.append(item);
  });
}
document.getElementById('review-form').addEventListener('submit',event=>{
  event.preventDefault();
  document.getElementById('review-status').textContent='Поля заполнены. Это демонстрация: отзыв не отправлен, не сохранён и не опубликован.';
});
const modal=document.getElementById('dialog');
const home=document.querySelector('.main-nav [data-panel="Главная"]');
const menuButtons=document.querySelectorAll('.main-nav [data-panel]');
let opener=null;
function setActive(section){
  menuButtons.forEach(button=>{
    const active=button.dataset.panel===section;
    button.classList.toggle('active',active);
    if(active) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });
}
function closeReviewsView(){
  reviewsSection.hidden=true;
  document.getElementById('modal-panel').classList.remove('reviews-panel');
  document.getElementById('review-form').reset();
  document.getElementById('review-status').textContent='';
}
function closeModal(){
  modal.classList.remove('open');
  closeReviewsView();
  closeBookingView();
  document.getElementById('modal-panel').classList.remove('about-panel');
  document.getElementById('dt').hidden=false;
  setActive('Главная');
  if(opener) opener.focus({preventScroll:true});
  opener=null;
}
function goHome(){
  closeModal();
  window.scrollTo({top:0,left:0,behavior:'instant'});
  if(home) home.focus({preventScroll:true});
}
// Общие якоря единого лендинга; визуальные блоки остаются без изменений.
function scrollToLandingSection(id,behavior){
  const target=document.getElementById(id);
  if(!target) return false;
  closeModal();
  const motion=behavior||(window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth');
  if(id==='home') window.scrollTo({top:0,left:0,behavior:motion});
  else target.scrollIntoView({behavior:motion,block:'start'});
  const focusTarget=id==='home'?home:document.getElementById('services-title');
  if(focusTarget) focusTarget.focus({preventScroll:true});
  setActive(id==='home'?'Главная':'Услуги и цены');
  return true;
}
function updateLandingHash(id){
  const hash='#'+id;
  if(window.location.hash!==hash) window.history.pushState(null,'',hash);
}
document.addEventListener('click',event=>{
  // Parts order CTA is reserved for its future dedicated form; it must never open the old info dialog.
  if(event.target.closest('.parts-cta')) return;
  const button=event.target.closest('[data-panel]');
  if(!button) return;
  if(button.tagName==='A'&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)) return;
  event.preventDefault();
  const section=button.dataset.panel;
  if(section==='Главная'){
    if(scrollToLandingSection('home')){if(button.tagName==='A') updateLandingHash('home');}
    else goHome();
    return;
  }
  if(section==='Услуги'||section==='Услуги и цены'){
    if(scrollToLandingSection('services')){if(button.tagName==='A') updateLandingHash('services');}
    else window.location.href='services.html';
    return;
  }
  if(section==='Цены'){window.location.href='services.html';return;}
  opener=button;
  setActive(section);
  closeReviewsView();
  closeBookingView();
  if(section==='Запись на СТО'){openBookingCalendar();return;}
  document.getElementById('dt').textContent=section;
  const isAbout=section==='О нас';
  document.getElementById('dt').hidden=isAbout;
  document.getElementById('modal-panel').classList.toggle('about-panel',isAbout);
  const isReviews=section==='Отзывы';
  reviewsSection.hidden=!isReviews;
  document.getElementById('modal-panel').classList.toggle('reviews-panel',isReviews);
  document.getElementById('desc').hidden=isReviews;
  // The existing contacts dialog previously opened by the parts CTA now belongs to «О нас».
  document.getElementById('desc').innerHTML=isReviews?'':(isAbout?aboutDetails:(info[section]||''));
  if(isReviews) renderReviews();
  modal.classList.add('open');
  document.getElementById('close').focus({preventScroll:true});
});
document.getElementById('close').onclick=document.body.dataset.innerPage?closeModal:goHome;
modal.onclick=event=>{if(event.target===modal) closeModal()};
document.addEventListener('keydown',event=>{if(event.key==='Escape' && modal.classList.contains('open')) closeModal()});

/* Демонстрационный календарь записи на СТО. */
(function(){
  // Для расписания учитываем местную дату СТО — Тюмень (UTC+05:00).
  const localDateParts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Yekaterinburg',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  const today=new Date(Number(localDateParts.year),Number(localDateParts.month)-1,Number(localDateParts.day));
  let displayed=new Date(today.getFullYear(),today.getMonth(),1);
  const lastMonth=new Date(today.getFullYear(),today.getMonth()+2,1);
  let chosen=null;
  const days=document.getElementById('cal-days');
  const monthText=document.getElementById('cal-month');
  const result=document.getElementById('cal-result');
  const monthTitle=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'});
  const dateTitle=new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',weekday:'long'});
  const weekdays=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  function sampleStatus(day){
    const n=day.getFullYear()*31+day.getMonth()*17+day.getDate();
    if(n%8===0 || n%11===0)return 'busy';
    if(n%5===0 || n%7===0)return 'few';
    return 'free';
  }
  function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function showResult(d,status){
    chosen=d;
    const name=dateTitle.format(d);
    if(status==='busy'){
      result.innerHTML='<strong>'+name+'</strong>На этой дате в демонстрационном расписании свободных часов нет.';
      return;
    }
    const times=status==='few'?['15:00','17:00']:['09:00','11:00','13:00','15:00','17:00'];
    result.innerHTML='<strong>'+name+'</strong>Пример свободного времени: <div class="booking-slots">'+times.map(t=>'<button class="booking-slot" type="button" data-time="'+t+'">'+t+'</button>').join('')+'</div><div class="booking-feedback" id="cal-feedback">Нажми на время. Настоящая запись пока не подключена.</div>';
    result.querySelectorAll('.booking-slot').forEach(b=>b.addEventListener('click',()=>{
      result.querySelectorAll('.booking-slot').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      document.getElementById('cal-feedback').textContent='Выбрано '+dateTitle.format(chosen)+', '+b.dataset.time+'. Это пример: заявка не отправлена.';
    }));
  }
  const appointment=document.getElementById('appointment-dialog');
  let appointmentReturnFocus=null;
  const appointmentForm=document.getElementById('appointment-form');
  const appointmentTimes=document.getElementById('appointment-times');
  const appointmentDate=document.getElementById('appointment-date');
  const appointmentSubmit=document.getElementById('appointment-submit');
  const appointmentFeedback=document.getElementById('appointment-feedback');
  let chosenTime=null;
  function closeAppointmentForm(){
    appointment.hidden=true;
    chosenTime=null;
    appointmentForm.reset();
    appointmentSubmit.disabled=true;
    if(appointmentReturnFocus && appointmentReturnFocus.isConnected){appointmentReturnFocus.focus();}
  }
  function openAppointmentForm(date,status){
    appointmentReturnFocus=document.activeElement;
    appointmentForm.reset();
    chosenTime=null;
    appointmentSubmit.disabled=true;
    appointmentFeedback.textContent='Демонстрация: данные не отправляются и не сохраняются.';
    appointmentDate.textContent=dateTitle.format(date);
    appointmentTimes.replaceChildren();
    const times=status==='few'?['15:00','17:00']:['09:00','11:00','13:00','15:00','17:00'];
    for(const time of times){
      const b=document.createElement('button');
      b.type='button'; b.className='appointment-time'; b.textContent=time;
      b.setAttribute('aria-pressed','false');
      b.addEventListener('click',()=>{
        chosenTime=time;
        for(const node of appointmentTimes.children){ node.setAttribute('aria-pressed',String(node===b)); }
        appointmentSubmit.disabled=false;
        appointmentFeedback.textContent='Выбрано время '+time+'. Можно проверить демо-форму.';
      });
      appointmentTimes.append(b);
    }
    appointment.hidden=false;
    document.getElementById('appointment-close').focus();
  }
  document.getElementById('appointment-close').addEventListener('click',closeAppointmentForm);
  appointment.addEventListener('click',e=>{if(e.target===appointment)closeAppointmentForm()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !appointment.hidden){e.stopImmediatePropagation();closeAppointmentForm()}} ,true);
  appointmentForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(!chosenTime)return;
    const name=appointmentForm.elements.namedItem('name');
    const phone=appointmentForm.elements.namedItem('phone');
    if(!name.value.trim() || !phone.value.trim()){
      appointmentFeedback.textContent='Для демонстрации заполните имя и телефон.';
      return;
    }
    appointmentFeedback.textContent='Демо: выбрано '+dateTitle.format(chosen)+', '+chosenTime+'. Заявка НЕ отправлена. Данные НЕ сохранены.';
  });
  function renderCalendar(){
    days.textContent='';
    monthText.textContent=monthTitle.format(displayed);
    for(const w of weekdays){const el=document.createElement('div');el.className='booking-dow';el.textContent=w;days.append(el)}
    const first=(displayed.getDay()+6)%7;
    for(let i=0;i<first;i++){const e=document.createElement('div');e.className='booking-cell empty';days.append(e)}
    const total=new Date(displayed.getFullYear(),displayed.getMonth()+1,0).getDate();
    for(let i=1;i<=total;i++){
      const date=new Date(displayed.getFullYear(),displayed.getMonth(),i);
      const b=document.createElement('button');b.type='button';b.className='booking-cell';b.textContent=i;
      const old=date<today;const status=sampleStatus(date);
      if(old){b.disabled=true;b.title='Дата уже прошла'}
      else{
        const dot=document.createElement('span');dot.className='booking-dot '+status;dot.setAttribute('aria-hidden','true');b.append(dot);
        b.setAttribute('aria-label',dateTitle.format(date)+': '+(status==='free'?'есть время, пример':status==='few'?'мало мест, пример':'нет мест, пример'));
        b.addEventListener('click',()=>{
          days.querySelectorAll('.booking-cell').forEach(x=>x.classList.remove('selected'));
          b.classList.add('selected');showResult(date,status);if(status!=='busy')openAppointmentForm(date,status);
        });
      }
      if(chosen && ymd(chosen)===ymd(date))b.classList.add('selected');
      days.append(b);
    }
    document.getElementById('cal-prev').disabled=displayed.getFullYear()===today.getFullYear() && displayed.getMonth()===today.getMonth();
    document.getElementById('cal-next').disabled=displayed.getFullYear()===lastMonth.getFullYear() && displayed.getMonth()===lastMonth.getMonth();
  }
  document.getElementById('cal-prev').addEventListener('click',()=>{displayed=new Date(displayed.getFullYear(),displayed.getMonth()-1,1);chosen=null;result.innerHTML='<strong>Выбери дату</strong>Нажми на число с цветной точкой.';renderCalendar()});
  document.getElementById('cal-next').addEventListener('click',()=>{displayed=new Date(displayed.getFullYear(),displayed.getMonth()+1,1);chosen=null;result.innerHTML='<strong>Выбери дату</strong>Нажми на число с цветной точкой.';renderCalendar()});
  window.openBookingCalendar=function(){
    document.getElementById('dt').textContent='Запись на СТО';
    document.getElementById('desc').hidden=true;
    document.getElementById('booking').hidden=false;
    document.getElementById('modal-panel').classList.add('booking-wide');
    chosen=null;displayed=new Date(today.getFullYear(),today.getMonth(),1);
    result.innerHTML='<strong>Выбери дату</strong>Нажми на число с цветной точкой, чтобы посмотреть пример свободных часов.';
    renderCalendar();
    document.getElementById('dialog').classList.add('open');
    document.getElementById('cal-next').focus();
  };
  window.closeBookingView=function(){
    document.getElementById('booking').hidden=true;
    document.getElementById('desc').hidden=false;
    document.getElementById('modal-panel').classList.remove('booking-wide');
  };
})();

// Прямые ссылки и возврат по истории учитывают высоту закреплённого хедера.
function restoreLandingAnchor(){
  const id=window.location.hash.slice(1);
  if(id==='home'||id==='services') scrollToLandingSection(id,'instant');
}
window.addEventListener('load',restoreLandingAnchor);
window.addEventListener('hashchange',restoreLandingAnchor);
