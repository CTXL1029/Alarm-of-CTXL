// receiver.js
const statusText = document.getElementById('status-text');
const body = document.body;
const container = document.querySelector('.container');
let isFirstLoad = true;
let idleTimer;

// Hàm lấy tên từ URL (ví dụ: #Bố%20Mười)
function getNameFromURL() {
    const hash = window.location.hash.substring(1); 
    return hash ? decodeURIComponent(hash) : "";
}

function resetTimer() {
    container.classList.remove('dimmed');
    clearTimeout(idleTimer);
    // iOS 12: Giữ sáng 30s khi có báo động, 6s khi bình thường
    const delay = body.classList.contains('alert-mode') ? 30000 : 6000;
    idleTimer = setTimeout(() => {
        container.classList.add('dimmed');
    }, delay);
}

// Tự động chạy khi trang tải xong
document.addEventListener("DOMContentLoaded", function() {
    const personName = getNameFromURL();
    
    if (personName) {
        showAlert(personName);
    }
    
    listenToFirebase();
    resetTimer();
});

function showAlert(name) {
    statusText.innerHTML = `${name}<br>ĐÃ VỀ!`;
    statusText.className = "status-big";
    body.className = "receiver-theme alert-mode";
    resetTimer();
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
            // Ưu tiên tên từ URL Hash, nếu không có mới dùng tên từ Firebase
            const personName = getNameFromURL() || data.name;
            showAlert(personName);
        } else if (data.command === "STOP") {
            statusText.innerText = "ĐANG TRỰC...";
            statusText.className = "";
            body.className = "receiver-theme";
            window.location.hash = ""; 
            resetTimer();
        }
    });
}

window.addEventListener('touchstart', resetTimer);