(function () {
    "use strict";

    // starts the aos library.
    // aos handles the basic scroll fade effects from the data-aos attributes in the html.
    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: false,
        mirror: true
    });

    // this function takes normal paragraph text and wraps each word in a span.
    // this lets gsap animate each word one at a time instead of animating the whole paragraph at once.
    function splitTextByWords(selector) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(function (element) {
            const words = element.textContent.trim().split(" ");
            element.textContent = "";

            words.forEach(function (word) {
                const span = document.createElement("span");

                span.className = "word";
                span.textContent = word + " ";

                element.appendChild(span);
            });
        });
    }

    // splits all paragraph text inside the panels into separate animated words.
    splitTextByWords(".panel p");

    // sets the paragraph words to start hidden, slightly lower, and blurry.
    // gsap will animate them into view later.
    gsap.set(".panel p .word", {
        opacity: 0,
        y: 12,
        filter: "blur(5px)"
    });

    // sets all h2 headings to start hidden.
    // these will appear before the paragraph text.
    gsap.set(".panel h2", {
        opacity: 0,
        y: 18,
        filter: "blur(4px)"
    });

    // sets the main title to start hidden.
    gsap.set(".intro h1", {
        opacity: 0,
        y: 18,
        filter: "blur(4px)"
    });

    // animates the main dreamscape title when the page loads.
    gsap.to(".intro h1", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out"
    });

    // goes through each section and creates a scroll animation for its text.
    document.querySelectorAll(".panel").forEach(function (panel) {
        const heading = panel.querySelector("h2");
        const words = panel.querySelectorAll("p .word");

        // animates the h2 first when the section comes into view.
        if (heading) {
            gsap.to(heading, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: panel,
                    start: "top 75%"
                }
            });
        }

        // animates the paragraph words after the h2.
        // the stagger makes each word appear one after another in a soft dreamy way.
        if (words.length > 0) {
            gsap.to(words, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.8,
                stagger: 0.06,
                ease: "power2.out",
                delay: 0.25,
                scrollTrigger: {
                    trigger: panel,
                    start: "top 75%"
                }
            });
        }
    });

    // gives the first cloud a slow floating movement.
    gsap.to(".cloud-one", {
        x: -40,
        y: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // gives the second cloud a slightly different floating direction.
    gsap.to(".cloud-two", {
        x: 50,
        y: -15,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // floats the third cloud slowly to keep the lower part of the page moving too.
    gsap.to(".cloud-three", {
        x: -60,
        y: 25,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // floats the fourth cloud in the opposite direction for more variation.
    gsap.to(".cloud-four", {
        x: 45,
        y: -20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // makes all stars softly pulse, like they are glowing.
    gsap.to(".star", {
        scale: 1.45,
        opacity: 0.35,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
        ease: "sine.inOut"
    });

    // slowly moves the first trail line back and forth.
    gsap.to(".trail-one", {
        x: 25,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // slowly moves the second trail line in the opposite direction.
    gsap.to(".trail-two", {
        x: -25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
})();