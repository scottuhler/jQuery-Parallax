/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Updated on 7/24 by Scott Uhler to add boundary locking to constrain images to their div's borders

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function ($) {
    var $parallaxActive = true;
	var $window = $(window);
	var windowHeight = $window.height();

	$window.resize(function () {
		windowHeight = $window.height();
	});

	$.fn.parallax = function (xpos, speedFactor, outerHeight, lockToBounds) {
	    $parallaxActive = true;
		var $this = $(this);
		var getHeight;
		var firstTop;
		var paddingTop = 0;

	    // setup defaults if arguments aren't specified
		if (arguments.length < 1 || xpos === null) xpos = "50%";
		if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
		if (arguments.length < 3 || outerHeight === null) outerHeight = true;
		if (arguments.length < 4 || lockToBounds === null) lockToBounds = false; //limits the image's movements to a percentage of the parent height

		speedFactor = Math.min(speedFactor, 1); //cap the speed at 1, which is 100%

		
		//get the starting position of each element to have parallax applied to it		
		$this.each(function(){
		    firstTop = $this.offset().top;
		});

		if (outerHeight) {
			getHeight = function(jqo) {
				return jqo.outerHeight(true);
			};
		} else {
			getHeight = function(jqo) {
				return jqo.height();
			};
		}
		
		// function to be called whenever the window is scrolled or resized
		function update() {
		    if ($parallaxActive) {
		        var pos = $window.scrollTop();

		        $this.each(function () {
		            var $element = $(this);
		            var top = $element.offset().top;
		            var height = getHeight($element);


		            // Check if totally above or totally below viewport
		            if (top + height < pos || top > pos + windowHeight) {
		                return;
		            }
                    
		            var targetTop = Math.round((firstTop - pos) * speedFactor) + "px";
		            if (lockToBounds) {
		                var pct = (pos - (top + height)) / (windowHeight + height);
		                pct *= 100;
		                pct -= 50;
		                //center the image, shift up or down according to the pct scrolled and the speedFactor
		                var finalPct = 50 + (pct * speedFactor);

                        targetTop = finalPct + "%";
		                console.log($element + ", targetTop: " + targetTop)
		            }

		            $element.css('backgroundPosition', xpos + " " + targetTop);
		        });
		    }
		}		

		$window.bind('scroll', update).resize(update);
		update();
	};

	

    //quick way to turn off parallax for mobile
	$.fn.parallaxStop = function() {
	    $parallaxActive = false;
	    $(this).attr("style", null);
	};
})(jQuery);
