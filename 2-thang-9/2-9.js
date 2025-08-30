const DURATION_MS = 5000;
const RUN_ONCE_PER_SESSION = true;
const AUDIO_SRC = "https://sussydomain.eu.org/2-thang-9/2-9.mp3";
const ENABLE_PROGRESS_BAR = true;
const PLANE_IMG = "https://sussydomain.eu.org/2-thang-9/maybay.png";

(function () {
  let loadPreloader = true;
  if (RUN_ONCE_PER_SESSION && window.sessionStorage) {
    const seen = sessionStorage.getItem("gpmn_preloader_shown");
    loadPreloader = !seen;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!loadPreloader) return;

    const wrap = document.createElement("div");
    wrap.id = "gpmn-body-load";
    wrap.innerHTML = `
      <div class="bl-logo">
        <div class="planes">
          <div class="plane plane-left" aria-hidden="true">
            <img src="${PLANE_IMG}" alt="Máy bay trái"/>
            <span class="trail"></span>
          </div>
          <div class="plane plane-right" aria-hidden="true">
            <img src="${PLANE_IMG}" alt="Máy bay phải"/>
            <span class="trail"></span>
          </div>
        </div>

        <div class="centerpiece">
          <div class="vn-sun">
            <img src="https://api.cmsnt.co/cdn/3041975/img/vn-flag-full.gif" alt="Cờ Việt Nam" loading="eager"/>
          </div>

          <div class="headline">
            Chào mừng <strong>80 năm Quốc khánh</strong><br/>
            <span>02/09/1945 – 02/09/2025</span>
          </div>

          <div class="voice-area">
            <div class="voice-label">🎤 Tuyên ngôn Độc lập</div>
            <div class="voice-bars">
              <span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <button class="audio-toggle" type="button" style="display:none">🔊 Nghe giọng Bác Hồ</button>
            <audio id="gpmn-audio" preload="auto" ${AUDIO_SRC ? `src="${AUDIO_SRC}"` : ""}></audio>
          </div>
        </div>

        ${ENABLE_PROGRESS_BAR ? `
        <div class="loading-progress">
          <div class="loading-bar"></div>
        </div>` : ''}
      </div>
    `;
    document.body.appendChild(wrap);

    const audio = wrap.querySelector("#gpmn-audio");
    const toggleBtn = wrap.querySelector(".audio-toggle");
    const tryAutoPlay = () => {
      if (!audio || !AUDIO_SRC) return;
      audio.currentTime = 0; audio.volume = 0.8;
      audio.play().catch(() => { toggleBtn.style.display = "inline-flex"; });
    };
    if (audio && AUDIO_SRC) {
      audio.addEventListener('loadeddata', tryAutoPlay);
      toggleBtn.addEventListener("click", () => {
        audio.play().then(() => {
          toggleBtn.style.display = "none";
          toggleBtn.textContent = "🔊 Đang phát...";
        }).catch(console.warn);
      });
      audio.addEventListener('ended', () => {
        toggleBtn.textContent = "🔊 Nghe lại";
        toggleBtn.style.display = "inline-flex";
      });
    }
    setTimeout(() => {
      wrap.classList.add("fade-out");
      setTimeout(() => wrap.parentNode && wrap.parentNode.removeChild(wrap), 800);
    }, DURATION_MS);

    if (RUN_ONCE_PER_SESSION && window.sessionStorage) {
      sessionStorage.setItem("gpmn_preloader_shown", "true");
    }
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        wrap.classList.add("fade-out");
        setTimeout(() => wrap.parentNode && wrap.parentNode.removeChild(wrap), 800);
      }
    });
    wrap.setAttribute('tabindex','0'); wrap.focus();
  });
})();
