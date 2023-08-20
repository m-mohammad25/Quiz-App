let qustsCategory = document.querySelector("header div.category span");
let qustCountSpan = document.querySelector("header div.qust-count span ");
let qustTitle = document.querySelector("section.question-sect .question");
let choicesForm = document.querySelector("form.choices");
let submitBtn = document.querySelector("button.submit");
let timer = document.querySelector("section.bullets_and_timer span.timer");
let bulletsDiv = document.querySelector(
  "section.bullets_and_timer div.bullets"
);

let rightAnswers = 0;
let changeQuestionInterval;
let questionInd = 0;
let questionsCount = 0;
const durationinSeconds = 5;
const startMsg = "Are you ready?\n Time will start after closing this window";

let fetchQuestions = async function () {
  let response = await fetch("./json/questions.json");
  let questions = JSON.parse(await response.text());
  return questions;
};

fetchQuestions().then((questions) => {
  questionsCount = questions.length;
  qustCountSpan.innerHTML = questionsCount;
  alert(startMsg);
  createBullets(questionsCount);
  setQuestionData(questions, questionInd);
  fillBullet(questionInd);
  countDown(durationinSeconds);
  submitBtn.onclick = function () {
    let selectedAnswer = document.querySelector(
      "input[type = 'radio']:checked"
    ).value;
    checkAns(questions[questionInd], selectedAnswer);
    questionInd++;
    clearInterval(changeQuestionInterval);
    if (isFinalCount()) {
      alert(`You have answered ${rightAnswers} correct answers!`);
      return;
    }
    countDown(durationinSeconds);
    setQuestionData(questions, questionInd);
    fillBullet(questionInd);
  };
});

const createBullets = function (questionsCount) {
  let bullet = document.createElement("div");
  bullet.className = "bullet";
  for (let i = 0; i < questionsCount; i++)
    bulletsDiv.appendChild(bullet.cloneNode(true));
};

const fillBullet = function (bulletId) {
  let bulletToFill = document.querySelectorAll("div.bullet")[bulletId];
  bulletToFill.classList.add("fill");
};

const createChoiceDOM = function (choice, id = null) {
  let wrapper = document.createElement("div");
  wrapper.className = "answer-wrapper";

  let input = document.createElement("input");
  input.setAttribute("type", "radio");

  let inpID = `answer_${id}`;

  input.setAttribute("name", "choice");
  input.setAttribute("id", inpID);
  if (id === 1) input.setAttribute("checked", "checked");

  input.value = choice;

  let label = document.createElement("label");
  label.setAttribute("for", inpID);
  label.textContent = choice;

  wrapper.appendChild(input);
  wrapper.appendChild(label);

  return wrapper;
};

let setQuestionData = function (questions, questionInd) {
  qustTitle.textContent = questions[questionInd].title;
  choicesForm.innerHTML = "";
  questions[questionInd].answers.forEach((ans, index) => {
    let answerDom = createChoiceDOM(ans, index + 1);
    choicesForm.appendChild(answerDom);
  });
};

let checkAns = function (question, ans) {
  if (question.right_answer == ans) rightAnswers++;
};

let countDown = function (durationInSeconds) {
  let mins, seconds;
  changeQuestionInterval = setInterval(() => {
    mins = parseInt(durationInSeconds / 60);
    seconds = parseInt(durationInSeconds % 60);
    displayDuration(mins, seconds);
    if (isTimeUp(--durationInSeconds)) {
      clearInterval(changeQuestionInterval);
      submitBtn.click();
    }
  }, 1000);
};

let displayDuration = function (mins, secds) {
  let displayedMins = mins < 10 ? `0${mins}` : `${mins}`;
  let displayedSecds = secds < 10 ? `0${secds}` : `${secds}`;
  timer.innerHTML = `${displayedMins}:${displayedSecds}`;
};

let isTimeUp = (duration) => duration < 0;
let isFinalCount = () => questionInd === questionsCount;
