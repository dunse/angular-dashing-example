angular.module('adDirectives', ['gridster'])
  .run(['gridsterConfig', function(gridsterConfig) {
    gridsterConfig.colWidth = 300;
  }])
  .directive('adArc', function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        value: '=',
        min: '@',
        max: '@',
        title: '@'
      },
      template: '<li gridster-item size-x="1" size-y="1" class="widget ad-arc">' +
        '<div>' +
        '<h1 class="title" data-bind="title">{{title}}</h1>' +
        '<div style="display:inline;width:200px;height:200px;"><input readonly="readonly" class="ad-arc"></div>' +
        '</div></li>',

      link: function (scope, element, attrs) {
        var arcOpts = {
          angleOffset: -125,
          angleArc: 250,
          width: 200,
          readOnly: true,
          bgColor: "rgba(0, 0, 0, 0.4)",
          fgColor: "rgb(255, 255, 255)",
          min: scope.min || 0,
          max: scope.max || 100
        };
        $timeout(function () {
          var el = $(element).find("input");
          el.knob(arcOpts);
          scope.$watch('value', function () {
            $({value: el.val()}).animate({
              value: scope.value
            }, {
              step: function () {
                el.val(Math.ceil(this.value))
                  .trigger('change');
              },
              complete: function () {
                if (el.val() !== scope.value) {
                  el.val(scope.value).trigger('change');
                }
              },
              duration: 1500
            });
          });
        });
      }
    };
  })
  .directive('adNumber', function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        value: '=',
        title: '@'
      },
      template: '<li gridster-item size-x="1" size-y="1" class="widget ad-number">' +
        '<div>' +
        '<h1 class="title">{{title}}</h1>' +
        '<h2>0</h2><p class="change-rate"><i></i><span class="per-cent">0</span></p>' +
        '</div></li>',

      link: function (scope, element, attrs) {
        var numEl = $(element).find('h2');
        var iEl = $(element).find('i');
        var pcEl = $(element).find('span');
        $timeout(function () {
          scope.$watch('value', function () {
            var startValue = parseInt(numEl.text());
            var difference = Math.floor((1 - (scope.value / startValue))*100) || 0;

            if (scope.value > startValue) {
              difference = Math.floor((scope.value / startValue)*100);
              iEl.removeClass('fa fa-arrow-down').addClass('fa fa-arrow-up');
            } else {
              iEl.removeClass('fa fa-arrow-up').addClass('fa fa-arrow-down');
            }

            $({value: startValue}).animate({
              value: scope.value
            }, {
              step: function() {
                numEl.text(Math.floor(this.value));
              },
              complete: function() {
                if (parseInt(numEl.text()) !== scope.value) {
                  numEl.text(scope.value);
                }
              },
              duration: 1500
            });

            var startPerCent = parseInt(pcEl.text());
            $({value: startPerCent}).animate({
              value: difference
            }, {
              step: function() {
                pcEl.text(Math.floor(this.value));
              },
              complete: function() {
                if (parseInt(pcEl.text()) !== difference) {
                  pcEl.text(difference);
                }
              },
              duration: 1500
            });

          });
        });
      }
    };
  });
