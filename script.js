let timer;
let gameStarted = false;
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let maxScore;
let level;
let timeLeft;

// Tạo danh sách các ảnh từ thư mục images
const allImages = Array.from({ length: 24 }, (_, i) => `./images/${i + 1}.png`);

// Chọn ngẫu nhiên n ảnh từ danh sách ảnh và tạo cặp bài
const generateCardImages = (numCards) => {
    let images = [];

    // Đối với cấp độ 24, chọn 12 ảnh ngẫu nhiên từ 24 ảnh
    if (numCards === 24) {
        const shuffledImages = shuffle([...allImages]);
        images = shuffledImages.slice(0, 12);
    } else if (numCards === 48) {
        // Đối với cấp độ 48, sử dụng tất cả 24 ảnh và nhân đôi
        images = allImages;
    }

    // Tạo cặp cho mỗi ảnh
    const cards = [...images, ...images];
    return shuffle(cards);
};

// Shuffle array
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Khởi tạo trò chơi
function initializeGame(level) {
    const cardImages = generateCardImages(level);
    maxScore = (level / 2) * 20; // Mỗi cặp thẻ đúng là 20 điểm
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;

    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = ''; // Xóa nội dung hiện tại

    // Tạo thẻ bài
    cardImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back" style="background-image: url('${image}');"></div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        gameContainer.appendChild(card);
    });

    // Thiết lập thời gian
    timeLeft = level === 24 ? 150 : 300; // Thời gian tùy thuộc vào cấp độ
    document.getElementById('time').innerText = `Time: ${timeLeft}s`;
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    gameStarted = true;
}

// Flip card
const flipCard = card => {
    if (lockBoard || card === firstCard || card.classList.contains('flip')) return;

    card.classList.add('flip');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    checkForMatch();
};

// Check for match
const checkForMatch = () => {
    const isMatch = firstCard.querySelector('.card-back').style.backgroundImage === secondCard.querySelector('.card-back').style.backgroundImage;

    if (isMatch) {
        score += 20;
        document.getElementById('score').innerText = `Score: ${score}`;
        resetBoard();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }
};

// Reset board
const resetBoard = () => {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
    checkWinCondition();
};

// Check win condition
const checkWinCondition = () => {
    const flippedCards = document.querySelectorAll('.card.flip');
    if (flippedCards.length === document.querySelectorAll('.card').length) {
        // Nếu tất cả các thẻ đã được lật
        endGame();
    }
};

// Update timer
const updateTimer = () => {
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
        return;
    }
    timeLeft--;
    document.getElementById('time').innerText = `Time: ${timeLeft}s`;
};

// End game
const endGame = () => {
    if (gameStarted) {
        console.log(`Final Score: ${score}`); // Hiển thị điểm số trong console
        document.getElementById('final-score').innerText = `Final Score: ${score}`;
        document.getElementById('end-game').classList.remove('hidden');
        gameStarted = false; // Ngăn không cho game tiếp tục
    }
};

// Restart game
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('end-game').classList.add('hidden');
    initializeGame(level);
});

// Get level from the page and initialize game
document.addEventListener('DOMContentLoaded', () => {
    level = parseInt(document.getElementById('level').innerText.split(':')[1].trim().split(' ')[0], 10);
    initializeGame(level);
});