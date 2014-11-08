(function($) {
	"use strict";
	
	var sliderHeight;
	var homepageSliderSlideWidth;
	var homepageSliderMainSlideWidth;
	var lightboxCurrentImage;
	var reviewBegin;
	
	var galleryNumberOfItems;
	var galleryTimeout;
	
	var doOnce768;
	var doOnce992;
	
	var nextPage;
	var maxPage;
	var nextLink;
	var pagedString;

	$(window).load(function() {
		
		theme_initialize();
		
		//User menu behavior
		
		$(document).on('click', '.user-menu-search a', function() {
			var $this = $(this);
			var userMenuSearch = $this.parent();
			
			if (userMenuSearch.find('form').css('display') == 'none')
			{
				userMenuSearch.find('form').css('display', 'block');
				var maxWidth = parseInt(userMenuSearch.find('.search-input').css('width'));
				
				userMenuSearch.find('form').animate({
					width: maxWidth	
				}, 300);
			}
			else
				userMenuSearch.find('form').animate({
					width: 0	
				}, 300, function() { userMenuSearch.find('form').css('display', 'none'); });
		});
		
		//Homepage slider behavior
		
		$(document).on('mouseenter', '#homepage-slider .slide', function() {
			if (window.innerWidth > 768)
			{
				var $next = $(this);
				var $current = $next.parent().find('.current-slide');
				
				if (!$next.hasClass('current-slide'))
				{
					$current.finish().animate({
						width: homepageSliderSlideWidth
					}, 300);
					
					var thumbnail = $next.find('.thumbnail-overlay');
					thumbnail.css('opacity', '1');
					
					$next.finish().animate({
						width: homepageSliderMainSlideWidth,
					}, 300, function() {
						thumbnail.finish().animate({
							opacity: 0	
						}, 150);
					});
					
					$current.removeClass('current-slide').removeClass('open-slide');
					$next.addClass('current-slide').addClass('open-slide');
				}
			}
		});
		
		//Navigation menu behavior
		
		$(document).on('mouseenter', '.menu .menu-item', function() {
			if (window.innerWidth > 992)
				$(this).children('.sub-menu').stop(true, true).fadeIn(300);	
		});
		
		$(document).on('mouseleave', '.menu .menu-item', function() {
			if (window.innerWidth > 992)
				$(this).children('.sub-menu').stop(true, true).fadeOut(300);	
		});
		
		$(document).on('click', '.mobile-menu-arrow', function() {
			var $this = $(this);
			var elemHeight = $this.parent().children('ul').children().length * $this.parent().height();
			
			if ($this.parent().children('ul').height() == 0)
			{
				$this.parent().children('ul').css('display', 'block').animate({height: elemHeight}, 200, function() { $(this).css('height', 'auto'); });
				$this.removeClass('fa-caret-up').addClass('fa-caret-up');
			}
			else
			{
				$this.parent().children('ul').animate({height: 0}, 200, function() { $(this).css('display', 'none'); });
				$this.removeClass('fa-caret-up').addClass('fa-caret-down');
			}	
		});
		
		$(document).on('click', '.mobile-menu-icon', function() {
			var $this = $(this);
			
			if ($this.parent().find('.navigation-menu').css('display') == 'none')
				$this.parent().find('.navigation-menu').fadeIn(400);
			else
				$this.parent().find('.navigation-menu').fadeOut(400);
		});
		
		//Masonry posts behavior
		
		$(document).on('click', '.radio-button-wrapper', function() {
			var $this = $(this);
			
			$this.parent().find('.radio-button-wrapper').removeClass('selected');	
			$this.addClass('selected');
		});
		
		$(document).on('click', '.select-field-title', function() {
			var $this = $(this);
			
			if ($this.parent().find('.select-field-buttons').css('display') == 'none')
				$this.parent().find('.select-field-buttons').fadeIn(300);
			else
				$this.parent().find('.select-field-buttons').fadeOut(300);
		});
		
		$(document).on('click', '#masonry-sort .radio-button-wrapper', function() {
			var sortValue = $(this).attr('data-sort-value');

			$('#masonry-container').isotope({ sortBy: sortValue, sortAscending: {originalOrder: true, loved: false} });	
		});
		
		var filters = {};
		$(document).on('click', '#masonry-filter .radio-button-wrapper', function() {
			var $this = $(this);
			
			$this.parent().css('display', 'none');
			
			var filterClass = $(this).attr('data-filter');

			var $buttonGroup = $this.parent();
		    var filterGroup = $buttonGroup.attr('data-filter-group');
		    filters[ filterGroup ] = $this.attr('data-filter');

		    var filterValue = '';
		    for ( var prop in filters ) {
		      filterValue += filters[ prop ];
		    }

			$('#masonry-container').isotope({ filter: filterValue });
		});
		
		//Love button behavior
		
		$(document).on('click', '.button-love', function() {
			var $this = $(this);

			$.ajax({
				type: 'GET',
				url: ajaxurl,
				data: {'action': 'oblivion_ajax_love', 'postId': $this.closest('.post').find('.post-id').html()},
				success: function(response) {
					var reply = JSON.parse(response);
					
					if (reply.text == 'set')
						$this.addClass('loved');
					else if (reply.text == 'unset')
						$this.removeClass('loved');
				}
			});	
		});
		
		//Subscribe widget behavior
		
		$(document).on('click', '.oblivion-subscribe .submit-subscribe', function(e) {
			e.preventDefault();
			
			var $this = $(this);
			
			$.ajax({
				type: 'GET',
				url: ajaxurl,
				data: { 'action': 'oblivion_ajax_subscribe', 'email': $this.parent().find('.email-subscribe').val() },
				success: function(response) {
					var reply = JSON.parse(response);
					
					if (reply.type == 'success')
						$this.parent().find('.status-message').html('Successfully subscribed!');
					else
						$this.parent().find('.status-message').html(reply.message);
				}
			});		
		});
		
		//Comments behavior
		
		$(document).on('click', '.open-comments', function(e) {
			e.preventDefault();
			
			if ($(this).closest('.comments-wrapper').find('.comments').css('display') == 'none')
			{
				$(this).closest('.comments-wrapper').find('.comments').fadeIn(500);
				$(this).closest('.comments-wrapper').find('.close-comments').fadeIn(500);
			}	
		});
		
		$(document).on('click', '.close-comments', function(e) {
			e.preventDefault();
			
			if ($(this).closest('.comments-wrapper').find('.comments').css('display') != 'none')
			{
				$(this).closest('.comments-wrapper').find('.comments').fadeOut(500);
				$(this).closest('.comments-wrapper').find('.close-comments').fadeOut(500);
			}	
		});
		
		$(document).on('click', '.add-comment', function(e) {
			e.preventDefault();
			
			if ($(this).closest('.comments-wrapper').find('.comments').css('display') == 'none')
			{
				$(this).closest('.comments-wrapper').find('.comments').fadeIn(500);
				$(this).closest('.comments-wrapper').find('.close-comments').fadeIn(500);
			}
			
			$('body, html').animate({
				scrollTop: $('#respond').offset().top
			}, 500);		
		});
		
		//Gallery page behavior
		
		$(document).on('mouseenter', '.gallery-image', function() {
			var $this = $(this);
			
			$this.find('.gallery-overlay').stop(true, true).animate({
				opacity: 0
			}, 150);
			
			$this.find('.gallery-image-title').stop(true, true).fadeIn(150);
		});
		
		$(document).on('mouseleave', '.gallery-image', function() {
			var $this = $(this);
			
			$this.find('.gallery-overlay').stop(true, true).animate({
				opacity: 0.6
			}, 150);
			
			$this.find('.gallery-image-title').stop(true, true).fadeOut(150);
		});
		
		$(document).on('click', '.gallery-image', function() {
			var $this = $(this);
			
			lightboxCurrentImage = $(this);
			var imageValues = galleryImageValues($this);

			$('#oblivion-gallery-lightbox').find('.prev-image').css('background-image', imageValues[0]);
			$('#oblivion-gallery-lightbox').find('.current-image').attr('src', imageValues[1]);
			$('#oblivion-gallery-lightbox').find('.next-image').css('background-image', imageValues[2]);
			
			$('#oblivion-gallery-lightbox').fadeIn(300);
		});
		
		$(document).on('click', '#oblivion-gallery-lightbox .gallery-overlay', function() {
			$('#oblivion-gallery-lightbox').fadeOut(300);	
		});
		
		$(document).on('click', '#oblivion-gallery-lightbox .prev-image, #oblivion-gallery-lightbox .next-image', function() {
			var imageValues = galleryImageValues(lightboxCurrentImage);
			var $this = $(this);
			
			if ($this.hasClass('prev-image'))
				var currentImage = imageValues[3];
			else
				var currentImage = imageValues[4];
				
			lightboxCurrentImage = currentImage;
			imageValues = galleryImageValues(lightboxCurrentImage);
			
			$('#oblivion-gallery-lightbox').find('.prev-image').fadeOut(300, function() { $(this).css('background-image', imageValues[0]); $(this).fadeIn(300); });
			$('#oblivion-gallery-lightbox').find('.current-image').fadeOut(300, function() { $(this).attr('src', imageValues[1]); $(this).fadeIn(300); });
			$('#oblivion-gallery-lightbox').find('.next-image').fadeOut(300, function() { $(this).css('background-image', imageValues[2]); $(this).fadeIn(300); });
		});
		
		//Load more button behavior
		
		$(document).on('click', '#masonry-posts .load-more-button, .search-page .load-more-button, .archive .load-more-button', function() {
			var $this = $(this);
			
			if (nextPage <= maxPage)
			{
				$this.html('Loading posts...');
				
				var newContent = $('<div class="hidden"></div>');
				$('#masonry-posts').append(newContent);
				newContent.load(nextLink + ' .post',
					function() {
						nextPage++;
						
						if (pagedString == 'page')
							nextLink = nextLink.replace(/\/page\/[0-9]?/, '/page/' + nextPage);
						else
							nextLink = nextLink.replace(/paged=[0-9]?/, 'paged=' + nextPage);

						if (nextPage <= maxPage) 
							$this.html('load more');
						else
							$this.css('display', 'none');
						
						if ($this.parent().attr('id') == 'masonry-posts') 
						{
							var newElements = newContent.children(':not(:first-child)');
							$('#masonry-container').append(newElements).isotope('appended', newElements);
							newElements.find('.thumbnail-title-text').lettering('words');
						}
						else
						{
							var newElements = newContent.children();
							$this.before(newElements);
							newElements.find('.thumbnail-title-text').lettering('words');
						}
					}
				);				
			}	
		});
		
		$(document).on('click', '#oblivion-gallery-wrapper .load-more-button', function() {
			var $this = $(this);
			var itemsDisplay = $this.parent().attr('data-display');
			
			$this.parent().find('.gallery-item.hidden').each(function(index) {
				if (index < itemsDisplay)
					$(this).removeClass('hidden');
			});
			
			$('#oblivion-gallery').isotope({filter: '*'});
			if ($this.parent().find('.gallery-item.hidden').length == 0)
				$this.css('display', 'none');
		});
		
		$(document).on('click', '.authors-wrapper .load-more-button', function() {
			var $this = $(this);
			var itemsDisplay = $this.parent().attr('data-display');
			
			$this.parent().find('.author.hidden').each(function(index) {
				if (index < itemsDisplay)
					$(this).fadeIn(300).removeClass('hidden');
			});
			
			if ($this.parent().find('.author.hidden').length == 0)
				$this.css('display', 'none');	
		});
		
		//Gallery post behavior
		
		$(document).on('mouseenter', '.post-thumbnail-gallery', function() {
			$(this).find('.thumbnail-arrow').stop(true, true).fadeIn(300);	
		});
		
		$(document).on('mouseleave', '.post-thumbnail-gallery', function() {
			$(this).find('.thumbnail-arrow').stop(true, true).fadeOut(300);	
		});
		
		$(document).on('click', '.thumbnail-arrow', function() {
			var currentImage = parseInt($('.thumbnail-current-image').html());
			
			if ($(this).hasClass('thumbnail-arrow-right'))
				var nextImage = currentImage % galleryNumberOfItems;
			else
				var nextImage = (currentImage - 2 + galleryNumberOfItems) % galleryNumberOfItems;
			
			clearTimeout(galleryTimeout);
			galleryAnimate(nextImage, galleryNumberOfItems);
		});
		
		$(document).on('click', '.post-thumbnail-thumbnail', function() {
			var nextImage = (parseInt($(this).attr('data-number')) - 1 + galleryNumberOfItems) % galleryNumberOfItems;
			
			clearTimeout(galleryTimeout);
			galleryAnimate(nextImage, galleryNumberOfItems);
		});
		
		//Scroll behavior
		
		$(window).on('scroll', function() {
			var direction = (/trident/.test(navigator.userAgent.toLowerCase())) ? -1 : 1;
			
			if ($('#parallax-header').length)
			{
				var scrollPos = ($(window).scrollTop() - $('#parallax-header').offset().top) * direction * 0.6;
				$('#parallax-header').css('background-position', 'center ' + scrollPos + 'px');	
			}
			
			if ($('.parallax-heading').length)
			{
				var newScrollPos = ($(window).scrollTop() - $('.parallax-heading').offset().top) * direction * 0.6;
				$('.parallax-heading').css('background-position', 'center ' + newScrollPos + 'px');	
			}
			
			if ($('.review-section').length && isScrolledIntoView($('.review-section')))
			{
				if (reviewBegin == 0)
				{
					reviewBegin = 1;
					
					var maxScore = parseFloat($('.review-score').attr('data-score'));
					$({value: 0}).animate({value: maxScore},
					{
						duration: 2000,
						easing: 'swing',
						step: function(now, fx) {
							$('.review-score').html(this.value.toFixed(1));
						},
						complete: function() {
							$('.review-score').html(maxScore);
						}
					});
					
					$('.review-category').each(function(index) {
						var itemSelector = $(this);
						var maxValue = parseInt($(this).find('.category-grade').attr('data-score'));
						
						$({value: 0}).animate({value: maxValue},
						{
							duration: 2000,
							easing: 'swing',
							step: function(now, fx) {
								itemSelector.find('.category-grade').html(Math.ceil(this.value));
								itemSelector.find('.category-line-inner').css('width', (this.value * 10) + '%');
							},
							complete: function() {
								itemSelector.find('.category-grade').html(maxValue);
								itemSelector.find('.category-line-inner').css('width', (maxValue * 10) + '%');
							}
						});
					});
				}
			}
		});
	});
	
	function theme_initialize()
	{
		nextPage = parseInt(loadNextPage.startPage) + 1;
		maxPage = parseInt(loadNextPage.maxPages);
		nextLink = loadNextPage.nextLink;
		pagedString = loadNextPage.pagedString;
		
		if (pagedString == 'paged')
			nextLink = nextLink.replace('&#038;', '&');
		
		sliderHeight = $('#homepage-slider').attr('data-height');
		
		reviewBegin = 0;
		
		if ($('.post-gallery-wrapper').length)
		{
			$('.post-thumbnail-thumbnails').css('width', $('.post-thumbnail-thumbnail').length * 100 + ($('.post-thumbnail-thumbnail').length - 1) * 10 + 'px');
			$('.post-thumbnail-thumbnail:first-child').addClass('current-thumbnail');
			galleryNumberOfItems = $('.thumbnail-gallery-image').length;
			galleryTimeout = setTimeout(function() { galleryAnimate(1, galleryNumberOfItems); }, 10000);
		}
		
		if (window.innerWidth <= 768)
			doOnce768 = 1;
		else
			doOnce768 = 0;
			
		if (window.innerWidth <= 992)
			doOnce992 = 1;
		else
			doOnce992 = 0;
		
		if (nextPage > maxPage)
			$('#masonry-posts .load-more-button, .search-page .load-more-button').css('display', 'none');
		
		$('.thumbnail-title-text:not(.gallery-title-text)').lettering('words');
		
		$('.gallery-text-inner, .author-description').mCustomScrollbar();
		
		$('#masonry-container').isotope({
			itemSelector: '.post',
			layoutMode: 'masonry',
			getSortData: {
				loved: '.post-loved'	
			},
			masonry: {
				columnWidth: '.col-3'
			}	
		});
		
		$('#oblivion-gallery').isotope({
			itemSelector: '.gallery-item',
			layoutMode: 'masonry',
			masonry: {
				columnWidth: '.col-3'
			}
		});
		
		if (window.location.href.indexOf('.comment') >= 0 || window.location.href.indexOf('#respond') >= 0 || window.location.href.indexOf('#comment') >= 0)
		{
			$('.comments').css('display', 'block');
			$('.close-comments').css('display', 'block');
			$('body, html').scrollTop($('.comments-wrapper').offset().top);
		}
		
		if ($('#homepage-slider-wrapper').length)
			$('#homepage-slider-wrapper').find('.slider-loading').fadeOut(300);
		
		if (/trident/.test(navigator.userAgent.toLowerCase()))
			$('#parallax-header').css('background-attachment', 'fixed');
			
		$('.post-thumbnail-wrapper > iframe').css('height', $('.post-thumbnail-wrapper > iframe').width() * 9 / 16 + 'px');
		
		responsiveFunction();
	}
	
	$(window).resize(function() {
		responsiveFunction();
	});
	
	function galleryImageValues(selector)
	{
		var $this = selector;
		
		var totalImages = $('#oblivion-gallery .gallery-image').length;
		var currentIndex = $this.index() - 1;
		var nextIndex = (currentIndex + 1) % totalImages + 2;
		var prevIndex = (currentIndex - 1 + totalImages) % totalImages + 2;
			
		var prevSelector = $('#oblivion-gallery').find('.gallery-image:nth-child(' + prevIndex + ')');
		var prevUrl = prevSelector.find('.gallery-image-image').css('background-image');
			
		var currentUrl = $('#oblivion-gallery').find('.gallery-image:nth-child(' + (currentIndex + 2) + ')').find('.gallery-image-image').css('background-image');
		currentUrl = /^url\((['"]?)(.*)\1\)$/.exec(currentUrl);
		currentUrl = currentUrl ? currentUrl[2] : "";
		
		var nextSelector = $('#oblivion-gallery').find('.gallery-image:nth-child(' + nextIndex + ')')	
		var nextUrl = nextSelector.find('.gallery-image-image').css('background-image');
		
		var imageValues = [];
		imageValues.push(prevUrl);
		imageValues.push(currentUrl);
		imageValues.push(nextUrl);
		imageValues.push(prevSelector);
		imageValues.push(nextSelector);
		
		return imageValues;
	}
	
	function responsiveFunction() 
	{
		$('#homepage-slider .slide:not(.current-slide)').removeAttr('style');
		homepageSliderSlideWidth = $('#homepage-slider .slide:not(.current-slide)').width();
		homepageSliderMainSlideWidth = $('#homepage-slider').width() - ($('#homepage-slider .slide').length - 1) * homepageSliderSlideWidth;
		$('#homepage-slider .current-slide').css('width', homepageSliderMainSlideWidth + 'px');
		
		$('.thumbnail-gallery-image').css('width', $('.post-gallery-wrapper').width() + 'px');
		$('.thumbnail-image-holder').css('width', $('.thumbnail-gallery-image').length * $('.thumbnail-gallery-image').width() + 'px');
		
		if (window.innerWidth <= 768 && doOnce768 == 1)
		{
			$('#homepage-slider .slide').css('height', sliderHeight + 'px');
			$('#homepage-slider .slide:not(.current-slide)').addClass('open-slide');
			$('#homepage-slider').css('height', 'auto');
			$('#homepage-slider-wrapper').css('height', 'auto');
			doOnce768 = 0;
		}
		else if (window.innerWidth > 768 && doOnce768 == 0)
		{
			$('#homepage-slider').css('height', sliderHeight + 'px');
			$('#homepage-slider-wrapper').css('height', sliderHeight + 'px');
			$('#homepage-slider .slide:not(.current-slide)').removeClass('open-slide');
			$('#homepage-slider .slide').css('height', '100%');
			doOnce768 = 1;
		}
		
		$('.parallax-heading').each(function() {
			$(this).css('left', '0px');
			$(this).css({'width': $(window).innerWidth() + 'px', 'left': -$(this).offset().left + 'px'});
		});
		
		if (window.innerWidth <= 992 && doOnce992 == 1)
		{
			$('.navigation-menu').css('display', 'none');
			$('.menu-item-has-children').append('<i class="mobile-menu-arrow fa fa-caret-down"></i>');
			doOnce992 = 0;
		}
		else if (window.innerWidth > 992 && doOnce992 == 0)
		{
			$('.mobile-menu-arrow').remove();
			$('.navigation-menu').css('display', 'block');
			$('.sub-menu').css('height', '');
			$('.navigation-menu').css('top', ($('#navigation-menu-wrapper').height() - $('.navigation-menu').height()) / 2 + 'px');
			doOnce992 = 1;
		}
		
		$('.review-text').css('width', $('.review-main').width() - 98 + 'px');
	}
	
	function isScrolledIntoView(elem)
	{
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + window.innerHeight;

	    var elemTop = $(elem).offset().top;
	    var elemBottom = elemTop + $(elem).height();

	    return (elemTop <= docViewBottom);
	}
	
	function galleryAnimate(galleryIndex, galleryNumberOfItems)
	{
		var translateX = -galleryIndex * $('.thumbnail-gallery-image').width() + 'px';
		
		$('.thumbnail-current-image').html(galleryIndex + 1);
			
		$('.post-thumbnail-thumbnail').removeClass('current-thumbnail');
		$('.post-thumbnail-thumbnail:nth-child(' + (galleryIndex + 1) + ')').addClass('current-thumbnail');
		
		scrollGalleryThumbnails(galleryIndex + 1);
		
		$('.thumbnail-image-holder').stop(true, true).transition({x: translateX}, 800, function() {
			clearTimeout(galleryTimeout);
			galleryTimeout = setTimeout(function() { galleryAnimate((galleryIndex + 1) % galleryNumberOfItems, galleryNumberOfItems); }, 10000);
		});
	}
	
	function scrollGalleryThumbnails(galleryIndex)
	{
		if ($('.post-thumbnail-thumbnail:nth-child(' + galleryIndex + ')').offset().left < $('.post-thumbnail-gallery').offset().left)
		{
			var translateValue = $('.post-thumbnail-gallery').offset().left - $('.post-thumbnail-thumbnail:nth-child(' + galleryIndex + ')').offset().left + 'px';
			$('.post-thumbnail-thumbnails').stop(true, true).transition({x: '+=' + translateValue}, 800);
		}
		else if (($('.post-thumbnail-thumbnail:nth-child(' + galleryIndex + ')').offset().left + 100) > ($('.post-thumbnail-gallery').offset().left + $('.post-thumbnail-gallery').width()))
		{
			var translateValue = ($('.post-thumbnail-gallery').offset().left + $('.post-thumbnail-gallery').width()) - $('.post-thumbnail-thumbnail:nth-child(' + galleryIndex + ')').offset().left - 100  + 'px';
			$('.post-thumbnail-thumbnails').stop(true, true).transition({x: '+=' + translateValue}, 800);
		}
	}
	
})(jQuery);