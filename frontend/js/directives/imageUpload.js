(function() {
    'use strict';

    angular
        .module('booksApp')
        .directive('imageUpload', imageUpload);

    imageUpload.$inject = ['API_URL'];

    /**
     * Image upload component with preview functionality.
     * Handles file selection, preview generation, and image removal.
     */
    function imageUpload(API_URL) {
        return {
            restrict: 'E',
            templateUrl: 'templates/image-upload.html',
            scope: {
                imageLink: '=',
                selectedFile: '=',
                inputId: '@'
            },
            link: function(scope, element) {
                scope.apiUrl = API_URL;
                scope.imagePreview = null;

                /**
                 * Handles file selection from input
                 * @param {FileList} files - Selected files
                 */
                scope.onFileSelect = function(files) {
                    if (!files || !files[0]) {
                        return;
                    }

                    scope.selectedFile = files[0];
                    generatePreview(scope.selectedFile);
                };

                /**
                 * Clears the selected file and preview
                 */
                scope.clearFile = function() {
                    scope.selectedFile = null;
                    scope.imagePreview = null;
                    clearFileInput();
                };

                /**
                 * Removes the existing image link
                 */
                scope.removeImage = function() {
                    scope.imageLink = null;
                    scope.clearFile();
                };

                // Watch for external changes to imageLink
                scope.$watch('imageLink', function(newVal, oldVal) {
                    if (newVal !== oldVal && !newVal) {
                        scope.clearFile();
                    }
                });

                // Watch for external changes to selectedFile (e.g., form reset)
                scope.$watch('selectedFile', function(newVal, oldVal) {
                    if (oldVal && !newVal) {
                        scope.imagePreview = null;
                        clearFileInput();
                    }
                });

                // Cleanup on destroy
                scope.$on('$destroy', function() {
                    scope.imagePreview = null;
                    scope.selectedFile = null;
                });

                /**
                 * Generates base64 preview from file
                 * @param {File} file - The file to preview
                 */
                function generatePreview(file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        scope.$apply(function() {
                            scope.imagePreview = e.target.result;
                        });
                    };
                    reader.readAsDataURL(file);
                }

                /**
                 * Clears the file input element
                 */
                function clearFileInput() {
                    var input = element[0].querySelector('input[type="file"]');
                    if (input) {
                        input.value = '';
                    }
                }
            }
        };
    }
})();
