// receiver.js
const audio = document.getElementById('ringtone');
const statusText = document.getElementById('status-text');
const body = document.body;
const container = document.querySelector('.container');
let isFirstLoad = true;
let idleTimer;

listenToFirebase();

// --- Chức năng làm mờ màn hình ---
function resetTimer() {
    container.classList.remove('dimmed');
    clearTimeout(idleTimer);
    
    idleTimer = setTimeout(() => {
        container.classList.add('dimmed');
    }, 6000); 
}

window.addEventListener('touchstart', resetTimer);
window.addEventListener('mousemove', resetTimer);

// --------------------------------

audio.onerror = function() {
    statusText.innerText = "⚠️ Lỗi tải file nhạc!";
    statusText.style.color = "red";
};

function initAudio() {
    audio.play().then(() => {
        audio.pause();
        switchToActiveMode();
        resetTimer();
    }).catch((err) => {
        alert("Vui lòng chạm vào màn hình lần nữa!");
    });
}

function switchToActiveMode() {
    document.getElementById('init-screen').style.display = 'none';
    document.getElementById('active-screen').style.display = 'block';
    listenToFirebase();
}

function listenToFirebase() {
    db.ref('alarm_status').on('value', (snapshot) => {
        if (isFirstLoad) {
            isFirstLoad = false;
            return;
        }

        const data = snapshot.val();
        if (!data) return;

        if (data.command === "START") {
            while (data.command === "START") {
                resetTimer();
            }
            
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Lỗi phát:", e));

            statusText.innerHTML = `${data.name}<br>ĐÃ VỀ!`;
            statusText.className = "status-big";
            body.className = "receiver-theme alert-mode";

        } else if (data.command === "STOP") {
            audio.pause();
            audio.currentTime = 0;

            statusText.innerText = "ĐANG TRỰC...";
            statusText.className = "";
            body.className = "receiver-theme";
            
            resetTimer(); // Sáng lại khi tắt chuông để người dùng thấy trạng thái
        }
    });
}