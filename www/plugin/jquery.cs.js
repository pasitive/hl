(function ($) {
    $.fn.cs = function (options) {
        var opts = $.extend({}, $.fn.cs.defaults, options);
        var init = function ($textarea) {
            var ta_width = $textarea.outerWidth();
            var ta_height = $textarea.outerHeight();
            opts.ta_height = ta_height;
            $textarea.wrap('<div class="cs-container"></div>');
            $textarea.val($textarea.val());
            var $parent = $textarea.parent();
            var scrollbarString = '<div class="cs-scrollbar"><a class="up" href="#"></a>' + '<div class="cs-slider"><div class="bar">' + '<div class="bar-top"><div class="bar-bottom"></div></div>' + '</div></div>' + '<a href="#" class="down"></a></div>';
            $parent.append(scrollbarString);
            //$parent.width(ta_width);
            $parent.height(ta_height);
            return new $.fn.cs.Class($parent, opts)
        };
        var csCollection = new Array();
        this.each(function () {
            var $this = $(this);
            csCollection.push(init($this))
        });
        return csCollection
    };
    $.fn.cs.defaults = {vs: 16, theme: 'css-cs-theme', redrawBar: true};
    $.fn.cs.Class = function ($el, opts) {
        this.opts = opts;
        this.$el = $el;
        var me = this;
        this.ta = this.$el.find('textarea').get(0);
        this.ta.getScrollable = function () {
            return this.scrollHeight - this.clientHeight
        };
        this.ta.getPercentVisible = function () {
            return this.clientHeight / this.scrollHeight
        };
        this.scrollbar = {$e: this.$el.find('.cs-scrollbar'), spinup: {$e: this.$el.find('.up'), scroll: function () {
            if (me.ta.scrollTop - me.opts.vs > 0) {
                me.ta.scrollTop -= me.opts.vs
            } else {
                me.ta.scrollTop = 0
            }
            if (me.FixScroll)me.scrollbar.slider.bar.draw()
        }}, spindown: {$e: this.$el.find('.down'), scroll: function () {
            if ((me.ta.scrollHeight - me.ta.clientHeight) - (me.ta.scrollTop + me.opts.vs) > 0) {
                me.ta.scrollTop += me.opts.vs
            } else {
                me.ta.scrollTop = (me.ta.scrollHeight - me.ta.clientHeight)
            }
            if (me.FixScroll)me.scrollbar.slider.bar.draw()
        }}, slider: {$e: this.$el.find('.cs-slider'), bar: {$e: this.$el.find('.bar'), draw: function () {
            if (me.ta.getScrollable() <= 0) {
                me.scrollbar.$e.css('visibility', 'hidden')
            } else {
                me.scrollbar.$e.css('visibility', 'visible')
            }
            this.drawHeight();
            if (me.FixScroll) {
                clearTimeout(this.timerScroll);
                this.timerScroll = setTimeout(function () {
                    me.scrollbar.slider.bar.setPosition()
                }, 50)
            } else {
                this.setPosition()
            }
        }, drawHeight: function () {
            var h = parseInt(me.scrollbar.slider.$e.height() * (me.ta.getPercentVisible()));
            this.$e.css('height', h)
        }, setPosition: function () {
            var ps = me.ta.scrollTop / me.ta.getScrollable();
            var top = parseInt((me.scrollbar.slider.$e.height() - this.$e.height()) * ps);
            this.$e.css('top', top)
        }, toggleDrag: function (e) {
            if (e.type == 'mousedown') {
                this.StartDragAtY = e.pageY;
                this.startDrag()
            } else if (this.dragging == true) {
                this.stopDrag()
            }
        }, startDrag: function () {
            //debug('start Drag');
            this.dragging = true;
            selectable(this.$e.get(0), false);
            this.StartDragTop = parseInt(this.$e.css('top').split('px')[0]);
            this.$e.bind('mousemove', function (e) {
                me.scrollbar.slider.bar.drag(e)
            });
            $(me.ta).unbind('scroll keyup')
        }, stopDrag: function () {
            this.dragging = false;
            selectable(this.$e.get(0), true);
            this.$e.unbind('mousemove');
            this.StartDragAtY = 0;
            $(me.ta).bind('scroll keyup', function (e) {
                me.scrollbar.slider.bar.draw()
            })
        }, drag: function (e) {
            var delta = this.StartDragAtY - e.pageY;
            var top = this.StartDragTop;
            var newtop = top - delta;
            if (newtop >= 0 && newtop <= (me.scrollbar.slider.$e.height() - this.$e.height())) {
                this.$e.css('top', newtop)
            }
            this.scrollTA();
            return false
        }, scrollTA: function () {
            var delta = me.scrollbar.slider.$e.height() - this.$e.height();
            var top = parseInt(this.$e.css('top').split('px')[0]);
            me.ta.scrollTop = me.ta.getScrollable() * (top / delta)
        }}}};
        var init = function () {
            me.FixScroll = navigator.userAgent.match(/safari|opera/i) !== null;
            me.$el.addClass(me.opts.theme);
            me.scrollbar.slider.bar.draw();
            bindEvents()
        };
        var bindEvents = function () {
            me.scrollbar.spinup.$e.bind('click', function (e) {
                me.scrollbar.spinup.scroll();
                return false
            });
            me.scrollbar.spindown.$e.bind('click', function (e) {
                me.scrollbar.spindown.scroll();
                return false
            });
            $(me.ta).bind('scroll keyup', function (e) {
                me.scrollbar.slider.bar.draw()
            });
            me.scrollbar.slider.bar.$e.bind('mousedown mouseup mouseleave', function (e) {
                me.scrollbar.slider.bar.toggleDrag(e)
            });
            if (me.FixScroll) {
                me.ta.addEventListener('mousewheel', function (e) {
                    me.scrollbar.slider.bar.draw()
                }, false)
            }
        };
        var selectable = function (elem, bool) {
            if (!elem)return;
            elem.unselectable = bool ? "off" : "on";
            elem.onselectstart = function () {
                return bool
            };
            if (document.selection && document.selection.empty)document.selection.empty();
            if (elem.style)elem.style.MozUserSelect = bool ? "" : "none"
        };
        init()
    };
    function debug(data) {
        if (typeof(console) != 'undefined') {
            console.log(data)
        }
    }
})(jQuery);
