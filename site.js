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
