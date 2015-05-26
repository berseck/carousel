(function ($) {
    var defaults = {
        id              :   '.mycycle',
        slides          :   '> img',
        next            :   '.slideNext',
        prev            :   '.slidePrev',
        pager           :   '',
        pagerClicable   :   false,
        pagerBullet     :   'slideBullet',
        visible         :   1,
        slidesPerMove   :   1,
        width           :   '',
        height          :   '',
        fx              :   'carrousel',
        timeout         :   400
    };
    
    var slidesNum       = new Number();
    var slidesWidth     = new Number();
    var fxWidth         = new Number();
    var fxHeight         = new Number();
    var fx              = new Number();
    var isAnimating     = false;
    var direction       = null;
    var _currentSlide   = 0;
	var slidesToMove 	= new Number();
    
    myCycle = function (cfg) {
        this.config = $.extend({}, defaults, cfg || {});
        _self = this;
        slidesNum = (this.config.visible) ? this.config.visible : $(this.config.id).find(this.config.slides).length;
        slidesWidth = parseInt((this.config.width !== '') ? this.config.width : $(this.config.id).find(this.config.slides).eq(0).innerWidth());
        fxWidth = (this.config.width !== '') ? parseInt(this.config.width) * $(this.config.id).find(this.config.slides).length : parseInt($(this.config.id).find(this.config.slides).eq(0).innerWidth() * $(this.config.id).find(this.config.slides).length); 
        fxHeight = $(this.config.id).find(this.config.slides).eq(0).innerHeight();
        fx = '.'+this.config.fx;
    }

    myCycle.prototype = {
        init: function () {
            $(this.config.id).find(this.config.slides).wrapAll("<div class='"+this.config.fx+"'></div>");
            $(this.config.id).css({
                position    :   'relative',
                overflow    :   'hidden',
                width       :   slidesNum * parseInt(slidesWidth),
                height      :   fxHeight
            });
			$(fx).css({ width:fxWidth, position: 'absolute', left: 0, top: 0 });
			
            this.addCallback('updateSlides', this.updateSlides, true);
            this.addCallback('beforeSlide', this.beforeSlide, true);
			
            $(this.config.next).on('click', this.next);
            $(this.config.prev).on('click', this.prev);
            
            $(fx).css({
                "-o-transition"         : "left "+this.config.timeout+"ms linear",
                "-moz-transition"       : "left "+this.config.timeout+"ms linear",
                "-webkit-transition"    : "left "+this.config.timeout+"ms linear",
                "transition"            : "left "+this.config.timeout+"ms linear"
            })
			
			
			$(fx+' '+this.config.slides).each(function(i, e){
				$(e).load(function(){
					if(i == _self.config.visible) {
						_self.slidesLoaded();
					}
				})
			})
			
        },
		slidesLoaded: function(){
			slidesWidth = (this.config.width !== '') ? parseInt(this.config.width) : parseInt($(fx+' '+this.config.slides).eq(0).innerWidth()); 
			slidesHeight = (this.config.height !== '') ? parseInt(this.config.height) : $(fx+' '+this.config.slides).eq(0).innerHeight();
			total = $(fx+' '+this.config.slides).length;
			
			$(this.config.id).css({
                position    :   'relative',
                overflow    :   'hidden',
                width       :   this.config.visible * parseInt(slidesWidth),
                height      :   slidesHeight
            });
			$(fx).css({ width: total * parseInt(slidesWidth), position: 'absolute', left: 0, top: 0 });
			
			if(this.config.pager !== '') {
                this.createPagerMenu();
            }
			
			_self.doCallback('beforeSlide');
            _self.doCallback('updateSlides');
		},
        next: function(e){
            direction = 'right';
            _self.doCallback('beforeSlide');
            var left = $(fx).position().left;
            var max = -($(fx).width() - slidesWidth * slidesNum);
            var toMove = slidesWidth * slidesToMove;

            if(left > max){
                if(isAnimating === false){
                    isAnimating = true;
                    $(fx).css({
                        left: "-="+toMove
                    });
                    setTimeout(function(){
                        _currentSlide++;
                        isAnimating = false; 
                        _self.doCallback('updateSlides');
                    }, _self.config.timeout);
                }
            }
        },
        prev: function(e){
            direction = 'left';
            _self.doCallback('beforeSlide');
            var left = $(fx).position().left;
            if(left < 0){
                if(isAnimating === false){
                    isAnimating = true;
                    $(fx).css({
                        left: "+="+slidesWidth * slidesToMove
                    });
                    setTimeout(function(){
                        _currentSlide--;
                        isAnimating = false; 
                        _self.doCallback('updateSlides');
                    }, _self.config.timeout);
                }
            }
        },
        updateSlides: function(){
            var toMove = slidesWidth * _self.config.visible;
            $(fx).find(_self.config.slides).each(function(i, e){
                if(e.getBoundingClientRect().left > 0 && e.getBoundingClientRect().left < toMove){
                    $(e).addClass('slide-visible');
                } else {
                    $(e).removeClass('slide-visible');  
                }
            });
            $(_self.config.pager).find('.'+_self.config.pagerBullet).removeClass('selected');
            $(_self.config.pager).find('.'+_self.config.pagerBullet).eq(_currentSlide).addClass('selected');
        },
        beforeSlide: function(){
			var items = $(fx+' > img').length;
            var total = Math.ceil(items / this.config.slidesPerMove) - (items % this.config.slidesPerMove);
			var index = $('.carrousel > img').nextAll(".slide-visible").first().index();
            if(direction === 'right'){
				if($('.slide-visible').eq(this.config.visible - 1).nextUntil().length < this.config.slidesPerMove) {
					slidesToMove = $('.slide-visible').eq(this.config.visible - 1).nextUntil().length
				}else {
					slidesToMove = _self.config.slidesPerMove
				}
            } else if(direction === 'left') {
                if($('.slide-visible').eq(0).prevUntil().length < this.config.slidesPerMove) {
					slidesToMove = $('.slide-visible').eq(0).prevUntil().length
				}else {
					slidesToMove = _self.config.slidesPerMove
				}
            }
        },
        createPagerMenu: function(){
            var items = $(fx+' > img').length;
            var total = 1 + Math.ceil((items - this.config.visible) / this.config.slidesPerMove);

            for(var i=0;i<total;i++){
                if(i === 0)
                    $(this.config.pager).append('<span class="'+this.config.pagerBullet+' selected">&bull;</span>');
                else 
                    $(this.config.pager).append('<span class="'+this.config.pagerBullet+'">&bull;</span>');
            }
            if(this.config.pagerClicable) {
                $(this.config.pager).find('.'+this.config.pagerBullet).on('click', function(e){
                    if(isAnimating === false){
                        $(_self.config.pager).find('.'+_self.config.pagerBullet).removeClass('selected');
                        $(this).addClass('selected');
                        _currentSlide = $(this).index();
                        var toMove = 0;
                        if(items % _self.config.visible > 0 && $(this).index() === (total - 1)) {
                            var resto = items % _self.config.visible;
                            if(resto === 1) resto = items - _self.config.visible;
                            else resto = (items - resto - 1);
                            toMove = -(slidesWidth * resto);
                        } else {
                            toMove = -(slidesWidth * (_self.config.slidesPerMove *  $(this).index()));
                        }
                        isAnimating = true;
                        $(fx).css({
                            left: toMove
                        })
                        setTimeout(function(){
                            isAnimating = false; 
                            _self.doCallback('updateSlides');
                        }, _self.config.timeout);
                    }   
                });
            }
        },
        getCurrentSlide: function(){
            return _currentSlide;
        },
        // callbacks
        callbacks: {},
        addCallback: function (hook, fn, unique) {
            if (hook && typeof fn === 'function') {
                if (!this.callbacks[hook] || !!unique) {
                    this.callbacks[hook] = [fn];
                } else {
                    this.callbacks[hook].push(fn);
                }
            }
        },
        removeCallback: function (hook, fn) {
            if (!this.callbacks[hook])
                return true;
            if (fn) {
                var arr = [];
                for (var i = 0; i < this.callbacks[hook].length; i++) {
                    if (fn !== this.callbacks[hook][i])
                        arr.push(this.callbacks[hook][i]);
                }
                this.callbacks[hook] = arr;
            } else {
                this.callbacks[hook] = null;
            }
        },
        doCallback: function (hook) {
            if (!this.callbacks[hook])
                return;
            for (var i = 0; i < this.callbacks[hook].length; i++) {
                if (typeof this.callbacks[hook][i] === 'function')
                    this.callbacks[hook][i].call(this);
            }
        },
    }
})(jQuery);