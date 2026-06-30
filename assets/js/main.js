// Theme toggle
(function () {
  const html = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") html.setAttribute("data-theme", "dark");

  window.toggleTheme = function () {
    const current = html.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };
})();

// Smooth Scroll

const lenis = new Lenis();
lenis.on("scroll", (e) => {
  console.log(e);
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Preloader
window.addEventListener("load", function () {
  var loaderOverlay = document.querySelector(".loader-overlay");
  var loaderPercent = document.getElementById("loader-percent");
  var loaderLine = document.querySelector(".loader-line__fill");
  var loaderShutters = document.querySelectorAll(".loader__shutter-panel");
  var logoIcon = document.querySelector(".loader__logo-icon");
  var loaderShade = document.querySelector(".loader__shade");

  if (!loaderOverlay || !loaderPercent) return;

  // Build rolling digit reels
  function buildLoaderDigit(targetDigit, index) {
    var reel = document.createElement("span");
    var strip = document.createElement("span");
    var target = parseInt(targetDigit, 10);
    var loops = 3 + index;
    var finalStep = loops * 10 + target;

    reel.className = "loader-percent-digit";
    strip.className = "loader-percent-strip";
    reel.dataset.finalStep = finalStep;

    for (var i = 0; i <= finalStep; i++) {
      var s = document.createElement("span");
      s.textContent = i % 10;
      strip.appendChild(s);
    }
    reel.appendChild(strip);
    return reel;
  }

  loaderPercent.innerHTML = "";
  "100".split("").forEach(function (digit, index) {
    loaderPercent.appendChild(buildLoaderDigit(digit, index));
  });

  var percentSymbol = document.createElement("span");
  percentSymbol.className = "loader-percent-symbol";
  percentSymbol.textContent = "%";
  loaderPercent.appendChild(percentSymbol);

  if (window.gsap) {
    var loaderTimeline = gsap.timeline({
      delay: 0.25,
      onComplete: function () {
        loaderOverlay.style.display = "none";
      },
    });

    loaderTimeline
      // Phase 1 — count-up + progress bar (simultaneous)
      .to(".loader-percent-strip", {
        y: function (_index, strip) {
          var reel = strip.closest(".loader-percent-digit");
          return "-" + reel.dataset.finalStep + "em";
        },
        duration: 1.9,
        ease: "power4.out",
        stagger: 0.12,
      })
      .to(loaderLine, { width: "100%", duration: 1.8, ease: "power3.out" }, 0)
      // Phase 2 — logo slides up out of frame
      .to(logoIcon, { y: "-250%", duration: 0.55, ease: "power3.in" })
      // Phase 3 — shade collapses
      .to(loaderShade, { height: 0, duration: 0.65, ease: "power3.inOut" })
      // Phase 4 — hide bar and counter
      .to([".loader-line", ".loader-progress"], {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      })
      // Phase 5 — shutters fold away
      .to(loaderShutters, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.85,
        ease: "expo.inOut",
        stagger: 0.09,
      });
  } else {
    // GSAP not available — simple fallback
    loaderPercent.textContent = "100%";
    if (loaderLine) loaderLine.style.width = "100%";
    setTimeout(function () {
      loaderOverlay.style.display = "none";
    }, 700);
  }
});

// Navbar fixed on scroll
window.addEventListener("scroll", function () {
  var sticky = document.querySelector(".navbar-main");
  var scroll = window.pageYOffset || document.documentElement.scrollTop;

  if (scroll >= 10) {
    sticky.classList.add("navbar-fixed");
  } else {
    sticky.classList.remove("navbar-fixed");
  }
});

// Scroll to top----------------

// Get the return-top button element
var returnTopButton = document.getElementById("return-top");

// Function to handle the scroll event
function handleScroll() {
  if (window.scrollY >= 50) {
    // If page is scrolled more than 50px
    returnTopButton.style.opacity = "1"; // Fade in the arrow
  } else {
    returnTopButton.style.opacity = "0"; // Else fade out the arrow
  }
}

// Add a scroll event listener to the window
window.addEventListener("scroll", handleScroll);

// Function to scroll to the top when the button is clicked
function scrollToTop() {
  // When arrow is clicked
  window.scrollTo({
    top: 0, // Scroll to the top of the page
    behavior: "smooth", // Smooth scrolling behavior
  });
}

// Add a click event listener to the return-top button
returnTopButton.addEventListener("click", scrollToTop);

// ─── Mobile drawer ────────────────────────────────────────────────────────────
(function () {
  const hamburger = document.getElementById("btnHamburger");
  const drawer = document.getElementById("mobileDrawer");
  const backdrop = document.getElementById("mobileBackdrop");
  const closeBtn = document.getElementById("btnDrawerClose");

  if (!hamburger || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.classList.add("is-visible");
    hamburger.classList.add("is-active");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.classList.remove("is-visible");
    hamburger.classList.remove("is-active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", function () {
    drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("is-open"))
      closeDrawer();
  });

  drawer.querySelectorAll(".mobile-drawer__link").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });
})();

// ─── Hero — Magnetic play/pause ───────────────────────────────────────────────
(function () {
  const magnetic = document.getElementById("heroPlayMagnetic");
  const btn = document.getElementById("heroPlayBtn");
  const video = document.getElementById("heroVideo");

  if (!magnetic || !btn || !video || !window.gsap) return;

  const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

  // ── Magnetic movement ──────────────────────────────────────────────────────
  magnetic.addEventListener("mousemove", function (e) {
    if (isTouchDevice()) return;

    const rect = magnetic.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    gsap.to(btn, {
      x: dx * 0.38,
      y: dy * 0.38,
      duration: 0.35,
      ease: "power2.out",
    });
  });

  magnetic.addEventListener("mouseleave", function () {
    // Elastic snap back — the signature of a premium magnetic button
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1.1, 0.4)",
    });
  });

  // ── Play / Pause toggle ────────────────────────────────────────────────────
  btn.addEventListener("click", function () {
    if (video.paused) {
      video.play().catch(() => {});
      btn.classList.remove("is-paused");
      btn.setAttribute("aria-label", "Pause video");
    } else {
      video.pause();
      btn.classList.add("is-paused");
      btn.setAttribute("aria-label", "Play video");
    }
  });
})();

// ─── App section — scroll-triggered sequence ─────────────────────────────────
(function () {
  const section = document.querySelector(".section-app");
  const base = document.querySelector(".app-mockup-base");
  const mockup = document.querySelector(".app-mockup");
  const shade = document.querySelector(".app-shade");
  const leftCards = document.querySelectorAll(".app-left__cards .app-card");
  const rightCards = document.querySelectorAll(".app-right .app-card");

  if (!section || !window.gsap) return;

  // Set initial hidden states
  gsap.set(base, { opacity: 0 });
  gsap.set(mockup, { opacity: 0, y: -70 });
  gsap.set(shade, { opacity: 0, scale: 0.6 });
  gsap.set(leftCards, {
    opacity: 0,
    scale: 0.5,
    transformOrigin: "center center",
  });
  gsap.set(rightCards, {
    opacity: 0,
    scale: 0.5,
    transformOrigin: "center center",
  });

  var tl = gsap.timeline({ paused: true });

  tl
    // 1. Base fades in
    .to(base, {
      opacity: 1,
      duration: 0.75,
      ease: "power2.out",
    })
    // 2. Mockup drops from above onto the base
    .to(
      mockup,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.3)",
      },
      "-=0.25",
    )
    // 3. Shade blooms in after mockup lands
    .to(shade, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: "power2.out",
    })
    // 4. Left cards pop in one by one
    .to(
      leftCards,
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.14,
        ease: "back.out(1.8)",
      },
      "-=0.55",
    )
    // 5. Right cards pop in one by one
    .to(
      rightCards,
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.14,
        ease: "back.out(1.8)",
      },
      "-=0.65",
    );

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tl.play();
          observer.unobserve(section);
        }
      });
    },
    { threshold: 0.25 },
  );

  observer.observe(section);
})();

// ─── Fort intro icon — scroll-triggered fade in ──────────────────────────────
(function () {
  const icons = document.querySelectorAll(".fort-intro__icon");
  if (!icons.length || !window.gsap) return;

  gsap.set(icons, { opacity: 0 });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 0.65,
            duration: 1.2,
            ease: "power2.out",
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  icons.forEach(function (icon) {
    observer.observe(icon);
  });
})();

// ─── Venues — image + shape reveal on scroll ─────────────────────────────────
(function () {
  const items = document.querySelectorAll(".venues-item");
  if (!items.length || !window.gsap) return;

  items.forEach(function (item) {
    var img = item.querySelector(".venues-item__img");
    var shape = item.querySelector(".venues-item__shape");

    if (img)
      gsap.set(img, {
        scale: 1.14,
        opacity: 0,
        transformOrigin: "center center",
      });
    if (shape)
      gsap.set(shape, {
        height: 0,
        scaleX: 0.7,
        opacity: 0,
        transformOrigin: "center bottom",
      });
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target.querySelector(".venues-item__img");
          var shape = entry.target.querySelector(".venues-item__shape");

          var tl = gsap.timeline();

          if (img)
            tl.to(img, {
              scale: 1,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
            });

          if (shape)
            tl.to(
              shape,
              {
                height: "80%",
                scaleX: 1,
                opacity: 1,
                duration: 0.75,
                ease: "expo.out",
              },
              "-=0.55",
            );

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
})();

// ─── Blob — scroll-triggered morph ───────────────────────────────────────────
(function () {
  const blob = document.getElementById("discoverBlob");
  const morphAnim = document.getElementById("blobMorph");
  if (!blob || !morphAnim) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          morphAnim.beginElement();
          observer.unobserve(blob);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(blob);
})();

// ─── Download app blob — scale reveal on scroll ───────────────────────────────
(function () {
  const blob = document.querySelector(".download-app-blob");
  if (!blob || !window.gsap) return;

  gsap.set(blob, { scale: 0, transformOrigin: "center center" });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          gsap.to(blob, {
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)",
          });
          observer.unobserve(blob);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(blob);
})();

// ─── Events slider ────────────────────────────────────────────────────────────
(function () {
  var el = document.querySelector(".events-swiper");
  if (!el) return;

  var eventsSwiper = new Swiper(".events-swiper", {
    loop: true,
    speed: 600,
    slidesPerView: 1,
    navigation: {
      prevEl: "#eventsPrev",
      nextEl: "#eventsNext",
    },
  });
})();

// ─── Venue & package cards — mouse light effect ──────────────────────────────
(function () {
  const cards = document.querySelectorAll(".venue-card, .bt-package-card");
  if (!cards.length || !window.gsap) return;

  const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      if (isTouchDevice()) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mx", (x / rect.width) * 100 + "%");
      card.style.setProperty("--my", (y / rect.height) * 100 + "%");
    });

    card.addEventListener("mouseleave", function () {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  });
})();

// ─── Gallery — 3D tilt on hover ──────────────────────────────────────────────
(function () {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length || !window.gsap) return;

  const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

  items.forEach(function (item) {
    var inner = item.querySelector(".gallery-item__inner");

    item.addEventListener("mousemove", function (e) {
      if (isTouchDevice()) return;
      var rect = item.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotY = ((x - cx) / cx) * 10;
      var rotX = -((y - cy) / cy) * 8;

      gsap.to(inner, {
        rotateX: rotX,
        rotateY: rotY,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 800,
      });
    });

    item.addEventListener("mouseleave", function () {
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1.1, 0.4)",
      });
    });
  });
})();

// ─── Gallery — lightbox ───────────────────────────────────────────────────────
(function () {
  var items = document.querySelectorAll(".gallery-item");
  var lightbox = document.getElementById("galleryLightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var closeBtn = document.getElementById("lightboxClose");
  var backdrop = document.getElementById("lightboxBackdrop");

  if (!lightbox || !items.length) return;

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      var src = item.dataset.gallerySrc;
      if (!src) return;
      lightboxImg.src = src;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightboxImg.src = "";
    }, 350);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open"))
      closeLightbox();
  });
})();

// ─── Nav floating indicator dot ──────────────────────────────────────────────
(function () {
  // ── Desktop ────────────────────────────────────────────────────────────────
  var nav = document.querySelector(".nav-main");
  if (nav) {
    var dot = document.createElement("span");
    dot.className = "nav-indicator";
    nav.appendChild(dot);

    var activeItem = nav.querySelector(".nav-main__item.active");

    function placeDesktopDot(item, animate) {
      if (!item) {
        dot.style.opacity = "0";
        return;
      }
      var navRect = nav.getBoundingClientRect();
      var itemRect = item.getBoundingClientRect();
      var centerX = itemRect.left - navRect.left + itemRect.width / 2;

      if (!animate) {
        dot.style.transition = "none";
        dot.style.left = centerX + "px";
        // Re-enable transition on the next frame so it doesn't affect
        // the instant initial placement
        requestAnimationFrame(function () {
          dot.style.transition = "";
        });
      } else {
        dot.style.left = centerX + "px";
      }
      dot.style.opacity = "1";
    }

    // Instant placement on load
    placeDesktopDot(activeItem, false);

    // Hover preview: dot follows the cursor, snaps back on leave
    nav.querySelectorAll(".nav-main__item").forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        placeDesktopDot(item, true);
      });
    });
    nav.addEventListener("mouseleave", function () {
      placeDesktopDot(activeItem, true);
    });
  }

  // ── Mobile ─────────────────────────────────────────────────────────────────
  var drawerList = document.querySelector(".mobile-drawer__list");
  var drawer = document.getElementById("mobileDrawer");
  if (!drawerList || !drawer) return;

  var mobileDot = document.createElement("span");
  mobileDot.className = "mobile-nav-indicator";
  drawerList.appendChild(mobileDot);

  var mobileActiveItem = drawerList.querySelector(
    ".mobile-drawer__item.active",
  );

  function placeMobileDot(item, animate) {
    if (!item) {
      mobileDot.style.opacity = "0";
      return;
    }
    var listRect = drawerList.getBoundingClientRect();
    var itemRect = item.getBoundingClientRect();
    var centerY = itemRect.top - listRect.top + itemRect.height / 2;

    if (!animate) {
      mobileDot.style.transition = "none";
      mobileDot.style.top = centerY + "px";
      requestAnimationFrame(function () {
        mobileDot.style.transition = "";
      });
    } else {
      mobileDot.style.top = centerY + "px";
    }
    mobileDot.style.opacity = "1";
  }

  // When the drawer finishes opening: slide indicator in from the left
  drawer.addEventListener("transitionend", function (e) {
    if (e.propertyName !== "transform") return;

    if (drawer.classList.contains("is-open")) {
      // Step 1 — position at correct Y, parked off-screen left
      mobileDot.style.transition = "none";
      mobileDot.style.transform = "translateY(-50%) translateX(-20px)";
      mobileDot.style.opacity = "0";
      if (mobileActiveItem) {
        var listRect = drawerList.getBoundingClientRect();
        var itemRect = mobileActiveItem.getBoundingClientRect();
        mobileDot.style.top =
          itemRect.top - listRect.top + itemRect.height / 2 + "px";
      }

      // Step 2 — slide in horizontally (double rAF forces a repaint first)
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          mobileDot.style.transition =
            "top 0.38s cubic-bezier(0.4,0,0.2,1), " +
            "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), " +
            "opacity 0.25s ease";
          mobileDot.style.transform = "translateY(-50%) translateX(0)";
          mobileDot.style.opacity = "1";
        });
      });
    } else {
      // Drawer closed — hide dot instantly
      mobileDot.style.transition = "none";
      mobileDot.style.opacity = "0";
      mobileDot.style.transform = "translateY(-50%) translateX(-20px)";
    }
  });

  // Hover preview inside drawer
  drawerList.querySelectorAll(".mobile-drawer__item").forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      placeMobileDot(item, true);
    });
  });
  drawerList.addEventListener("mouseleave", function () {
    placeMobileDot(mobileActiveItem, true);
  });
})();

// ─── Return-to-top — scroll progress ring ────────────────────────────────────
(function () {
  var ring = document.querySelector(".return-top__ring-progress");
  if (!ring) return;

  var circumference = 2 * Math.PI * 22;

  window.addEventListener("scroll", function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var progress = docHeight > 0 ? scrollTop / docHeight : 0;
    ring.style.strokeDashoffset = circumference * (1 - progress);
  });
})();
