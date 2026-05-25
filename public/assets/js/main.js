const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && window.anime) {
  anime
    .timeline({
      easing: "easeOutExpo",
      duration: 900
    })
    .add({
      targets: ".hero-kicker",
      opacity: [0, 1],
      translateY: [16, 0]
    })
    .add(
      {
        targets: ".hero-title",
        opacity: [0, 1],
        translateY: [24, 0]
      },
      "-=650"
    )
    .add(
      {
        targets: ".hero-copy, .hero-actions, .hero-stats",
        opacity: [0, 1],
        translateY: [18, 0],
        delay: anime.stagger(80)
      },
      "-=560"
    )
    .add(
      {
        targets: ".dashboard-card, .floating-card",
        opacity: [0, 1],
        scale: [0.96, 1],
        translateY: [28, 0],
        delay: anime.stagger(110)
      },
      "-=620"
    );

  anime({
    targets: ".floating-card",
    translateY: [-8, 8],
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
    duration: 2800
  });

  anime({
    targets: ".progress-bar",
    scaleX: [0, 1],
    transformOrigin: "0 50%",
    easing: "easeOutCubic",
    duration: 1200,
    delay: anime.stagger(120, { start: 900 })
  });
}
