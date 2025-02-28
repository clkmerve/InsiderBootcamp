let countdown;
let timeLeft;

function startCountdown() {
    clearInterval(countdown);
    timeLeft = parseInt(document.getElementById('timeInput').value, 10);
    //parseInt: Tam sayı kısmını alır
    //Number: Ondalık sayıları da destekler.
    
    if (isNaN(timeLeft) || timeLeft <= 0) {
        alert("Lütfen geçerli bir süre girin!");
        return;
    }
    
    document.getElementById('countdownDisplay').innerText = `Süre: ${timeLeft}`;
    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('countdownDisplay').innerText = `Süre: ${timeLeft}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            document.getElementById('countdownDisplay').innerText = "Süre doldu!";
        }
    }, 1000);
}

function resetCountdown() {
    clearInterval(countdown);
    document.getElementById('countdownDisplay').innerText = "Süre: 0";
    document.getElementById('timeInput').value = "0";
}