const cardsContainer = document.getElementById("cards-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const currentEl = document.getElementById("current");
const showBtn = document.getElementById("show");
const hideBtn = document.getElementById("hide");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const addCardBtn = document.getElementById("add-card");
const clearBtn = document.getElementById("clear");
const addContainer = document.getElementById("add-container");

// Track of current card
let currentActiveCard = getCurrentActiveCard();

function getCurrentActiveCard() {
  return localStorage.getItem("current-card") === null
    ? Number(0)
    : Number(localStorage.getItem("current-card"));
}

// Store DOM cards
const cardsEl = [];

// Store card data
const cardsData = getCardsData();

// Create all cards
function createCards() {
  cardsData.forEach((data) => createCard(data));
}

// Cretae single card
function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `<div class="inner-card">
                        <div class="inner-card-front">
                            <p>${data.question}</p>
                            <button class="btn remove-btn" onclick="removeCard()"><i class="fas fa-trash"> </i></button>
                        </div>
                        <div class="inner-card-back">
                            <p>${data.answer}</p>
                        </div>
                    </div>`;

  card.addEventListener("click", () => card.classList.toggle("show-answer"));
  // Add to DOM cards
  cardsEl.push(card);

  cardsContainer.appendChild(card);

  updateCurrentCard();
}

function showInitialCard() {
  cardsEl[currentActiveCard].className = "card active";
}

function updateCurrentCard() {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
  localStorage.setItem("current-card", currentActiveCard.toString());
}

// Get cards from local storage
function getCardsData() {
  const cards = JSON.parse(localStorage.getItem("cards"));
  return cards === null ? [] : cards;
}

// Add card to the local storage
function setCardsData(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
  window.location.reload();
}

createCards();

nextBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card left";

  currentActiveCard = currentActiveCard + 1;

  if (currentActiveCard > cardsEl.length - 1) {
    currentActiveCard = cardsEl.length - 1;
  }

  cardsEl[currentActiveCard].className = "card active";
  updateCurrentCard();
});

prevBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card right";

  currentActiveCard = currentActiveCard - 1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsEl[currentActiveCard].className = "card active";
  updateCurrentCard();
});

// Show add container
showBtn.addEventListener("click", () => addContainer.classList.add("show"));
// Hide add container
hideBtn.addEventListener("click", () => addContainer.classList.remove("show"));

// Add new card
addCardBtn.addEventListener("click", () => {
  addCard();
});

answer.addEventListener("keydown", function (e) {
  const keyCode = e.keyCode;

  if (keyCode === 13) {
    addCard();
  }
});

// Add card
function addCard() {
  const question = questionEl.value;
  const answer = answerEl.value;

  if (question.trim() && answer.trim()) {
    const newCard = { question, answer };

    createCard(newCard);
    questionEl.value = "";
    answer.value = "";

    addContainer.classList.remove("show");

    cardsData.push(newCard);
    setCardsData(cardsData);
  }
}

// Clear cards button
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  cardsContainer.innerHTML = "";
  window.location.reload();
});

// Remove current card
function removeCard() {
  cardsData.splice(currentActiveCard, 1);

  if (currentActiveCard > 0) {
    currentActiveCard--;
  }

  updateCurrentCard();
  setCardsData(cardsData);
}

// Show initial card
if (cardsData.length > 0) {
  showInitialCard();
}
