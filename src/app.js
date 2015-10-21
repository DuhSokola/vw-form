;(function(){
    'use strict';

    var deps = [
        'ngSanitize',
        'pascalprecht.translate'
    ];

    var app = angular.module('app',deps);

    app.config(function($translateProvider){

        /**
         * Translations
         */
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/lang-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('de_CH');
    });

    app.controller('mainCtrl',['$scope',function($scope){

    }]);

}());