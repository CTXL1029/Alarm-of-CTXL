// receiver.js
const audio = document.getElementById('ringtone');
const statusText = document.getElementById('status-text');
const body = document.body;
let isFirstLoad = true;

// Xử lý lỗi nếu file âm thanh hỏng
audio.onerror = function() {
    statusText.innerText = "⚠️ Lỗi tải file nhạc!";
    statusText.style.color = "red";
};

function initAudio() {
    // Mồi âm thanh cho iOS
    audio.play().then(() => {
        audio.pause();
        switchToActiveMode();
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
        // Bỏ qua lần load đầu tiên để tránh chuông tự kêu
        if (isFirstLoad) {
            isFirstLoad = false;
            return;
        }

        const data = snapshot.val();
        if (!data) return;

        if (data.command === "START") {
            // 1. Phát nhạc
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Lỗi phát:", e));

            // 2. Cập nhật giao diện báo động
            statusText.innerHTML = `${data.name}<br>ĐÃ VỀ!`;
            statusText.className = "status-big"; // Chữ to, nhấp nháy
            body.className = "receiver-theme alert-mode"; // Nền đỏ

        } else if (data.command === "STOP") {
            // 1. Tắt nhạc
            audio.pause();
            audio.currentTime = 0;

            // 2. Trả về giao diện bình thường
            statusText.innerText = "ĐANG TRỰC...";
            statusText.className = "";
            body.className = "receiver-theme"; // Nền đen
        }
    });
}