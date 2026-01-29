(function() {
    'use strict';

    angular
        .module('booksApp')
        .directive('confirmModal', confirmModal);

    function confirmModal() {
        return {
            restrict: 'E',
            templateUrl: 'templates/confirm-modal.html',
            scope: {
                modalId: '@',
                title: '@',
                message: '<',
                confirmText: '@',
                confirmClass: '@',
                onConfirm: '&',
                loading: '<'
            },
            link: function(scope) {
                scope.confirmClass = scope.confirmClass || 'btn-danger';
                scope.confirmText = scope.confirmText || 'Confirm';
            }
        };
    }
})();
