/* ==========================================================================
       A. CẤU HÌNH THÔNG TIN THIỆP MỜI (TÙY BIẾN TẠI ĐÂY)
       ========================================================================== */
const INVITATION_CONFIG = {
  hostNames: "Ngọc Hoàng",
  eventDateTimeISO: "2026-09-19T17:30:00",
  eventDateFormatted: "Thứ Bảy, 19/09/2026 (Nhằm 09/08 Âm lịch)",
  eventTimeFormatted: "17:30 (5h30 chiều)", // hoặc "17:30 - 20:30" tùy bạn giữ khung giờ kết thúc
  venueName: "Tổ Ấm Mới - Nhà Ngọc Hoàng",
  venueAddress:
    "Thôn Mỹ Hòa xã Thu Bồn Đà Nẵng",
  googleMapsUrl: "https://www.google.com/maps/place/Nh%C3%A0+V%C4%83n+Ho%C3%A1+Th%C3%B4n+M%E1%BB%B9+Ho%C3%A0/@15.8282129,108.1054553,21z/data=!4m14!1m7!3m6!1s0x3142017a8afe1501:0xd0afa428a08ff26f!2zTmjDoCBWxINuIEhvw6EgVGjDtG4gTeG7uSBIb8Og!8m2!3d15.8282687!4d108.1056612!16s%2Fg%2F11h8z3fw9p!3m5!1s0x3142017a8afe1501:0xd0afa428a08ff26f!8m2!3d15.8282687!4d108.1056612!16s%2Fg%2F11h8z3fw9p?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",
  defaultGuestName: "Quý Khách Hàng & Bạn Bè",
};

/* ==========================================================================
       B. KHỞI TẠO NỘI DUNG & ĐỌC LINK KHÁCH MỜI (?to=Tên_Khách)
       ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("coverHostNames").innerText =
    INVITATION_CONFIG.hostNames;
  document.getElementById("mainHostNames").innerText =
    INVITATION_CONFIG.hostNames;
  document.getElementById("footerHostNames").innerText =
    INVITATION_CONFIG.hostNames;

  document.getElementById("eventDateText").innerText =
    INVITATION_CONFIG.eventDateFormatted;
  document.getElementById("eventTimeText").innerText =
    INVITATION_CONFIG.eventTimeFormatted;
  document.getElementById("eventVenueText").innerText =
    INVITATION_CONFIG.venueName;
  document.getElementById("eventAddressText").innerText =
    INVITATION_CONFIG.venueAddress;
  document.getElementById("googleMapLink").href =
    INVITATION_CONFIG.googleMapsUrl;

  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get("to") || urlParams.get("guest");

  if (guestParam) {
    const decodedName = decodeURIComponent(guestParam);
    document.getElementById("guestNameDisplay").innerText = decodedName;
    document.getElementById("rsvpName").value = decodedName;
  } else {
    document.getElementById("guestNameDisplay").innerText =
      INVITATION_CONFIG.defaultGuestName;
  }

  initCountdown();
  initScrollReveal();
  initParticles();
});

/* ==========================================================================
       C. XỬ LÝ HIỆU ỨNG MỞ CỬA 3D & NHẠC NỀN
       ========================================================================== */
const doorOverlay = document.getElementById("doorOverlay");
const openDoorBtn = document.getElementById("openDoorBtn");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isPlaying = false;

openDoorBtn.addEventListener("click", function () {
  // Mở cánh cửa 3D
  doorOverlay.classList.add("opened");
  document.body.classList.remove("no-scroll");

  // Phát nhạc dịu nhẹ
  playAudio();
});

function playAudio() {
  bgMusic
    .play()
    .then(() => {
      isPlaying = true;
      musicBtn.classList.add("playing");
    })
    .catch((err) => {
      console.log("Audio autoplay restriction: ", err);
    });
}

musicBtn.addEventListener("click", function () {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove("playing");
  } else {
    playAudio();
  }
});

/* ==========================================================================
       D. ĐỒNG HỒ ĐẾM NGƯỢC
       ========================================================================== */
function initCountdown() {
  const targetDate = new Date(INVITATION_CONFIG.eventDateTimeISO).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("cdDays").innerText = "00";
      document.getElementById("cdHours").innerText = "00";
      document.getElementById("cdMinutes").innerText = "00";
      document.getElementById("cdSeconds").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("cdDays").innerText = days < 10 ? "0" + days : days;
    document.getElementById("cdHours").innerText =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("cdMinutes").innerText =
      minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("cdSeconds").innerText =
      seconds < 10 ? "0" + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
       E. INTERSECTION OBSERVER SCROLL REVEAL
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
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ==========================================================================
       F. HẠT KIM TUYẾN VÀNG RƠI NỀN (CANVAS)
       ========================================================================== */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
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
       G. LIGHTBOX & FORM RSVP
       ========================================================================== */
function openLightbox(element) {
  const imgUrl = element.querySelector("img").src;
  document.getElementById("lightboxImg").src = imgUrl;
  document.getElementById("lightboxModal").classList.add("active");
}

function closeLightbox() {
  document.getElementById("lightboxModal").classList.remove("active");
}

document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("rsvpName").value.trim();
  const attendance = document.querySelector(
    'input[name="attendance"]:checked',
  ).value;

  if (!name) {
    alert("Vui lòng nhập họ và tên của quý khách.");
    return;
  }

  const thankYouMsg =
    attendance === "Sẽ tham dự"
      ? `Cảm ơn ${name} đã xác nhận tham dự. Gia đình rất hân hạnh được đón tiếp!`
      : `Gia đình đã nhận được lời nhắn từ ${name}. Rất tiếc vì quý khách không thể tham dự!`;

  document.getElementById("thankYouMessage").innerText = thankYouMsg;
  document.getElementById("thankYouModal").classList.add("show");
  this.reset();
});

function closeModal() {
  document.getElementById("thankYouModal").classList.remove("show");
}

