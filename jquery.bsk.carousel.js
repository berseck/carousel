/**
 * author Thiago de Oliveira Cruz
 */
(function ($) {
    'use strict';
    var defaults = {
        id: '.carousel',
        slides: '> img',
        next: '.slideNext',
        prev: '.slidePrev',
        pager: '',
        pagerClicable: false,
        pagerBullet: '.slideBullet',
        visible: 1,
        slidesPerMove: 1,
        width: '',
        height: '',
        fx: 'carousel',
        timeout: 400,
        currentSlider: 0
    };

    var fxWidth = Number();
    var fxHeight = Number();
    var fx = Number();
    var isAnimating = false;
    var direction = null;
    var hasLoaded = false;
    var timeout = 0;
    var _self;

    $.fn.Carousel = function (o) {
        var instance;

        if (typeof o == 'string') {
            if (!(instance = $(this).data('Carousel'))) {
                $.error('O plugin ainda não foi instanciado para este elemento.');
                return false;
            }
            if (typeof instance[o] != 'function') {
                $.error('O método Carousel.' + o + ' não existe.');
                return false;
            }
            return instance[o].apply(instance, Array.prototype.slice(arguments, 1));
        }
        
        instance = new Carousel(this, $.extend({}, defaults, $.isPlainObject(o) ? o : {}));
        $(this).data('Carousel', instance);
    };
    
    // a classe em si
    function Carousel(element, cfg) {
        this.element = element;
        element.config = cfg;
        init(element);
    }

    function init(element) {
        element.config.id = element;
        element.config.slidesNum = (element.config.visible) ? element.config.visible : element.find(element.config.slides).length;
        element.config.width = parseInt((element.config.width !== '') ? element.config.width : $(element.config.id).find(element.config.slides).eq(0).innerWidth());
		element.config.total = element.find(element.config.slides).length;
        fxWidth = (element.config.width !== '') ? parseInt(element.config.width) * $(element.config.id).find(element.config.slides).length : parseInt(element.find(element.config.slides).eq(0).innerWidth() * element.find(element.config.slides).length);
        element.config.height = fxHeight = element.find(element.config.slides).eq(0).innerHeight();
        fx = '.' + element.config.fx;
        timeout = element.config.timeout;
        
    	element.config.carousel = $("<div class='" + element.config.fx + "'></div>");
    	var parent = element.parent();
    	$(parent).prepend(element.config.carousel);
    	$(element.config.carousel).prepend(element);

        $(element.config.carousel).css({
            position: 'relative',
            overflow: 'hidden',
            width: element.config.slidesNum * parseInt(element.config.width),
            height: fxHeight
        });
        element.css({width: fxWidth, position: 'absolute', left: 0, top: 0});


        $(element.config.next).on('click', function(e){
            e.preventDefault();
            next(element);
        });
        $(element.config.prev).on('click', function(e){
            e.preventDefault();
            prev(element);
        });

        element.css({
            "-o-transition": "left " + element.config.timeout + "ms linear",
            "-moz-transition": "left " + element.config.timeout + "ms linear",
            "-webkit-transition": "left " + element.config.timeout + "ms linear",
            "transition": "left " + timeout + "ms linear"
        });

        slidesLoaded(element);
        updateSlides(element);
    }
    function slidesLoaded(element) {
        $(element.config.carousel).css({
            position: 'relative',
            overflow: 'hidden',
            width: element.config.visible * parseInt(element.config.width),
            height: element.config.height
        });
        $(element.config.id).css({width: element.config.total * element.config.width, position: 'absolute', left: 0, top: 0});

        if (element.config.pager !== '') {
            createPagerMenu(element);
        }
        element.hasLoaded = true;
        beforeSlide(element);
        updateSlides(element);
    }
    function next(element) {
        direction = 'right';
        beforeSlide(element);
        var left = $(element.config.id).position().left;
        var max = -($(element.config.id).width() - element.config.width * element.config.slidesNum);
        if (left > max) {
            if (isAnimating === false) {
                isAnimating = true;
                $(element.config.id).css({
                    left: "-=" + element.config.width * element.config.slidesToMove
                });
                setTimeout(function () {
                    element.config.currentSlider++;
                    isAnimating = false;
                    updateSlides(element);
                }, timeout + 50);
            }
        }
    }
    function prev(element) {
        direction = 'left';
        beforeSlide(element);
        var left = $(element.config.id).position().left;

        if (left < 0) {
            if (isAnimating === false) {
                isAnimating = true;
                $(element.config.id).css({
                    left: "+=" + element.config.width * element.config.slidesToMove
                });
                setTimeout(function () {
                    element.config.currentSlider--;
                    isAnimating = false;
                    updateSlides(element);
                }, timeout + 50);
            }
        }
    }
    function updateSlides(element) {
        var toMove = element.config.width * element.config.visible;
        $(element.config.id).find(element.config.slides).each(function (i, e) {
        	var sl = e.getBoundingClientRect().left - $(element.config.carousel).offset().left;
            if (sl >= 0 && sl < toMove) {
                $(e).addClass('slide-visible');
            } else {
                $(e).removeClass('slide-visible');
            }
        });
        $(element.config.pager).find(element.config.pagerBullet).removeClass('selected');
        $(element.config.pager).find(element.config.pagerBullet).eq(element.config.currentSlider).addClass('selected');
    }
    function beforeSlide(element) {
        if (direction === 'right') {
            if ($(element.config.carousel).find('.slide-visible').eq(element.config.visible - 1).nextUntil().length < element.config.slidesPerMove) {
                element.config.slidesToMove = $(element.config.carousel).find('.slide-visible').eq(element.config.visible - 1).nextUntil().length;
            } else {
                element.config.slidesToMove = element.config.slidesPerMove;
            }
        } else if (direction === 'left') {
            if ($(element.config.carousel).find('.slide-visible').eq(0).prevUntil().length < element.config.slidesPerMove) {
                element.config.slidesToMove = $(element.config.carousel).find('.slide-visible').eq(0).prevUntil().length;
            } else {
                element.config.slidesToMove = element.config.slidesPerMove;
            }
        }
    }
    function createPagerMenu(element) {
        var items = $(element.config.id).find(element.config.slides).length;
        var total = 1 + Math.ceil((items - element.config.visible) / element.config.slidesPerMove);
        if($(element.config.pager).find(element.config.pagerBullet).length === 0){
            for (var i = 0; i < total; i++) {
                var page = $('<span><a href="javascript://">&bull;</a></span>');
                var bullet = element.config.pagerBullet.replace('.', '');
                page.addClass(bullet);
                if (i === 0)
                    page.addClass('selected');

                $(element.config.pager).append(page);
            }
        }
        if (element.config.pagerClicable) {
            $(element.config.pager).find(element.config.pagerBullet).on('click', function (e) {
                if (isAnimating === false) {
                    $(element.config.pager).find(element.config.pagerBullet).removeClass('selected');
                    $(this).addClass('selected');
                    element.config.currentSlider = $(this).index();
                    var toMove = 0;
                    if (items % element.config.visible > 0 && $(this).index() === (total - 1)) {
                        var resto = items % element.config.visible;
                        if (resto === 1) resto = items - element.config.visible;
                        else resto = items - element.config.visible;
                        toMove = -(element.config.width * resto);
                    } else {
                        toMove = -(element.config.width * (element.config.slidesPerMove * $(this).index()));
                    }
                    isAnimating = true;
                    $(element.config.id).css({
                        left: toMove
                    });
                    setTimeout(function () {
                        isAnimating = false;
                        updateSlides(element);
                    }, timeout + 100);
                }
            });
        }
    }
})(jQuery);