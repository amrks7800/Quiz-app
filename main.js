// https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple

// Declare counter
let counter = 0;

// necessary dom nodes
const questionArea = document.querySelector(".question-area");
const answersArea = document.querySelector(".answers-area");
const submitButton = document.querySelector("button");
const scoreSpan = document.querySelector(".score-count");

// -----------------------------------------------
let correctResult;
let questions;

const getQuestions = (async () => {
  // API
  const api = `https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple`;
  // fetch
  const result = await fetch(api);
  // final questions
  questions = await result.json();

  showQuestions(questions.results);
})();

function showQuestions(obj) {
  // setting The question and category in html
  questionArea.innerHTML = `
    <h3 class="question">${obj[counter].question}</h3>
    <span class="category">${obj[counter].category}</span>
  `;

  // inserting the correct answer in randow position
  const answers = randomInsert(
    obj[counter].incorrect_answers,
    obj[counter].correct_answer
  );

  // setting answers in html
  for (let i = 0; i < answers.length; i++) {
    answersArea.innerHTML += `
      <li class="ans">${i + 1}-${answers[i]}</li>
    `;
  }

  // adding selected class to the user-chosen answer Li
  const handleLiClick = (() => {
    let lis = Array.from(document.querySelectorAll("li.ans"));
    lis.map((li) => {
      li.addEventListener("click", () => {
        lis.forEach((li) => li.classList.remove("selected"));
        li.classList.add("selected");
      });
    });
  })();

  // storing the correct answer
  correctResult = obj[counter].correct_answer;

  counter++;
}

submitButton.onclick = () => {
  submitter();
};

// function to insert a value in array in random position
function randomInsert(array, value) {
  array.splice(Math.floor(Math.random() * (array.length + 1)), 0, value);
  return array;
}

const submitter = () => {
  let selected;
  // fetching previously created answers
  let lis = Array.from(document.querySelectorAll("li"));

  // looping on answers
  lis.forEach((li, i) => {
    if (li.innerHTML === `${i + 1}-${correctResult}`) {
      li.style.backgroundColor = "#4cd137";
    }

    if (li.classList.contains("selected")) {
      selected = li;
      if (selected.innerHTML === `${i + 1}-${correctResult}`) {
        submitButton.style.backgroundColor = "#4cd137";

        scoreSpan.innerHTML = +scoreSpan.innerHTML + 1;

        submitButton.textContent = "Yeah!";
      } else {
        submitButton.style.backgroundColor = "#e84118";
      }

      setTimeout(() => {
        if (counter !== questions.results.length) {
          answersArea.innerHTML = "";
          showQuestions(questions.results);
          submitButton.style.backgroundColor = "#9b59b6";
          submitButton.textContent = "submit";
        } else {
          submitButton.textContent = "New Game";
          counter = 0;
          submitButton.onclick = () => {
            window.location.reload();
          };
        }
      }, 500);
    }
  });
};
