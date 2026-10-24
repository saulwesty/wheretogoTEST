/* Progressive-enhancement scrollspy for the "Page sections" in-page nav.
   Falls back gracefully to plain anchor links if this doesn't run. */
(function(){
  var nav = document.querySelector('nav[aria-label="Page sections"]');
  if(!nav) return;
  var items = [].slice.call(nav.querySelectorAll('.chip')).map(function(link){
    var sec = document.getElementById(link.getAttribute('href').slice(1));
    return sec ? {link:link, sec:sec} : null;
  }).filter(Boolean);
  if(!items.length || !('IntersectionObserver' in window)) return;

  function setActive(id){
    items.forEach(function(item){
      item.link.setAttribute('aria-current', item.sec.id === id ? 'true' : 'false');
    });
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) setActive(entry.target.id);
    });
  }, {rootMargin:'-40% 0px -55% 0px', threshold:0});

  items.forEach(function(item){ observer.observe(item.sec); });
})();

/* Ratings panel: animate the stars filling in when it scrolls into view.
   Stars are full by default, so nothing breaks if this never runs. */
(function(){
  var panels = [].slice.call(document.querySelectorAll('.rate'));
  if(!panels.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('go'); io.unobserve(e.target); }
    });
  }, {threshold:.2});
  panels.forEach(function(p){ io.observe(p); });
})();

/* Venue CTA click tracking for GA4. One delegated listener, so any page that
   loads site.js only needs these attributes on an outbound link:
   data-track="venue_cta" data-venue="..." data-cta-label="..." data-cta-position="..."
   Uses the beacon transport so the hit survives same-tab navigation; new-tab
   clicks (target="_blank", ctrl/cmd-click, middle-click) never unload the page. */
(function(){
  function track(e){
    if(e.type === 'auxclick' && e.button !== 1) return;
    var el = e.target.closest && e.target.closest('[data-track="venue_cta"]');
    if(!el || typeof window.gtag !== 'function') return;
    window.gtag('event', 'venue_cta_click', {
      venue_name: el.getAttribute('data-venue') || '',
      cta_label: el.getAttribute('data-cta-label') || el.textContent.trim(),
      cta_position: el.getAttribute('data-cta-position') || '',
      link_url: el.href || '',
      page_path: location.pathname,
      transport_type: 'beacon'
    });
  }
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
})();
