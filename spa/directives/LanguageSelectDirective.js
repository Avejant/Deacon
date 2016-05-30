angular.module('deaconApp').directive('ngTranslateLanguageSelect', function(LocaleService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        template: '' +
            '<li class="language-select dropdown" ng-if="visible">' +
            '<a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{"directives.language-select.Language" | translate}} <span class="caret"></span></a>'+
            '<ul class="dropdown-menu">'+
            '<li ' +
            'ng-repeat="localesDisplayName in localesDisplayNames"' +
            'ng-click="changeLanguage(localesDisplayName)">' +
            '<a href=""> {{localesDisplayName}} <span ng-if="localesDisplayName === currentLocaleDisplayName" class="glyphicon glyphicon-ok"></span></a>'+
            '</li>' +
            '</ul>'+
            '</li>' +
            '',
        controller: function($scope) {
            $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
            $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
            $scope.visible = $scope.localesDisplayNames &&
                $scope.localesDisplayNames.length > 1;

            $scope.changeLanguage = function(locale) {
                LocaleService.setLocaleByDisplayName(locale);
                $scope.currentLocaleDisplayName = locale;
            };
        }
    };
});
