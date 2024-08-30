// Sample data with local image paths
const images = [
    { src: './images/bat.jpeg', word: 'BAT' },
    { src: './images/cat.jpeg', word: 'CAT' },
    { src: './images/dog.jpeg', word: 'DOG' },
    { src: './images/goat.jpeg', word: 'GOAT' },
    { src: './images/hen.jpeg', word: 'HEN' },
    { src: './images/horse.jpeg', word: 'HORSE' },
    { src: './images/lion.jpeg', word: 'LION' },
    { src: './images/duck.jpeg', word: 'DUCK' },
    { src: './images/lizard.jpeg', word: 'LIZARD' },
    { src: './images/snake.jpeg', word: 'SNAKE' },
    { src: './images/pig.jpeg', word: 'PIG' },
    { src: './images/rabbit.jpeg', word: 'RABBIT' },
    { src: './images/monkey.jpeg', word: 'MONKEY' }
];

const MAX_WORDS = 3; // Limit the game to 5 words

let currentImageIndex = 0;
let currentWord = '';
let userSpelling = '';
let correctAnswers = 0;
let timer;

const imageElement = document.getElementById('current-image');
const spellingBoxes = document.getElementById('spelling-boxes');
const alphabetContainer = document.getElementById('alphabet-container');
const timerElement = document.getElementById('timer');
const feedbackSection = document.getElementById('feedback-section');
const nextButton = document.getElementById('next-button');
const reportSection = document.getElementById('report-section');
const reportList = document.getElementById('report-list');
const endGameSection = document.getElementById('end-game-section');
const restartButton = document.getElementById('restart-button');
const quitButton = document.getElementById('quit-button');
const cancelButton = document.getElementById('cancel-button');
const clearButton = document.getElementById('clear-button');
const submitButton = document.getElementById('submit-button');

// Initialize the alphabet buttons
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
alphabet.split('').forEach(letter => {
    const button = document.createElement('button');
    button.className = 'alphabet-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded';
    button.innerText = letter;
    button.addEventListener('click', () => handleLetterClick(letter));
    alphabetContainer.appendChild(button);
});

// Fisher-Yates Shuffle Algorithm to randomize array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start the game
function startGame() {
    shuffle(images); // Shuffle the images array
    currentImageIndex = 0;
    correctAnswers = 0;
    reportList.innerHTML = ''; // Clear previous report
    loadNextImage();
}

function loadNextImage() {
    if (currentImageIndex >= MAX_WORDS) {
        displayReport();
        return;
    }

    const currentImage = images[currentImageIndex];
    imageElement.src = currentImage.src;
    currentWord = currentImage.word;
    userSpelling = '';
    spellingBoxes.innerHTML = '';
    feedbackSection.classList.add('hidden');
    nextButton.classList.add('hidden');
    alphabetContainer.classList.remove('hidden');
    submitButton.classList.add('hidden');
    timerElement.innerText = '60';

    // Clear existing countdown
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
        handleSpellingResult(false);
    }, 60000);

    // Start countdown
    startCountdown();
}

function handleLetterClick(letter) {
    if (userSpelling.length < currentWord.length) {
        userSpelling += letter;
        updateSpellingBoxes();
    }

    // Show submit button only if the word length matches
    if (userSpelling.length === currentWord.length) {
        submitButton.classList.remove('hidden');
    }
}

function updateSpellingBoxes() {
    spellingBoxes.innerHTML = '';
    for (let i = 0; i < userSpelling.length; i++) {
        const box = document.createElement('span');
        box.innerText = userSpelling[i];
        spellingBoxes.appendChild(box);
    }
}

// Cancel the last entered letter
// cancelButton.addEventListener('click', () => {
//     if (userSpelling.length > 0) {
//         userSpelling = userSpelling.slice(0, -1);
//         updateSpellingBoxes();
//         submitButton.classList.add('hidden');
//     }
// });

// Clear the entire spelling
clearButton.addEventListener('click', () => {
    userSpelling = '';
    updateSpellingBoxes();
    submitButton.classList.add('hidden');
});

// Submit the word
submitButton.addEventListener('click', () => {
    clearTimeout(timer);
    handleSpellingResult(userSpelling === currentWord);
});

function startCountdown() {
    let timeLeft = 60;
    timerElement.innerText = timeLeft;
    window.countdownInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(window.countdownInterval);
            handleSpellingResult(false);
        }
    }, 1000);
}

function handleSpellingResult(isCorrect) {
    alphabetContainer.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
    nextButton.classList.remove('hidden');
    submitButton.classList.add('hidden');
    feedbackSection.innerText = isCorrect ? 'Correct!' : `Incorrect! The correct spelling for the Animal is ${currentWord}`;
    
    if (isCorrect) correctAnswers++;

    nextButton.onclick = () => {
        currentImageIndex++;
        if (currentImageIndex < MAX_WORDS) {
            loadNextImage();
        } else {
            displayReport();
        }
    };

    clearInterval(window.countdownInterval);
}

function displayReport() {
    reportSection.classList.remove('hidden');
    endGameSection.classList.remove('hidden');
    reportList.innerHTML = ''; // Clear previous report

    // Add score display
    const scoreItem = document.createElement('li');
    scoreItem.innerText = `Your score: ${correctAnswers} out of ${MAX_WORDS}`;
    reportList.appendChild(scoreItem);

    // Display individual word results
    images.slice(0, MAX_WORDS).forEach((image, index) => {
        const reportItem = document.createElement('li');
        reportItem.innerText = `Image ${index + 1}: ${image.word}`;
        reportList.appendChild(reportItem);
    });

    // Restart and Quit buttons
    restartButton.onclick = () => {
        reportList.innerHTML = ''; // Clear previous report
        reportSection.classList.add('hidden');
        endGameSection.classList.add('hidden');
        startGame(); // Restart the game
    };

    quitButton.onclick = () => {
        if (confirm('Are you sure you want to quit?')) {
            alert('Thanks for playing!');
            // Add any additional cleanup or reset logic here
        }
    };
}

// Start the game when the page loads
window.onload = startGame;

let timeoutId;
const timeoutDuration = 4000; // 5 seconds, adjust as needed

function handleUserInput(event) {
    clearTimeout(timeoutId);
    
    if (event.target.value.trim() !== '') {
        // User is typing, reset the timeout
        timeoutId = setTimeout(displayNextImage, timeoutDuration);
    } else {
        // Input is empty, start the timeout
        timeoutId = setTimeout(displayNextImage, timeoutDuration);
    }
}

function displayNextImage() {
    // Your code to display the next image
    console.log('Displaying next image');
}

// Attach this to your input element
document.getElementById('wordInput').addEventListener('input', handleUserInput);
