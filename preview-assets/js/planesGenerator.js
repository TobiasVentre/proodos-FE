'use strict';
var planesJson,
    apiPlanes = function () {
      return 'test.ddsuite.net' == document.location.host ||
      'localhost:3000' == document.location.host
      ? 'php/Spreadsheet1.json'
      : document.location.origin + '/php/Spreadsheet1.json';      
    },
    contenedoresParaActualizar = [],
    jsonDataContenedor = []
    if (typeof nombreLP=="undefined") {
      var nombreLP=" "
    }
    sendCallAnalytics();
    fetchPlanes(apiPlanes());
function fetchPlanes(a) {
  fetch(a)
    .then(function (a) {
      return a.json();
    })
    .then(function (a) {
      planesJson = a,      
      filtraContenedoresMasDatos(),
      llenarPlanes(),
      sendCallAnalyticsOK()
    });
}
function filtraContenedoresMasDatos() {
  for (var a = document.querySelectorAll('[class^="js__id-plan-"]'), b = 0; b < a.length; b++) {    
    var c = a[b].classList[0].length,
      d = a[b].classList[0].slice(12);
    12 < c ? (contenedoresParaActualizar.push(a[b]), jsonDataContenedor.push(d)) : null;
  }
}

function sendCallAnalytics(){
  window.document.dispatchEvent(
    new CustomEvent("ga_service_call", {
      detail: {
        endpoint: document.location.origin+"/js/planesGenerator.min.js"
      }
    })
  );
}

function sendCallAnalyticsOK(){
  window.document.dispatchEvent(
    new CustomEvent("ga_service_answer", {
      detail: {
        endpoint: document.location.origin+"/js/planesGenerator.min.js",
        response_code: 200
      }
    })
  );
}

function llenarPlanes() {   
  try{
  var stateCarga = "Cargando"; 
  for (var a = 0; a < contenedoresParaActualizar.length; a++) {
    for (var b = 0; b < planesJson.length; b++) {
      if (planesJson[b].ID === jsonDataContenedor[a]) {
        var c = contenedoresParaActualizar[a];
        if(planesJson[b]['COMERCIAL NAME']!='' && c.dataset.elementGa && !c.dataset.gaProductComercial_name){
          c.dataset.gaProductComercial_name = planesJson[b]['COMERCIAL NAME'];
        }
        if(planesJson[b]['COMERCIAL ID']!='' && c.dataset.elementGa && !c.dataset.gaProductComercial_id){
          c.dataset.gaProductComercial_id = planesJson[b]['COMERCIAL ID'];
        }
        if(c.dataset.dinamicGa)
          c.dataset.dinamicGa = 1;   
        if (planesJson[b]['BONETE']!='' && c.getElementsByClassName('bonete').length) {     
          c.classList.add('card__destacada');
          c.getElementsByClassName('js__bonete')[0].innerHTML = planesJson[b]['BONETE']
        } else {          
          if (0<c.getElementsByClassName('bonete').length){
            c.getElementsByClassName('bonete')[0].style.display="none"
          }
        }        
        if (0 < c.getElementsByClassName('js__nombre-plan-tv').length && planesJson[b]['Nombre Plan TV']!='') {          
          c.getElementsByClassName('js__nombre-plan-tv')[0].innerHTML = planesJson[b]['Nombre Plan TV']
        }
        if (0 < c.getElementsByClassName('js__nombre-plan').length && planesJson[b]['NOMBRE PLAN']!='') {          
          c.getElementsByClassName('js__nombre-plan')[0].innerHTML = planesJson[b]['NOMBRE PLAN']
        }
        if (0 < c.getElementsByClassName('js__nombre-plan-movil').length && planesJson[b]['NOMBRE PLAN MOVIL']!='') {          
          c.getElementsByClassName('js__nombre-plan-movil')[0].innerHTML = planesJson[b]['NOMBRE PLAN MOVIL']
        } /*ESTO ES SOLO PARA EL CASO DE LA LP MOVISTAR CON TODO*/

        if (0 < c.getElementsByClassName('js__capacidad-plan').length && planesJson[b]['CAPACIDAD PLAN']!='') {
          c.getElementsByClassName('js__capacidad-plan')[0].innerHTML = planesJson[b]['CAPACIDAD PLAN']
        }    
        if (0 < c.getElementsByClassName('js__capacidad-anterior').length && planesJson[b]['CAPACIDAD ANTERIOR']!='') {
          c.getElementsByClassName('js__capacidad-anterior')[0].innerHTML = planesJson[b]['CAPACIDAD ANTERIOR']
        }   
        if (0 < c.getElementsByClassName('js__full-price').length && planesJson[b]['FULL PRICE']!='') {
          c.getElementsByClassName('js__full-price')[0].innerHTML = planesJson[b]['FULL PRICE']
        }
        else {
          if (c.getElementsByClassName('js__full-price').length) {
            const divPadre= c.getElementsByClassName('js__full-price')[0].parentElement.parentElement            
            divPadre.style.display="none";
          }
        }
        if (0 < c.getElementsByClassName('js__desde').length && planesJson[b]['MUESTRA DESDE']=="Si") {
          c.getElementsByClassName('js__desde')[0].innerHTML = "Desde"
          c.getElementsByClassName('js__desde')[0].style.fontSize = "14px"
        }
        if (0 < c.getElementsByClassName('js__precio-oferta').length && planesJson[b]['PRECIO OFERTA']!='') {
          c.getElementsByClassName('js__precio-oferta')[0].innerHTML = planesJson[b]['PRECIO OFERTA']
        }
        if (0 < c.getElementsByClassName('js__icono-bonete').length && planesJson[b]['Icono - Bonete']!='') {
          c.getElementsByClassName('js__icono-bonete')[0].innerHTML = planesJson[b]['Icono - Bonete']
        } 


        if (0 < c.getElementsByClassName('js__pre-beneficio-2').length && planesJson[b]['pre-beneficio-2-titulo']!='') { 
          c.getElementsByClassName('js__pre-beneficio-2')[0].innerHTML = planesJson[b]['pre-beneficio-2-titulo']
          c.getElementsByClassName('js__pre-beneficio-2-icono')[0].innerHTML = planesJson[b]['pre-beneficio-2-icono']     
          c.getElementsByClassName('js__pre-beneficio-2-descripcion')[0].innerHTML = planesJson[b]['pre-beneficio-2-descripcion']
    
        } else {
          if (0 < c.getElementsByClassName('js__pre-beneficio-2').length) {
            c.getElementsByClassName('pre-beneficio-2')[0].style.display = 'none' ; 
          }
        }  

        
        if (0 < c.getElementsByClassName('js__pre-beneficio-1').length && planesJson[b]['pre-beneficio-1-titulo']!='') {
          c.getElementsByClassName('js__pre-beneficio-1')[0].innerHTML = planesJson[b]['pre-beneficio-1-titulo']
          c.getElementsByClassName('js__pre-beneficio-1-icono')[0].innerHTML = planesJson[b]['pre-beneficio-1-icono']
          c.getElementsByClassName('js__pre-beneficio-1-descripcion')[0].innerHTML = planesJson[b]['pre-beneficio-1-descripcion']

        } else {
          if (0 < c.getElementsByClassName('js__pre-beneficio-1').length) {
            c.getElementsByClassName('pre-beneficio-1')[0].style.display = 'none' ; 
          }
        }    
        if (0 < c.getElementsByClassName('js__text-beneficios').length && planesJson[b]['Texto beneficios']!='') {
          c.getElementsByClassName('js__text-beneficios')[0].innerHTML = planesJson[b]['Texto beneficios']}
          else {
          if (0 < c.getElementsByClassName('js__text-beneficios').length) {
            c.getElementsByClassName('js__text-beneficios')[0].style.display = 'none' ; 
          }
        }

        const beneficios = [
          'BENEFICIO 1',
          'BENEFICIO 2',
          'BENEFICIO 3',
          'BENEFICIO 4'
        ];
        
        const sinBeneficios = beneficios.every(
          key => !planesJson[b][key]
        );
        
        if (sinBeneficios && c.querySelector('.js__beneficios-v2')) {
          c.querySelector('.js__beneficios-v2').style.display = 'none';
          c.querySelector('.js__toggle-detalles').style.display = 'none';
        }


        if (0 < c.getElementsByClassName('js__beneficio-1').length && planesJson[b]['BENEFICIO 1'] != '') {  
          const beneficio1 = planesJson[b]['BENEFICIO 1'];
          //Si incluye "|"
          if (beneficio1.includes('|')) {
            //Divido el texto en dos partes y lo agrego donde corresponde
            const partes = beneficio1.split('|');
            if (c.getElementsByClassName('js__titulo-beneficio-1').length > 0) {
              c.getElementsByClassName('js__titulo-beneficio-1')[0].innerHTML = partes[0];
            }
            c.getElementsByClassName('js__beneficio-1')[0].innerHTML = partes[1];
          }
          //Si no incluye "|"
          else{
            c.getElementsByClassName('js__beneficio-1')[0].innerHTML = beneficio1;
          }
          //Si incluye "WiFi 6"
          if (beneficio1.includes('WiFi 6')) {
            agregaTooltip(planesJson[b].ID, 1);
          }


          if (0 < c.getElementsByClassName('js__icono-beneficio-1').length && planesJson[b]['Icono - Beneficio 1'] != '') {
            c.getElementsByClassName('js__icono-beneficio-1')[0].insertAdjacentHTML('afterbegin', planesJson[b]['Icono - Beneficio 1']);
          } 
        } else {
          if (0 < c.getElementsByClassName('js__beneficio-1').length) {
            c.getElementsByClassName('beneficio-1')[0].style.display = "none";
          }
        }
        if (0 < c.getElementsByClassName('js__beneficio-2').length && planesJson[b]['BENEFICIO 2'] != '') {  
          const beneficio2 = planesJson[b]['BENEFICIO 2'];
          // Si incluye "|"
          if (beneficio2.includes('|')) {
            // Divido el texto en dos partes y lo agrego donde corresponde
            const partes = beneficio2.split('|');
            if (c.getElementsByClassName('js__titulo-beneficio-2').length > 0) {
              c.getElementsByClassName('js__titulo-beneficio-2')[0].innerHTML = partes[0];
            }
            c.getElementsByClassName('js__beneficio-2')[0].innerHTML = partes[1];
          }
          // Si no incluye "|"
          else {
            c.getElementsByClassName('js__beneficio-2')[0].innerHTML = beneficio2;
          }

          // Si incluye "WiFi 6"
          if (beneficio2.includes('WiFi 6')) {
            agregaTooltip(planesJson[b].ID, 2);
          }

          // Si existe el ícono correspondiente
          if (0 < c.getElementsByClassName('js__icono-beneficio-2').length && planesJson[b]['Icono - Beneficio 2'] != '') {
            c.getElementsByClassName('js__icono-beneficio-2')[0].insertAdjacentHTML('afterbegin', planesJson[b]['Icono - Beneficio 2']);
          }
        } else {
          if (0 < c.getElementsByClassName('js__beneficio-2').length) {
            c.getElementsByClassName('beneficio-2')[0].style.display = "none";
          }
        }
        if (0 < c.getElementsByClassName('js__beneficio-3').length && planesJson[b]['BENEFICIO 3'] != '') {  
          const beneficio3 = planesJson[b]['BENEFICIO 3'];

          // Si incluye "|"
          if (beneficio3.includes('|')) {
            // Divido el texto en dos partes y lo agrego donde corresponde
            const partes = beneficio3.split('|');
            if (c.getElementsByClassName('js__titulo-beneficio-3').length > 0) {
              c.getElementsByClassName('js__titulo-beneficio-3')[0].innerHTML = partes[0];
            }
            c.getElementsByClassName('js__beneficio-3')[0].innerHTML = partes[1];
          }
          // Si no incluye "|"
          else {
            c.getElementsByClassName('js__beneficio-3')[0].innerHTML = beneficio3;
          }

          // Si incluye "WiFi 6"
          if (beneficio3.includes('WiFi 6')) {
            agregaTooltip(planesJson[b].ID, 3);
          }

          // Si existe el ícono correspondiente
          if (0 < c.getElementsByClassName('js__icono-beneficio-3').length && planesJson[b]['Icono - Beneficio 3'] != '') {
            c.getElementsByClassName('js__icono-beneficio-3')[0].insertAdjacentHTML('afterbegin', planesJson[b]['Icono - Beneficio 3']);
          }
        } else {
          if (0 < c.getElementsByClassName('js__beneficio-3').length) {
            c.getElementsByClassName('beneficio-3')[0].style.display = "none";
          }
        }
        if (0 < c.getElementsByClassName('js__beneficio-4').length && planesJson[b]['BENEFICIO 4'] != '') {  
          const beneficio4 = planesJson[b]['BENEFICIO 4'];

          // Si incluye "|"
          if (beneficio4.includes('|')) {
            // Divido el texto en dos partes y lo agrego donde corresponde
            const partes = beneficio4.split('|');
            if (c.getElementsByClassName('js__titulo-beneficio-4').length > 0) {
              c.getElementsByClassName('js__titulo-beneficio-4')[0].innerHTML = partes[0];
            }
            c.getElementsByClassName('js__beneficio-4')[0].innerHTML = partes[1];
          }
          // Si no incluye "|"
          else {
            c.getElementsByClassName('js__beneficio-4')[0].innerHTML = beneficio4;
          }

          // Si incluye "WiFi 6"
          if (beneficio4.includes('WiFi 6')) {
            agregaTooltip(planesJson[b].ID, 4);
          }

          // Si existe el ícono correspondiente
          if (0 < c.getElementsByClassName('js__icono-beneficio-4').length && planesJson[b]['Icono - Beneficio 4'] != '') {
            c.getElementsByClassName('js__icono-beneficio-4')[0].insertAdjacentHTML('afterbegin', planesJson[b]['Icono - Beneficio 4']);
          }
        } else {
          if (0 < c.getElementsByClassName('js__beneficio-4').length) {
            c.getElementsByClassName('beneficio-4')[0].style.display = "none";
          }
        }       
        if (0 < c.getElementsByClassName('js__cta-1').length && planesJson[b]['CTA 1']!='') { 
          c.getElementsByClassName('js__cta-1')[0].innerHTML = planesJson[b]['CTA 1'];          
          if (planesJson[b]['LINK 1']==='MODAL') {
            var zz = c.getElementsByClassName('js__cta-1')[0];
            var tag= "handleCtaClick(this)";              
            zz.setAttribute('onclick',tag)
            zz.setAttribute('data-target', '#modal')
            zz.setAttribute('data-toggle', 'modal')                            
            c.getElementsByClassName('js__cta-1')[0].href = '#';
          }    
          else {
            if (planesJson[b]['LINK 1'].includes('wa.')) { 
              const img = document.createElement('img');
              img.src = '/imagenes/iconos/whatsapp-regular-green.svg';
              img.alt = 'WhatsApp';
              img.style.width = '24px';
              c.getElementsByClassName('js__cta-1')[0].appendChild(img);
              c.getElementsByClassName('js__cta-1')[0].style.flexDirection = 'row-reverse';
              c.getElementsByClassName('js__cta-1')[0].style.gap = '5px';
              c.getElementsByClassName('js__cta-1')[0].style.padding='12px';
            } 
            c.getElementsByClassName('js__cta-1')[0].href = planesJson[b]['LINK 1'];
          }                 
        } 
        else {
          if (0 < c.getElementsByClassName('js__cta-1').length) {
            c.getElementsByClassName('js__cta-1')[0].style.display="none"
          }
        }
        if (0 < c.getElementsByClassName('js__cta-2').length && planesJson[b]['CTA 2']!='') { 
          c.getElementsByClassName('js__cta-2')[0].innerHTML = planesJson[b]['CTA 2'];          
          if (planesJson[b]['LINK 2']==='MODAL') {
            var zz = c.getElementsByClassName('js__cta-2')[0];
            var tag= "handleCtaClick(this)";              
            zz.setAttribute('onclick',tag)
            zz.setAttribute('data-target', '#modal')
            zz.setAttribute('data-toggle', 'modal')                            
            c.getElementsByClassName('js__cta-2')[0].href = '#';
          }    
          else {
            if (planesJson[b]['LINK 2'].includes('wa.')) { 
              const img = document.createElement('img');
              img.src = '/imagenes/iconos/whatsapp-regular-green.svg';
              img.alt = 'WhatsApp';
              img.style.width = '24px';
              c.getElementsByClassName('js__cta-2')[0].appendChild(img);
              c.getElementsByClassName('js__cta-2')[0].style.flexDirection = 'row-reverse';
              c.getElementsByClassName('js__cta-2')[0].style.gap = '5px';
              c.getElementsByClassName('js__cta-2')[0].style.padding='12px';
            } 
            c.getElementsByClassName('js__cta-2')[0].href = planesJson[b]['LINK 2'];
          }                 
        } 
        else {
          if (0 < c.getElementsByClassName('js__cta-2').length) {
            c.getElementsByClassName('js__cta-2')[0].style.display="none"
          }
        }       
        if (0 < c.getElementsByClassName('js__aumento').length && planesJson[b]['AUMENTO']!='') {
          c.getElementsByTagName('sup')[0].style.visibility = 'visible';
          c.getElementsByClassName('js__aumento')[0].style.display = 'block' ;
          c.getElementsByClassName('js__aumento')[0].innerHTML = planesJson[b]['AUMENTO'];
        }    
        if (0 < c.getElementsByClassName('js__precio-tv-digital').length && planesJson[b]['PRECIO TV DIGITAL']!='') {
          c.getElementsByClassName('js__precio-tv-digital')[0].innerHTML = planesJson[b]['PRECIO TV DIGITAL']          
        }  
        if (0 < c.getElementsByClassName('js__precio-tv-max').length && planesJson[b]['PRECIO TV MAX']!='') {
          c.getElementsByClassName('js__precio-tv-max')[0].innerHTML = planesJson[b]['PRECIO TV MAX']
        }  
        if (0 < c.getElementsByClassName('js__promo-activa').length && planesJson[b]['PROMO ACTIVA']!='No') {
          c.getElementsByClassName('js__promo-activa')[0].style.display = 'block';
          c.getElementsByClassName('js__promo-activa')[0].src = '../../imagenes/cucardas/' + planesJson[b]['PROMO ACTIVA'] + '.png';
          c.getElementsByClassName('js__promo-activa')[0].alt = 'Icono de promoción ' + planesJson[b]['PROMO ACTIVA'];
          c.getElementsByClassName('js__promo-activa')[0].title = planesJson[b]['PROMO ACTIVA'];
        }
        if (0 < c.getElementsByClassName('js__legales-plan').length && planesJson[b]['LEGALES PLAN']!='') {
          c.getElementsByClassName('js__legales-plan')[0].href = planesJson[b]['LEGALES PLAN']          
        }
        if (0 < c.getElementsByClassName('js__legales-promocion').length && planesJson[b]['LEGALES PROMOCION']!='') {
          
        }
        if (0 < c.getElementsByClassName('js__pocode').length && planesJson[b]['POCODE']!='') {
          
        }
        if (0 < c.getElementsByClassName('js__tag-1').length && planesJson[b]['TAG 1']!='') {          
          c.getElementsByClassName('js__tag-1')[0].innerHTML = planesJson[b]['TAG 1']
          c.getElementsByClassName('js__tag-1')[0].style.display = 'block' ;
          if (0 < c.getElementsByClassName('js__icono-tag').length && planesJson[b]['Icono - Tag 1']!='') {
            c.getElementsByClassName('js__icono-tag')[0].innerHTML = planesJson[b]['Icono - Tag 1']
          }
        }
        else {
          if (0 < c.getElementsByClassName('js__tag-1').length) {
            c.getElementsByClassName('js__tag-1')[0].parentElement.style.display = 'none'

          }
        }
        
        if (0 < c.getElementsByClassName('js__tag-2').length && planesJson[b]['TAG 2']!='') {          
          c.getElementsByClassName('js__tag-2')[0].innerHTML = planesJson[b]['TAG 2']
          c.getElementsByClassName('js__tag-2')[0].style.display = 'block' ;
          if (0 < c.getElementsByClassName('js__icono-tag-2').length && planesJson[b]['Icono - Tag 2']!='') {
            c.getElementsByClassName('js__icono-tag-2')[0].innerHTML = planesJson[b]['Icono - Tag 2']
          }
        }
        else {
          if (0 < c.getElementsByClassName('js__tag-2').length) {
            c.getElementsByClassName('js__tag-2')[0].style.display = 'none'

          }
        }        
        if (0<c.getElementsByClassName('js__precio-oferta-nocliente').length && planesJson[b]['PRECIO NO CLIENTE']!= '') {
          c.getElementsByClassName('js__precio-oferta-nocliente')[0].innerHTML = planesJson[b]['PRECIO NO CLIENTE']
        } else {
          if (0<c.getElementsByClassName('js__precio-oferta-nocliente').length) {
            const elem = c.getElementsByClassName('js__precio-oferta-nocliente')[0];
            if (elem) {
              const padre = elem.closest('.price-nocliente');
              if (padre) {
                padre.style.display = 'none';
              }
            }
          }
        }
        if (0<c.getElementsByClassName('js__linea-1').length) {
          c.getElementsByClassName('js__linea-1')[0].innerHTML = planesJson[b]['Texto anterior al precio']
        }
        if (0<c.getElementsByClassName('js__canales-digital').length) {
          c.getElementsByClassName('js__canales-digital')[0].innerHTML = planesJson[b]['CANALES TV DIGITAL']
        }
        if (0<c.getElementsByClassName('js__canales-max').length) {
          c.getElementsByClassName('js__canales-max')[0].innerHTML = planesJson[b]['CANALES TV MAX']
        }
        if (0<c.getElementsByClassName('js__precio-sin-iva').length) {
          let precio=parseInt(planesJson[b]['PRECIO OFERTA'].replace(".",""),10);
          let precioSinIva=parseInt(precio/1.21);
          precioSinIva="$"+precioSinIva.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          c.getElementsByClassName('js__precio-sin-iva')[0].innerHTML = precioSinIva;
        };

        if (0<c.getElementsByClassName('js__precio-sin-iva-nocli').length) {
          let precio=parseInt(planesJson[b]['PRECIO NO CLIENTE'].replace(".",""),10);
          let precioSinIva=parseInt(precio/1.21);
          precioSinIva="$"+precioSinIva.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          c.getElementsByClassName('js__precio-sin-iva-nocli')[0].innerHTML = precioSinIva;
        }
        if (0<c.getElementsByClassName('js__offer-description').length && planesJson[b]['DESCRIPCION OFERTA']!= "") {
          c.getElementsByClassName('js__offer-description')[0].innerHTML = planesJson[b]['DESCRIPCION OFERTA']
        }
        else {
          if (0<c.getElementsByClassName('js__offer-description').length) {
            c.getElementsByClassName('js__offer-description')[0].style.display = 'none'
          }
        }
          if (0<c.getElementsByClassName('js__precio-descripcion').length && planesJson[b]['DESCRIPCION PRECIO']!= undefined) {
          c.getElementsByClassName('js__precio-descripcion')[0].innerHTML = planesJson[b]['DESCRIPCION PRECIO']
        }
        else {
          if (0<c.getElementsByClassName('js__precio-descripcion').length) {
            c.getElementsByClassName('js__precio-descripcion')[0].style.display = 'none'
          }
        }
        if (0<c.getElementsByClassName('js__0800').length && planesJson[b]['0800']!= undefined) {
          let phoneNumber = planesJson[b]['0800'];
          let cleanedNumber = phoneNumber.replace(/-/g, "");
          const linkElement = document.querySelector('a span.js__0800').parentElement;
          linkElement.href=`tel:${cleanedNumber}`;
          c.getElementsByClassName('js__0800')[0].innerHTML = planesJson[b]['0800']
        }
        else {
          if (0<c.getElementsByClassName('js__0800').length) {
            c.getElementsByClassName('js__0800')[0].style.display = 'none'
          }
        }
      }
    }
  }
  stateCarga = "Finalizado";}
  finally{
    ocultarSkeleton()
  }
}

async function agregaTooltip(idPlan, beneficio) {
  const htmlTooltip ='\\componentes_kenos\\tooltip\\tooltip-card-hogar-121.html';
  const existeEstilo = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  .some(link => link.href.includes('componentes_kenos/tooltip/css/styles-tooltip-hogar.min.css'));
  if (!existeEstilo) {
    let estilo = document.createElement('link');
    estilo.rel='stylesheet';
    estilo.href = '\\componentes_kenos\\tooltip\\css\\styles-tooltip-hogar.min.css';
    document.head.appendChild(estilo);
  }
  try {
    const response = await fetch(htmlTooltip);        
    const data = await response.text();        
    const cardPlan = document.querySelector('.js__id-plan-' + idPlan);
    const beneficioPlan = cardPlan.querySelector('.js__beneficio-' + beneficio);
    $(beneficioPlan).css({'display': 'flex', 'align-items': 'center', 'gap': '4px'});
    $(beneficioPlan).append(data);
    return;
  }
  catch (error) {
    console.error('Error:', error);
  }
}
function handleElementsWithTwoClasses(class1, action, targetClass) {
    const elements = document.querySelectorAll(`.${class1}`);
    
    elements.forEach(el => {
        el.classList[action](targetClass);
    });
}
function ocultarSkeleton() {

  handleElementsWithTwoClasses('skeleton', 'add', 'hidden-skeleton');
  handleElementsWithTwoClasses('skeleton', 'remove', 'visible-skeleton');
  handleElementsWithTwoClasses('content-skeleton', 'remove', 'hidden-skeleton');
  handleElementsWithTwoClasses('content-skeleton', 'add', 'visible-skeleton');
  handleElementsWithTwoClasses('swiper-button-next', 'remove', 'hidden-skeleton');
  handleElementsWithTwoClasses('swiper-button-next', 'add', 'visible-skeleton');
  handleElementsWithTwoClasses('swiper-button-prev', 'remove', 'hidden-skeleton');
  handleElementsWithTwoClasses('swiper-button-prev', 'add', 'visible-skeleton');
}
function mostrarSkeleton() {
  handleElementsWithTwoClasses('skeleton', 'remove', 'hidden-skeleton');
  handleElementsWithTwoClasses('skeleton', 'add', 'visible-skeleton');
  handleElementsWithTwoClasses('content-skeleton', 'add', 'hidden-skeleton');
  handleElementsWithTwoClasses('content-skeleton', 'remove', 'visible-skeleton');
  handleElementsWithTwoClasses('swiper-button-next', 'add', 'hidden-skeleton');
  handleElementsWithTwoClasses('swiper-button-next', 'remove', 'visible-skeleton');
  handleElementsWithTwoClasses('swiper-button-prev', 'add', 'hidden-skeleton');
  handleElementsWithTwoClasses('swiper-button-prev', 'remove', 'visible-skeleton');
}