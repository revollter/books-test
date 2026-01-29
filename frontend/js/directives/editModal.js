(function() {
    'use strict';

    angular
        .module('booksApp')
        .directive('editModal', editModal);

    function editModal() {
        return {
            restrict: 'E',
            templateUrl: 'templates/edit-modal.html',
            scope: {
                editBook: '=',
                modalId: '@',
                loading: '<',
                onSave: '&'
            },
            link: function(scope) {
                scope.selectedFile = null;

                scope.$watch('editBook', function(newVal) {
                    if (newVal) {
                        scope.selectedFile = null;
                    }
                });
            }
        };
    }
})();
