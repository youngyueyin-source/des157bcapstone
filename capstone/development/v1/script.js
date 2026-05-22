AOS.init({
    duration: 1000,
    once: true
});

const ingredients = document.querySelectorAll('.draggable');
const basket = document.querySelector('#basket');
const basketItems = document.querySelector('#basket-items');
const cookButton = document.querySelector('#cook-button');
const message = document.querySelector('#message');

const overlay = document.querySelector('#cooking-overlay');
const closeOverlay = document.querySelector('#close-overlay');
const chosenList = document.querySelector('#chosen-list');
const cookingMessage = document.querySelector('#cooking-message');
const seasoningButtons = document.querySelectorAll('.seasoning-button');

let chosenIngredients = [];
let chosenSeasonings = [];

ingredients.forEach(function(ingredient) {
    ingredient.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    });
});

basket.addEventListener('dragover', function(event) {
    event.preventDefault();
    basket.classList.add('over');

    gsap.to(basket, {
        scale: 1.04,
        duration: 0.2
    });
});

basket.addEventListener('dragleave', function() {
    basket.classList.remove('over');

    gsap.to(basket, {
        scale: 1,
        duration: 0.2
    });
});

basket.addEventListener('drop', function(event) {
    event.preventDefault();

    const ingredientId = event.dataTransfer.getData('text/plain');
    const ingredient = document.querySelector(`#${ingredientId}`);

    basket.classList.remove('over');

    gsap.to(basket, {
        scale: 1,
        duration: 0.2
    });

    if (!chosenIngredients.includes(ingredientId)) {
        chosenIngredients.push(ingredientId);

        const ingredientCopy = ingredient.cloneNode(true);

        ingredientCopy.classList.remove('draggable');
        ingredientCopy.classList.add('basket-item');
        ingredientCopy.removeAttribute('draggable');

        basketItems.appendChild(ingredientCopy);

        gsap.from(ingredientCopy, {
            y: -40,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(2)'
        });

        message.textContent = `You chose ${chosenIngredients.length} ingredient(s).`;

        cookButton.classList.remove('hidden');

        gsap.fromTo(cookButton,
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4 }
        );
    }
});

cookButton.addEventListener('click', function() {
    chosenList.innerHTML = '';

    chosenIngredients.forEach(function(ingredientId) {
        const ingredient = document.querySelector(`#${ingredientId}`);
        const ingredientCopy = ingredient.cloneNode(true);

        ingredientCopy.classList.remove('draggable');
        ingredientCopy.removeAttribute('draggable');

        chosenList.appendChild(ingredientCopy);
    });

    cookingMessage.textContent = 'Now add seasonings to your cooking pot.';

    overlay.classList.remove('hidden');

    gsap.fromTo('.overlay-content',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
});

closeOverlay.addEventListener('click', function() {
    gsap.to('.overlay-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.25,
        onComplete: function() {
            overlay.classList.add('hidden');
        }
    });
});

seasoningButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const seasoning = button.textContent.replace(' added', '');

        if (!chosenSeasonings.includes(seasoning)) {
            chosenSeasonings.push(seasoning);

            button.textContent = `${seasoning} added`;
            button.disabled = true;

            gsap.to(button, {
                scale: 1.05,
                duration: 0.15,
                yoyo: true,
                repeat: 1
            });
        }

        cookingMessage.textContent = `You added: ${chosenSeasonings.join(', ')}.`;
    });
});