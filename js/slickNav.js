(function ($) {
  'use strict';

  if (!$.fn.slickNav) {
    $.fn.slickNav = function (item, ops) {
      var defaults = {
        parentNode: false,
        circle: false,
        circleSize: '30px',
        circleBorder: '1px',
        circleTrack: 'rgba(0, 0, 0, .2)',
        progress: false,
        progressWidth: '150px',
        progressHeight: '3px',
        progressTrack: '#000',
        progressFill: '#fff',
        dotSize: '5px',
        dotDefaultColor: '#ccc',
        dotColor: '#f00',
        controls: true,
        controlsOnly: false,
        duration: 5000,
      };

      var settings = $.extend({}, defaults, ops);

      var $this = this;
      var wrap = document.createElement('div');
      var dotsWrap = document.createElement('div');
      var progressWrap = document.createElement('div');
      var btnsWrap = document.createElement('div');

      var _duration = 'all linear ' + settings.duration + 'ms';
      var _circleXY = parseInt(settings.circleSize) / 2;
      var _circleBorder = parseInt(settings.circleBorder);
      var _circleR = _circleXY - _circleBorder;
      var _circumference =
        Math.PI *
        (parseInt(settings.circleSize) - parseInt(settings.circleBorder) * 2);

      var $childLength = 0;

      $.each($this.find(item), function (idx, ele) {
        if (!$(ele).hasClass('slick-cloned')) {
          $childLength++;
        }
      });

      var activeFunc = function () {};

      var currentIdx = 0;

      wrap.classList.add('slick-nav');
      progressWrap.classList.add('slick-nav__progress');
      dotsWrap.classList.add('slick-nav__dots');
      btnsWrap.classList.add('slick-nav__btns');

      var btnsHTML =
        '<button type="button" class="slick-nav__prev" style="cursor: pointer;">prev</button><button type="button" class="slick-nav__pause" style="cursor: pointer;">pause</button><button type="button" class="slick-nav__next" style="cursor: pointer;">next</button>';
      $(btnsWrap).append(btnsHTML).css({
        'display': 'flex',
        'align-items': 'center',
      });

      if (settings.controls) {
        $(wrap).append(btnsWrap);
      }

      if (settings.circle && settings.progress) {
        throw Error('progress와 circle 속성을 같이 사용할 수 없습니다.');
      }

      if (!settings.controlsOnly) {
        if (settings.progress) {
          // Progress Bar
          parseProgress();

          activeFunc = function () {
            activeProgress(currentIdx);
          };
        } else {
          if (settings.circle) {
            // Dots
            parseCircles();
          } else {
            parseDots();
          }

          activeFunc = function () {
            activeDots(currentIdx);
          };
        }
      }

      function parseCircles() {
        $(wrap).css({
          'display': 'flex',
          'align-items': 'center',
        });

        for (var i = 0; i < $childLength; i++) {
          var dotStr =
            '<button type="button" class="circle"><div class="circle__dot"></div><svg class="circle__track"><circle cx=' +
            _circleXY +
            ' cy=' +
            _circleXY +
            ' r=' +
            _circleR +
            '></circle></svg><svg class="circle__fill"><circle cx=' +
            _circleXY +
            ' cy=' +
            _circleXY +
            ' r=' +
            _circleR +
            '></circle></button>';
          $(dotsWrap).append(dotStr);
        }

        $(dotsWrap)
          .find('.circle')
          .css({
            'fill': 'none',
            'transform-origin': 'center',
            'stroke-width': settings.circleBorder,
            'width': settings.circleSize,
            'height': settings.circleSize,
            'position': 'relative',
            'cursor': 'pointer',
            'padding': 0,
            'outline': 0,
            'border': 'none',
            'background': 'none',
          })
          .end()
          .find('.circle__dot')
          .css({
            'width': settings.dotSize,
            'height': settings.dotSize,
            'background-color': settings.dotDefaultColor,
            'border-radius': '50%',
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
          })
          .end()
          .find('svg')
          .css({
            'stroke-dasharray': _circumference,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
          })
          .end()
          .find('.circle__track')
          .css({
            'opacity': 0,
            'z-index': 0,
            'transition': 'all linear .15s',
          })
          .find('circle')
          .css({
            stroke: settings.circleTrack,
          })
          .end()
          .end()
          .find('.circle__fill')
          .css({
            'z-index': 1,
            'stroke-dashoffset': _circumference,
            'transform': 'rotate(270deg)',
          })
          .find('circle')
          .css({
            stroke: settings.dotColor,
          });

        $(wrap).prepend(dotsWrap);
      }

      function parseDots() {
        $(wrap).css({
          'display': 'flex',
          'align-items': 'center',
        });

        for (var i = 0; i < $childLength; i++) {
          var dotStr =
            '<button type="button" class="circle"><div class="circle__dot"></div></button>';
          $(dotsWrap)
            .append(dotStr)
            .find('.circle')
            .css({
              padding: 0,
              outline: 0,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            })
            .find('.circle__dot')
            .css({
              'width': settings.dotSize,
              'height': settings.dotSize,
              'background-color': settings.dotDefaultColor,
              'border-radius': '50%',
            });
        }

        $(wrap).prepend(dotsWrap);
      }

      function parseProgress() {
        $(wrap).css({
          'display': 'flex',
          'align-items': 'center',
        });

        var total = $childLength < 10 ? '0' + $childLength : $childLength;

        var progressHTML =
          '<p class="progress__current">01</p><div class="progress__track"><div class="progress__fill"></div></div><p class="progress__total">' +
          total +
          '</p>';

        $(progressWrap)
          .append(progressHTML)
          .css({
            'display': 'flex',
            'align-items': 'center',
          })
          .find('.progress__track')
          .css({
            'position': 'relative',
            'width': settings.progressWidth,
            'height': settings.progressHeight,
            'background-color': settings.progressTrack,
          })
          .find('.progress__fill')
          .css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': '0%',
            'height': '100%',
            'background-color': settings.progressFill,
          });

        $(wrap).prepend(progressWrap);
      }

      function activeProgress(idx) {
        idx += 1;
        idx = idx < 10 ? '0' + idx : idx;

        if ($(progressWrap).hasClass('active')) {
          $(progressWrap).find('.progress__fill').css({
            width: '100%',
            transition: _duration,
          });
        } else {
          $(progressWrap).find('.progress__fill').css({
            width: '0%',
            transition: 'auto',
          });
        }

        $(progressWrap).find('.progress__current').text(idx);
      }

      function activeDots(idx) {
        $.each($(dotsWrap).find('.circle'), function (i, v) {
          if (settings.circle) {
            if ($(v).hasClass('active')) {
              $(v)
                .find('.circle__dot')
                .css({
                  'background-color': settings.dotColor,
                })
                .end()
                .find('.circle__track')
                .css({
                  opacity: 1,
                })
                .end()
                .find('.circle__fill')
                .css({
                  'transition': _duration,
                  'stroke-dashoffset': '0',
                });
            } else {
              $(v)
                .find('.circle__dot')
                .css({
                  'background-color': settings.dotDefaultColor,
                })
                .end()
                .find('.circle__track')
                .css({
                  opacity: 0,
                })
                .end()
                .find('.circle__fill')
                .css({
                  'transition': 'none',
                  'stroke-dashoffset': _circumference,
                });
            }
          } else {
            if ($(v).hasClass('active')) {
              $(v).find('.circle__dot').css({
                'background-color': settings.dotColor,
              });
            } else {
              $(v).find('.circle__dot').css({
                'background-color': settings.dotDefaultColor,
              });
            }
          }
        });
      }

      function init() {
        if (settings.parentNode) {
          $(settings.parentNode).append($(wrap));
        } else {
          $this.append($(wrap));
        }

        $(dotsWrap)
          .find('.circle')
          .on('click', function () {
            var idx = $(this).index();
            $this.slick('slickGoTo', idx);
          });

        $(btnsWrap)
          .find('.slick-nav__prev')
          .on('click', function () {
            $this.slick('slickPrev');
          });

        $(btnsWrap)
          .find('.slick-nav__next')
          .on('click', function () {
            $this.slick('slickNext');
          });

        $(btnsWrap)
          .find('.slick-nav__pause')
          .on('click', function () {
            if (!$(this).hasClass('paused')) {
              $(this).addClass('paused').text('play');
              $this.slick('slickPause');
              $(dotsWrap).find('.circle').removeClass('active');
              $(progressWrap).removeClass('active');

              activeFunc(currentIdx);
            } else {
              $(this).removeClass('paused').text('pause');
              $this.slick('slickPlay').slick('slickNext');
            }
          });

        $this.on('beforeChange', function (e, s, c, n) {
          currentIdx = n;

          $(progressWrap).removeClass('active');
          $(dotsWrap).find('.circle').removeClass('active');
          $(dotsWrap).find('.circle').eq(n).addClass('active');

          activeFunc(currentIdx);
        });

        $this.on('afterChange', function (e, s, c) {
          currentIdx = c;

          $(progressWrap).addClass('active');
          activeFunc(currentIdx);
        });

        $(window).on('load', function () {
          $(dotsWrap).find('.circle').eq(0).addClass('active');
          $(progressWrap).addClass('active');

          activeFunc(0);
        });
      }

      init();

      return this;
    };
  }
})(jQuery);
