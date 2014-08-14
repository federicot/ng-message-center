'use strict';

angular.module('federicot.ng-message-center', [])
.factory('ngMessageCenter', ['$rootScope', function($rootScope) {
    var messages = {
        next: [],
        current: []
    };
    var id = 0;
    var service = {
        defaultOptions: {
            next: false,
            stack: false,
            timeout: 3000
        },
        error: function(options) {
            options.type = 'alert-danger';
            this.add(options);
        },
        warning: function(options) {
            options.type = 'alert-warning';
            this.add(options);
        },
        success: function(options) {
            options.type = 'alert-success';
            this.add(options);
        },
        info: function(options) {
            options.type = 'alert-info';
            this.add(options);
        },
        add: function(options) {
            id = id + 1;
            var msg;
            msg = angular.extend({}, this.defaultOptions, options);

            if (!msg.stack) {
                this.clear();
            }

            msg.id = id;
            msg.close = function() {
                service.remove(this);
            };

            if (options.next) {
                messages.next.push(msg);
            } else {
                messages.current.push(msg);
            }
        },
        remove: function(message) {
            for(var i = 0, len = messages.current.length; i < len; i++) {
                if (messages.current[i].id === message.id) {
                    messages.current.splice(i, 1);
                    break;
                }
            }
        },
        clear: function() {
            messages.current.length = 0;
        },
        moveNextToCurrent: function() {
            angular.copy(messages.next, messages.current);
            messages.next.length = 0;
        },
        get: function() {
            return messages;
        }
    };

    $rootScope.$on('$locationChangeStart', function() {
        service.clear()
    });
    $rootScope.$on('$locationChangeSuccess', function() {
        service.moveNextToCurrent()
    });

    return service;
}])
.directive('ngmessagecenterMessages', ['$rootScope', 'ngMessageCenter', function($rootScope, ngMessageCenter) {
    var templateStr = '<div class="row" ng-repeat="message in messages.current">' +
                      ' <div class="col-lg-12">' +
                      '     <ngmessagecenter-message message="message"></ngmessagecenter-message>' +
                      ' </div>' +
                      '</div>';
    return {
        restrict: 'E',
        template: templateStr,
        link: function(scope, element, attrs) {
            scope.messages = ngMessageCenter.get();
        }
    };
}])

.directive('ngmessagecenterMessage', ['$timeout', 'ngMessageCenter', function($timeout, ngMessageCenter) {
    var templateStr = '<div class="alert fade in" role="alert" ng-class="message.type">' +
                      ' <button type="button" class="close" data-dismiss="alert">' +
                      '      <span aria-hidden="true">×</span>' +
                      ' </button>' +
                      ' <strong ng-if="message.title">{{message.title}} </strong>{{message.text}}' +
                      '</div>';
    return {
        restrict: 'E',
        template: templateStr,
        link: function(scope, element, attrs) {
            if (scope.message.timeout) {
                var $element = angular.element(element).children().first();
                $element.on('closed.bs.alert', function() {
                    scope.message.close();
                });
                scope.timer = $timeout(function() {
                    $element.alert('close');
                }, scope.message.timeout);
            }
        }
    };
}]);
