;(function () {
    'use strict';

    var deps = [
        'ngResource',
        'ngSanitize',
        'ngProgress',
        'pascalprecht.translate',
        'blockUI'
    ];

    var app = angular.module('app', deps);

    app.config(function ($translateProvider) {

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

    app.factory('Customer', ['$resource', function ($resource) {
        return $resource('http://localhost:3000/api/customers/:id');
    }]);

    app.controller('mainCtrl', ['$scope', 'Customer', 'ngProgressFactory','blockUI', function ($scope, Customer, ngProgressFactory,blockUI) {

        $scope.startValidation = undefined;

        $scope.submit = function () {
            $scope.startValidation = true;
            $scope.myForm.$valid = 1;

            $scope.fileIsValid = /pdf/i.test($scope.upload_file);
            if ($scope.myForm.$valid && /pdf/i.test($scope.upload_file)) {
                $scope.progressbar = ngProgressFactory.createInstance();
                $scope.progressbar.start();
                blockUI.start();

                var customerData = {
                    salutation: $scope.salutation,
                    forename: $scope.forename,
                    surname: $scope.surname,
                    street: $scope.street,
                    street_nr: $scope.street_nr,
                    po_box: $scope.po_box,
                    zip: $scope.zip,
                    city: $scope.city,
                    email: $scope.email,
                    telephone: $scope.telephone,
                    bank_name: $scope.bank_name,
                    bank_city: $scope.bank_city,
                    bank_iban: $scope.bank_iban,
                    bank_account: $scope.bank_account
                };

                customerData = btoa(JSON.stringify(customerData));

                var dataObject = {
                    customerData: customerData,
                    file: $scope.upload_file
                };

                console.log(dataObject);

                var customer = new Customer();
                customer.data = dataObject;
                customer.$save(function () {
                        $scope.progressbar.complete();
                        blockUI.stop();
                        console.log("OK");
                    },
                    function () {
                        $scope.progressbar.complete();
                        blockUI.stop();
                        console.log("FAIL");
                    });
            }
        };
    }]);

    app.directive("fileread", [function () {
        return {
            require: 'ngModel',
            scope: {
                fileread: "=ngModel"
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    };
                    try {
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    } catch (e) {
                        scope.fileread = undefined;
                    }
                });
            }
        }
    }]);

}());