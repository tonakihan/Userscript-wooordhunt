// ==UserScript==
// @name         Small the 'Wooordhunt' improvement
// @namespace    http://tampermonkey.net/
// @version      1
// @description  1. Removing the useless html element from bottom; 2. Changing the header style; 3. Add the listener 'past' on whole page
// @author       Tonakihan
// @match        *://wooordhunt.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wooordhunt.ru
// @grant        none
// @run-at       document-end
// @source       https://github.com/tonakihan/Userscript-wooordhunt
// ==/UserScript==

(function() {
    'use strict';

    /* При вставке, автоматически очищает поле ввода.
     То есть Ctrl+V -> Очистка ввода -> Вставка */
    var autoCleanSearch = true;
    var autoEnter = true;

    try {
        // Delete the useless element
        document.getElementById('word_history_box_mobile').remove();

        // Изменение положения header
        let styleSheet = document.createElement("style")
        styleSheet.textContent = `
        #header {
            z-index: 9;
            position: fixed;
            top: 0;
            width: 100vw;
            height: 53px;
        }

        #main_layout {
            margin-top: 45px;
        }

        #header_container {
            height: inherit;
            display: flex;
            align-items: center;
        }

        #header_container > * {
            padding-top: 0 !important;
        }
        #header_container > #profile {
            margin-left: 30px;
        }

        @media(max-width: 850px) {
            #content {
                padding-top: 90px;
            }
        }
        `;
        document.head.appendChild(styleSheet);

        // -- Search ---------------------------------
        var searchLine = document.getElementById('hunted_word');
        var currentPage = decodeURI(window.location.pathname.split('/').at(-1));
        // Добавление текущего слова в search при загрузке страницы
        if (window.location.pathname.includes('word'))
            searchLine.value = currentPage;
        //
        // --- Clipboard ---
        // Авто фокус на input - Вставка с помощью ctrl+V.
        document.addEventListener('paste', function (event) {
            if (document.activeElement !== searchLine || autoCleanSearch) {
                event.preventDefault();
                searchLine.focus();

                let textFromClipboard = event.clipboardData.getData('Text');
                if (currentPage === textFromClipboard.toLowerCase()) {
                    alert("We are already on this page");
                    return;
                }
                searchLine.value = textFromClipboard

                autoEnter && searchLine.form.submit();
            }
        });

    } catch {
        alert("UserScript: Wooordunt. \n An error occurred");
    }

})();
