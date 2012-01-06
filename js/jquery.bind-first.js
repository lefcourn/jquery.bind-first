(function($) {
	var JQ_VERSION = parseFloat($.fn.jquery);
	
	function eventsData($el) {
		return JQ_VERSION < 1.7 ? $el.data('events') : $._data($el[0]).events;
	}
	
	function moveHandlerToTop($el, eventName, isDelegated) {
		var data = eventsData($el);
		var events = data[eventName];
		
		if (JQ_VERSION >= 1.7) {
			var handler = events.pop();
			events.splice(isDelegated ? 0 : (events.delegateCount || 0), 0, handler);

			return;
		}

		if (isDelegated) {
			data.live.unshift(data.live.pop());
		} else {
			events.unshift(events.pop());
		}
	}
	
	function moveEventHandlers($elems, eventsString, isDelegate) {
		var events = eventsString.split(/\s+/);
		$elems.each(function() {
			for (var i = 0; i < events.length; ++i) {
				var pureEventName = $.trim(events[i]).match(/[^\.]+/i)[0];
				moveHandlerToTop($(this), pureEventName, isDelegate);
			}
		});
	}
	
	$.fn.bindFirst = function() {
		var $el = $(this);
		var args = $.makeArray(arguments);
		var eventsString = args.shift();

		if (eventsString) {
			$.fn.bind.apply($el, arguments);
			moveEventHandlers($el, eventsString);
		}

		return $(this);
	};

	$.fn.delegateFirst = function() {
		var $el = $(this);
		var args = $.makeArray(arguments);
		var eventsString = args[1];
		
		if (eventsString) {
			args.splice(0, 2);
			$.fn.delegate.apply($el, arguments);
			moveEventHandlers($(this), eventsString, true);
		}

		return $el;
	};

	$.fn.liveFirst = function() {
		var $el = $(this);
		var args = $.makeArray(arguments);

		// live = delegate to document
		args.unshift($el.selector);
		$.fn.delegateFirst.apply($(document), args);

		return $el;
	};

})(jQuery);