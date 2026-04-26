(function () {
    'use strict';

    const headers = document.querySelectorAll('h1, h2, h3');
    const timeSelect = document.querySelector('#timeSelect');
    const displayTime = document.querySelector('#displayTime');
    const displayMood = document.querySelector('#displayMood');
    const displayCoffee = document.querySelector('#displayCoffee');
    const displayNotes = document.querySelector('#displayNotes');

    function wrapLetters(element) {
        const text = element.textContent;
        let wrappedText = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (char === ' ') {
                wrappedText += ' ';
            } else {
                wrappedText += `<span class="float-letter">${char}</span>`;
            }
        }

        element.innerHTML = wrappedText;
    }

    headers.forEach(function (header) {
        wrapLetters(header);
    });

    async function getData() {
        const response = await fetch('data.json');
        const data = await response.json();

        Object.keys(data).forEach(function (key) {
            const option = document.createElement('option');

            option.value = key;
            option.textContent = data[key].time;

            timeSelect.appendChild(option);
        });

        timeSelect.addEventListener('change', function () {
            const selectedPoint = timeSelect.value;

            if (selectedPoint === '') {
                displayTime.textContent = 'time';
                displayMood.textContent = '—';
                displayCoffee.textContent = '—';
                displayNotes.textContent = '—';
            } else {
                displayTime.textContent = data[selectedPoint].time;
                displayMood.textContent = `${data[selectedPoint].mood}/5`;
                displayCoffee.textContent = data[selectedPoint].coffee;
                displayNotes.textContent = data[selectedPoint].reason;
            }
        });
    }

    getData();
})();