'use strict'
$(document).ready(function () {    
    /******CONTROL PARA DESPLEGABLE EN CARDS DE PRODUCTO */
    $('.js__desplegable').click(function () {
        $(this).parent().find('.js__que-incluye').toggle();
        $(this).toggleClass('active');
        $('.js__desplegable div').text('Ver planes de TV');
        $('.js__desplegable div').addClass('leyenda-mas-info').removeClass('leyenda-ocultar-info');
        $('.js__desplegable.active div').text('Ocultar planes de TV');
        $('.js__desplegable.active div').addClass('leyenda-ocultar-info').removeClass('leyenda-mas-info');
    })
    /******CONTROL PARA ACORDEON DE PREGUNTAS FRECUENTES  */
    if ($('.js__faq-pregunta').length>0) {
        let a=$('.js__faq-pregunta');
        a.click(function(){
            $(this).parent().find('.js__faq-contenido').toggle();
            $(this).toggleClass('activ#e');
        })
    }
    /******CONTROL PARA ACORDEON ANIDADO EN PREGUNTAS FRECUENTES  */
    if ($('.js__acordeon-anidado').length>0) {
        let a=$('.js__acordeon-anidado');
        a.click(function(){
            $(this).next('.js__contenido-anidado').toggle();
            $(this).toggleClass('active');
        })
    }
    /******CONTROL PARA MODAL DE INACTIVIDAD */
   if ($('#modalInactividad').length>0){
        setTimeout(function(){
            const btnCerrar = $('#modalInactividad .close');            
            $('#modalInactividad').addClass('in');
            if ($('#modalInactividad').find('.backdrop').length === 0) {
                const backdrop = $('<div class="backdrop"></div>');
                $('#modalInactividad').prepend(backdrop);
                requestAnimationFrame(() => {
                    backdrop.addClass('in');
                });
                backdrop.on('click', function () {
                    $('#modalInactividad').removeClass('in');
                });
            }
            $(btnCerrar).on('click', () => {
                $('#modalInactividad').removeClass('in');
            })
        },120000) 
    }
    /******CONTROL PARA TABS DE MULTIPRODUCTO */
    if ($('#navbar-multiproducto').length > 0) {

        function actualizarVistaSegunTab() {
            const sticky = document.querySelector('.section_sticky_footer_container');
            sticky.style.display = 'none';
            const params = new URLSearchParams(window.location.search);
            const value = params.get('tab');
            if (!value) return;
            // Reset de estados previos
            $('#navbar-multiproducto .item-button, #navbar-multiproducto .subitem-button, #navbar-multiproducto .button-tab')
                .removeClass('active');
            $('body > div').css("display", "none");

            // Activar la sección/tab correspondiente
            $('#' + value).css("display", "block");
            $(`[value="${value}"]`).addClass('active');
            $(`[value="${value}"]`).each(function() {
                if ($(this).hasClass('subitem-button')) {
                    $(`[value="${value}"]`).removeClass('active');
                    $(`[value="${value}"]`).parent().parent().addClass('active');
                }
            });

          
            
            if (window.location.href.includes("empresas")) {
                multiEmpresas(value)
            }
        }


        // Si es una URL de empresas, ejecutar el comportamiento para ocultar los entry points según la tab
        function multiEmpresas(value) {
            if (value === "internet-fibra") {
                $("#internet-fibra").find('#box-internet-fibra-empresarial, #box-portabilidad, #box-alta-de-linea, #box-movistar-con-todo').css("display", "flex");
                $("#internet-fibra").find('#box-internet-fibra').css("display", "none");
                $("footer div:contains('Avisos legales')")
                    .find("a")
                    .attr("href", "https://www.movistarempresas.com.ar/legales/internet/planes-internet-empresas-promocion-online-LP?_gl=1*e2tvw6*_gcl_aw*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_au*MTg1NDI3NTkzMC4xNzU2MTI0OTE2*_ga*MTU0NDU5ODMwOS4xNzU2MTI0OTE2*_ga_61RJ6EK95F*czE3NjMwNDMwNDYkbzc0JGcwJHQxNzYzMDQzMDQ2JGo2MCRsMCRoMTYwODAxODEyMA..");
            }
            if (value === "internet-fibra-empresarial") {
                $("#internet-fibra-empresarial").find('#box-portabilidad, #box-alta-de-linea, #box-movistar-con-todo, #box-internet-fibra').css("display", "flex");
                $("#internet-fibra-empresarial").find('#box-internet-fibra-empresarial').css("display", "none");
                $("footer div:contains('Avisos legales')")
                    .find("a")
                    .attr("href", "https://www.movistarempresas.com.ar/legales/internet/fibra-empresarial-promocion-online?_gl=1*kmbjdj*_gcl_aw*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_au*MTg1NDI3NTkzMC4xNzU2MTI0OTE2*_ga*MTU0NDU5ODMwOS4xNzU2MTI0OTE2*_ga_61RJ6EK95F*czE3NjMwNDMwNDYkbzc0JGcxJHQxNzYzMDQzMDY0JGo0MiRsMCRoMTYwODAxODEyMA..");
            }
            if (value === "portabilidad") {
                $("#portabilidad").find('#box-internet-fibra-empresarial, #box-alta-de-linea, #box-movistar-con-todo, #box-internet-fibra').css("display", "flex");
                $("#portabilidad").find('#box-portabilidad').css("display", "none");
                $("footer div:contains('Avisos legales')")
                    .find("a")
                    .attr("href", "https://www.movistarempresas.com.ar/legales/lineas-y-planes/comunidad-negocios?_gl=1*b197r6*_gcl_aw*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_au*MTg1NDI3NTkzMC4xNzU2MTI0OTE2*_ga*MTU0NDU5ODMwOS4xNzU2MTI0OTE2*_ga_61RJ6EK95F*czE3NjMwNDMwNDYkbzc0JGcxJHQxNzYzMDQzMzgzJGo2MCRsMCRoMTYwODAxODEyMA..");
            }
            if (value === "alta-de-linea") {
                $("#alta-de-linea").find('#box-internet-fibra-empresarial, #box-portabilidad, #box-movistar-con-todo, #box-internet-fibra').css("display", "flex");
                $("#alta-de-linea").find('#box-alta-de-linea').css("display", "none");
                $("footer div:contains('Avisos legales')")
                    .find("a")
                    .attr("href", "https://www.movistarempresas.com.ar/legales/lineas-y-planes/comunidad-negocios?_gl=1*8cr2ox*_gcl_aw*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_au*MTg1NDI3NTkzMC4xNzU2MTI0OTE2*_ga*MTU0NDU5ODMwOS4xNzU2MTI0OTE2*_ga_61RJ6EK95F*czE3NjMwNDMwNDYkbzc0JGcxJHQxNzYzMDQzMzgzJGo2MCRsMCRoMTYwODAxODEyMA..");
            }
            if (value === "movistar-con-todo") {
                $("#movistar-con-todo").find('#box-internet-fibra-empresarial, #box-portabilidad, #box-alta-de-linea, #box-internet-fibra').css("display", "flex");
                $("#movistar-con-todo").find('#box-movistar-con-todo').css("display", "none");
                $("footer div:contains('Avisos legales')")
                    .find("a")
                    .attr("href", "https://www.movistarempresas.com.ar/legales/promociones/movistar-con-todo-empresas?_gl=1*1t8lleu*_gcl_aw*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NjI2MjM1MDMuQ2p3S0NBaUE4YnZJQmhCSkVpd0F1NWF5ckJQcnRLRjA1X0E0NVNjTzVBTUlqdGpOcGxfYVdXVTVtU0FKU250VFNvdG9LNGRHUFJhb3JCb0N1UEFRQXZEX0J3RQ..*_gcl_au*MTg1NDI3NTkzMC4xNzU2MTI0OTE2*_ga*MTU0NDU5ODMwOS4xNzU2MTI0OTE2*_ga_61RJ6EK95F*czE3NjMwNDMwNDYkbzc0JGcxJHQxNzYzMDQzNTI3JGo2MCRsMCRoMTYwODAxODEyMA..");
            }
        }
        
        // Manejo de clicks en opciones de menu
        $('.item-button, .subitem-button, .button-tab').click(function () {

            let value = $(this).attr('value');
            if (!value) return;

            if (window.location.href.includes("empresas")) {
                multiEmpresas(value);
            }

            // --- actualización visual general
            $('#navbar-multiproducto .item-button, #navbar-multiproducto .subitem-button, #navbar-multiproducto .button-tab, #navbar-multiproducto .submenu')
                .removeClass('active');

            // --- mostrar la sección correspondiente
            $('body > div').css("display", "none");
            $('#' + value).css("display", "block");

            // --- marcar activo el elemento clickeado
            $(this).addClass('active');


            // --- actualización de URL
            let url = new URL(window.location.href);
            url.searchParams.set("tab", value);
            window.history.pushState({}, "", url);

            // --- actualización inmediata
            actualizarVistaSegunTab();
        });
        actualizarVistaSegunTab()
    }


    /******CONTROL PARA MODAL DE INACTIVIDAD ALTA*/
    function showPopUp() {
        $('.pop-up').addClass('show');
        $('.popup-wrap').addClass('show');
    }
    $(".popup-wrap #close").click(function () {
        $('.pop-up').removeClass('show');
        $('.popup-wrap').removeClass('show');
    })
    setTimeout(showPopUp, 180000);
    /******CONTROL PARA MANEJO DE TABS GIP */
    if ($('.tabs-gip').length>0) {        
        cambiarTab('home');            
        $('.tablinks').click(function(){    
            if ($('.section-empty-state')){
                $('.section-empty-state').css("display","none") 
            }
            let value = $(this).attr('value');
            if (value==="tab1"){
                $('.tab').children().eq(0).addClass('active');
                $('#tab1').css("display","block");
                $('#tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('#tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')  
                $('#tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')        
                $('#tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')    
                $('#tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active')       
                cambiarTab('pasate_a_movistar');
            }
            if (value==="tab2"){
                $('.tab').children().eq(1).addClass('active');
                $('#tab2').css("display","block");
                $('#tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('#tab3').css("display","none");                    
                $('.tab').children().eq(2).removeClass('active')  
                $('#tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')  
                $('#tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')  
                $('#tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active') 
                cambiarTab('internet_fibra');              
            }
            if (value==="tab3"){
                $('.tab').children().eq(2).addClass('active');
                $('#tab3').css("display","block");
                $('#tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('#tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('#tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')
                $('#tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')
                cambiarTab('movil_fibra');
            }
            if (value==="tab4"){
                $('.tab').children().eq(3).addClass('active');
                $('#tab4').css("display","block");
                $('#tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('#tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('#tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')
                $('#tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')
                $('#tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active')
                cambiarTab('suma_una_linea_nueva');
            }
            if (value==="tab5"){
                $('.tab').children().eq(4).addClass('active');
                $('#tab5').css("display","block");
                $('#tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('#tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('#tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')
                $('#tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')
                $('#tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active')
                cambiarTab('sos_movistar');
            }
            if (value==="tab6"){
                $('.tab').children().eq(5).addClass('active');
                $('#tab6').css("display","block");
                $('#tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('#tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('#tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')
                $('#tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')
                $('#tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')
                cambiarTab('celulares');
            }
        });  
        function cambiarTab(nuevoTab) {
            let url = new URL(window.location.href);
            url.searchParams.set("tab", nuevoTab);
            window.history.pushState({}, "", url);
        }   
    }

    /****** CONTROL PARA MANEJO DE TABS LP WHATSAPP */
    if ($('.menu-tabs.js__lp-whatsapp').length > 0) {

        // Estado inicial al cargar
        $('.tab1').css("display", "block");
        $('.tab2').css("display", "none");
        $('.tab').children().eq(0).addClass('active');
        $('.tab').children().eq(1).removeClass('active');

        $('.tablinks').on('click', function () {
            let value = $(this).attr('value');

            if (value === "tab1") {
                $('.tab').children().eq(0).addClass('active');
                $('.tab1').css("display", "block");
                $('.tab2').css("display", "none");
                $('.tab').children().eq(1).removeClass('active');
            }
            
            if (value === "tab2") {
                $('.tab').children().eq(1).addClass('active');
                $('.tab2').css("display", "block");
                $('.tab1').css("display", "none");
                $('.tab').children().eq(0).removeClass('active');
            }
        });
    }


    /****** CONTROL PARA MANEJO DE TABS LP ALTA DE LINEA */
    if ($('.menu-tabs.tabs__app-alta').length > 0) {

        // estado inicial
        $('.tab1, .tab2, .tab3, .tab4, .tab5, .tab6').hide();
        $('.tab2').show();

        // cambiarTab('tab2');

        $(document).ready(function () {
            $('.tab1').css("display","none");
            $('.tab2').css("display","block");
        });
        
        $('.tablinks').click(function(){    
            if ($('.section-empty-state')){
                $('.section-empty-state').css("display","none") 
            }

            let value = $(this).attr('value');

            if (value==="tab1"){
                $('.tab').children().eq(0).addClass('active');
                $('.tab1').css("display","block");
                $('.tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('.tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')  
                $('.tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')        
                $('.tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')    
                $('.tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active')       
                cambiarTab('tab1');
            }
            if (value==="tab2"){
                $('.tab').children().eq(1).addClass('active');
                $('.tab2').css("display","block");
                $('.tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('.tab3').css("display","none");                    
                $('.tab').children().eq(2).removeClass('active')  
                $('.tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')  
                $('.tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')  
                $('.tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active') 
                $('.box.item-4').css("display", "none");
                cambiarTab('tab2');              
            }
            if (value==="tab3"){
                $('.tab').children().eq(2).addClass('active');
                $('.tab3').css("display","block");
                $('.tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('.tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('.tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')
                $('.tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')
                $('.tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active')
                $('.box.item-4').css("display", "flex");
                cambiarTab('tab3');
            }
            if (value==="tab4"){
                $('.tab').children().eq(3).addClass('active');
                $('.tab4').css("display","block");
                $('.tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('.tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('.tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')
                $('.tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')
                $('.tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active')
                $('.box.item-4').css("display", "flex");
                cambiarTab('tab4');
            }
            if (value==="tab5"){
                $('.tab').children().eq(4).addClass('active');
                $('.tab5').css("display","block");
                $('.tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('.tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('.tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')
                $('.tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')
                $('.tab6').css("display","none");
                $('.tab').children().eq(5).removeClass('active')
                $('.box.item-4').css("display", "flex");
                cambiarTab('tab5');
            }
            if (value==="tab6"){
                $('.tab').children().eq(5).addClass('active');
                $('.tab6').css("display","block");
                $('.tab1').css("display","none");
                $('.tab').children().eq(0).removeClass('active')
                $('.tab2').css("display","none");
                $('.tab').children().eq(1).removeClass('active')
                $('.tab3').css("display","none");
                $('.tab').children().eq(2).removeClass('active')
                $('.tab4').css("display","none");
                $('.tab').children().eq(3).removeClass('active')
                $('.tab5').css("display","none");
                $('.tab').children().eq(4).removeClass('active')
                $('.box.item-4').css("display", "flex");
                cambiarTab('tab6');
            }
        });  
        function cambiarTab(nuevoTab) {
            let url = new URL(window.location.href);
            url.searchParams.set("tab", nuevoTab);
            window.history.pushState({}, "", url);
        }   
    }



    /******CONTROL PARA BANNER FORM DE PORTA CON SELECTOR DE OPERADORA */
    if ($('.js__btn-step1').length>0) {
        $(".formulario-banner .js__btn-step1").click(function(event){
            event.preventDefault();
            var formCtc = $(this).closest("form");
            var $phoneInput = formCtc.find("input[name='phone']")
            if (!validaTelefono($phoneInput, formCtc)) {
                return;
            }
            $(formCtc).find('.step-1-mainbanner').css('display','none');
            $(formCtc).find('.step-2-mainbanner').css('display','flex');
            $(formCtc).find('.step-2-mainbanner button').css('visibility','visible');
        })
        $(".btn-back").click(function(){
            var formCtc = $(this).closest("form");
            $(formCtc).find('.step-2-mainbanner').css('display','none');
            $(formCtc).find('.step-1-mainbanner').css('display','flex');
        })
        $('[name=operadoras]').on('change',function(){
            if ($(this).val()!=null) {
                $(this).closest('form').find('.step-2-mainbanner .banner-boton').prop('disabled', false)
                if($(this).val() == 'Movistar' || $(this).val() == 'Tuenti') {
                    $(this).closest('form').find('.form-ic-c2c-submit').data('form-ic-c2c-send', false)
                }
                else {
                    $(this).closest('form').find('.form-ic-c2c-submit').data('form-ic-c2c-send', true)
                }
            }
        })
        /*Fin Función desplegable operadores*/            
    }     

    /******CONTROL PARA ARMAR SLIDER DE MOVISTAR TV  */
    if($('.js__slider-movistar-tv')) {
        var swiper = new Swiper('.js__slider-movistar-tv', {
            slidesPerView: 1,      
            navigation: {
                nextEl: ".js__slider-movistar-tv .swiper-button-next",
                prevEl: ".js__slider-movistar-tv .swiper-button-prev",
            },
            pagination: {
                el: ".js__slider-movistar-tv .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },          
        })    
    }
    /******CONTROL PARA CARGAR GRILLA DE CANALES */
    if( $('.js__grilla-canales-digital')) {
        $('.js__grilla-canales-digital').load('/componentes_kenos/grilla-de-canales/grilla-digital.html');
    }
    if( $('.js__grilla-canales-max')) {
        $('.js__grilla-canales-max').load('/componentes_kenos/grilla-de-canales/grilla-max.html');
    }
    /******CONTROL PARA ARMAR SLIDER DE PLANES */
    if ($('.js__swiper-planes').length) {
        $('.js__swiper-planes').each(function(index, element) {
            const wrapper = $(element).children('.swiper-wrapper')[0],
            componente = $(element).closest('.js__comp-kenos')[0],
            container= $(element).parent()[0],
            nextEl=$(container).find('.swiper-button-next')[0],
            prevEl=$(container).find('.swiper-button-prev')[0],
            pagination=$(container).find('.swiper-pagination')[0],
            startMobile = $(componente).attr('start-mobile');    

            if (wrapper.children.length <= 2 && window.innerWidth > 930) {
                wrapper.style.width = '1300px';
                wrapper.style.justifyContent = 'center';
            }
            if (wrapper.children.length === 3 && window.innerWidth > 930) {
                wrapper.style.maxWidth = '930px';
            }
            if (wrapper.children.length === 4 && window.innerWidth > 930) {
                wrapper.style.maxWidth = '1230px';
            }
            if (wrapper.children.length >= 5 && window.innerWidth > 930) {
                wrapper.style.maxWidth = '930px';
            }            
            var swiper = new Swiper(element, {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: nextEl,
                    prevEl: prevEl,
                },
                pagination: {
                    el: pagination,
                    type: 'bullets',
                    clickable: true,
                },
                breakpoints: {
                    1080: {
                        slidesPerView: wrapper.children.length >= 5 || wrapper.children.length === 3 ? 3 : 4,
                    },
                    360: {
                        slidesPerView: 1.3,
                        initialSlide: startMobile,
                        centeredSlides: true,
                        spaceBetween: 20,
                    }
                }
            });
    
        }); 
    } 
    /******CONTROL PARA ARMAR SLIDER DE SNAP CARD  */
    if($('.carrusel__beneficios-fibra')) {
        var swiper = new Swiper('.carrusel__beneficios-fibra', {
            slidesPerView: 1.7,
            centeredSlides: true,
            spaceBetween: 30,
            navigation: {
                nextEl: "#beneficios__fibra .swiper-button-next",
                prevEl: "#beneficios__fibra .swiper-button-prev",
            },
            pagination: {
                el: "#beneficios__fibra .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                300: {
                    slidesPerView: 1.6,
                    spaceBetween: 20,
                },
                400: {
                    slidesPerView: 1.7,
                },
                980: {
                    slidesPerView: 1,
                    loop: false,          
                    noSwiping: true,      
                    allowTouchMove: false,
                    navigation: false,
                    spaceBetween: 0,
                    pagination: false,
                }
            }
        })  
    }

    /******CONTROL PARA ARMAR SLIDER DE SNAP CARD MCT  */
    if($('.js__snap-card-mct')) {
        var swiper = new Swiper('.js__snap-card-mct', {            
            navigation: {
                nextEl: "#beneficios__mct .swiper-button-next",
                prevEl: "#beneficios__mct .swiper-button-prev",
            },
            pagination: {
                el: "#beneficios__mct .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                300: {
                    slidesPerView: 2,
                    spaceBetween: 8,
                    slidesPerGroup: 1,
                },
                400: {
                    slidesPerView: 2.5,
                    slidesPerGroup: 1,
                    spaceBetween: 10,
                },
                500: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    spaceBetween: 10,
                },
                980: {
                    slidesPerView: 1,
                    noSwiping: true,      
                    allowTouchMove: false,
                    navigation: false,
                    spaceBetween: 16,
                    pagination: false,
                }
            }
        })  
    }

    /******CONTROL PARA ARMAR SLIDER DE CARD PREPAGO MULTIPRODUCTO */
    if($('.cards__prepago-multiproducto')) {
        var swiper = new Swiper('.cards__prepago-multiproducto', {
            slidesPerView: 2,
            navigation: {
                nextEl: "#cards__prepago .swiper-button-next",
                prevEl: "#cards__prepago .swiper-button-prev",
            },
            pagination: {
                el: "#cards__prepago .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                300: {
                    slidesPerView: 1,
                    pagination: {
                        el: "#cards__prepago .swiper-pagination",
                        type: 'bullets',
                        clickable: true,
                    }
                },
                400: {
                    slidesPerView: 1,
                    pagination: {
                        el: "#cards__prepago .swiper-pagination",
                        type: 'bullets',
                        clickable: true,
                        spaceBetween: 0,
                        centeredSlides: true,
                    }
                },
                980: {
                    slidesPerView: 2,
                    loop: false,          
                    noSwiping: true,      
                    allowTouchMove: false,
                    navigation:false,
                    spaceBetween: 0,
                    pagination: false,
                }
            }
        })  
    }
    /******CONTROL PARA ARMAR SLIDER DE CARDS MOVISTAR TV */
    if ($('#tv__con-todo')) {
        var swiper = new Swiper ('.cards-container', {
            slidesPerView: 2,
            spaceBetween: 48,
            pagination: false,
            navigation: false,
            centeredSlides: false,
            navigation: {
                nextEl: "#cards_planes .swiper-button-next",
                prevEl: "#cards_planes .swiper-button-prev",
            },
            pagination: {
                el: "#cards_planes .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                300: {
                    slidesPerView: 1.2,
                    spaceBetween: 16,
                    centeredSlides: true,
                },
                400: {
                    slidesPerView: 1.4,
                    spaceBetween: 16,
                    centeredSlides: true,
                },
                500: {
                    slidesPerView: 1.6,
                    spaceBetween: 16,
                    centeredSlides: true,
                },
                600: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                    pagination: false,
                    navigation: false,
                    centeredSlides: false,
                },    
                700: {
                    spaceBetween: 48,
                }
            }
        })  
    }

    /******CONTROL PARA ARMAR SLIDER DE SERVICIOS ADICIONALES */
    if ($('.slider-servicios-adicionales')) {
        var swiper = new Swiper('.slider-servicios-adicionales', {
            slidesPerView: 3,
            spaceBetween: 24,
            navigation: {
                nextEl: ".section_servicios_adicionales .swiper-button-next",
                prevEl: ".section_servicios_adicionales .swiper-button-prev",
            },
            pagination: {
                el: ".section_servicios_adicionales .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                300: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                    centeredSlides:true
                },
                380: {
                    slidesPerView: 1,
                    centeredSlides: true,
                    spaceBetween: 45,
                },  

                400: {
                    slidesPerView: 1,
                    centeredSlides: true,
                    spaceBetween: 35,
                },
                980: {
                    slidesPerView: 3
                }                  
            }
        })  
    }

    /******CONTROL PARA ARMAR SLIDER DE PORTA PASOS LIGHT */
    if ($('.vp-porta-pasos-light').length) {
        var swiper = new Swiper('.vp-porta-pasos-light .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 10,
            centeredSlides: true,
            pagination: { 
                el: ".vp-porta-pasos-light .swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".vp-porta-pasos-light .swiper-button-next",
                prevEl: ".vp-porta-pasos-light .swiper-button-prev",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                980: {
                    slidesPerView: 1,
                    noSwiping: true,      
                    allowTouchMove: false,
                    navigation: false,
                    spaceBetween: 0,
                    pagination: false,
                },
            }
        });
    }

    /******CONTROL PARA ARMAR SLIDER DE CARDS TERMINALES */
    if ($('.js__swiper-terminales')){
        var swiper = new Swiper('.js__swiper-terminales', {
            slidesPerView: 4, 
            navigation: {
                nextEl: ".terminales-swiper .swiper-button-next",
                prevEl: ".terminales-swiper .swiper-button-prev",
            },
            pagination: {
                el: ".terminales-swiper .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },
            breakpoints: {
                300: {
                    slidesPerView: 1.1,
                    spaceBetween: 15,
                    centeredSlides:true
                },
                380: {
                    slidesPerView: 1.3,
                    centeredSlides: true,
                    spaceBetween: 45,
                },  

                400: {
                    slidesPerView: 1.3,
                    centeredSlides: true,
                    spaceBetween: 35,
                },
                980: {
                    slidesPerView: 4
                }                  
            }
        }) 
    }    
   /******CONTROL PARA ARMAR SLIDER HERO GIP */
    if($('.js__slider-hero-gip')) {
        const existeEstilo = document.querySelector('link[href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"]') !== null;
        const existeScript = Array.from(document.scripts).some(script => script.src === 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
        if (!existeEstilo){
            let estilo = document.createElement('link');
            estilo.rel='stylesheet';
            estilo.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
            document.head.appendChild(estilo);
        }
        if (!existeScript) {
            let script = document.createElement('script');
            script.src='https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
            script.async = true;
            document.body.appendChild(script);
        }

        var swiper = new Swiper('.js__slider-hero-gip', {
            slidesPerView: 1,         
            pagination: {
                el: ".js__slider-hero-gip .swiper-pagination",
                type: 'bullets',
                clickable: true,
            },
            autoplay: {
                delay: 3000, // Tiempo en milisegundos entre cada slide (3 segundos)
                disableOnInteraction: false, // Sigue moviéndose después de la interacción del usuario
            },        
        })  
    }   
    
    /*NAVBAR COMAR*/
    /*****Menu */
    if($('#navbar-comar')) {
        // Función para poner clase active al menú padre al que pertenece la lp
        const menuLink = document.querySelectorAll ('[menu-link]');
        if (menuLink.length>0) {
            menuLink.forEach (menu => {
                const menuItem = menu.getAttribute('menu-link');
                const activo = document.getElementById(menuItem);
                activo.classList.add('activo');
            })
        }
        // Menu
        const mobileMenu = document.querySelector("#mobileMenu");
        const mobileToggles = document.querySelectorAll(".mobile-toggle");
        const mobilesubheader = document.querySelectorAll(".sub-header-segmento");
        const mobileMenuClose = document.querySelectorAll(".mobile-menu-close");
        const submenuMobile = document.querySelectorAll(".submenu-mobile");
        const volver = document.querySelector(".volver");

        // Abrir menú
        window.toggleMobileMenu = () => {
            mobileMenu.classList.add("active");
            mobileMenuClose.forEach(el => el.classList.add("visible"));
        };

        // Cambiar titulo del menu mobile
        const menuTitulo = document.querySelector('.mobile-menu-close .titulo')
        const subMenuTrigger = document.querySelectorAll('.submenu-trigger')
        window.triggerData = (elem) => elem.getAttribute("data-submenu")

        subMenuTrigger.forEach (e => {
            if(triggerData(e) == 'tienda') {
                e.onclick = () => menuTitulo.innerHTML = 'Tienda'
            } else if (triggerData(e) == 'hogar') {
                e.onclick = () => menuTitulo.innerHTML = 'Hogar'
            } else if (triggerData(e) == 'movil') {
                e.onclick = () => menuTitulo.innerHTML = 'Móvil'
            } else if (triggerData(e) == 'tv') {
                e.onclick = () => menuTitulo.innerHTML = 'Televisión'
            }
        })
        
        
        // Cerrar menú completo
        window.toggleMobileMenuClose = () => {
            mobileMenu.classList.remove("active");
            mobileMenuClose.forEach(el => el.classList.remove("visible"));
            mobilesubheader.forEach(el => el.style.display = "flex");
            submenuMobile.forEach(el => el.classList.remove("active"));
            volver.style.visibility = "hidden";
            menuTitulo.innerHTML = 'Menu'
        };

        // Abrir submenú
        document.querySelectorAll('.submenu-trigger').forEach(trigger => {
            trigger.addEventListener("click", () => {
                const id = trigger.getAttribute("data-submenu");
                const submenu = document.getElementById(id);

                submenuMobile.forEach(el => el.classList.remove("active"));
                submenu.classList.add("active");
                volver.style.visibility = "visible";
            });     
        });

        // Cerrar submenú
        window.closeSubMenu = () => {
            submenuMobile.forEach(el => el.classList.remove("active"));
            mobileMenu.classList.add("active");
            volver.style.visibility = "hidden";
            menuTitulo.innerHTML = 'Menu'
        };

        // Abrir / cerrar todos los dropdowns con clase "dropdown-toggle"
        window.toggleDropdown = (toggleElement) => {
            const dropdown = toggleElement.nextElementSibling;
            if (dropdown && dropdown.classList.contains("dropdown-content")) {
            const isOpen = dropdown.style.display === "block";
            
            // Cerrar todos los otros dropdowns primero
            document.querySelectorAll(".dropdown-content").forEach(d => d.style.display = "none");
        
            // Luego alternar el actual
            dropdown.style.display = isOpen ? "none" : "block";
            }
        };

        
        // Agregar event listener a todos los toggles
        document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
            toggle.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que se cierre de inmediato por el otro listener
            toggleDropdown(toggle);
            });
        });
        
        // Cerrar dropdown si se hace clic afuera
        document.addEventListener("click", (event) => {
            document.querySelectorAll(".dropdown-content").forEach(dropdown => {
            if (!dropdown.previousElementSibling.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
            });
        });
        

    /*****Buscador */
    const urlBuscador = 'https://ayuda.movistar.com.ar/busqueda/'; 

    //Desktop
    const lupaDesktop = document.getElementById("app-buscador-menu-desktop");
    const botonBuscar = document.getElementById("boton-buscar");

    //Tablet
    const lupaTablet = document.getElementById("app-buscador-menu-tablet");
    const botonBuscarTablet = document.getElementById("boton-buscar-tablet");


    //Creo y configuro elementos
    const input = document.createElement('input');
    input.placeholder = 'Buscar en Movistar (por ejemplo: factura)';

    const btnCerrar = document.createElement('button');
    btnCerrar.setAttribute('id', 'boton-cerrar');
    const imgCerrar = document.createElement('img');
    imgCerrar.setAttribute('alt', 'cerrar'); 
    imgCerrar.setAttribute('src','https://www.movistar.com.ar/documents/10180/98129813/Cerrar.svg');

    //funcion que habilita el buscador Desktop
    function activarBuscadorDesktop() {
    //Modifico funciones asignadas
    lupaDesktop.removeEventListener('click', activarBuscadorDesktop);
    botonBuscar.addEventListener('click', buscarDesdeBoton);
    //Agrego y oculto componentes
    ocultarMenuItem()
    input.setAttribute('class', 'input-busqueda-desktop'); 
    input.setAttribute('class', 'input-active-desktop');
    input.setAttribute('id', 'input-busqueda-desktop');
    lupaDesktop.prepend(input);
    btnCerrar.appendChild(imgCerrar);
    lupaDesktop.appendChild(btnCerrar);
    input.focus();
    lupaDesktop.setAttribute('class', 'active-desktop');



    btnCerrar.addEventListener('click', function (event) {
        event.stopPropagation(); // Evita que el click siga subiendo
        desactivarBuscadorDesktop();
    });

    document.getElementById("input-busqueda-desktop").addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
        const termino = input.value.trim();
        if (termino !== '') {
            const urlCompleta = urlBuscador + encodeURIComponent(termino);
            window.location.href = urlCompleta; // Redirige a la nueva URL
        }
        }
    });

    }

    //funcion que deshabilita el buscador Desktop
    function desactivarBuscadorDesktop() {
    document.getElementById("input-busqueda-desktop").remove();
    document.getElementById("boton-cerrar").remove();
    lupaDesktop.addEventListener('click', activarBuscadorDesktop);
    mostrarMenuItem()
    lupaDesktop.classList.remove('active-desktop');
    }


    //funcion que habilita el buscador
    function activarBuscadorTablet() {
    //Modifico funciones asignadas 
    lupaTablet.removeEventListener('click', activarBuscadorTablet);
    botonBuscarTablet.addEventListener('click', buscarDesdeBoton);
    //Agrego componentes
    input.setAttribute('class', 'input-busqueda-tablet'); 
    input.setAttribute('class', 'input-active-tablet');
    input.setAttribute('id', 'input-busqueda-tablet');
    lupaTablet.prepend(input);
    btnCerrar.appendChild(imgCerrar);
    lupaTablet.appendChild(btnCerrar);
    input.focus(); 
    lupaTablet.setAttribute('class', 'active-tablet');


    btnCerrar.addEventListener('click', function (event) {
        event.stopPropagation(); // Evita que el click siga subiendo
        desactivarBuscadorTablet();
    });

    document.getElementById("input-busqueda-tablet").addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
        const termino = input.value.trim();
        if (termino !== '') {
            const urlCompleta = urlBuscador + encodeURIComponent(termino);
            window.location.href = urlCompleta; // Redirige a la nueva URL
        }
        }
    });

    }

    //funcion que deshabilita el buscador
    function desactivarBuscadorTablet() {
    document.getElementById("input-busqueda-tablet").remove();
    document.getElementById("boton-cerrar").remove();
    lupaTablet.addEventListener('click', activarBuscadorTablet);
    lupaTablet.classList.remove('active-tablet');
    }

    function buscarDesdeBoton() {
    const termino = input.value.trim();
    if (termino !== '') {
        const urlCompleta = urlBuscador + encodeURIComponent(termino);
        window.location.href = urlCompleta;
    }
    }
    function ocultarMenuItem() {
    const elementos = document.querySelectorAll('.menu-item');
    elementos.forEach(elemento => {
        elemento.style.display = 'none';
    });
    }

    function mostrarMenuItem() {
    const elementos = document.querySelectorAll('.menu-item');
    elementos.forEach(elemento => {
        elemento.style.display = 'flex';
    });
    }

    if (lupaTablet!==null){
        lupaDesktop.addEventListener('click', activarBuscadorDesktop);
        lupaTablet.addEventListener('click', activarBuscadorTablet);
    }
    /*****Megafono */
    const dataMegafonoList = document.querySelectorAll('.js__data-megafono');
    const itemCountList = document.querySelectorAll('.js__item-count');
    const modalContents = document.querySelectorAll('.modal__content');
    const openButtons = document.querySelectorAll('#open');
    const closeButtons = document.querySelectorAll('#close');

    const fetchCarrusel = async () => {
        try {
        const tab = 'MEGAFONO';
        const API__KEY = 'AIzaSyAIGduFVKPpfmSH5x4zHJXQHos211pHDeQ';
        const ID__SPREAD = '1zbapMW574ijOrX_AUEpeVyZfHAHiaEEa6mW-L8luxlk';
        const RANGO = `${tab}!A:E`;
        const URL__BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
        const url = `${URL__BASE}/${ID__SPREAD}/values/${RANGO}?key=${API__KEY}`;
        const resp = await fetch(url);
        const data = await resp.json();

        const dataArray = [];

        for (let x = 1; x < data.values.length; x++) {
            const item = {
            link_imagen: data.values[x][0],
            alt_imagen: data.values[x][1],
            titulo: data.values[x][2],
            bajada: data.values[x][3],
            enlace: data.values[x][4]
            };
            dataArray.push(item);
        }

        // Insertar los datos en todas las instancias del megáfono
        dataMegafonoList.forEach(dataContainer => {
            dataArray.forEach(item => {
            const card = document.createElement('a');
            card.href = item.enlace;
            card.setAttribute("aria-label", `${item.titulo} ${item.bajada}`)
            card.setAttribute("data-element-ga", "link")
            card.setAttribute("onclick", "dataLayer.push({'event': 'trackEvent', 'eventCategory': 'megafono_novedades', 'eventAction': 'click', 'eventLabel': 'megafono_internet_con_2_meses_gratis', 'eventValue': 1, 'eventNonInteraction': false})")
            card.classList.add('megafono__box');
            card.innerHTML = `
                <img class="icono" src="${item.link_imagen}" alt="${item.alt_imagen}">
                <div class="texto">
                <p class="titular">${item.titulo}</p>
                <span class="bajada">${item.bajada}</span>
                </div>
            `;
            dataContainer.appendChild(card);
            });
        });

        // Mostrar cantidad
        itemCountList.forEach(span => {
            span.textContent = data.values.length - 1;
        });

        } catch (error) {
        console.error('Error al obtener datos del carrusel:', error);
        }
    };

    // Ejecutar fetch una sola vez
    fetchCarrusel();

    // Abrir todos los modales al hacer click en cualquier "open"
    openButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        modalContents.forEach(modal => {
            modal.classList.remove('close');
            void modal.offsetWidth;
            modal.classList.add('open');
        });

        // Ocultar la cantidad de items despues de x segundos
        itemCountList.forEach(span =>  {
            setTimeout(() => { span.style.display = 'none'; }, 350)
        });
        });
    });

    // Cerrar al hacer click afuera
    document.addEventListener('click', (e) => {
        // ... para copiar el array original
        const isInsideMegafono = [...modalContents].some(modal => modal.contains(e.target));
        const isOpenBtn = [...openButtons].some(btn => btn.contains(e.target));
        if (!isInsideMegafono && !isOpenBtn) {
        modalContents.forEach(modal => {
            modal.classList.remove('open');
            modal.classList.add('close');
        });
        }
    });

    // Cerrar todos los modales al hacer click en cualquier "close"
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        modalContents.forEach(modal => {
            modal.classList.remove('open');
            modal.classList.add('close');
        });
        });
    });

    // Dropdowm Footer (Mobile)
    const jsItem = document.querySelectorAll('.js__item');
        
    jsItem.forEach(item => {
        item.addEventListener('click', function () {
            // Mostrar el que tiene verse
            this.classList.toggle('active');
            // Cerrar los demas
            jsItem.forEach(e => (e !== this) ? e.classList.remove('active') : null );
        });
    });
    }
    
    /*NAVBAR B2B*/
    /*****Menu */
    if($('#navbar-comar.b2b_navbar')) {

    /*****Megafono */
    const dataMegafonoList = document.querySelectorAll('.js__data-megafono-b2b');
    const itemCountList = document.querySelectorAll('.js__item-count.b2b');

    const fetchMegafono = async () => {
        try {
        const tab = 'MEGAFONO_B2B';
        const API__KEY = 'AIzaSyAIGduFVKPpfmSH5x4zHJXQHos211pHDeQ';
        const ID__SPREAD = '1zbapMW574ijOrX_AUEpeVyZfHAHiaEEa6mW-L8luxlk';
        const RANGO = `${tab}!A:E`;
        const URL__BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
        const url = `${URL__BASE}/${ID__SPREAD}/values/${RANGO}?key=${API__KEY}`;
        const resp = await fetch(url);
        const data = await resp.json();

        const dataArray = [];

        for (let x = 1; x < data.values.length; x++) {
            const item = {
            link_imagen: data.values[x][0],
            alt_imagen: data.values[x][1],
            titulo: data.values[x][2],
            bajada: data.values[x][3],
            enlace: data.values[x][4]
            };
            dataArray.push(item);
        }

        // Insertar los datos en todas las instancias del megáfono
        dataMegafonoList.forEach(dataContainer => {
            dataArray.forEach(item => {
            const card = document.createElement('a');
            card.href = item.enlace;
            card.setAttribute("aria-label", `${item.titulo} ${item.bajada}`)
            card.setAttribute("data-element-ga", "link")
            card.setAttribute("onclick", "dataLayer.push({'event': 'trackEvent', 'eventCategory': 'megafono_novedades', 'eventAction': 'click', 'eventLabel': 'megafono_internet_con_2_meses_gratis', 'eventValue': 1, 'eventNonInteraction': false})")
            card.classList.add('megafono__box');
            card.innerHTML = `
                <img class="icono" src="${item.link_imagen}" alt="${item.alt_imagen}">
                <div class="texto">
                <p class="titular">${item.titulo}</p>
                <span class="bajada">${item.bajada}</span>
                </div>
            `;
            dataContainer.appendChild(card);
            });
        });

        // Mostrar cantidad
        itemCountList.forEach(span => {
            span.textContent = data.values.length - 1;
        });

        } catch (error) {
        console.error('Error al obtener datos del carrusel:', error);
        }
    };

    // Ejecutar fetch una sola vez
    fetchMegafono();
    }

    /**CONTROL PARA MODALES **/
    $(document).on('click', '[data-toggle="modal"]', function (event) {
        event.preventDefault();   
        if (this.id === 'whatsapp') {
            if ($(this).hasClass('notification')) {
                $(this).removeClass('notification');
            }
        }
        $("form").not("#form-banner").each(function() {
            this.reset();
        });    
        const target = $(this).attr('data-target');
        // Buscar el modal dentro de la sección activa del multiproducto
        let modal = $('body > div[style*="display: block"]').find(target);
        // Si no se encuentra dentro de la tab activa, usar el global como fallback
        if (!modal.length) {
            modal = $(target);
        }
        //If para poner en el código descripción del modal el nombre del plan que tiene la card cuando es llamado desde el componente movi-tv-40
        if ($(this).closest('section').attr('id') === 'tv__con-todo') {
            modal.find('input[name="Codigo_Descripcion"]').val($(this).closest('.card').find('.titulo-card').text().trim())
        }
        
        const btnCerrar = modal.find('.close');
        const dataPlan = $(this).attr('data-plan');   
        const modalIC = modal.find('.ctc_loading');       
        if(dataPlan) {
            if(target === '#modal-digital') {
                modal.find('.modalMainTitle').html('Canales de Movistar TV Digital <br class="hidden-md hidden-lg"><span class="hidden-md hidden-lg gris-canales"> - 38 canales</span><p class="gris-canales hidden-xs">38 canales</p>');
                modal.find('.mejor-premium').hide();
                modal.find('.disney').hide(); // Si esta clase existe y debe ocultarse
                modal.find('.disney-espn').hide(); // Usamos .hide() en lugar de css('display','none') para consistencia
                modal.find('.grilla-digital').css('height','580px'); // Ajusta la altura para este caso
            } else {
                modal.find('.modalMainTitle').html('Canales de Movistar TV Max <br class="hidden-md hidden-lg"><span class="hidden-md hidden-lg gris-canales"> - 98 canales</span><p class="gris-canales hidden-xs">98 canales</p>');
                modal.find('.mejor-premium').hide();
                modal.find('.disney').hide(); // Si esta clase existe y debe ocultarse
                modal.find('.disney-espn').css('display','contents'); // Según tu script original, se mantiene 'contents'
                modal.find('.grilla-digital').css('height','580px'); // Ajusta la altura para este caso
            }
        } else {
            if(target === '#modal-digital' || target === '#modal-max') {
                if(target === '#modal-digital') {
                    modal.find('.modalMainTitle').html('Canales de Movistar TV Digital <br class="hidden-md hidden-lg"> con Disney+ Premium <span class="hidden-md hidden-lg gris-canales"> - 38 canales</span><p class="gris-canales hidden-xs">38 canales</p>');
                    modal.find('.mejor-premium').show();
                    modal.find('.disney').show(); // Si esta clase existe y debe mostrarse
                    modal.find('.disney-espn').hide(); // Según tu script original, en este caso también se ocultaba
                    modal.find('.grilla-digital').css('height','200px'); // Altura más pequeña con Disney+
                } else {
                    modal.find('.modalMainTitle').html('Canales de Movistar TV Max <br class="hidden-md hidden-lg"> con Disney+ Premium <span class="hidden-md hidden-lg gris-canales"> - 98 canales</span><p class="gris-canales hidden-xs">98 canales</p>');
                    modal.find('.mejor-premium').show();
                    modal.find('.disney').show(); // Si esta clase existe y debe mostrarse
                    modal.find('.disney-espn').css('display','contents'); // Según tu script original, se mantiene 'contents'
                    modal.find('.grilla-digital').css('height','200px'); // Altura más pequeña con Disney+
                }
            }
        }        
        modal.addClass('in');
        if (modal.find('.backdrop').length === 0) {
            const backdrop = $('<div class="backdrop"></div>');
            modal.prepend(backdrop);
            requestAnimationFrame(() => {
                backdrop.addClass('in');
            });
            backdrop.on('click', function () {
                modal.removeClass('in');
            });
        }
        btnCerrar.on('click', function() {
            modal.removeClass('in');
        })
    });


    if ($('#lp_whatsapp').length > 0) {
        $('.tab-container .tab').on('click', function () {
            // Botón clickeado
            let tabValue = $(this).attr('value');
            // Sacar "active" de todos los botones
            $('.tab-container .tab').removeClass('active');
            // Activar el botón clickeado
            $(this).addClass('active');
            // Ocultar todos los contenedores
            $('.tab-content').hide().removeClass('active');
            // Mostrar el contenido que va
            if (tabValue === 'tab1') {
                $('.tab-content.tab-1').show().addClass('active');
            } else if (tabValue === 'tab2') {
                $('.tab-content.tab-2').show().addClass('active');
            }
        });
    }

    if ($('.section_carrusel_banner').length > 0) { 
        let swiper = new Swiper('.js__carrusel-banner', {
            slidesPerView: 1,
            loop: true,
            /* centeredSlides: true, */
            navigation: {
                nextEl: ".section_carrusel_banner .slider-container .swiper-button-next",
                prevEl: ".section_carrusel_banner .slider-container .swiper-button-prev",
            },
            pagination: {
                el: ".section_carrusel_banner .slider-container .swiper-pagination",                    
                clickable: true,
                renderBullet: function (index, className) {
                return `
                    <span class="${className}">
                    <svg viewBox="0 0 36 36" class="circle">
                        <circle class="bg" cx="18" cy="18" r="15"/>
                        <circle class="progress" cx="18" cy="18" r="15"/>
                    </svg>
                    <span class="number">${index + 1}</span>
                    </span>
                `;
                },
            },
            autoplay: {
                delay: 4000, 
            },
            breakpoints: {
                992:{
                    centeredSlides: true,
                    spaceBetween: 20,
                }
            },             
        })  
    }

    if ($('.section_sticky_footer_container').length > 0) {
        const sticky = document.querySelector('.section_sticky_footer_container');
        sticky.style.display = 'none';
    
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const width = window.innerWidth;
            const height = document.documentElement.scrollHeight;

            if ((scrolled >= 1070 && width > 992) || (scrolled >= 1100 && width <= 992) || height <= 1450) {
                sticky.style.display = 'block';
            } else {
                sticky.style.display = 'none';
            }
        });
    }

    if ($('#sticky-footer-0800-modal-b2b').length > 0) {
        const sticky_b2b = document.querySelector('#sticky-footer-0800-modal-b2b');
        sticky_b2b.style.display = 'block';

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled >= 0) { sticky_b2b.style.display = 'block'; } 
        });
    }

    // Tooltip terminales
    if ($('.section_planes_movistar.section_terminales').length > 0) {

        const botonesCupon = document.querySelectorAll('.section_planes_movistar.section_terminales .cupon');
        window.globalSVGCopy = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.72098 4.06808H12.4848C13.0207 4.06808 13.4577 4.50505 13.4558 5.041V12.4845C13.4558 13.0205 13.0207 13.4574 12.4829 13.4574H5.04125C4.5053 13.4574 4.06832 13.0205 4.06832 12.4845V9.72261H1.34003C0.78541 9.72261 0.333496 9.27069 0.333496 8.71607V1.33979C0.333496 0.783299 0.783543 0.333252 1.33816 0.333252H8.71445C9.26907 0.333252 9.72098 0.783299 9.72098 1.33979V4.06808ZM1.18317 8.71607V1.33979C1.18317 1.25389 1.25413 1.18293 1.34003 1.18293H8.71445C8.80035 1.18293 8.87131 1.25389 8.87131 1.33979V8.71607C8.87131 8.80197 8.80035 8.87294 8.71445 8.87294H1.33816C1.25226 8.87107 1.18317 8.80197 1.18317 8.71607ZM12.608 12.4845C12.608 12.5536 12.552 12.6078 12.4848 12.6078H5.04311C4.97402 12.6078 4.91986 12.5517 4.91986 12.4845V9.72074H8.71632C9.27094 9.72074 9.72285 9.26883 9.72285 8.7142V4.91775H12.4848C12.5539 4.91775 12.608 4.97191 12.608 5.041V12.4845Z" fill="#313235"/></svg>`;
        window.globalSVGCopied = `<svg width="14.67" height="14.67" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.99787 15.3333C5.66767 15.3333 3.85576 14.7253 2.61229 13.5259C1.32075 12.2826 0.666626 10.4249 0.666626 8.00313C0.666626 5.58132 1.32075 3.72161 2.61229 2.47623C3.85576 1.27682 5.66976 0.666664 7.99787 0.666664C10.3281 0.666664 12.14 1.27473 13.3855 2.47414C14.6792 3.71952 15.3333 5.57923 15.3333 8.00104C15.3333 10.4228 14.6771 12.2805 13.3855 13.5259C12.14 14.7253 10.3281 15.3333 7.99787 15.3333ZM7.99787 1.47951C3.67185 1.47951 1.47749 3.67355 1.47749 8.00313C1.47749 12.3285 3.67185 14.5226 7.99787 14.5226C12.326 14.5226 14.5224 12.3285 14.5224 8.00313C14.5224 3.67564 12.326 1.47951 7.99787 1.47951ZM6.6311 11.0936C6.70424 11.1855 6.81501 11.2378 6.93204 11.2378H6.9404C7.05952 11.2357 7.17028 11.1793 7.24134 11.0832L11.5423 5.32431C11.6698 5.15505 11.6342 4.91475 11.465 4.78729C11.2957 4.65983 11.0553 4.69535 10.9279 4.8646L6.92159 10.2264L5.26224 8.14104C5.13058 7.97597 4.88815 7.9488 4.72305 8.08045C4.55795 8.21209 4.53078 8.45448 4.66245 8.61955L6.6311 11.0936Z" fill="#313235"/></svg>`;

        botonesCupon.forEach((boton) => {

            boton.addEventListener('mouseenter', (e) => {
                const tooltipText = e.target.closest('.box-container-description').querySelector('.tooltip__text');
                if (tooltipText) tooltipText.style.opacity = '1';
            });

            boton.addEventListener('mouseleave', (e) => {
                const tooltipText = e.target.closest('.box-container-description').querySelector('.tooltip__text');
                if (tooltipText) {
                    tooltipText.style.opacity = '0';
                    setTimeout(() => { tooltipText.innerHTML = 'Copiar cupón'; }, 300);
                }
            });

            boton.addEventListener('click', (e) => {
                const cuponSpan = e.currentTarget.querySelector('span');
                const cuponIcon = e.currentTarget.querySelector('svg');

                if (cuponSpan) {
                    navigator.clipboard.writeText(cuponSpan.textContent.trim());
                }

                const tooltipText = e.currentTarget.closest('.box-container-description').querySelector('.tooltip__text');
                if (tooltipText) tooltipText.textContent = 'Copiado';

                if (cuponIcon) cuponIcon.innerHTML = globalSVGCopied;

                setTimeout(() => {
                    if (cuponIcon) cuponIcon.innerHTML = globalSVGCopy;
                }, 2500);
            });
        });
    }
    
    // Control para mostrar/ocultar detalles en carrousel de cards de planes
    if ($('.carrousel-principal__box .box__white .js__toggle-detalles').length > 0){
        const DURATION = 350; // ms

            function slideDown(el) {
                el.classList.remove('is-collapsed');
                el.style.display = 'block';
                const height = el.scrollHeight; // altura total

                // Estado inicial: height 0 y opacity 0
                el.style.height = '0px';
                el.style.opacity = '0';
                el.style.overflow = 'hidden';
                el.offsetHeight; // reflow forzado

                // Transición al estado visible
                el.style.transition = `height ${DURATION}ms ease, opacity ${DURATION}ms ease`;
                el.style.height = height + 'px';
                el.style.opacity = '1';

                el.addEventListener('transitionend', function tidy(e) {
                if (e.propertyName !== 'height') return;
                el.style.transition = '';
                el.style.height = 'auto'; 
                el.style.overflow = '';
                el.removeEventListener('transitionend', tidy);
                });
            }
            function slideUp(el) {
                const height = el.scrollHeight; 
                el.style.height = height + 'px';
                el.style.opacity = '1';
                el.offsetHeight; 
                el.style.transition = `height ${DURATION}ms ease, opacity ${DURATION}ms ease`;
                el.style.height = '0px';
                el.style.opacity = '0';
                el.style.overflow = 'hidden';

                el.addEventListener('transitionend', function tidy(e) {
                if (e.propertyName !== 'height') return;
                el.style.transition = '';
                el.style.display = 'none';
                el.classList.add('is-collapsed');
                el.removeEventListener('transitionend', tidy);
                });
            }

            // Escucha clics en cualquier .js__toggle-detalles
            document.addEventListener('click', function (e) {
                const btn = e.target.closest('.js__toggle-detalles');
                if (!btn) return;
                const boxWhite = btn.closest('.box__white');
                const panel = boxWhite ? boxWhite.querySelector('.beneficios-v2') : null;
                if (!panel) return;

                const texto = btn.querySelector('span');

                const isCollapsed = panel.classList.contains('is-collapsed');

                if (isCollapsed) {
                slideDown(panel);
                texto.textContent = 'Ocultar detalles';
                texto.classList.replace('chevron-down', 'chevron-up');
            } else {
                slideUp(panel);
                texto.textContent = 'Mostrar detalles';
                texto.classList.replace('chevron-up', 'chevron-down');
                }
            });
    }

    /****** UNIVERSAL COLLAPSE  ******/
    (function initUniversalCollapseV2() {
        const DEFAULT_DURATION = 280;
        const DEFAULT_EASING = 'ease';

        const prefersReducedMotion = () =>
            window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const isMobileByBreakpoint = (btnEl) => {
            const bpAttr = btnEl.getAttribute('data-ui-breakpoint');
            const bp = bpAttr ? parseInt(bpAttr, 10) : 992; // default
            return window.innerWidth < bp;
        };

        const parseTargets = (btnEl) => {
            const raw = (btnEl.getAttribute('data-ui-collapse') || '').trim();
            if (!raw) return [];
            return raw
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
        };

        const resolvePanelsInScope = (btnEl, names) => {
            const scope = btnEl.closest('[data-ui-scope]');
            if (!scope) return [];

            const out = [];
            for (const name of names) {
                const safe = window.CSS && CSS.escape ? CSS.escape(name) : name.replace(/"/g, '\\"');
                const panel = scope.querySelector(`[data-ui-collapse-panel="${safe}"]`);
                if (panel) out.push(panel);
            }
            return out;
        };

        const getPanelState = (panelEl) => (panelEl.getAttribute('data-ui-collapsed') || 'true') === 'true';
        const setPanelState = (panelEl, collapsed) => panelEl.setAttribute('data-ui-collapsed', collapsed ? 'true' : 'false');

        const setBtnState = (btnEl, isOpen, firstPanelEl) => {
            btnEl.setAttribute('aria-expanded', String(isOpen));

            if (firstPanelEl) {
                if (!firstPanelEl.id) {
                    firstPanelEl.id = 'ui-collapse-' + Math.random().toString(36).slice(2, 10);
                }
                btnEl.setAttribute('aria-controls', firstPanelEl.id);
            }
        };

        const slideDown = (el, duration) => {
            if (prefersReducedMotion()) {
                el.style.display = 'block';
                el.style.height = '';
                el.style.opacity = '';
                el.style.overflow = '';
                el.style.transition = '';
                setPanelState(el, false);
                return;
            }

            el.style.display = 'block';
            el.style.overflow = 'hidden';
            el.style.height = '0px';
            el.style.opacity = '0';

            el.offsetHeight;

            const h = el.scrollHeight;
            el.style.transition = `height ${duration}ms ${DEFAULT_EASING}, opacity ${duration}ms ${DEFAULT_EASING}`;
            el.style.height = h + 'px';
            el.style.opacity = '1';

            const tidy = (e) => {
                if (e.propertyName !== 'height') return;
                el.style.transition = '';
                el.style.height = 'auto';
                el.style.overflow = '';
                el.removeEventListener('transitionend', tidy);
            };
            el.addEventListener('transitionend', tidy);

            window.setTimeout(() => {
                if (el.style.height !== 'auto' && getPanelState(el) === false) {
                    el.style.transition = '';
                    el.style.height = 'auto';
                    el.style.overflow = '';
                }
            }, duration + 60);

            setPanelState(el, false);
        };

        const slideUp = (el, duration) => {
            if (prefersReducedMotion()) {
                el.style.display = 'none';
                el.style.height = '';
                el.style.opacity = '';
                el.style.overflow = '';
                el.style.transition = '';
                setPanelState(el, true);
                return;
            }

            const h = el.scrollHeight;
            el.style.overflow = 'hidden';
            el.style.height = h + 'px';
            el.style.opacity = '1';
            el.offsetHeight;
            el.style.transition = `height ${duration}ms ${DEFAULT_EASING}, opacity ${duration}ms ${DEFAULT_EASING}`;
            el.style.height = '0px';
            el.style.opacity = '0';

            const tidy = (e) => {
                if (e.propertyName !== 'height') return;
                el.style.transition = '';
                el.style.display = 'none';
                el.style.height = '';
                el.style.opacity = '';
                el.style.overflow = '';
                el.removeEventListener('transitionend', tidy);
            };
            el.addEventListener('transitionend', tidy);

            window.setTimeout(() => {
                if (el.style.display !== 'none' && getPanelState(el) === true) {
                    el.style.transition = '';
                    el.style.display = 'none';
                    el.style.height = '';
                    el.style.opacity = '';
                    el.style.overflow = '';
                }
            }, duration + 60);

            setPanelState(el, true);
        };

        const closeOtherPanelsInGroup = (btnEl, keepPanelNames = []) => {
            const scope = btnEl.closest('[data-ui-scope]');
            if (!scope) return;

            const group = (btnEl.getAttribute('data-ui-group') || '').trim();
            const btnSelector = group
                ? `[data-ui-collapse-btn][data-ui-group="${(window.CSS && CSS.escape) ? CSS.escape(group) : group}"]`
                : `[data-ui-collapse-btn]`;

            const allBtns = Array.from(scope.querySelectorAll(btnSelector));

            for (const otherBtn of allBtns) {
                if (otherBtn === btnEl) continue;

                const targets = parseTargets(otherBtn);
                const panels = resolvePanelsInScope(otherBtn, targets);

                for (let i = 0; i < panels.length; i++) {
                    const panel = panels[i];
                    const name = panel.getAttribute('data-ui-collapse-panel');
                    if (keepPanelNames.includes(name)) continue;

                    if (!getPanelState(panel)) {
                        slideUp(panel, DEFAULT_DURATION);
                    }
                }
                setBtnState(otherBtn, false, panels[0] || null);
            }
        };

        document.querySelectorAll('[data-ui-collapse-panel]').forEach((panel) => {
            const isOpen = panel.getAttribute('data-ui-collapsed') === 'false';
            panel.style.display = isOpen ? 'block' : 'none';
            if (!panel.hasAttribute('data-ui-collapsed')) {
                panel.setAttribute('data-ui-collapsed', isOpen ? 'false' : 'true');
            }
        });

        document.querySelectorAll('[data-ui-collapse-btn]').forEach((btn) => {
            const targets = parseTargets(btn);
            const panels = resolvePanelsInScope(btn, targets);
            const isOpen = panels.length ? panels.some(p => !getPanelState(p)) : false;
            setBtnState(btn, isOpen, panels[0] || null);
        });

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-ui-collapse-btn]');
            if (!btn) return;

            e.preventDefault();

            const durationAttr = btn.getAttribute('data-ui-duration');
            const duration = durationAttr ? parseInt(durationAttr, 10) : DEFAULT_DURATION;

            const targets = parseTargets(btn);
            if (!targets.length) return;

            const panels = resolvePanelsInScope(btn, targets);
            if (!panels.length) return;

            for (const p of panels) {
                if (p.__uiLock) return;
            }
            panels.forEach(p => { p.__uiLock = true; setTimeout(() => (p.__uiLock = false), duration + 80); });

            const anyOpen = panels.some(p => !getPanelState(p));
            const willOpen = !anyOpen;

            const accordion = (btn.getAttribute('data-ui-accordion') || '').trim() === 'true';
            const autoCloseMobile = (btn.getAttribute('data-ui-autoclose-mobile') || '').trim() === 'true';
            const shouldAutoCloseNow = autoCloseMobile ? isMobileByBreakpoint(btn) : false;

            if (willOpen && (accordion || shouldAutoCloseNow)) {
                closeOtherPanelsInGroup(btn, targets);
            }

            for (const panel of panels) {
                if (willOpen) slideDown(panel, duration);
                else slideUp(panel, duration);
            }

            const nowAnyOpen = willOpen; 
            setBtnState(btn, nowAnyOpen, panels[0] || null);
        });
    })();

    if ($('#lead').length > 0) {
        // Detectar elementos del formulario
        const form = document.getElementById('hidden-modal');
        const nombreInput = document.getElementById('nombreC2C');
        const telefonoInput = document.getElementById('ani2');
        const emailInput = document.getElementById('emailC2C');
        const checkbox = document.getElementById('checkC2C');
        const submitButton = form.querySelector('.form-ic-c2c-submit');
        
        // Deshabilitar el botón inicialmente
        submitButton.disabled = true;
        
        // Función para validar el formulario
        function validarFormulario() {
        const nombreValido = nombreInput.value.trim() !== '';
        const telefonoValido = telefonoInput.value.trim() !== '';
        const emailValido = emailInput.value.trim() !== '';
        const checkboxValido = checkbox.checked;
        // Habilitar/deshabilitar submit según validación
        if (nombreValido && telefonoValido && emailValido && checkboxValido) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
        }
        
        // Escuchar cambios en todos los campos
        nombreInput.addEventListener('input', validarFormulario);
        telefonoInput.addEventListener('input', validarFormulario);
        emailInput.addEventListener('input', validarFormulario);
        checkbox.addEventListener('change', validarFormulario);

        const intervalo = setInterval( () => {
            const tituloModal = document.querySelector('section .modal.fade.in .modal-dialog .modal-content .ctc_loading .content-lead-ok .title-content-lead-ok')
            const subtituloModal = document.querySelectorAll('section .modal.fade.in .modal-dialog .modal-content .ctc_loading .content-lead-ok .subtitle-content-lead-ok')
            const botonAceptar = document.querySelector('section .modal.fade.in .modal-dialog .modal-content .ctc_loading .content-lead-ok .btn-aceptar')
            
            if (tituloModal && subtituloModal && botonAceptar) {
                tituloModal.innerHTML = 'En breve vas a recibir las mejores promos'
                
                subtituloModal.forEach(subtitulo => {
                    subtitulo.innerHTML = ''
                })
                
                botonAceptar.addEventListener('click', () => {
                    console.log('Se puede redirigir')
                    
                    if (window.location.href.includes('empresas')) {
                        window.location.href = 'https://tienda.movistarempresas.com.ar/'
                    } else {
                        window.location.href = 'https://tiendaonline.movistar.com.ar/'
                    }
                })
                
                clearInterval(intervalo) // Se frena el intervalo una vez se detecte el cambio
            }
            
        }, 100)

        // Cambia el banner de la derecha
        if(window.location.href.includes('empresas')) {
            let contenidoBanner = document.querySelector('#lead .der .contenido')
            contenidoBanner.classList.add('b2b')
        }
    }

    // Traer y mostrar los equipos para los lanzaminetos de Samsung
    if ($('#catalogo').length > 0) {
        const fetchEquipos = async () => {
            const tab = 'LIVE_SAMSUNG'
            const API__KEY = 'AIzaSyBJmg-XpmLPJC1pc_ee-3EHSfgC0gGn-mg'
            const ID__SPREAD = '164v9hHlg61q3ucfBdtpJG5N_ng8WfscG9appmSeKXTw'
            const RANGO = `${tab}!A:M`
            const URL__BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
            const url = `${URL__BASE}/${ID__SPREAD}/values/${RANGO}?key=${API__KEY}`
        
            const resp = await fetch(url)
            const data = await resp.json()
        
            data.values.shift();
        
            const arrEquipos = [];
        
            data.values.map((item) => {
                item = {
                    enlaces: {
                        tienda: item[9],
                        tienda_b2b: item[10],
                        imagen: item[11]
                    },
                    equipo: {
                        marca: item[0],
                        modelo: item[1],
                        masinfo: item[2],
                        mostrar: item[11]
                    },
                    precio: {
                        completo: item[3],
                        tachado: item[4],
                        off: item[5],
                        cuotas: item[6],
                        valor_cuota: item[7],
                        sin_impuestos: item[8],
                    },
                    extra: {
                        tag_bold: 'Exclusivo online',
                    }
                }
                arrEquipos.push(item)
            })
        
            console.log(arrEquipos);
        
            const contenedorEquipos = document.querySelector('#catalogo')
        
            const dibujarEquipo = (obj) => {
                const equipo = document.createElement('a')
                equipo.className = `card__box js__${obj.id}`
                equipo.href = obj.enlaces.tienda 
                
                // Condicionales para B2B
                if(window.location.href.includes('empresas')) {
                    equipo.href = obj.enlaces.tienda_b2b

                    const tiendaB2B = document.querySelector('.links .tienda')
                    tiendaB2B.href = 'https://tienda.movistarempresas.com.ar/'
                }
        
                let fullEquipo = `${obj.equipo.marca} ${obj.equipo.modelo} ${obj.equipo.masinfo}`
        
                equipo.setAttribute('data-element-ga', 'product');
                equipo.setAttribute('data-ga-business-team', 'terminales');
                equipo.setAttribute('data-ga-business-mod', 'b2c');
                equipo.setAttribute('data-ga-product-comercial_name', fullEquipo);
                equipo.setAttribute('data-ga-product-comercial_id', fullEquipo);
        
                equipo.innerHTML = `
                <img src="${obj.enlaces.imagen}" class="picture" alt="${fullEquipo}" loading="lazy">
        
                <div class="contenido">
                    <div class="cucardas">
                        <!-- <p class="bold">${obj.extra.tag_bold}</p> -->
                        <p class="light">${obj.precio.cuotas} cuotas sin interés</p>
                    </div>
                    <div class="description">
                        <h3 class="titulo">
                            <p class="marca">${obj.equipo.marca}</p>
                            <p class="equipo">${obj.equipo.modelo}</p>
                            <p class="parrafo">${obj.equipo.masinfo}</p>
                        </h3>
                        <div class="precio">
                            <p class="tachado">$${obj.precio.tachado}</p>
                            <p class="actual">$${obj.precio.completo}
                                <span class="off">${obj.precio.off}% off</span>
                            </p>
                            <span class="cuotas">Hasta ${obj.precio.cuotas} cuotas sin interés de $${obj.precio.valor_cuota}</span>
                            <div class="no_imp-cont">
                                <span class="sin_impuestos">Precio sin impuestos nacionales: $${obj.precio.sin_impuestos}</span>
                            </div>
                        </div>
                    </div>
                    </div>
                `
        
                contenedorEquipos.appendChild(equipo)
        
                if(obj.precio.off == '' || obj.precio.off == '0') {
                    const descuento = document.querySelector(`.js__${obj.id} .contenido .off`)
                    const precio_tachado = document.querySelector(`.js__${obj.id} .contenido .tachado`)
        
                    descuento.style.display = 'none'
                    precio_tachado.style.display = 'none'
                }

                if(obj.equipo.mostrar == 'no') {
                    let card = document.querySelector(`.js__${obj.id}`)
                    card.style.display = 'none'
                }
            }
        
            arrEquipos.forEach((e, index) => {
                Object.assign(e, { id: index })
                dibujarEquipo(e)
            })
        }
        
        setTimeout(fetchEquipos(), 500)
    }



/* =================================
    Funcionamiento Menú Lps legales 
   ================================= */

// normaliza href para comparar por ruta
function normalize(href) {
    const a = document.createElement('a');
    a.href = href;
    let path = a.pathname.replace(/\/+$/, '');
    if (path === '') path = '/';
    return a.protocol + '//' + a.host + path;
}

// detecta el item activo
function syncSelectedItem() {
    // detectar activo por URL y marcarlo en el <a>
    const current = normalize(window.location.href);
    let $deskActive = $();

    $('.menu-legales-list-desk .menu-legales-item a').each(function () {
        const href = $(this).attr('href');
        if (href && normalize(href) === current) {
            $deskActive = $(this).closest('.menu-legales-item');
            return false;
        }
    });

    if ($deskActive.length === 0) {
        $deskActive = $('.menu-legales-list-desk .menu-legales-item').first();
    }
    if ($deskActive.length === 0) return;

    $('.menu-legales-list-desk .menu-legales-item a').removeClass('active');
    $deskActive.find('a').addClass('active');

    const value = $deskActive.data('value');

    // busca el <li> wn mobile
    const $mobileOption = $('.menu-legales-option[data-value="' + value + '"]');

    // is-selected
    $('.menu-legales-option').removeClass('is-selected').attr('aria-selected', 'false');
    $mobileOption.addClass('is-selected').attr('aria-selected', 'true');

    // Setear texto del botón
    const text = $.trim($mobileOption.find('a').text());
    $('.js__menu-legales-button-text').text(text);
}


// abre y cierra el dropdown
$(document).on('click', '.js__menu-legales-button', function () {
    const $wrap = $(this).closest('.js__menu-legales');
    const $label = $wrap.find('.js__menu-legales-button-text');

    $wrap.toggleClass('active');
    $label.toggleClass('active');
});


// actualiza selección + texto
$(document).on('click', '.menu-legales-option', function () {
    const $opt = $(this);
    const value = $opt.data('value');
    const text = $.trim($opt.find('a').text());
    const $wrap = $opt.closest('.js__menu-legales');

    $('.menu-legales-option').removeClass('is-selected').attr('aria-selected', 'false');
    $opt.addClass('is-selected').attr('aria-selected', 'true');

    $wrap.find('.js__menu-legales-button-text').text(text);

    // (NUEVO) sincroniza el activo en desktop moviendo .active al <a> correspondiente
    const $deskItem = $('.menu-legales-list-desk .menu-legales-item[data-value="' + value + '"]').first();
    if ($deskItem.length) {
        $('.menu-legales-list-desk .menu-legales-item a').removeClass('active');
        $deskItem.find('a').addClass('active');
    }

    $wrap.removeClass('active');
    $wrap.find('.js__menu-legales-button-text').removeClass('active');
});


// click afuera cierra dropdown
$(document).on('click', function (e) {
    const $t = $(e.target);
    if (!$t.closest('.js__menu-legales').length) {
        $('.js__menu-legales').removeClass('active');
        $('.js__menu-legales .js__menu-legales-button-text').removeClass('active');
    }
});


// sincronizar desktop con mobile
$(function () {
    syncSelectedItem();
});


/* ================================
   Administracion de legales ofertas.movistar
   ================================ */

function getQueryParam(name) {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(name);

  console.log("🟡 [getQueryParam] URL:", url.href);
  console.log(`🟡 [getQueryParam] Param "${name}":`, value);

  return value !== null ? value.trim() : null;
}

/**
 * Devuelve el wrapper padre: el section.js__comp-kenos
 */
function getKenosWrapperByInnerId(innerId) {
  console.log("🔵 [getKenosWrapperByInnerId] Buscando innerId:", innerId);

  const inner = document.getElementById(innerId);
  console.log("   ↳ inner encontrado:", !!inner);

  if (!inner) {
    console.warn("⚠️ No existe elemento con id:", innerId);
    return null;
  }

  const wrapper = inner.closest("section.js__comp-kenos");
  console.log("   ↳ wrapper .js__comp-kenos encontrado:", !!wrapper, wrapper);

  return wrapper;
}

function showKenosWrapperByInnerId(innerId) {
  console.log("🟢 [showKenosWrapperByInnerId] Intentando mostrar:", innerId);

  const wrapper = getKenosWrapperByInnerId(innerId);

  if (!wrapper) {
    console.warn("⚠️ No se pudo mostrar. Wrapper no encontrado.");
    return false;
  }

  console.log("   ↳ Removiendo display none de:", wrapper);
  wrapper.style.display = ""; // elimina display:none

  console.log("   ↳ Classes actuales:", wrapper.className);

  return true;
}

function hideKenosWrapperByInnerId(innerId) {
  console.log("🔴 [hideKenosWrapperByInnerId] Intentando ocultar:", innerId);

  const wrapper = getKenosWrapperByInnerId(innerId);

  if (!wrapper) {
    console.warn("⚠️ No se pudo ocultar. Wrapper no encontrado.");
    return false;
  }

  console.log("   ↳ Agregando display none a:", wrapper);
  wrapper.style.display = "none";

  console.log("   ↳ Classes actuales:", wrapper.className);

  return true;
}

window.addEventListener("load", () => {
  console.log("✅ [window.load] Página completamente cargada");

  const targetInnerId = getQueryParam("legal");
  console.log("🔵 Target recibido:", targetInnerId);

  if (targetInnerId) {
    console.log("🟣 Hay parámetro → oculto menú y muestro detalle");

    const hideResult = hideKenosWrapperByInnerId("legales");
    const showResult = showKenosWrapperByInnerId(targetInnerId);

    console.log("   ↳ Resultado ocultar menú:", hideResult);
    console.log("   ↳ Resultado mostrar detalle:", showResult);

  } else {
    console.log("🟠 No hay parámetro → muestro menú");
    showKenosWrapperByInnerId("legales");
  }
});


    /*********A PARTIR DE ACÁ PARA ABAJO NO DEBEN PONERSE OTRAS FUNCIONES, ESTO DEBE SER LO ÚLTIMO DE LAS LÍNEAS DE CÓDIGO */
    /**Atributo loading = lazy para las imagenes */
    const lazyImg = () => {
        const imagenes = document.querySelectorAll('img');
        imagenes.forEach(imagen => imagen.setAttribute('loading', 'lazy'));
    }
    lazyImg();
    /*Hace visible el DOM una vez que tiene todo cargado */
    $('body').css('opacity','1'); 

});
    