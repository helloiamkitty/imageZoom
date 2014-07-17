(function ($) {
    $.fn.imageZoom = function (options) {

        var defaults = {
                zoomSize: 100,
                borderSize: 4,
                borderColor: "#888"
            },
            options = $.extend(defaults, options),
            zoomStyle = {
                "position" : "absolute",
                "display" : "none",
                "width" : String(options.zoomSize) + "px",
                "height" : String(options.zoomSize) + "px",
                "border" : String(options.borderSize) + "px solid " + options.borderColor,
                "border-radius" : String(options.zoomSize / 2 + options.borderSize) + "px",
                'z-index' : 999,
                "background-repeat" : "no-repeat",
                "background-position" : "0px 0px"
            };

        return this.each(function () {
            var img = $(this);
            var parentCss = {
                "position" : "relative",
                "display" : "inline-block"
            };
            img.wrap("<div />").parent().css(parentCss);

            // Creating zoom
            var target = $("<div />").css(zoomStyle).appendTo(img.parent());

            // Calculating actual size of image
            var imageSrc = options.imageSrc ? options.imageSrc : img.attr("src");
            var imageTag = "<img style='display:none;' src='" + imageSrc + "' />";

            var widthRatio = 0;
            var heightRatio = 0;

            $(imageTag).load(function () {
                widthRatio = $(this).width() / img.width();
                heightRatio = $(this).height() / img.height();
            }).appendTo($(this).parent());

            target.css({ backgroundImage: "url('" + imageSrc + "')" });

            // Hide when user moves quickly off image
            $(window).scroll(hideLens);

            function hideLens() {
                target.hide();
            }
            
            img.parent().bind('mouseenter', function(e){
                target.show();
            }).bind('mouseleave', function(e){
                target.hide();
            }).bind('mousemove', function(e){
                var offset = img.offset();
                var leftPos = parseInt(e.pageX - offset.left);
                var topPos = parseInt(e.pageY - offset.top);

                if (leftPos < 0 || topPos < 0 || leftPos > img.width() || topPos > img.height()) {
                    target.hide();
                }
                else {
                    target.show();

                    leftPos = String(((e.pageX - offset.left) * widthRatio - (target.width() - options.borderSize * 2) / 2) * (-1));
                    topPos = String(((e.pageY - offset.top) * heightRatio - (target.height() - options.borderSize * 2) / 2) * (-1));
                    target.css({ backgroundPosition: leftPos + 'px ' + topPos + 'px' });

                    leftPos = String((e.pageX - offset.left) - target.width() / 2);
                    topPos = String((e.pageY - offset.top) - target.height() / 2);
                    target.css({ left: String(1 * leftPos) + 'px', top: String(1 * topPos) + 'px' });
                }
            });
        });
    };
})(jQuery);
