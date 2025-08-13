
// subtle parallax for logo panel (Apple-like)
const panel = document.querySelector('.logo-panel');
if(panel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const img = panel.querySelector('img');
  let rotX=0, rotY=0, targetX=0, targetY=0;
  panel.addEventListener('mousemove',e=>{
    const r = panel.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    targetX = ny * -6; // tilt up/down
    targetY = nx * 6;  // tilt left/right
    panel.style.setProperty('--mx', `${(nx+0.5)*100}%`);
    panel.style.setProperty('--my', `${(ny+0.5)*100}%`);
  });
  panel.addEventListener('mouseleave',()=>{targetX=0;targetY=0;});
  (function animate(){
    rotX += (targetX - rotX) * 0.08;
    rotY += (targetY - rotY) * 0.08;
    if(img){img.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;}
    requestAnimationFrame(animate);
  })();
}

// carousel drag/swipe
document.querySelectorAll('.carousel').forEach(carousel=>{
  const scroller = carousel.querySelector('.scroller');
  let isDown=false,startX,scrollLeft;
  carousel.tabIndex = 0;
  scroller.addEventListener('mousedown',e=>{isDown=true;startX=e.pageX-scroller.offsetLeft;scrollLeft=scroller.scrollLeft;});
  window.addEventListener('mouseup',()=>isDown=false);
  scroller.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();const x=e.pageX-scroller.offsetLeft;const walk=(x-startX)*1.2;scroller.scrollLeft=scrollLeft-walk;});
  // touch is native; arrows
  carousel.querySelector('.arrow.left')?.addEventListener('click',()=> scroller.scrollBy({left:-scroller.clientWidth*.9,behavior:'smooth'}));
  carousel.querySelector('.arrow.right')?.addEventListener('click',()=> scroller.scrollBy({left: scroller.clientWidth*.9,behavior:'smooth'}));
  carousel.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault(); scroller.scrollBy({left:-scroller.clientWidth*.9,behavior:'smooth'});} 
    if(e.key==='ArrowRight'){e.preventDefault(); scroller.scrollBy({left: scroller.clientWidth*.9,behavior:'smooth'});} 
  });
});

// flip cards tap/keyboard support with debounced toggle
document.querySelectorAll('.flip').forEach(card=>{
  let busy=false; // prevents rapid toggles causing jitter
  const toggle=()=>{
    if(busy) return; busy=true;
    card.classList.toggle('is-flipped');
    setTimeout(()=>busy=false, 450);
  };
  card.addEventListener('click', toggle);
  card.setAttribute('tabindex','0');
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
});

// performance: lazy-load non-critical images
document.querySelectorAll('#characters .flip-front img').forEach(img=>{
  img.loading = 'lazy';
  img.decoding = 'async';
  img.setAttribute('width','96');
  img.setAttribute('height','96');
});
document.querySelectorAll('.carousel .scroller img').forEach(img=>{
  img.loading = 'lazy';
  img.decoding = 'async';
});

// mobile menu toggle
const nav = document.querySelector('.nav');
document.querySelector('.menu-btn')?.addEventListener('click',()=>{
  nav?.classList.toggle('open');
});

// intersection reveal for sections/cards
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io = new IntersectionObserver(entries=>{
    for(const e of entries){
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  },{threshold:.18});
  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
}

// interactive tilt on cards (Apple-like subtle parallax)
document.querySelectorAll('.card').forEach(card=>{
  card.classList.add('interactive');
  let rect;
  const onMove = e => {
    rect = rect || card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (-y * 6).toFixed(2);
    const ry = ( x * 6).toFixed(2);
    card.style.setProperty('--rx', rx + 'deg');
    card.style.setProperty('--ry', ry + 'deg');
    card.style.setProperty('--mx', ((x+0.5)*100) + '%');
    card.style.setProperty('--my', ((y+0.5)*100) + '%');
  };
  const clear = ()=>{rect=undefined;card.style.removeProperty('--rx');card.style.removeProperty('--ry');};
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', clear);
});
