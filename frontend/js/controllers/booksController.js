(function() {
    'use strict';

    angular
        .module('booksApp')
        .controller('BooksController', BooksController);

    BooksController.$inject = ['$scope', 'BookService'];

    function BooksController($scope, BookService) {
        var vm = this;

        vm.books = [];
        vm.newBook = getEmptyBook();
        vm.selectedFile = null;
        vm.imagePreview = null;
        vm.selectedBook = null;
        vm.loading = false;
        vm.error = null;
        vm.success = null;

        vm.loadBooks = loadBooks;
        vm.addBook = addBook;
        vm.deleteBook = deleteBook;
        vm.resetForm = resetForm;
        vm.getJsonUrl = getJsonUrl;
        vm.onFileSelect = onFileSelect;
        vm.removeSelectedImage = removeSelectedImage;
        vm.openImageModal = openImageModal;

        init();

        function init() {
            loadBooks();
        }

        function getEmptyBook() {
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

        function loadBooks() {
            vm.loading = true;
            vm.error = null;

            BookService.getAll()
                .then(function(books) {
                    vm.books = books;
                    vm.loading = false;
                })
                .catch(function(error) {
                    vm.error = 'Failed to load books: ' + (error.data?.message || error.statusText || 'Unknown error');
                    vm.loading = false;
                });
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
            vm.selectedFile = null;
            vm.imagePreview = null;
            var fileInput = document.getElementById('imageFile');
            if (fileInput) {
                fileInput.value = '';
            }
        }

        function addBook() {
            if (!validateBook(vm.newBook)) {
                return;
            }

            vm.loading = true;
            vm.error = null;
            vm.success = null;

            var createBook = function() {
                BookService.create(vm.newBook)
                    .then(function(book) {
                        vm.books.push(book);
                        vm.newBook = getEmptyBook();
                        vm.selectedFile = null;
                        vm.imagePreview = null;
                        var fileInput = document.getElementById('imageFile');
                        if (fileInput) fileInput.value = '';
                        vm.success = 'Book added successfully!';
                        vm.loading = false;
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to add book: ' + (error.data?.message || JSON.stringify(error.data) || error.statusText || 'Unknown error');
                        vm.loading = false;
                    });
            };

            if (vm.selectedFile) {
                BookService.uploadImage(vm.selectedFile)
                    .then(function(image) {
                        vm.newBook.image_id = image.id;
                        createBook();
                    })
                    .catch(function(error) {
                        vm.error = 'Failed to upload image: ' + (error.data?.message || JSON.stringify(error.data?.errors) || error.statusText || 'Unknown error');
                        vm.loading = false;
                    });
            } else {
                createBook();
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
                    var index = vm.books.indexOf(book);
                    if (index > -1) {
                        vm.books.splice(index, 1);
                    }
                    vm.success = 'Book deleted successfully!';
                    vm.loading = false;
                })
                .catch(function(error) {
                    vm.error = 'Failed to delete book: ' + (error.data?.message || error.statusText || 'Unknown error');
                    vm.loading = false;
                });
        }

        function resetForm() {
            vm.newBook = getEmptyBook();
            vm.selectedFile = null;
            vm.imagePreview = null;
            var fileInput = document.getElementById('imageFile');
            if (fileInput) fileInput.value = '';
            vm.error = null;
            vm.success = null;
        }

        function openImageModal(book) {
            vm.selectedBook = book;
            var modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        }

        function getJsonUrl() {
            return 'http://localhost:8080/books/export';
        }

        function validateBook(book) {
            if (!book.title || !book.author || !book.country || !book.language || !book.pages || !book.year) {
                vm.error = 'Please fill in all required fields';
                return false;
            }
            return true;
        }
    }
})();
