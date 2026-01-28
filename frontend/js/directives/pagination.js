(function() {
    'use strict';

    angular
        .module('booksApp')
        .directive('booksPagination', booksPagination);

    function booksPagination() {
        return {
            restrict: 'E',
            templateUrl: 'templates/pagination.html',
            scope: {
                currentPage: '<',
                pageCount: '<',
                totalCount: '<',
                onPageSelect: '&',
                onPrev: '&',
                onNext: '&'
            },
            link: function(scope) {
                scope.$watchGroup(['currentPage', 'pageCount'], function() {
                    scope.pages = generatePageNumbers(scope.currentPage, scope.pageCount);
                });

                function generatePageNumbers(current, total) {
                    var pages = [];
                    if (!total) return pages;

                    var start = Math.max(1, current - 2);
                    var end = Math.min(total, current + 2);

                    for (var i = start; i <= end; i++) {
                        pages.push(i);
                    }
                    return pages;
                }
            }
        };
    }
})();
