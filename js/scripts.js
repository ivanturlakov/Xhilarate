/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);


$.fn.isOnScreen = function(){
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};


// http://www.html5rocks.com/en/tutorials/pagevisibility/intro/
function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

function isTabHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;
    return document[prop];
}


var vendorPrefix = (function(){
	var styles = window.getComputedStyle(document.documentElement, ''),
		pre = (Array.prototype.slice
			.call(styles)
			.join('') 
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
		)[1],
		dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
	return {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre[0].toUpperCase() + pre.substr(1)
	};
})();



$(function(){

	var win = $(window);
	var isTouchDevice = "ontouchstart" in document.documentElement;


	$("html, body").animate({ scrollTop: 0 }, 500);


	//
	// preloader
	var images = [];
	var preloadTimeout = 10000;
	var preloadTimer = null;
	var loaded = loadedPercent = 0;
	var preloadComplete = false;
	var preloader = $(".loader");
	var preloaderBar = $(".progress", preloader);

	$("body img").each(function(){
		var src = $(this).attr("src");
		if(src && $.inArray(src, images) < 0) images.push(src);
	});

	if(images.length && preloader.length){
		preload(images);
	} else {
		onPreloadComplete();
	}

	function preload(imageArray, index) {
        index = index || 0;
        if (imageArray && imageArray.length > index) {
            var img = new Image();
            img.onload = function(){
            	clearTimeout(preloadTimer);

            	loaded = index + 1;
            	loadedPercent = parseInt((loaded / imageArray.length) * 100);
            	preloaderBar.css({width: loadedPercent + "%"});

            	console.log("preloaded: " + this.src);

            	if(this.src.indexOf("preload-bg" > 0)){
            		preloader.removeClass("blured-bg");
            	}

            	var nextIndex = index + 1;
            	if(nextIndex < imageArray.length){
            		preloadTimer = setTimeout(onPreloadComplete, preloadTimeout);
	                preload(imageArray, nextIndex);
	            } else {
	            	setTimeout(onPreloadComplete, 1000);
	            }
            }
            img.src = images[index];
        } else {
        	onPreloadComplete();
        }
	}

	function onPreloadComplete(){
		
		initCoverVideo();

		init3dLogo();

		initParticles();

		initQuotes();

		initSkrollr();

		initClientLogos();

		$("body").addClass("loaded");

		setTimeout(function(){
			preloader.remove();
		}, 1000);

		var hash = document.location.hash;
		if(hash){
			var el = $(hash);
			if(el.length){
				$("html, body").animate({scrollTop: el.offset().top}, 1000);
			}

			console.log(hash);
		}
	}



	//
	// fullscreen intro
	var fullscreenIntro = $(".intro");
	if(fullscreenIntro.length){

		win.resize(function(){
			fullscreenIntro.height(this.innerHeight);
		}).trigger("resize");
	}



	//
	// bg video
	function initCoverVideo(){
		var bgVideo = $(".covervid-video");
		if(!bgVideo.length) return;

		bgVideo.coverVid(1920, 1080);
		bgVideo[0].play();
	}

	

	//
	// 3d logo
	function init3dLogo(){
		var logoImg = $(".3dlogo img");
		if(!logoImg.length) return;

		fullscreenIntro.bind("mousemove.xhil", $.throttle(150, function(e){
			if(!logoImg.isOnScreen()) return;

			var x = e.pageX;
			var y = e.pageY;
			var winW = win[0].innerWidth;
			var winH = win[0].innerHeight;
			var halfWinW = winW / 2;
			var halfWinH = winH / 2;
			var xForce = ((x - halfWinW)/halfWinW) * 100; /* -100 - 100 */
			var yForce = ((y - halfWinH)/halfWinH) * 100; /* -100 - 100 */

			logoImg.css(vendorPrefix.css + "transform", "rotateX(" + (-yForce * .25) + "deg) rotateY(" + (xForce * .25) + "deg)");
		}));
	}
	

	
	//
	// particles animation
	function initParticles(){
		var particles = $(".particles");
		if(!particles.length) return;

		var videoHolder = $(".covervid");
		var bgVideo = $(".covervid-video");
		var isParticlesPaused = false;

		particles.particleground({ // https://github.com/jnicol/particleground
			dotColor: "rgba(255,255,255,.65)",
			lineColor: "rgba(255,255,255,.15)",
			particleRadius: 2,
			lineWidth: .8,
			density: 15000,
			proximity: 100,
			parallaxMultiplier: -5,
			maxSpeedX: .5,
			maxSpeedY: .5
		});

		win.bind("scroll.xhil", $.throttle(100, function(){
			var topSectionVisible = fullscreenIntro.isOnScreen();
			if(topSectionVisible && isParticlesPaused){
				//resume particles and video
				particles.particleground("start");
				bgVideo[0].play();
				isParticlesPaused = false;

			} else if(!topSectionVisible && !isParticlesPaused){
				//pause particles and video
				particles.particleground("pause");
				bgVideo[0].pause();
				isParticlesPaused = true;
			}
		}));

		//pause particles/video on tab/window blur
		var visProp = getHiddenProp();
		if (visProp) {
		  	var eventName = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
		  	document.addEventListener(eventName, function(){
		  		if(isTabHidden()){
			    	// pause all
			       	$(".particles").particleground("pause");
					bgVideo[0].pause();
					isParticlesPaused = true;
			    } else {
			    	// resume visible sliders
			        $(window).trigger("scroll");
			    }
		  	});
		}
	}



	//
	// quotes slider
	function initQuotes(){
		var quoteSlider = $(".quotes");
		if(!quoteSlider.length) return;

		quoteSlider.on("beforeChange", function(event, slick, currentSlide, nextSlide){
		  	var bgColor = $(".quotes .quote-slide").not(".slick-cloned").eq(nextSlide).data("color");
		  	if(bgColor){
		  		$(".quote").css({background: bgColor});
		  	}
		});

		quoteSlider.slick({
			dots: false,
			arrows: false,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
	  		autoplaySpeed: 6000,
	  		pauseOnHover: false,
			slide: ".quotes > .quote-slide" 
		});
	}



	//
	// skrollr
	function initSkrollr(){
		if(window.innerWidth > 767 && !isTouchDevice && typeof skrollr !== "undefined"){
			var s;
			setTimeout(function(){
				s = skrollr.init({
					forceHeight: false
				});
			}, 100);
		}
	}



	if(typeof $.fn.SumoSelect != "undefined"){
		$(".sumoselect").SumoSelect({placeholder: 'What can we do for you?'});
	}
	
	
	//
    // mob nav
	var navToggle = $(".nav-toggle, .nav-close");
	navToggle.click(function(){
		$("body").toggleClass("nav-opened");
		return false;
	});
	
		
	

	//
	// clients logos
	var clientsSlider;
	var logoBoxes;
	var lastBoxIndex;

	function changeLogo(){
		var boxIndex = ~~(Math.random() * logoBoxes.length);
		if(boxIndex == lastBoxIndex){
			changeLogo();
			return;
		}
		lastBoxIndex = boxIndex;

		var box = logoBoxes.eq(boxIndex);
		box.prepend( $("img:last", box) );
		
		var interval = ~~(Math.random() * 2000) + 1000;
		setTimeout(changeLogo, interval);
	}

	function initClientLogos(){
		clientsSlider = $(".clients-slider");
		if(!clientsSlider.length) return;

		logoBoxes = $("div", clientsSlider);
		changeLogo();
	}



	//
	// contact form
	if($("#contact-form").length){

		$(".submit-btn").click(function(){
			var isValid = true;

			$("#contact-form [required]").each(function(){
				var field = $(this);
				var val = field.val();

				if(!val || val.length < 2 || (field.attr("type") == "email" && !/^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val))){
					field.addClass("err");
					isValid = false;
				} else {
					field.removeClass("err");
				}
			});

			if(isValid){
				alert("submitted");
			} else {
				alert("error");
			}

			return false;
		});

	}
	
	
	
	
	
	
	//
	//Scroll Down
	function scrollToAnchor(aid){
       var aTag = $(".scroll-target");
       $('html,body').animate({scrollTop: aTag.offset().top},'slow');
    }

	$(".scroll-down").click(function() {
	   scrollToAnchor('.scroll-targetr');
	});
	
	
	
	
	//
	//Lazy Load Imgs
	$(window).on('scroll', function(){
       if ($(".portfolio-item").is(':visible')){
             $(this).addClass("fade-in");
       }
    });


 
});