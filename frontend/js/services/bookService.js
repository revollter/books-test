(function() {
    'use strict';

    angular
        .module('booksApp')
        .factory('BookService', BookService);

    BookService.$inject = ['$http', 'API_URL'];

    function BookService($http, API_URL) {
        var service = {
            getAll: getAll,
            get: get,
            create: create,
            update: update,
            remove: remove
        };

        return service;

        function getAll() {
            return $http.get(API_URL + '/books')
                .then(function(response) {
                    return response.data;
                });
        }

        function get(id) {
            return $http.get(API_URL + '/books/' + id)
                .then(function(response) {
                    return response.data;
                });
        }

        function create(book) {
            return $http.post(API_URL + '/books', book)
                .then(function(response) {
                    return response.data;
                });
        }

        function update(id, book) {
            return $http.put(API_URL + '/books/' + id, book)
                .then(function(response) {
                    return response.data;
                });
        }

        function remove(id) {
            return $http.delete(API_URL + '/books/' + id)
                .then(function(response) {
                    return response.data;
                });
        }
    }
})();
