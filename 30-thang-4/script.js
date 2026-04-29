document.addEventListener("DOMContentLoaded", function () {
    // new 1
    if (window.sessionStorage && sessionStorage.getItem('gpmn_thongnhat_loaded')) {
        return;
    }

    // Đánh dấu là đã xem trong phiên này
    if (window.sessionStorage) {
        sessionStorage.setItem('gpmn_thongnhat_loaded', 'true');
    }

    // 1. CHUẨN BỊ CSS CHO HIỆU ỨNG NHẤP NHÁY (KHI AUDIO BỊ CHẶN)
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulseGlowClick {
            0% { transform: scale(1); text-shadow: 0 0 5px #FFD700; color: #FFD700; }
            100% { transform: scale(1.15); text-shadow: 0 0 20px #FFD700, 0 0 30px #FFA500; color: #FFF; }
        }
        .audio-require-click .voice-label {
            animation: pulseGlowClick 0.8s infinite alternate ease-in-out !important;
            cursor: pointer;
        }
        .audio-require-click {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // 2. PRELOAD: TẢI TRƯỚC TOÀN BỘ TÀI NGUYÊN (ẢNH, AUDIO) TRƯỚC KHI HIỂN THỊ
    const preloadingDiv = document.createElement('div');
    preloadingDiv.style.cssText = 'position:fixed;inset:0;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;font-size:14px;';
    preloadingDiv.innerHTML = 'Đang tải dữ liệu...';
    document.body.appendChild(preloadingDiv);

    const imageUrls = [
        'https://cdnproxy.miku.us.kg/https://files.catbox.moe/j5z5nk.png',
        'https://files.catbox.moe/3ler05.png',
        'https://api.cmsnt.co/cdn/3041975/img/vn-flag-full.gif',
        'https://api.cmsnt.co/cdn/3041975/img/tank.webp',
        'https://api.cmsnt.co/cdn/3041975/img/wheel.webp',
        'https://api.cmsnt.co/cdn/3041975/img/fence.webp',
        'https://api.cmsnt.co/cdn/3041975/img/fence2.webp',
        'https://sussydomain.eu.org/2-thang-9/maybay.png'
    ];

    const audioHCM = new Audio('https://sussydomain.eu.org/2-thang-9/2-9.mp3');
    const audioBG = new Audio('https://files.catbox.moe/mqo8bv.mp3');
    audioHCM.volume = 1.0;
    audioBG.volume = 0.64;

    const loadPromises = [];

    // Promise tải ảnh
    imageUrls.forEach(src => {
        loadPromises.push(new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Lỗi thì bỏ qua, để không bị kẹt loading mãi
            img.src = src;
        }));
    });

    // Promise tải audio
    [audioHCM, audioBG].forEach(aud => {
        loadPromises.push(new Promise(resolve => {
            aud.addEventListener('canplaythrough', resolve, { once: true });
            aud.addEventListener('error', resolve, { once: true });
            aud.load();
        }));
    });

    let isLoaded = false;
    
    // Khi tất cả đã tải xong
    Promise.all(loadPromises).then(() => {
        if (!isLoaded) {
            isLoaded = true;
            document.body.removeChild(preloadingDiv);
            showLoaderEffects(audioHCM, audioBG);
        }
    });

    // Fallback: Quá 6 giây mà mạng chậm chưa tải xong, ép hiện Loader luôn
    setTimeout(() => {
        if (!isLoaded && document.body.contains(preloadingDiv)) {
            isLoaded = true;
            document.body.removeChild(preloadingDiv);
            showLoaderEffects(audioHCM, audioBG);
        }
    }, 6000);

    // 3. HÀM CHÍNH ĐỂ CHẠY HIỆU ỨNG VÀ XỬ LÝ AUDIO
    function showLoaderEffects(audioHCM, audioBG) {
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

        let audioBlocked = false;

        // Xử lý khi người dùng click vào màn hình để bật âm thanh (nếu bị chặn)
        loaderDiv.addEventListener('click', () => {
            if (audioBlocked) {
                audioHCM.play().catch(e => console.log('Vẫn không thể phát audio:', e));
                audioBG.play().catch(e => console.log('Vẫn không thể phát audio:', e));
                
                audioBlocked = false;
                loaderDiv.classList.remove('audio-require-click');
                
                const vl = loaderDiv.querySelector('.voice-label');
                if (vl) vl.innerHTML = '🎧 ÂM THANH LỊCH SỬ';
            }
        });

        // Hàm bắt lỗi khi trình duyệt chặn Autoplay
        const handleAudioError = (e) => {
            console.log('Trình duyệt chặn autoplay audio:', e);
            if (!audioBlocked) {
                audioBlocked = true;
                loaderDiv.classList.add('audio-require-click');
                const vl = loaderDiv.querySelector('.voice-label');
                if (vl) vl.innerHTML = '🎧 BẤM VÀO ĐÂY ĐỂ PHÁT ÂM THANH';
            }
        };

        // Tự động phát khi tải xong
        const playPromiseHCM = audioHCM.play();
        const playPromiseBG = audioBG.play();

        if (playPromiseHCM !== undefined) {
            playPromiseHCM.catch(handleAudioError);
        }
        if (playPromiseBG !== undefined) {
            playPromiseBG.catch(handleAudioError);
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
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Ngăn sự kiện click truyền ra ngoài
                closeLoader();
            });
        }

        // Tự động tắt sau 18 giây
        setTimeout(() => {
            if (document.getElementById('gpmn-body-load')) {
                closeLoader();
            }
        }, 18000);
    }
});
