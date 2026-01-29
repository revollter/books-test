(function() {
    'use strict';

    angular
        .module('booksApp')
        .factory('ModalService', ModalService);

    ModalService.$inject = ['$document'];

    function ModalService($document) {
        var modals = {};

        var service = {
            open: open,
            close: close,
            register: register,
            unregister: unregister
        };

        return service;

        /**
         * Opens a modal by ID
         * @param {string} modalId - The modal element ID
         */
        function open(modalId) {
            var element = getElement(modalId);
            if (!element) {
                return;
            }

            var modal = new bootstrap.Modal(element);
            modals[modalId] = modal;
            modal.show();
        }

        /**
         * Closes a modal by ID
         * @param {string} modalId - The modal element ID
         */
        function close(modalId) {
            var modal = modals[modalId];
            if (modal) {
                modal.hide();
                delete modals[modalId];
                return;
            }

            // Fallback: try to get instance from DOM
            var element = getElement(modalId);
            if (element) {
                var instance = bootstrap.Modal.getInstance(element);
                if (instance) {
                    instance.hide();
                }
            }
        }

        /**
         * Registers a modal instance (called from directive)
         * @param {string} modalId - The modal element ID
         * @param {Element} element - The modal DOM element
         */
        function register(modalId, element) {
            // Pre-registration for faster access
        }

        /**
         * Unregisters a modal (cleanup on directive destroy)
         * @param {string} modalId - The modal element ID
         */
        function unregister(modalId) {
            if (modals[modalId]) {
                delete modals[modalId];
            }
        }

        /**
         * Gets DOM element using Angular's $document
         * @param {string} modalId - The modal element ID
         * @returns {Element|null}
         */
        function getElement(modalId) {
            var elements = $document[0].getElementById(modalId);
            return elements || null;
        }
    }
})();
