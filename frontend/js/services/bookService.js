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
            remove: remove,
            uploadImage: uploadImage
        };

        return service;

        function getAll(page, perPage) {
            page = page || 1;
            perPage = perPage || 10;

            return $http.get(API_URL + '/books', {
                params: { page: page, 'per-page': perPage }
            }).then(function(response) {
                return {
                    data: response.data,
                    pagination: {
                        totalCount: parseInt(response.headers('X-Pagination-Total-Count')) || 0,
                        pageCount: parseInt(response.headers('X-Pagination-Page-Count')) || 1,
                        currentPage: parseInt(response.headers('X-Pagination-Current-Page')) || 1,
                        perPage: parseInt(response.headers('X-Pagination-Per-Page')) || perPage
                    }
                };
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

        function uploadImage(file) {
            var formData = new FormData();
            formData.append('file', file);

            return $http.post(API_URL + '/images', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(response) {
                return response.data;
            });
        }
    }
})();
