(function() {
    'use strict';

    angular
        .module('booksApp')
        .controller('BooksController', BooksController);

    BooksController.$inject = ['$scope', 'BookService', 'API_URL'];

    function BooksController($scope, BookService, API_URL) {
        var vm = this;

        // Data
        vm.books = [];
        vm.newBook = createEmptyBook();
        vm.selectedBook = null;
        vm.selectedFile = null;
        vm.imagePreview = null;

        // State
        vm.loading = false;
        vm.error = null;
        vm.success = null;

        // Pagination
        vm.pagination = {
            currentPage: 1,
            pageCount: 1,
            perPage: 10,
            totalCount: 0
        };

        // API URL for templates
        vm.apiUrl = API_URL;

        // Public methods
        vm.loadBooks = loadBooks;
        vm.addBook = addBook;
        vm.deleteBook = deleteBook;
        vm.resetForm = resetForm;
        vm.onFileSelect = onFileSelect;
        vm.removeSelectedImage = removeSelectedImage;
        vm.openImageModal = openImageModal;
        vm.goToPage = goToPage;
        vm.nextPage = nextPage;
        vm.prevPage = prevPage;
        vm.getJsonUrl = getJsonUrl;

        // Init
        loadBooks(1);

        // Private functions
        function createEmptyBook() {
            return {
                author: '',
                country: '',
                image_id: null,
                language: '',
                link: '',
                pages: null,
                title: '',
                year: null
            };
        }

        function loadBooks(page) {
            vm.loading = true;
            vm.error = null;

            BookService.getAll(page, vm.pagination.perPage)
                .then(function(result) {
                    vm.books = result.data;
                    vm.pagination = result.pagination;
                    vm.loading = false;
                })
                .catch(function(error) {
                    vm.error = 'Failed to load books: ' + getErrorMessage(error);
                    vm.loading = false;
                });
        }

        function addBook() {
            if (!validateBook(vm.newBook)) {
                return;
            }

            vm.loading = true;
            vm.error = null;
            vm.success = null;

            var saveBook = function() {
                BookService.create(vm.newBook)
                    .then(function() {
                        vm.newBook = createEmptyBook();
                        clearFileInput();
                        vm.success = 'Book added successfully!';
                        loadBooks(1);
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to add book: ' + getErrorMessage(error);
                        vm.loading = false;
                    });
            };

            if (vm.selectedFile) {
                BookService.uploadImage(vm.selectedFile)
                    .then(function(image) {
                        vm.newBook.image_id = image.id;
                        saveBook();
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to upload image: ' + getErrorMessage(error);
                        vm.loading = false;
                    });
            } else {
                saveBook();
            }
        }

        function deleteBook(book) {
            if (!confirm('Are you sure you want to delete "' + book.title + '"?')) {
                return;
            }

            vm.loading = true;
            vm.error = null;

            BookService.remove(book.id)
                .then(function() {
                    vm.success = 'Book deleted successfully!';
                    loadBooks(vm.pagination.currentPage);
                })
                .catch(function(error) {
                    vm.error = 'Failed to delete book: ' + getErrorMessage(error);
                    vm.loading = false;
                });
        }

        function resetForm() {
            vm.newBook = createEmptyBook();
            clearFileInput();
            vm.error = null;
            vm.success = null;
        }

        function onFileSelect(files) {
            if (files && files[0]) {
                vm.selectedFile = files[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.$apply(function() {
                        vm.imagePreview = e.target.result;
                    });
                };
                reader.readAsDataURL(vm.selectedFile);
            }
        }

        function removeSelectedImage() {
            clearFileInput();
        }

        function clearFileInput() {
            vm.selectedFile = null;
            vm.imagePreview = null;
            var fileInput = document.getElementById('imageFile');
            if (fileInput) fileInput.value = '';
        }

        function openImageModal(book) {
            vm.selectedBook = book;
            var modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        }

        function goToPage(page) {
            if (page >= 1 && page <= vm.pagination.pageCount) {
                loadBooks(page);
            }
        }

        function nextPage() {
            goToPage(vm.pagination.currentPage + 1);
        }

        function prevPage() {
            goToPage(vm.pagination.currentPage - 1);
        }

        function getJsonUrl() {
            return API_URL + '/books/export';
        }

        function validateBook(book) {
            if (!book.title || !book.author || !book.country || !book.language || !book.pages || !book.year) {
                vm.error = 'Please fill in all required fields';
                return false;
            }
            return true;
        }

        function getErrorMessage(error) {
            if (error.data) {
                if (error.data.message) return error.data.message;
                if (error.data.errors) return JSON.stringify(error.data.errors);
                if (typeof error.data === 'string') return error.data;
                return JSON.stringify(error.data);
            }
            return error.statusText || 'Unknown error';
        }
    }
})();
