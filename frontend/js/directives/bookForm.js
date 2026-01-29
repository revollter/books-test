(function() {
    'use strict';

    angular
        .module('booksApp')
        .directive('bookForm', bookForm);

    function bookForm() {
        return {
            restrict: 'E',
            templateUrl: 'templates/book-form.html',
            scope: {
                book: '=',
                selectedFile: '=',
                inputId: '@'
            }
        };
    }
})();
