let timeLeft = 60;
let itemsFound = 0;
const totalItems = document.querySelectorAll('.needle').length;
let hintsUsed = 0;
let currentNeedle = null;

document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('time');
    const needles = document.querySelectorAll('.needle');
    const caps = document.querySelectorAll('.cap');

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
                currentNeedle = null;
                checkGameStatus();
            }
        });
    });

    const countdown = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = timeLeft;
        } else {
            clearInterval(countdown);
            alert('Time\'s up! You found ' + itemsFound + ' needles and caps.');
        }
    }, 1000);
});

function checkGameStatus() {
    if (itemsFound === totalItems) {
        alert('Congratulations! You found all the needles and caps!');
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
                }
            });
        }
    } else {
        alert('No more hints available!');
    }
}
