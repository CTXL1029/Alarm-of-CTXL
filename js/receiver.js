// receiver.js
const audio = document.getElementById('ringtone');
const statusText = document.getElementById('status-text');
const body = document.body;
const container = document.querySelector('.container');
let isFirstLoad = true;
let idleTimer;
let canPlayAudio = false; // Biến kiểm soát quyền phát nhạc

// Tự động chạy ngay khi load trang
listenToFirebase();

function resetTimer() {
    container.classList.remove('dimmed');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        container.classList.add('dimmed');
    }, 6000); 
}

window.addEventListener('touchstart', resetTimer);
window.addEventListener('mousemove', resetTimer);

audio.onerror = function() {
    statusText.innerText = "⚠️ Lỗi tải file nhạc!";
    statusText.style.color = "red";
};

// Hàm này giờ chỉ làm nhiệm vụ "xin quyền" phát nhạc từ trình duyệt
function initAudio() {
    audio.play().then(() => {
        audio.pause();
        canPlayAudio = true; // Đã có quyền phát nhạc
        document.getElementById('init-screen').style.display = 'none';
        document.getElementById('active-screen').style.display = 'block';
        resetTimer();
    }).catch((err) => {
        alert("Vui lòng chạm vào nút KÍCH HOẠT!");
    });
}

function listenToFirebase() {
    // Luôn lắng nghe Firebase bất kể đã bấm nút hay chưa
    db.ref('alarm_status').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Cập nhật trạng thái văn bản ngay lập tức
        if (data.command === "START") {
            resetTimer();
            statusText.innerHTML = `${data.name}<br>ĐÃ VỀ!`;
            statusText.className = "status-big";
            body.className = "receiver-theme alert-mode";
            
            // Chỉ phát nhạc nếu đã nhấn nút kích hoạt trước đó
            if (canPlayAudio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log("Lỗi phát:", e));
            } else {
                console.log("Đã nhận tín hiệu nhưng chưa có quyền phát âm thanh.");
            }

        } else if (data.command === "STOP") {
            if (canPlayAudio) {
                audio.pause();
                audio.currentTime = 0;
            }
            statusText.innerText = "ĐANG TRỰC...";
            statusText.className = "";
            body.className = "receiver-theme";
            resetTimer();
        }
    });
}