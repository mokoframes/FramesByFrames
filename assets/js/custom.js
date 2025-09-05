$(function () {
  // Header Scroll
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 60) {
      $("header").addClass("fixed-header");
    } else {
      $("header").removeClass("fixed-header");
    }
  });

  // Featured Owl Carousel
  $(".featured-projects-slider .owl-carousel").owlCarousel({
    center: true,
    loop: true,
    margin: 30,
    nav: false,
    // dots: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // Custom arrow navigation
  $(".custom-next").click(function () {
    $(".featured-projects-slider .owl-carousel").trigger("next.owl.carousel");
  });

  $(".custom-prev").click(function () {
    $(".featured-projects-slider .owl-carousel").trigger("prev.owl.carousel");
  });

  // Count
  $(".count").each(function () {
    $(this)
      .prop("Counter", 0)
      .animate(
        {
          Counter: $(this).text(),
        },
        {
          duration: 1000,
          easing: "swing",
          step: function (now) {
            $(this).text(Math.ceil(now));
          },
        }
      );
  });

  // ScrollToTop
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const btn = document.getElementById("scrollToTopBtn");
  btn.addEventListener("click", scrollToTop);

  window.onscroll = function () {
    const scrollTopBtn = document.getElementById("scrollToTopBtn");
    const whatsappBtn = document.getElementById("whatsappBtn");

    if (
      document.documentElement.scrollTop > 100 ||
      document.body.scrollTop > 100
    ) {
      // Show both buttons
      if (scrollTopBtn) scrollTopBtn.style.display = "flex";
      if (whatsappBtn) whatsappBtn.style.display = "flex";
    } else {
      // Hide both buttons
      if (scrollTopBtn) scrollTopBtn.style.display = "none";
      if (whatsappBtn) whatsappBtn.style.display = "none";
    }
  };

  // Aos
  AOS.init({
    once: true,
  });
});
