// config.js
const firebaseConfig = {
    apiKey: "AIzaSyBFl3mxmV5IyhdcC5gjiCL-D5nSdMUmz0k",
    authDomain: "ctxl-smart-speaker.firebaseapp.com",
    projectId: "ctxl-smart-speaker",
    storageBucket: "ctxl-smart-speaker.firebasestorage.app",
    messagingSenderId: "685168365893",
    appId: "1:685168365893:web:a63be17dd13430950fae2c",
    measurementId: "G-4GCWRYEPZL",
    databaseURL: "https://ctxl-smart-speaker-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Khởi tạo Firebase ngay tại đây
firebase.initializeApp(firebaseConfig);
const db = firebase.database();