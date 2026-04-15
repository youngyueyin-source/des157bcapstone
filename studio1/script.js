(function() {
    'use strict';

    const video = document.querySelector('#myVideo');
    const line1 = document.querySelector('.line1');
    const line2 = document.querySelector('.line2');
    const author = document.querySelector('.author');
    const translation = document.querySelector('.translation');
    const soundToggle = document.querySelector('#soundToggle');

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

    wrapLetters(line1);
    wrapLetters(line2);
    wrapLetters(author);
    wrapLetters(translation);

    line1.style.opacity = 0;
    line2.style.opacity = 0;
    author.style.opacity = 0;
    translation.style.opacity = 0;

    function checkTime() {
        const time = video.currentTime;
        const duration = video.duration;

        if (!duration || isNaN(duration)) {
            return;
        }

        line1.style.opacity = 0;
        line2.style.opacity = 0;
        author.style.opacity = 0;
        translation.style.opacity = 0;

        if (time >= 3.5 && time < duration - 3.2) {
            line1.style.opacity = 1;
        }

        if (time >= 8 && time < duration - 2.6) {
            line2.style.opacity = 1;
        }

        if (time >= 11 && time < duration - 1.9) {
            author.style.opacity = 1;
        }

        if (time >= 18 && time < duration - 1.1) {
            translation.style.opacity = 1;
        }
    }

    video.addEventListener('timeupdate', checkTime);

    const soundIcon = soundToggle.querySelector('i');

    soundToggle.addEventListener('click', function(event) {
        event.stopPropagation();

        if (video.muted) {
            video.muted = false;
            soundIcon.className = 'fa-solid fa-volume-high';
        } else {
            video.muted = true;
            soundIcon.className = 'fa-solid fa-volume-xmark';
        }
    });

    function makeRipple(event) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        ripple.style.left = `${event.clientX}px`;
        ripple.style.top = `${event.clientY}px`;

        document.body.appendChild(ripple);

        setTimeout(function() {
            ripple.remove();
        }, 2500);
    }

    document.addEventListener('click', function(event) {
        if (event.target.id === 'soundToggle') {
            return;
        }

        makeRipple(event);
    });

    function createClouds() {
        const numClouds = 20;

        for (let i = 0; i < numClouds; i++) {
            const cloud = document.createElement('img');
            cloud.src = 'images/cloud.png';
            cloud.classList.add('cloud');

            cloud.style.top = `${Math.random() * 85}%`;

            const size = 140 + Math.random() * 260;
            cloud.style.width = `${size}px`;

            cloud.style.opacity = 0.04 + Math.random() * 0.12;

            const duration = 45 + Math.random() * 75;
            cloud.style.animationDuration = `${duration}s`;

            cloud.style.animationDelay = `${Math.random() * 40}s`;

            cloud.style.filter = `blur(${Math.random() * 2}px)`;

            document.body.appendChild(cloud);
        }
    }

    createClouds();
})();