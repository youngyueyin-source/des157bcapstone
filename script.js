(function () {
    'use strict';

    const button = document.querySelector('#mode-toggle');
    const body = document.querySelector('body');
    const kiwi = document.querySelector('#kiwi');

    button.addEventListener('click', function () {
        body.classList.toggle('dark');

        if (body.classList.contains('dark')) {
            kiwi.src = "images/white-kiwi.svg";
        } else {
            kiwi.src = "images/green-kiwi.svg";
        }
    });
})();