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
            selector: (isInputSupported ? 'textarea' : ':input') + '[placeholder]',
            _placeholder: function($input) {
                // get or create placeholder element
                var ph = $input.next('i.placeholder');
                if (ph.length == 0) {
                    ph = $('<i class="placeholder">' + $input.attr('placeholder') + '</i>');
                    // adaptor style
                    var position = $input.position();
                    ph.css({
                        left: position.left,
                        top: position.top,
                        marginLeft: $input.css("marginLeft") + $input.css("borderLeftWidth"),
                        marginTop: $input.css("marginTop")  + $input.css("borderTopWidth"),
                        paddingLeft: $input.css("paddingLeft"),
                        paddingTop: $input.css("paddingTop"),
                        fontSize: $input.css("fontSize"),
                        lineHeight: $input.css("lineHeight"),
                        textIndent: $input.css("textIndent")
                    });

                    // add to document
                    ph.addClass('hide');
                    $input.after(ph);
                }
                return ph;
            },
            keyup: function() {
                var input = this,
                    $input = $(input),
                    ph = Placeholder._placeholder($input);

                if (input.value == '') {
                    ph.removeClass('hide');
                } else {
                    ph.addClass('hide');
                }
            },
            blur: function() {
                var input = this,
                    $input = $(input);

                if (input.value == '') {
                    Placeholder._placeholder($input)
                        .removeClass('hide');
                }
            }
        };

        // jQuery fn
        $.fn.placeholder = function() {
            var $this = this;

            // global event
            if (!Placeholder.live) {
                $('body').on('keyup.placeholder', Placeholder.selector, Placeholder.keyup);
                $('body').on('blur.placeholder', Placeholder.selector, Placeholder.blur);
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