(function() {
    'use strict';

    angular
        .module('booksApp')
        .directive('imageModal', imageModal);

    imageModal.$inject = ['API_URL'];

    function imageModal(API_URL) {
        return {
            restrict: 'E',
            templateUrl: 'templates/image-modal.html',
            scope: {
                book: '<',
                modalId: '@'
            },
            link: function(scope) {
                scope.apiUrl = API_URL;
            }
        };
    }
})();
