(function() {
    'use strict';

    angular
        .module('booksApp')
        .controller('BooksController', BooksController);

    BooksController.$inject = ['$q', 'BookService', 'ModalService', 'API_URL'];

    /**
     * Main controller for books management.
     * Handles CRUD operations, pagination, and modal interactions.
     */
    function BooksController($q, BookService, ModalService, API_URL) {
        var vm = this;

        // Constants
        vm.apiUrl = API_URL;

        // Data models
        vm.books = [];
        vm.newBook = createEmptyBook();
        vm.selectedFile = null;

        // Modal data
        vm.selectedBook = null;
        vm.editBook = null;
        vm.bookToDelete = null;
        vm.deleteMessage = '';

        // UI State
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

        // Public API - CRUD
        vm.loadBooks = loadBooks;
        vm.addBook = addBook;
        vm.updateBook = updateBook;
        vm.resetForm = resetForm;
        vm.getJsonUrl = getJsonUrl;

        // Public API - Pagination
        vm.goToPage = goToPage;
        vm.nextPage = nextPage;
        vm.prevPage = prevPage;

        // Public API - Modals
        vm.openImageModal = openImageModal;
        vm.openEditModal = openEditModal;
        vm.openDeleteModal = openDeleteModal;
        vm.confirmDelete = confirmDelete;

        // Initialize
        activate();

        // ============ Initialization ============

        function activate() {
            loadBooks(1);
        }

        // ============ CRUD Operations ============

        /**
         * Loads books with pagination
         * @param {number} page - Page number to load
         */
        function loadBooks(page) {
            vm.loading = true;
            vm.error = null;

            BookService.getAll(page, vm.pagination.perPage)
                .then(handleBooksLoaded)
                .catch(handleError('Failed to load books'));
        }

        /**
         * Adds a new book with optional image
         */
        function addBook() {
            if (!validateBook(vm.newBook)) {
                return;
            }

            vm.loading = true;
            clearMessages();

            var bookData = angular.copy(vm.newBook);

            uploadImageIfPresent(vm.selectedFile)
                .then(function(imageId) {
                    if (imageId) {
                        bookData.image_id = imageId;
                    }
                    return BookService.create(bookData);
                })
                .then(function() {
                    vm.newBook = createEmptyBook();
                    vm.selectedFile = null;
                    vm.success = 'Book added successfully!';
                    loadBooks(1);
                })
                .catch(handleError('Failed to add book'));
        }

        /**
         * Updates an existing book
         * @param {Object} book - Book data to update
         * @param {File} file - Optional new image file
         */
        function updateBook(book, file) {
            if (!validateBook(book)) {
                return;
            }

            vm.loading = true;
            clearMessages();

            var bookData = extractBookData(book);

            uploadImageIfPresent(file)
                .then(function(imageId) {
                    if (imageId) {
                        bookData.image_id = imageId;
                    }
                    return BookService.update(book.id, bookData);
                })
                .then(function() {
                    vm.success = 'Book updated successfully!';
                    ModalService.close('editModal');
                    vm.editBook = null;
                    loadBooks(vm.pagination.currentPage);
                })
                .catch(handleError('Failed to update book'));
        }

        /**
         * Resets the add book form
         */
        function resetForm() {
            vm.newBook = createEmptyBook();
            vm.selectedFile = null;
            clearMessages();
        }

        /**
         * Returns the JSON export URL
         * @returns {string}
         */
        function getJsonUrl() {
            return API_URL + '/books/export';
        }

        // ============ Pagination ============

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

        // ============ Modal Operations ============

        function openImageModal(book) {
            vm.selectedBook = book;
            ModalService.open('imageModal');
        }

        function openEditModal(book) {
            vm.editBook = angular.copy(book);
            ModalService.open('editModal');
        }

        function openDeleteModal(book) {
            vm.bookToDelete = book;
            vm.deleteMessage = 'Are you sure you want to delete "' + book.title + '"?';
            ModalService.open('deleteModal');
        }

        function confirmDelete() {
            if (!vm.bookToDelete) {
                return;
            }

            vm.loading = true;
            clearMessages();

            BookService.remove(vm.bookToDelete.id)
                .then(function() {
                    vm.success = 'Book deleted successfully!';
                    ModalService.close('deleteModal');
                    vm.bookToDelete = null;
                    loadBooks(vm.pagination.currentPage);
                })
                .catch(handleError('Failed to delete book'));
        }

        // ============ Private Helpers ============

        /**
         * Creates an empty book object
         * @returns {Object}
         */
        function createEmptyBook() {
            return {
                title: '',
                author: '',
                country: '',
                language: '',
                pages: null,
                year: null,
                link: '',
                image_id: null,
                imageLink: null
            };
        }

        /**
         * Extracts only the fields needed for API update
         * @param {Object} book - Full book object
         * @returns {Object}
         */
        function extractBookData(book) {
            return {
                title: book.title,
                author: book.author,
                country: book.country,
                language: book.language,
                pages: book.pages,
                year: book.year,
                link: book.link,
                image_id: book.image_id
            };
        }

        /**
         * Validates required book fields
         * @param {Object} book - Book to validate
         * @returns {boolean}
         */
        function validateBook(book) {
            if (!book.title || !book.author || !book.country || !book.language || !book.pages || !book.year) {
                vm.error = 'Please fill in all required fields';
                return false;
            }
            return true;
        }

        /**
         * Uploads image if file is present
         * @param {File|null} file - File to upload
         * @returns {Promise<number|null>} - Image ID or null
         */
        function uploadImageIfPresent(file) {
            if (!file) {
                return $q.resolve(null);
            }

            return BookService.uploadImage(file)
                .then(function(image) {
                    return image.id;
                });
        }

        /**
         * Handles successful books load
         * @param {Object} result - API response
         */
        function handleBooksLoaded(result) {
            vm.books = result.data;
            vm.pagination = result.pagination;
            vm.loading = false;
        }

        /**
         * Creates an error handler function
         * @param {string} message - Error message prefix
         * @returns {Function}
         */
        function handleError(message) {
            return function(error) {
                vm.error = message + ': ' + extractErrorMessage(error);
                vm.loading = false;
            };
        }

        /**
         * Extracts error message from API error response
         * @param {Object} error - Error object
         * @returns {string}
         */
        function extractErrorMessage(error) {
            if (error.data) {
                if (error.data.message) return error.data.message;
                if (error.data.errors) return JSON.stringify(error.data.errors);
                if (typeof error.data === 'string') return error.data;
                return JSON.stringify(error.data);
            }
            return error.statusText || 'Unknown error';
        }

        /**
         * Clears error and success messages
         */
        function clearMessages() {
            vm.error = null;
            vm.success = null;
        }
    }
})();
