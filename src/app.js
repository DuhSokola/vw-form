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
        //return $resource('https://cashback.volkswagen.ch/VWCashBackBackend/vwCashBack');
        return $resource('https://www.leadcollector.amag.ch/VWCashBackBackend/vwCashBack');
        //return $resource('http://s1100pws429.dmz.car.web:8080/VWCashBackBackend/vwCashBack');
        //return $resource('http://localhost:8080/vwCashBack');
        //return $resource('http://localhost:3000/VWCashBackBackend/vwCashBack');
    }]);

    app.controller('mainCtrl', ['$scope', 'Customer', 'ngProgressFactory', 'blockUI', '$translate', '$http', function ($scope, Customer, ngProgressFactory, blockUI, $translate, $http) {

        $scope.submitted = false;
        $scope.failed = false;

        $scope.language = location.search.split("=")[1] || 'de';
        if ($scope.language == 'de') {
            $translate.use('de_CH');
        }
        else if ($scope.language == 'fr') {
            $translate.use('fr_FR');
        }
        else if ($scope.language == 'it') {
            $translate.use('it_IT');
        }

        $scope.startValidation = undefined;
        $scope.$watch('bank_iban', function () {
            if ($scope.bank_iban) {
                $scope.IBANisValid = /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/.test($scope.bank_iban.replace(/ /g, ''));
            } else {
                $scope.IBANisValid = false;
            }
        });
        $scope.submit = function () {
            $scope.startValidation = true;
            //$scope.myForm.$valid = 1;

            if ($scope.bank_iban) {
                $scope.IBANisValid = /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/.test($scope.bank_iban.replace(/ /g, ''));
            } else {
                $scope.IBANisValid = false;
            }

            $scope.fileIsValid = /application\/pdf/.test($scope.upload_file);



            if(($scope.bank_iban && $scope.bank_name && $scope.bank_city) || $scope.bank_account){
                $scope.myForm.$valid = true;
                $scope.myForm.$invalid = false;
            }else{
                $scope.myForm.$valid = false;
                $scope.myForm.$invalid = true;
            }

            if(!$scope.fileIsValid){
                $scope.myForm.$valid = false;
                $scope.myForm.$invalid = true;
            }

            if ($scope.myForm.$valid && $scope.fileIsValid) {
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
                    bank_account: $scope.bank_account,
                    language: $scope.language
                };

                console.log(customerData);

                customerData = btoa(JSON.stringify(customerData));

                var dataObject = {
                    customerData: customerData,
                    file: $scope.upload_file
                };

                console.log(JSON.stringify(dataObject));

                var customer = new Customer();
                customer.data = dataObject;
                customer.$save(function (res) {
                        console.log(res);
                        $scope.progressbar.complete();
                        blockUI.stop();
                        $scope.submitted = true;
                        $scope.failed = false;
                        console.log("OK");
                    },
                    function (err) {
                        console.log(err);
                        $scope.progressbar.complete();
                        blockUI.stop();
                        $scope.submitted = true;
                        $scope.failed = true;
                        console.log("FAIL");
                    });

                /*$http.post('http://leadcollector.amag.ch/VWCashBackBackend/vwCashBack', dataObject).then(function successCallback(res) {
                    console.log(res);
                    $scope.progressbar.complete();
                    blockUI.stop();
                    $scope.submitted = true;
                    $scope.failed = false;
                    console.log("OK");
                }, function errorCallback(err) {
                    console.log(err);
                    $scope.progressbar.complete();
                    blockUI.stop();
                    $scope.submitted = true;
                    $scope.failed = true;
                    console.log("FAIL");
                });*/

            }else{
                console.log('INVALID')
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
                            console.log(loadEvent.target.result);
                            scope.fileread = loadEvent.target.result;
                        });
                    };
                    try {
                        if (changeEvent.target.files[0].size < 10484736) {
                            console.log(changeEvent.target.files[0]);
                            console.log(mOxie);

                            reader.readAsDataURL(changeEvent.target.files[0]);
                            console.log(reader.readAsDataURL(changeEvent.target.files[0]));
                        } else {
                            alert("File is to big (max. 10Mb)");
                        }
                    } catch (e) {
                        scope.fileread = undefined;
                    }
                });
            }
        }
    }]);

}());