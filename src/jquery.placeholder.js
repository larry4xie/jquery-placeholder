/*! jquery.placeholder.js v1.0.0 | xiegang.1988@gmail.com */
(function(window, document, $) {
    // Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;

    var Placeholder;
    if (isInputSupported && isTextareaSupported) {
        // use native placeholder
        Placeholder = $.fn.placeholder = function() {
            return this;
        };

        Placeholder.input = Placeholder.textarea = true;
    } else {
        // use absolute position tag
        Placeholder = {
            input: isInputSupported,
            textarea: isTextareaSupported,
            live: false,
            selector: (isInputSupported ? 'textarea' : ':input') + '[placeholder]:not(.ph-disabled)',
            _placeholder: function($input) {
                // get or create placeholder element
                var ph = $input.next('i.placeholder');
                if (ph.length == 0) {
                    ph = $('<i class="placeholder">' + $input.attr('placeholder') + '</i>');
                    // adaptor style
                    var position = $input.position();
                    var cssProps = $input.css(['marginLeft', 'marginTop', 'paddingLeft', 'paddingTop',
                        'fontSize', 'lineHeight', 'textIndent']);

                    ph.css({
                        left: position.left,
                        top: position.top,
                        marginLeft: cssProps.marginLeft,
                        marginTop: cssProps.marginTop,
                        paddingLeft: cssProps.paddingLeft,
                        paddingTop: cssProps.paddingTop,
                        fontSize: cssProps.fontSize,
                        lineHeight: cssProps.lineHeight,
                        textIndent: cssProps.textIndent
                    });
                    // hack for focus
                    ph.click(Placeholder._click_placeholder);

                    // add to document
                    ph.addClass('hide');
                    $input.after(ph);
                }
                return ph;
            },
            _click_placeholder: function() {
                $(this).prev().focus();
            },
            setPlaceholder: function() {
                var input = this,
                    $input = $(input),
                    ph = Placeholder._placeholder($input);

                if (input.value == '') {
                    ph.removeClass('hide');
                } else {
                    ph.addClass('hide');
                }
            },
            clearPlaceholder: function() {
                var input = this,
                    $input = $(input);

                if (input.value == '') {
                    Placeholder._placeholder($input)
                        .removeClass('hide');
                }
            }
        };

        // val set hooks
        var hooks = {
            set: function(element, value) {
                element.value = value;
                var $element = $(element);
                if ($element.data('placeholder-enabled')) {
                    $element.trigger('change.placeholder');
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            $.valHooks.input = hooks;
        }
        if (!isTextareaSupported) {
            $.valHooks.textarea = hooks;
        }

        // jQuery fn
        $.fn.placeholder = function() {
            var $this = this;

            // global event
            if (!Placeholder.live) {
                $(document).on({
                    'keyup.placeholder': Placeholder.setPlaceholder,
                    'change.placeholder': Placeholder.setPlaceholder,
                    'blur.placeholder': Placeholder.clearPlaceholder
                }, Placeholder.selector);
                Placeholder.live = true;
            }

            // this selector elements
            $this
                .find(Placeholder.selector)
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');

            return $this;
        };

        $.placeholder = Placeholder;
    }
}(this, document, jQuery));