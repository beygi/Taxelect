(function ($){
	$.fn.taxelect = function (options) {
		// set the default values
		defaults = {
			width: 190,
			color: '#909597',
			defaultOption: '-1',
			defaultString: 'لطفا انتخاب کنید:‌',
			optionHeight: 30,
			closedHeight: 30,
			openedHeight: 120,
			openingSpeed: 500,
			closingSpeed: 500,
			closeOtherSpeed: 200
		},
		settings = $.extend({},defaults, options);
		
		this.each(function(){
			var selectOptions = [],
				parent        = $(this).parent(),
				selectName    = $(this).attr('name'),
				selectFormId  = $(this).parents('form').attr('id'),
				hasSearch     = $(this).data('has-search') ? true: false,
				target        = '';
			// make a list of needed options
			$(this).children().each(function(){
				var arr = {};
				arr['text'] = $(this).text();
				arr['hasIcon'] = $(this).data('has-icon') ? true: false;
				selectOptions.push(arr);
			});
			// build the html structure
			var tmp = '';
			if (hasSearch){
				tmp = '<li class="taxearch"><input type="text"></li>'
			}
			for (var i = 0; i < selectOptions.length; i++) {
				var icon = selectOptions[i].hasIcon ? '<span id="' + selectFormId 
				+ '-' + selectName + '-option-' + i + '-span' + '" class="taxelect-icon"></span>':'';
				tmp += '<li class="taxelect-option" data-option="' 
				+ i + '">' + selectOptions[i].text + icon + '</li>';
			};
			// add needed elements after select
			$(this).after('<div class="taxelect-wrapper">' 
				+ '<ul class="taxelect-ul" data-form-id="' 
				+ selectFormId + '" data-name="' 
				+ selectName + '">'
				+ '<li class="taxelected" data-default-option="' 
				+ settings.defaultOption 
				+ '">' + settings.defaultString + '</li>' 
				+ tmp + '</ul></div>');
			// assign added elements to variables
			var selectWrapper = $(this).siblings('.taxelect-wrapper'),
				dropdownItems = selectWrapper.find('.taxelect-option'),
				taxearchInput = selectWrapper.find('input');
			// apply settings on result element
			selectWrapper.css({
				width: settings.width,
				color: settings.color
			});
			// apply settings on dropdown options 
			dropdownItems.css({
				height: settings.optionHeight,
				lineHeight: settings.optionHeight + 'px'
			})
			// initialize and then disable the scrollbar on page load
			selectWrapper.mCustomScrollbar({
		    	theme: "minimal-dark"
		    });
			selectWrapper.mCustomScrollbar('disable',true);
			// open a dropdown on menu on click
			selectWrapper.click(function(){
				var other = $('#' + selectFormId + ' .opened');
				if (selectWrapper.hasClass('opened')) {
					selectWrapper.animate({height: settings.closedHeight}, settings.closingSpeed, function(){
						selectWrapper.removeClass('opened');
					});
					selectWrapper.mCustomScrollbar('disable',true);
				}
				else{
					selectWrapper.mCustomScrollbar('update');
					if (other.length){
						selectWrapper.addClass('opened').promise().done(function(){
							selectWrapper.animate({height: settings.openedHeight}, settings.openingSpeed);
						});
						other.animate({height: settings.closedHeight},settings.closeOtherSpeed ,function(){
							other.removeClass('opened');
						});
					}else{
						selectWrapper.addClass('opened').promise().done(function(){
							selectWrapper.animate({height: settings.openedHeight}, settings.openingSpeed);
							if ((selectWrapper.find('li').length * settings.optionHeight) > (settings.openedHeight - settings.closedHeight)){
								selectWrapper.mCustomScrollbar({
							    	theme: "minimal-dark"
							    });
							}
						});
					}
				}
			}).find('.taxearch').click(function(e){
				return false;
			});
			// sets the selected option as selected and closes the dropdown
			dropdownItems.click(function(){
				var elem      = $(this),
					parent    = elem.parent(),
					formId    = parent.data('form-id'),
					inputName = parent.data('name'),
					wrapper   = elem.parents('.taxelect-wrapper');
				elem.siblings('.taxelected').html($(this).html());
				$('#' + formId + ' select[name="' + inputName + '"]').prop('selectedIndex', elem.data('option'));
			}).hover(function(){
				if(!$(this).hasClass('chosen')){
					$(this).siblings().removeClass('chosen');
					$(this).addClass('chosen');
				}
			}, function(){
				$(this).removeClass('chosen');
			});
			//set the setting for search input
			taxearchInput.css({
				width: settings.width - 25
			});
			// hide original select
			return $(this).css({
				display: 'none'
			});
			$(this).prop('selectedIndex', function(){
				return $('.taxelect-ul[data-form-id="' + selectFormId + '"][data-name="' + selectName + '"] > .taxelected').data('default-option');
			});
		});
		// searches through select options
		$('.taxearch > input').bind("change paste keyup", function(){
			var value   = $(this).val(),
				parent  = $(this).parents('.taxelect-wrapper'),
				options = $(this).parent().siblings('.taxelect-option');
			options.each(function(){
				if (!$(this).html().indexOf(value)){
					$(this).css({display: ''});
				}else{
					$(this).css({display: 'none'});
				}
			});
			if (parent.find('.option:not(.hidden)').length > 4){
				parent.mCustomScrollbar("update");
			}
		});
		// closes all the opened dropdowns upon clicking anywhere outside them.
		$(document).on('click', function(event) { 
			if (!$(event.target).closest('.taxelect-wrapper').length) {
				$('.taxelect-wrapper.opened').each(function(){
					$(this).animate({height: settings.closedHeight}, function(){
						$(this).removeClass('opened');
					});
				});
			}
		});
	};
}(jQuery));