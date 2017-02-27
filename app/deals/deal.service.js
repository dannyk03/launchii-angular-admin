(function() {
    'use strict';

    angular.module('app')
        .factory('DealService', DealService);

    DealService.$inject = ['$http', 'CONST', '$q', 'HelperService'];

    /* @ngInject */
    function DealService($http, CONST, $q, HelperService) {
        var api = CONST.api_domain + 'deals/';

        var service = {
            lists: [],
            errors: [],
            add: add,
            edit: edit,
            delete: _delete,
            getAll: getAll,
            find: find
        }

        return service;

        //////// SERIVCE METHODS ////////

        function getAll() {
            var d = $q.defer();

            $http.get(api)
                .then(function(data) {
                    d.resolve(data.data);
                })
                .catch(function(error) {
                    //console.log(error.data);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function find(id) {
            var d = $q.defer();

            $http({
                    method: 'GET',
                    url: api + id,
                    //params: {id: id}
                })
                .then(function(data) {
                    d.resolve(data.data);
                })
                .catch(function(error) {
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function add(data) {
            var url = api + "add/";
            var d = $q.defer();

            $http.post(url, data)
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    console.log(error.data);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function edit(data) {
            var url = api + "edit/";
            var d = $q.defer();

            $http.post(url, data)
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    console.log(error.data);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }

        function _delete(id) {
            var url = api + "delete/" + id;
            var d = $q.defer();

            $http.post(url, {})
                .then(function(resp) {
                    d.resolve(resp);
                }).catch(function(error) {
                    console.log(error.data);
                    service.errors = error;
                    d.reject(error);
                });

            return d.promise;
        }
    }

})();