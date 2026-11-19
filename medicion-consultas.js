/* Measures consultation starts, not confirmed bookings or sales. No client form values. */
(() => {
  'use strict';
  if(['localhost','127.0.0.1'].includes(location.hostname))return;
  const measurementId='G-3KX626G1MB';
  if(typeof window.gtag!=='function'){
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    const tag=document.createElement('script');
    tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;
    document.head.append(tag);
    window.gtag('js',new Date());window.gtag('config',measurementId);
  }
  let lastEvent=0;
  window.almaRegistrarConsulta=(productId='general')=>{
    const now=Date.now();if(now-lastEvent<1500)return;lastEvent=now;
    // An outbound click only proves that the visitor started a consultation.
    window.gtag('event','whatsapp_consultation_start',{
      contact_channel:'whatsapp',service_id:productId,page_path:location.pathname,
      transport_type:'beacon'
    });
  };
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href]');
    if(!link||event.defaultPrevented)return;
    let url;try{url=new URL(link.href,location.href);}catch{return;}
    if(['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname)){
      window.almaRegistrarConsulta(link.dataset.producto||link.dataset.catalogoCotizar||'general');
    }
  });
})();
