/* ==========================================================================
   A. CẤU HÌNH THÔNG TIN THIỆP MỜI (TÙY BIẾN TẠI ĐÂY)
   ========================================================================== */
const INVITATION_CONFIG = {
  hostNames: "Ngọc Hoàng",
  eventDateTimeISO: "2026-09-19T17:30:00",
  
  // Định dạng hiển thị tại Hero Section
  heroTimeFormatted: "17 GIỜ 30 | THỨ BẢY",
  heroDateFormatted: "NGÀY 19 THÁNG 09 NĂM 2026 (09/08 Âm Lịch)",
  
  // Định dạng hiển thị tại Grid Chi Tiết
  gridDateFormatted: "Thứ Bảy, 19/09/2026 (09/08 Âm lịch)",
  gridTimeFormatted: "17:30 (5h30 chiều)",
  
  venueName: "Nhà Ngọc Hoàng",
  venueAddress: "Thôn Mỹ Hòa, xã Thu Bồn, Đà Nẵng",
  googleMapsUrl:
    "https://www.google.com/maps/place/Nh%C3%A0+V%C4%83n+Ho%C3%A1+Th%C3%B4n+M%E1%BB%B9+Ho%C3%A0/@15.8282129,108.1054553,21z/data=!4m14!1m7!3m6!1s0x3142017a8afe1501:0xd0afa428a08ff26f!2zTmjDoCBWxINuIEhvw6EgVGjDtG4gTeG7uSBIb8Og!8m2!3d15.8282687!4d108.1056612!16s%2Fg%2F11h8z3fw9p!3m5!1s0x3142017a8afe1501:0xd0afa428a08ff26f!8m2!3d15.8282687!4d108.1056612!16s%2Fg%2F11h8z3fw9p?entry=ttu",
  defaultGuestName: "QUÝ KHÁCH & BẠN BÈ",
  musicUrl: "https://assets.mixkit.co/music/preview/mixkit-peaceful-garden-536.mp3" // Link nhạc nền mặc định
};

// Hàm hỗ trợ gán text an toàn (tránh lỗi ngắt script nếu thiếu ID)
function safeSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

/* ==========================================================================
   B. KHỞI TẠO NỘI DUNG & ĐỌC LINK KHÁCH MỜI (?to=Tên_Khách)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  // 1. Gán thông tin cấu hình vào Section Hero
  safeSetText("heroEventTime", INVITATION_CONFIG.heroTimeFormatted);
  safeSetText("heroEventDate", INVITATION_CONFIG.heroDateFormatted);
  safeSetText("heroEventVenue", INVITATION_CONFIG.venueName);
  safeSetText("heroEventAddress", INVITATION_CONFIG.venueAddress);

  // 2. Gán thông tin vào Grid Chi Tiết & Bản Đồ
  safeSetText("gridEventDate", INVITATION_CONFIG.gridDateFormatted);
  safeSetText("gridEventTime", INVITATION_CONFIG.gridTimeFormatted);
  safeSetText("gridEventVenue", INVITATION_CONFIG.venueName);
  safeSetText("mapEventAddress", INVITATION_CONFIG.venueAddress);

  // 3. Gán thông tin Footer
  safeSetText("footerHostNames", INVITATION_CONFIG.hostNames);

  // 4. Cập nhật link Google Maps
  const googleMapLink = document.getElementById("googleMapLink");
  if (googleMapLink) {
    googleMapLink.href = INVITATION_CONFIG.googleMapsUrl;
  }

  // 5. Lấy tên khách từ đường link ?to=Tên_Khách hoặc ?guest=Tên_Khách
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get("to") || urlParams.get("guest");

  if (guestParam) {
    const decodedName = decodeURIComponent(guestParam);
    safeSetText("heroGuestName", decodedName.toUpperCase());
    safeSetText("secGuestName", decodedName);

    const rsvpNameInput = document.getElementById("rsvpName");
    if (rsvpNameInput) rsvpNameInput.value = decodedName;
  } else {
    safeSetText("heroGuestName", INVITATION_CONFIG.defaultGuestName);
    safeSetText("secGuestName", INVITATION_CONFIG.defaultGuestName);
  }

  // 6. Khởi tạo nhạc nền và các tính năng
  initAudioElement();
  initDoorAndAudio();
  initCountdown();
  initScrollReveal();
  initParticles();
  initRSVPForm();
});

/* ==========================================================================
   C. XỬ LÝ NHẠC NỀN & HIỆU ỨNG MỞ CỬA 3D
   ========================================================================== */
let isPlaying = false;

// Tự động tạo thẻ audio nếu chưa có trên HTML
function initAudioElement() {
  if (!document.getElementById("bgMusic")) {
    const audio = document.createElement("audio");
    audio.id = "bgMusic";
    audio.loop = true;
    audio.src = INVITATION_CONFIG.musicUrl;
    document.body.appendChild(audio);
  }
}

function playAudio() {
  const bgMusic = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicBtn");

  if (bgMusic) {
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        if (musicBtn) musicBtn.classList.add("playing");
      })
      .catch((err) => {
        console.log("Trình duyệt chặn phát nhạc tự động: ", err);
      });
  }
}

function initDoorAndAudio() {
  const doorOverlay = document.getElementById("doorOverlay");
  const musicBtn = document.getElementById("musicBtn");

  // Click vào cửa 3D để mở
  if (doorOverlay) {
    doorOverlay.addEventListener("click", function () {
      doorOverlay.classList.add("closed"); // Khớp với class mở cửa trong CSS
      document.body.classList.remove("no-scroll");
      playAudio();
    });
  }

  // Nút bật/tắt nhạc thủ công
  if (musicBtn) {
    musicBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const bgMusic = document.getElementById("bgMusic");
      if (!bgMusic) return;

      if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        musicBtn.classList.remove("playing");
      } else {
        playAudio();
      }
    });
  }
}

/* ==========================================================================
   D. ĐỒNG HỒ ĐẾM NGƯỢC
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date(INVITATION_CONFIG.eventDateTimeISO).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      safeSetText("cdDays", "00");
      safeSetText("cdHours", "00");
      safeSetText("cdMinutes", "00");
      safeSetText("cdSeconds", "00");
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    safeSetText("cdDays", days < 10 ? "0" + days : days);
    safeSetText("cdHours", hours < 10 ? "0" + hours : hours);
    safeSetText("cdMinutes", minutes < 10 ? "0" + minutes : minutes);
    safeSetText("cdSeconds", seconds < 10 ? "0" + seconds : seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   E. HIỆU ỨNG HIỂN THỊ KHI CUỘN TRANG (SCROLL REVEAL)
   ========================================================================== */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ==========================================================================
   F. HẠT KIM TUYẾN VÀNG RƠI NỀN (CANVAS)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 0.5 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.7 + 0.3;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(245, 215, 127, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 45; i++) {
    particlesArray.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ==========================================================================
   G. LIGHTBOX SHOW ẢNH & FORM XÁC NHẬN RSVP
   ========================================================================== */
function openLightbox(element) {
  const img = element.querySelector("img");
  const modal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");

  if (img && modal && lightboxImg) {
    lightboxImg.src = img.src;
    modal.style.display = "flex";
  }
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function initRSVPForm() {
  const rsvpForm = document.getElementById("rsvpForm");
  if (!rsvpForm) return;

  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("rsvpName");
    const attendanceInput = document.querySelector('input[name="attendance"]:checked');

    const name = nameInput ? nameInput.value.trim() : "";
    const attendance = attendanceInput ? attendanceInput.value : "";

    if (!name) {
      alert("Vui lòng nhập họ và tên của quý khách.");
      return;
    }

    const thankYouMsg =
      attendance === "Sẽ tham dự"
        ? `Cảm ơn ${name} đã xác nhận tham dự. Gia đình rất hân hạnh được đón tiếp!`
        : `Gia đình đã nhận được lời nhắn từ ${name}. Rất tiếc vì quý khách không thể tham dự!`;

    safeSetText("thankYouMessage", thankYouMsg);

    const thankYouModal = document.getElementById("thankYouModal");
    if (thankYouModal) {
      thankYouModal.style.display = "flex";
    }

    this.reset();
  });
}

function closeModal() {
  const thankYouModal = document.getElementById("thankYouModal");
  if (thankYouModal) {
    thankYouModal.style.display = "none";
  }
}