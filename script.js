// BANCO DE PREGUNTAS CLASIFICADO POR DIFICULTAD
const questionBank = {
    easy: [
        {
            question: "¿Cuál es el principal elemento para proteger las vías respiratorias ante la caída de ceniza?",
            options: ["Gafas de sol", "Tapabocas N95", "Bufanda de lana", "Toalla seca"],
            answer: 1,
            hint: "Debe ser un elemento de bioseguridad que filtre partículas muy pequeñas."
        },
        {
            question: "Ante una orden de evacuación por alerta volcánica, ¿qué debes hacer?",
            options: ["Ignorar el llamado", "Seguir las rutas oficiales hacia la zona segura", "Subir al tejado", "Ir a la orilla del río"],
            answer: 1,
            hint: "Busca siempre las indicaciones establecidas por la Gestión del Riesgo."
        },
        {
            question: "¿Qué debes hacer con los depósitos de agua de tu hogar si cae ceniza?",
            options: ["Dejarlos destapados", "Llenarlos de ceniza", "Cubrirlos herméticamente", "Hervirlos sin tapar"],
            answer: 2,
            hint: "Evita que el polvo volcánico contamine el agua potable."
        }
    ],
    medium: [
        {
            question: "¿Qué indica la 'Alerta Naranja' emitida para el volcán Puracé?",
            options: ["Volcán totalmente inactivo", "Erupción probable en días o semanas", "Erupción menor ya finalizada", "Sin ningún tipo de riesgo"],
            answer: 1,
            hint: "Es un nivel intermedio que exige alistamiento previo a una posible erupción."
        },
        {
            question: "¿Por qué no se debe buscar refugio en las riberas de los ríos durante una erupción del Puracé?",
            options: ["Por el exceso de viento", "Por la formación de lahares (flujos de lodo y escombros)", "Por la falta de sombra", "Porque los ríos se secan instantáneamente"],
            answer: 1,
            hint: "La mezcla de ceniza, agua y nieve genera avalanchas de lodo que bajan por los cauces."
        },
        {
            question: "¿Qué gas emitido por el Puracé puede acumularse en zonas bajas provocando asfixia?",
            options: ["Oxígeno", "Helio", "Dióxido de carbono y dióxido de azufre", "Nitrógeno puro"],
            answer: 2,
            hint: "Son gases más pesados que el aire con fuerte olor a azufre."
        }
    ],
    hard: [
        {
            question: "¿Cuál de los siguientes instrumentos monitorea la deformación del suelo en el volcán Puracé?",
            options: ["Sismómetro broadband", "Inclinómetro y estaciones GNSS/GPS", "Termómetro ambiental", "Anemómetro"],
            answer: 1,
            hint: "Se utiliza para medir cómo 'se hincha' o altera la superficie del volcán cuando asciende magma."
        },
        {
            question: "¿Qué es un flujo piroclástico, una de las mayores amenazas del volcán Puracé?",
            options: ["Una corriente suave de agua tibia", "Una mezcla ardiente de gases, ceniza y rocas a alta velocidad", "Lluvia leve de azufre coloidal", "Una nube de vapor inofensiva"],
            answer: 1,
            hint: "Es una avalancha volcánica ardiente supercaliente que destruye todo a su paso."
        },
        {
            question: "En el kit de emergencia volcánico, ¿para qué se recomienda incluir un radio a pilas?",
            options: ["Para escuchar música y calmarse", "Para recibir boletines oficiales sin depender de red eléctrica o internet", "Para comunicarse directamente con el volcán", "No tiene ninguna utilidad"],
            answer: 1,
            hint: "En una emergencia las redes celulares y la energía suelen colapsar."
        }
    ]
};

// ESTADO DEL JUEGO
let currentDiff = 'easy';
let gameQuestions = [];
let currentIndex = 0;
let lives = 3;
let score = 0;
let hintsLeft = 2;
let isPaused = false;

// ELEMENTOS HTML
let coverScreen, startScreen, gameScreen, pauseScreen, gameOverScreen, winScreen;
let coverStartBtn, startBtn, pauseBtn, resumeBtn, hintBtn, restartBtnLoss, restartBtnWin;
let diffButtons, questionText, optionsGrid, livesDisplay, scoreDisplay, hintsCount, feedbackMessage, progressBar, playerPin, diffBadge;
let lossScore, winScore;

// INICIALIZADOR AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    // Vínculos del DOM
    coverScreen = document.getElementById('cover-screen');
    startScreen = document.getElementById('start-screen');
    gameScreen = document.getElementById('game-screen');
    pauseScreen = document.getElementById('pause-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    winScreen = document.getElementById('win-screen');

    coverStartBtn = document.getElementById('cover-start-btn');
    startBtn = document.getElementById('start-btn');
    pauseBtn = document.getElementById('pause-btn');
    resumeBtn = document.getElementById('resume-btn');
    hintBtn = document.getElementById('hint-btn');
    restartBtnLoss = document.getElementById('restart-btn-loss');
    restartBtnWin = document.getElementById('restart-btn-win');

    diffButtons = document.querySelectorAll('.diff-btn');
    questionText = document.getElementById('question-text');
    optionsGrid = document.getElementById('options-grid');
    livesDisplay = document.getElementById('lives-display');
    scoreDisplay = document.getElementById('score-display');
    hintsCount = document.getElementById('hints-count');
    feedbackMessage = document.getElementById('feedback-message');
    progressBar = document.getElementById('progress-bar');
    playerPin = document.getElementById('player-pin');
    diffBadge = document.getElementById('diff-badge');

    lossScore = document.getElementById('loss-score');
    winScore = document.getElementById('win-score');

    // Eventos de botones
    coverStartBtn.addEventListener('click', () => {
        coverScreen.classList.remove('active');
        startScreen.classList.add('active');
    });

    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDiff = btn.dataset.diff;
        });
    });

    startBtn.addEventListener('click', startGame);
    restartBtnLoss.addEventListener('click', () => {
        gameOverScreen.classList.remove('active');
        startScreen.classList.add('active');
    });
    restartBtnWin.addEventListener('click', () => {
        winScreen.classList.remove('active');
        startScreen.classList.add('active');
    });

    pauseBtn.addEventListener('click', togglePause);
    resumeBtn.addEventListener('click', togglePause);
    hintBtn.addEventListener('click', useHint);
});

// SONIDOS SINTETIZADOS
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'correct') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        }
    } catch(e) {
        console.log("Audio no disponible");
    }
}

// INICIAR JUEGO
function startGame() {
    lives = 3;
    score = 0;
    currentIndex = 0;
    hintsLeft = 2;

    gameQuestions = [...questionBank[currentDiff]].sort(() => Math.random() - 0.5);

    startScreen.classList.remove('active');
    gameScreen.classList.add('active');

    loadQuestion();
}

function updateHUD() {
    livesDisplay.textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
    scoreDisplay.textContent = score;
    hintsCount.textContent = hintsLeft;
    feedbackMessage.textContent = '';

    const pct = (currentIndex / gameQuestions.length) * 100;
    progressBar.style.width = `${pct}%`;
    playerPin.style.left = `${pct}%`;

    const diffIcons = { easy: '🟢', medium: '🟡', hard: '🔴' };
    diffBadge.textContent = diffIcons[currentDiff];
}

function loadQuestion() {
    updateHUD();
    hintBtn.disabled = hintsLeft <= 0;

    const q = gameQuestions[currentIndex];
    questionText.textContent = q.question;
    optionsGrid.innerHTML = '';

    const badges = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, idx) => {
        const card = document.createElement('button');
        card.classList.add('option-card');
        card.innerHTML = `<span class="badge">${badges[idx]}</span> <span>${opt}</span>`;
        card.addEventListener('click', () => handleAnswer(idx, card));
        optionsGrid.appendChild(card);
    });
}

function handleAnswer(selectedIdx, selectedCard) {
    if (isPaused) return;

    const cards = optionsGrid.querySelectorAll('.option-card');
    cards.forEach(c => c.style.pointerEvents = 'none');

    const correctIdx = gameQuestions[currentIndex].answer;

    if (selectedIdx === correctIdx) {
        selectedCard.classList.add('correct');
        feedbackMessage.style.color = '#2ecc71';
        feedbackMessage.textContent = '¡Excelente! Respuesta correcta.';
        score += currentDiff === 'easy' ? 100 : currentDiff === 'medium' ? 150 : 200;
        playSound('correct');
    } else {
        selectedCard.classList.add('incorrect');
        cards[correctIdx].classList.add('correct');
        feedbackMessage.style.color = '#e74c3c';
        feedbackMessage.textContent = '¡Incorrecto! Has perdido una vida.';
        lives--;
        playSound('wrong');
    }

    setTimeout(() => {
        if (lives <= 0) {
            endGame(false);
        } else {
            currentIndex++;
            if (currentIndex < gameQuestions.length) {
                loadQuestion();
            } else {
                endGame(true);
            }
        }
    }, 1800);
}

function useHint() {
    if (hintsLeft <= 0 || isPaused) return;

    const q = gameQuestions[currentIndex];
    const cards = optionsGrid.querySelectorAll('.option-card');

    let incorrectIndices = [];
    q.options.forEach((_, idx) => {
        if (idx !== q.answer && !cards[idx].classList.contains('disabled')) {
            incorrectIndices.push(idx);
        }
    });

    if (incorrectIndices.length > 0) {
        const discardIdx = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
        cards[discardIdx].classList.add('disabled');
    }

    hintsLeft--;
    hintsCount.textContent = hintsLeft;
    feedbackMessage.style.color = '#f1c40f';
    feedbackMessage.textContent = `💡 Pista: ${q.hint}`;
    hintBtn.disabled = true;
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseScreen.classList.add('active');
    } else {
        pauseScreen.classList.remove('active');
    }
}

function endGame(isWin) {
    gameScreen.classList.remove('active');
    if (isWin) {
        winScore.textContent = score;
        winScreen.classList.add('active');
    } else {
        lossScore.textContent = score;
        gameOverScreen.classList.add('active');
    }
}