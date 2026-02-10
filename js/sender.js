// sender.js

/**
 * Hàm gửi tín hiệu kèm mã xác thực lưu trong máy
 * @param {string} cmd - Lệnh 'START' hoặc 'STOP'
 */
function sendSignal(cmd) {
    const selectedName = document.getElementById('personSelect').value;
    const logElement = document.getElementById('log');

    // 1. Lấy mật mã đã lưu trong bộ nhớ trình duyệt (localStorage)
    let savedKey = localStorage.getItem('admin_password');

    // 2. Nếu máy này chưa bao giờ nhập mã, hãy yêu cầu nhập ngay
    if (!savedKey) {
        savedKey = prompt("LẦN ĐẦU SỬ DỤNG:\nVui lòng nhập mã bảo mật gia đình để ghi nhớ vào máy này:");
        
        if (savedKey) {
            // Lưu lại để lần sau không phải nhập nữa
            localStorage.setItem('admin_password', savedKey);
        } else {
            // Nếu người dùng nhấn Hủy (Cancel)
            alert("Bạn cần có mã để gửi lệnh!");
            return; 
        }
    }

    // 3. Gửi lệnh lên Firebase kèm theo mã xác thực (auth_token)
    // Firebase Rules sẽ so khớp 'auth_token' này với 'admin_token' trên server
    db.ref('alarm_status').set({
        command: cmd,
        name: selectedName,
        timestamp: Date.now(),
        auth_token: savedKey 
    }).then(() => {
        // Thông báo thành công
        if (cmd === 'START') {
            logElement.innerText = `✅ Đã báo: ${selectedName} về!`;
            logElement.style.color = "green";
        } else {
            logElement.innerText = "🔇 Đã tắt chuông.";
            logElement.style.color = "red";
        }
    }).catch((err) => {
        // Nếu mã sai hoặc Rules chặn, Firebase sẽ trả về lỗi
        logElement.innerText = "❌ Lỗi: Sai mã hoặc không có quyền!";
        logElement.style.color = "orange";
        
        // Xóa mã sai trong máy để người dùng có thể nhập lại mã mới
        localStorage.removeItem('admin_password');
        console.error("Firebase Error:", err);
    });
}