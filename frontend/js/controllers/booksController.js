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
        vm.loading = false;
        vm.error = null;
        vm.success = null;

        vm.loadBooks = loadBooks;
        vm.addBook = addBook;
        vm.deleteBook = deleteBook;
        vm.resetForm = resetForm;
        vm.getJsonUrl = getJsonUrl;

        init();

        function init() {
            loadBooks();
        }

        function getEmptyBook() {
            return {
                author: '',
                country: '',
                imageLink: '',
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

        function addBook() {
            if (!validateBook(vm.newBook)) {
                return;
            }

            vm.loading = true;
            vm.error = null;
            vm.success = null;

            BookService.create(vm.newBook)
                .then(function(book) {
                    vm.books.push(book);
                    vm.newBook = getEmptyBook();
                    vm.success = 'Book added successfully!';
                    vm.loading = false;
                })
                .catch(function(error) {
                    vm.error = 'Failed to add book: ' + (error.data?.message || JSON.stringify(error.data) || error.statusText || 'Unknown error');
                    vm.loading = false;
                });
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
            vm.error = null;
            vm.success = null;
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
