const choiceButtons = document.querySelectorAll(".choice-card");
const plateItems = document.querySelector(".plate-items");
const plateCount = document.querySelector(".plate-count");
const scoreNumber = document.querySelector(".score-number");
const resultMessage = document.querySelector(".result-message");
const resetButton = document.querySelector(".reset-button");

const userChoices = {};

const foodImages = {
    "local-greens": "images/local-greens.png",
    "imported-avocado": "images/imported-avocado.png",
    "lentils": "images/lentils.png",
    "beef-steak": "images/beef-steak.png",
    "compost-bowl": "images/compost-bowl.png",
    "plastic-box": "images/plastic-box.png"
};

choiceButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const section = button.closest(".choice-section");
        const station = section.dataset.station;
        const type = button.dataset.type;
        const item = button.dataset.item;
        const points = Number(button.dataset.points);

        userChoices[station] = {
            type: type,
            item: item,
            points: points
        };

        const sectionButtons = section.querySelectorAll(".choice-card");

        sectionButtons.forEach(function(sectionButton) {
            sectionButton.classList.remove("selected");
        });

        button.classList.add("selected");

        updatePlate();
        updateResult();
    });
});

function updatePlate() {
    plateItems.innerHTML = "";

    const choicesArray = Object.values(userChoices);

    choicesArray.forEach(function(choice) {
        const food = document.createElement("img");

        food.classList.add("plate-food");
        food.src = foodImages[choice.item];
        food.alt = choice.item;

        plateItems.appendChild(food);
    });

    plateCount.textContent = `${choicesArray.length} / 3 choices made`;
}

function updateResult() {
    const choicesArray = Object.values(userChoices);

    if (choicesArray.length < 3) {
        scoreNumber.textContent = "0/100";
        resultMessage.textContent = "Make your choices above to reveal your final score.";
        return;
    }

    const totalScore = choicesArray.reduce(function(total, choice) {
        return total + choice.points;
    }, 0);

    scoreNumber.textContent = `${totalScore}/100`;

    if (totalScore >= 85) {
        resultMessage.textContent = "Your plate shows a strong sustainable future with local food, lower-impact protein, and less waste.";
    } else if (totalScore >= 55) {
        resultMessage.textContent = "Your plate is on the right path, but there is still room to make the meal more sustainable.";
    } else {
        resultMessage.textContent = "Your plate shows how everyday dining choices can increase waste and environmental impact.";
    }
}

resetButton.addEventListener("click", function() {
    for (const station in userChoices) {
        delete userChoices[station];
    }

    choiceButtons.forEach(function(button) {
        button.classList.remove("selected");
    });

    updatePlate();
    updateResult();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

AOS.init({
    duration: 900,
    easing: "ease-out-cubic",
    once: true,
    offset: 120
});