(function() {
    'use strict';

    angular
        .module('booksApp')
        .directive('fileInput', fileInput);

    function fileInput() {
        return {
            restrict: 'A',
            scope: {
                fileInput: '&'
            },
            link: function(scope, element) {
                element.on('change', function(event) {
                    var files = event.target.files;
                    scope.$apply(function() {
                        scope.fileInput({ files: files });
                    });
                });

                // Cleanup
                scope.$on('$destroy', function() {
                    element.off('change');
                });
            }
        };
    }
})();
