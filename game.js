let timeLeft = 60;
let syringesFound = 0;
const totalSyringes = document.querySelectorAll('.syringe').length;
let hintsUsed = 0;

document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('time');
    const syringes = document.querySelectorAll('.syringe');

    syringes.forEach(syringe => {
        syringe.addEventListener('click', () => {
            syringe.style.visibility = 'hidden';
            syringesFound++;
            checkGameStatus();
        });
    });

    const countdown = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = timeLeft;
        } else {
            clearInterval(countdown);
            alert('Time\'s up! You found ' + syringesFound + ' syringes.');
        }
    }, 1000);
});

function checkGameStatus() {
    if (syringesFound === totalSyringes) {
        alert('Congratulations! You found all the syringes!');
        clearInterval(countdown);
    }
}

function useHint() {
    if (hintsUsed < 3) {
        const syringes = document.querySelectorAll('.syringe');
        for (let syringe of syringes) {
            if (syringe.style.visibility !== 'hidden') {
                syringe.style.outline = '2px solid yellow';
                setTimeout(() => {
                    syringe.style.outline = 'none';
                }, 1000);
                hintsUsed++;
                break;
            }
        }
    } else {
        alert('No more hints available!');
    }
}
