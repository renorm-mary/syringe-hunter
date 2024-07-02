let timeLeft = 60;
let itemsFound = 0;
const totalItems = document.querySelectorAll('.needle').length;
let hintsUsed = 0;
let currentNeedle = null;
let score = 0;
const positions = [];

document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('time');
    const scoreElement = document.getElementById('score-value');
    const needles = document.querySelectorAll('.needle');
    const caps = document.querySelectorAll('.cap');
    const findSound = document.getElementById('find-sound');
    const hintSound = document.getElementById('hint-sound');
    const errorSound = document.getElementById('error-sound');

    randomizePositions(needles);
    randomizePositions(caps);

    needles.forEach(needle => {
        needle.addEventListener('click', () => {
            if (!currentNeedle) {
                currentNeedle = needle;
                needle.style.backgroundColor = 'yellow'; // Highlight selected needle
            }
        });
    });

    caps.forEach(cap => {
        cap.addEventListener('click', () => {
            if (currentNeedle && currentNeedle.dataset.id === cap.dataset.id) {
                currentNeedle.style.visibility = 'hidden';
                cap.style.visibility = 'hidden';
                itemsFound++;
                score += 100 - hintsUsed * 10; // Simple scoring mechanism
                scoreElement.textContent = score;
                findSound.play();
                currentNeedle = null;
                checkGameStatus();
            } else if (currentNeedle) {
                errorSound.play();
            }
        });
    });

    const countdown = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = timeLeft;
        } else {
            clearInterval(countdown);
            alert('Time\'s up! You found ' + itemsFound + ' needles and caps. Your score is ' + score + '.');
        }
    }, 1000);
});

function checkGameStatus() {
    if (itemsFound === totalItems) {
        alert('Congratulations! You found all the needles and caps! Your score is ' + score + '.');
        clearInterval(countdown);
    }
}

function useHint() {
    if (hintsUsed < 3) {
        const needles = document.querySelectorAll('.needle');
        const caps = document.querySelectorAll('.cap');
        let foundHint = false;
        needles.forEach(needle => {
            if (needle.style.visibility !== 'hidden' && !foundHint) {
                needle.style.outline = '2px solid yellow';
                setTimeout(() => {
                    needle.style.outline = 'none';
                }, 1000);
                foundHint = true;
                hintsUsed++;
                hintSound.play();
            }
        });
        if (!foundHint) {
            caps.forEach(cap => {
                if (cap.style.visibility !== 'hidden' && !foundHint) {
                    cap.style.outline = '2px solid yellow';
                    setTimeout(() => {
                        cap.style.outline = 'none';
                    }, 1000);
                    hintsUsed++;
                    hintSound.play();
                }
            });
        }
    } else {
        alert('No more hints available!');
    }
}

function randomizePositions(elements) {
    const container = document.getElementById('game-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    elements.forEach(element => {
        let posX, posY;
        do {
            posX = Math.floor(Math.random() * (containerWidth - element.offsetWidth));
            posY = Math.floor(Math.random() * (containerHeight - element.offsetHeight));
        } while (isOverlap(posX, posY, element.offsetWidth, element.offsetHeight));

        element.style.left = `${posX}px`;
        element.style.top = `${posY}px`;
        positions.push({x: posX, y: posY, width: element.offsetWidth, height: element.offsetHeight});
    });
}

function isOverlap(x, y, width, height) {
    for (let pos of positions) {
        if (!(x + width < pos.x || x > pos.x + pos.width || y + height < pos.y || y > pos.y + pos.height)) {
            return true;
        }
    }
    return false;
}
