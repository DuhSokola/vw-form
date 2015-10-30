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

        var dataObject = {
            salutation: $scope.salutation,
            forename: $scope.forename,
            surname: $scope.surname,
            street: $scope.street,
            street_nr: $scope.street_nr,
            po_box: $scope.po_box,
            zip:$scope.zip,
            city: $scope.city,
            telephone: $scope.telephone,
            bank_name: $scope.bank_name,
            bank_city: $scope.bank_city,
            bank_iban: $scope.bank_iban,
            bank_account: $scope.bank_account
        }



    }]);

    app.factory('Cust',['$resources',function($resources){

    }]);

}());