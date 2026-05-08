const people = [
  "Michele",
  "Francesco",
  "Gregorio",
  "Clelia",
  "Ludovica",
  "Giusi",
  "Giorgio",
  "Andrea",
  "Federico",
  "Alessio",
  "Anthony",
  "Stefano",
  "Elena",
  "Alessandro",
  "Simona",
  "Bianca",
  "Vittoria"
];

const questions = [
  {
    text: "Da quanti anni vi conoscete?",
    answers: [
      { label: "< 1 anno", value: 1 },
      { label: "2-4 anni", value: 2 },
      { label: "5-7 anni", value: 3 },
      { label: "> 7 anni", value: 4 }
    ]
  },
  {
    text: "Quante volte alla settimana *fuori da scout( vi vedete?",
    answers: [
      { label: "Mai", value: 1 },
      { label: "1-3 volte a settimana", value: 3 },
      { label: "4-5 volte a settimana", value: 6 },
      { label: "> 6 volte a settimana", value: 4 }
    ]
  },
  {
    text: "Sai dove abita?",
    answers: [
      { label: "Non saprei", value: 1 },
      { label: "Conosco il quartiere in cui vive", value: 3 },
      { label: "Si, so dove si trova precisamente", value: 6 }
    ]
  },
  {
    text: "Conosci i nomi dei genitori?",
    answers: [
      { label: "Non saprei", value: 2 },
      { label: "Solo uno dei due", value: 5 },
      { label: "Entrambi", value: 8 }
    ]
  },
  {
    text: "Quanto ti pesa parlare con l'altro durante la strada?",
    answers: [
      { label: "Parlerei solo con lui", value: 17 },
      { label: "Mi interessa e ci provo", value: 8 },
      { label: "Se capita è ok", value: 4 },
      { label: "Non mi interessa, lo schivo", value: 1 }
    ]
  },
  {
    text: "Ti trovi in TRIPPIA con l'altra persona, come ti senti?",
    answers: [
      { label: "Molto contento", value: 12 },
      { label: "Indifferente", value: 8 },
      { label: "Starei meglio con qualcun altro", value: 5 }
    ]
  },
  {
    text: "Siete produttivi insieme in PATTUGLIA?",
    answers: [
      { label: "Molto", value: 7 },
      { label: "Tendiamo a distrarci", value: 5 },
      { label: "Simao inconcludenti", value: 3 }
    ]
  },
  {
    text: "Quanto ti fidi di questa persona?",
    answers: [
      { label: "Gli racconto tutto di me", value: 14 },
      { label: "Non riesco a confidarmi ma ci parlo spesso", value: 10 },
      { label: "Mi ispira fiducia ma non ci parlo di me", value: 7 },
      { label: "Non ci parlo di cose esterne allo scoutismo", value: 4 }
    ]
  },
  {
    text: "...scrive sul gruppo di clan chiedendo un favore:",
    answers: [
      { label: "Non ri spondo, tanto qualcuno lo farà", value: 3 },
      { label: "Rispondo nel gruppo", value: 7 },
      { label: "Rispondo ma in chat privata", value: 10 }
    ]
  },
  {
    text: "Ci andresti a mangiare una pizza (solo voi due)?",
    answers: [
      { label: "Si, certo", value: 12 },
      { label: "Si se mi viene proposto", value: 6 },
      { label: "No, non mi interessa", value: 2 }
    ]
  }
];

const storageKey = "friendshipTestScores";
const resetMarkerKey = "friendshipTestReset20260508";
const supabaseUrl = "https://icmiqxfiryvlizkvkqzn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbWlxeGZpcnl2bGl6a3ZrcXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTczNjksImV4cCI6MjA5MzgzMzM2OX0.h9EiCRjFIO9lXk0nHuoMBnCKNJO0cRPA2eoBx9ssmV8";
const supabaseClient = window.supabase?.createClient(supabaseUrl, supabaseAnonKey);
const selected = document.getElementById("selected");
const options = document.getElementById("options");
const startBtn = document.getElementById("startBtn");
const changeUserBtn = document.getElementById("changeUserBtn");
const resetScoresBtn = document.getElementById("resetScoresBtn");
const loginView = document.getElementById("loginView");
const communityView = document.getElementById("communityView");
const quizView = document.getElementById("quizView");
const title = document.getElementById("title");
const userList = document.getElementById("userList");
const pairList = document.getElementById("pairList");
const completedCount = document.getElementById("completedCount");
const averageScore = document.getElementById("averageScore");
const bestPair = document.getElementById("bestPair");
const quizTitle = document.getElementById("quizTitle");
const quizForm = document.getElementById("quizForm");
const saveQuizBtn = document.getElementById("saveQuizBtn");
const backBtn = document.getElementById("backBtn");
const tabs = document.querySelectorAll(".tab");

let currentUser = "";
let currentTarget = "";

resetSavedScoresOnce();

let scores = readScores();

people.forEach((person) => {
  const option = document.createElement("div");
  option.className = "option";
  option.textContent = person;
  option.addEventListener("click", () => {
    currentUser = person;
    selected.textContent = person;
    options.classList.add("hidden");
  });

  options.appendChild(option);
});

const savedUser = localStorage.getItem("friendshipTestUser");
if (savedUser && people.includes(savedUser)) {
  currentUser = savedUser;
  selected.textContent = savedUser;
}

selected.addEventListener("click", () => {
  options.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".dropdown")) {
    options.classList.add("hidden");
  }
});

startBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Seleziona il tuo nome prima di entrare.");
    return;
  }

  localStorage.setItem("friendshipTestUser", currentUser);
  await loadScores();
  showDashboard();
});

changeUserBtn.addEventListener("click", () => {
  currentUser = "";
  currentTarget = "";
  selected.textContent = "Seleziona il tuo nome";
  showOnly(loginView);
});

resetScoresBtn.addEventListener("click", async () => {
  if (currentUser !== "Michele") {
    return;
  }

  if (!confirm("Vuoi azzerare tutti i punteggi salvati?")) {
    return;
  }

  scores = {};
  localStorage.removeItem(storageKey);
  localStorage.removeItem("scores");
  await deleteScoresFromDatabase();
  renderPeople();
  renderPairs();
  renderStats();
});

backBtn.addEventListener("click", showDashboard);

saveQuizBtn.addEventListener("click", async () => {
  const checkedAnswers = [...quizForm.querySelectorAll("input:checked")];

  if (checkedAnswers.length !== questions.length) {
    alert("Rispondi a tutte le domande prima di salvare.");
    return;
  }

  const total = checkedAnswers.reduce((sum, answer) => {
    return sum + Number(answer.value);
  }, 0);

  const max = getQuizMaxScore();
  await saveDirectionalScore(currentUser, currentTarget, total, max);
  showDashboard();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    document.querySelectorAll(".view").forEach((view) => {
      view.classList.toggle("hidden", view.id !== tab.dataset.view);
    });
  });
});

function showDashboard() {
  title.textContent = `Ciao, ${currentUser}`;
  resetScoresBtn.classList.toggle("hidden", currentUser !== "Michele");
  renderPeople();
  renderPairs();
  renderStats();
  showOnly(communityView);
}

function renderPeople() {
  userList.innerHTML = "";

  people
    .filter((person) => person !== currentUser)
    .forEach((person) => {
      const score = getDirectionalScore(currentUser, person);
      const pair = getPairScore(currentUser, person);
      const card = document.createElement("article");
      card.className = "user-card";

      card.innerHTML = `
        <div>
          <h3>${person}</h3>
          <p>${score ? "<strong>Questionario completato</strong>" : "<strong>Da compilare</strong>"}</p>
        </div>
        <div class="card-side">
          <strong>${score ? score.score : "-"}</strong>
          <span>tuo <strong>punteggio</strong></span>
        </div>
        <div class="pair-preview">
          <span><strong>Coppia:</strong> ${pair.total}</span>
          <span><strong>${pair.label}</strong></span>
        </div>
        <button class="secondary-btn" type="button">
          ${score ? "Modifica" : "Inizia quiz"}
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        startQuiz(person);
      });

      userList.appendChild(card);
    });
}

function renderPairs() {
  const rows = people
    .filter((person) => person !== currentUser)
    .map((person) => ({
      person,
      pair: getPairScore(currentUser, person)
    }))
    .sort((a, b) => b.pair.total - a.pair.total);

  pairList.innerHTML = rows
    .map(({ person, pair }) => `
      <article class="pair-card">
        <div>
          <h3>${currentUser} + ${person}</h3>
          <p><strong>${pair.label}</strong></p>
        </div>
        <strong>${pair.total}</strong>
      </article>
    `)
    .join("");
}

function renderStats() {
  const userScores = people
    .filter((person) => person !== currentUser)
    .map((person) => getDirectionalScore(currentUser, person))
    .filter(Boolean);

  completedCount.textContent = `${userScores.length}/${people.length - 1}`;

  const average = userScores.length
    ? userScores.reduce((sum, item) => sum + item.score, 0) / userScores.length
    : 0;

  averageScore.textContent = average.toFixed(1);

  const best = people
    .filter((person) => person !== currentUser)
    .map((person) => ({ person, pair: getPairScore(currentUser, person) }))
    .sort((a, b) => b.pair.total - a.pair.total)[0];

  bestPair.textContent = best && best.pair.total > 0 ? best.person : "-";
}

function startQuiz(targetPerson) {
  currentTarget = targetPerson;
  quizTitle.textContent = `${currentUser} su ${currentTarget}`;
  renderQuizForm();
  showOnly(quizView);
}

function renderQuizForm() {
  const previous = getDirectionalScore(currentUser, currentTarget);

  quizForm.innerHTML = questions
    .map((question, questionIndex) => {
      const options = question.answers
        .map((answer) => {
          const selected = previous?.answers?.[questionIndex] === answer.value ? "checked" : "";

          return `
            <label class="answer">
              <input type="radio" name="question-${questionIndex}" value="${answer.value}" ${selected}>
              <span>${answer.label}</span>
            </label>
          `;
        })
        .join("");

      return `
        <fieldset class="question">
          <legend>
            <span class="question-number">${questionIndex + 1}/${questions.length}</span>
            ${question.text}
          </legend>
          <div class="answers">${options}</div>
        </fieldset>
      `;
    })
    .join("");
}

function getDirectionalScore(from, to) {
  return scores[getDirectionalKey(from, to)] || null;
}

async function saveDirectionalScore(from, to, score, max) {
  const answers = [...quizForm.querySelectorAll("input:checked")].map((answer) => {
    return Number(answer.value);
  });

  const key = getDirectionalKey(from, to);
  const scoreData = {
    from,
    to,
    score,
    max,
    answers,
    completedAt: new Date().toISOString()
  };

  scores[key] = scoreData;
  localStorage.setItem(storageKey, JSON.stringify(scores));
  await saveScoreToDatabase(key, scoreData);
}

function getPairScore(personA, personB) {
  const first = getDirectionalScore(personA, personB)?.score || 0;
  const second = getDirectionalScore(personB, personA)?.score || 0;
  const total = first + second;
  const maxTotal = getQuizMaxScore() * 2;

  return {
    total,
    label: getPairLabel(total, maxTotal)
  };
}

function getPairLabel(total, maxTotal) {
  const percentage = total / maxTotal;

  if (percentage >= 0.85) return "Coppia fortissima";
  if (percentage >= 0.65) return "Coppia molto affiatata";
  if (percentage >= 0.45) return "Coppia in crescita";
  if (total > 0) return "Coppia da scoprire";
  return "In attesa";
}

function getQuizMaxScore() {
  return questions.reduce((sum, question) => {
    const highestAnswer = Math.max(...question.answers.map((answer) => answer.value));

    return sum + highestAnswer;
  }, 0);
}

function getDirectionalKey(from, to) {
  return `${from}__${to}`;
}

function readScores() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

async function loadScores() {
  if (!supabaseClient) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("scores")
    .select("id, from_user, to_user, score, max_score, answers, completed_at");

  if (error) {
    alert("Non riesco a leggere i punteggi online. Controlla tabella e permessi Supabase.");
    return;
  }

  scores = {};

  data.forEach((item) => {
    scores[item.id] = {
      from: item.from_user,
      to: item.to_user,
      score: item.score,
      max: item.max_score,
      answers: item.answers || [],
      completedAt: item.completed_at
    };
  });

  localStorage.setItem(storageKey, JSON.stringify(scores));
}

async function saveScoreToDatabase(key, scoreData) {
  if (!supabaseClient) {
    alert("Supabase non e caricato. Il punteggio e stato salvato solo su questo telefono.");
    return;
  }

  const { error } = await supabaseClient
    .from("scores")
    .upsert({
      id: key,
      from_user: scoreData.from,
      to_user: scoreData.to,
      score: scoreData.score,
      max_score: scoreData.max,
      answers: scoreData.answers,
      completed_at: scoreData.completedAt
    });

  if (error) {
    alert("Non riesco a salvare il punteggio online. Controlla Supabase.");
  }
}

async function deleteScoresFromDatabase() {
  if (!supabaseClient) {
    return;
  }

  const { error } = await supabaseClient
    .from("scores")
    .delete()
    .neq("id", "");

  if (error) {
    alert("Non riesco ad azzerare i punteggi online. Controlla Supabase.");
  }
}

function resetSavedScoresOnce() {
  if (localStorage.getItem(resetMarkerKey) === "done") {
    return;
  }

  localStorage.removeItem(storageKey);
  localStorage.removeItem("scores");
  localStorage.setItem(resetMarkerKey, "done");
}

function showOnly(activeView) {
  [loginView, communityView, quizView].forEach((view) => {
    view.classList.toggle("hidden", view !== activeView);
  });
}
