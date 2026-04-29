document.addEventListener("DOMContentLoaded", function () {
    // KÊNH KIỂM TRA SESSION: Chỉ chạy 1 lần trên mỗi tab/phiên duyệt web.
    if (window.sessionStorage && sessionStorage.getItem('gpmn_thongnhat_loaded')) {
        return;
    }

    // Đánh dấu là đã xem trong phiên này
    if (window.sessionStorage) {a
        sessionStorage.setItem('gpmn_thongnhat_loaded', 'true');
    }

    // Khởi tạo giao diện Loader
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'gpmn-body-load';
    loaderDiv.innerHTML = `
        <button class="close-loader">Bỏ qua / Đóng</button>
        
        <div class="planes">
            <div class="plane plane-left">
                <img src="https://sussydomain.eu.org/2-thang-9/maybay.png" alt="Máy bay"/>
            </div>
        </div>

        <div class="loader-content">
            <!-- NỬA TRÁI: TEXT & ANIMATION -->
            <div class="left-panel">
                
                <div class="text-container">
                    <span class="writing-text line-1">Chào mừng 51 năm</span>
                    <span class="writing-text golden-glow line-2">Thống Nhất Đất Nước</span>
                    <span class="writing-text line-3">30/04/1975 - 30/04/2026</span>
                </div>

                <div class="voice-area">
                    <div class="voice-label">🎧 ÂM THANH LỊCH SỬ</div>
                    <div class="voice-bars">
                        <span></span><span></span><span></span><span></span><span></span><span></span>
                    </div>
                </div>

                <!-- Xe Tăng -->
                <div class="tank-wrap">
                    <div class="vn-sun"><img src="https://api.cmsnt.co/cdn/3041975/img/vn-flag-full.gif" /></div>
                    <div class="tank-simu">
                        <div class="wheels"><span></span><span></span><span></span><span></span><span></span></div>
                        <div class="fence"></div>
                        <div class="fence2"></div>
                    </div>
                    <div class="gate"></div>
                    <div class="gate2"></div>
                </div>

            </div>

            <!-- NỬA PHẢI: ẢNH BÁC -->
            <div class="right-panel">
                <img src="https://files.catbox.moe/3ler05.png" alt="Bác Hồ" class="hcm-img">
            </div>
        </div>
    `;

    // Nhúng vào body
    document.body.appendChild(loaderDiv);

    // Khởi tạo Âm thanh bằng mã HTML5
    const audioHCM = new Audio('https://sussydomain.eu.org/2-thang-9/2-9.mp3');
    const audioBG = new Audio('https://files.catbox.moe/mqo8bv.mp3');

    // Mức âm lượng: Bác Hồ là nguồn chính (100%), Nhạc nền là phụ (~70%)
    audioHCM.volume = 1.0;
    audioBG.volume = 0.64;

    // Tự động phát khi tải xong (thêm catch lỗi phòng trường hợp trình duyệt chặn Autoplay do chưa tương tác)
    const playPromiseHCM = audioHCM.play();
    const playPromiseBG = audioBG.play();

    if (playPromiseHCM !== undefined) {
        playPromiseHCM.catch(e => console.log('Trình duyệt chặn autoplay audio (HCM):', e));
    }
    if (playPromiseBG !== undefined) {
        playPromiseBG.catch(e => console.log('Trình duyệt chặn autoplay audio (BG):', e));
    }

    // Hàm đóng Loader với hiệu ứng
    function closeLoader() {
        loaderDiv.classList.add('fade-out');
        
        // Timeout đợi CSS animation fade-out chạy xong (800ms)
        setTimeout(() => {
            if (loaderDiv.parentNode) {
                loaderDiv.parentNode.removeChild(loaderDiv);
            }
            audioHCM.pause();
            audioBG.pause();
            
            // Xóa bộ nhớ cache audio
            audioHCM.src = '';
            audioBG.src = '';
        }, 800);
    }

    // Sự kiện nút đóng
    const closeBtn = loaderDiv.querySelector('.close-loader');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLoader);
    }

    // Tự động tắt sau 18 giây
    setTimeout(() => {
        if (document.getElementById('gpmn-body-load')) {
            closeLoader();
        }
    }, 18000);
});
