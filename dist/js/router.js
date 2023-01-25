const sectionsObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    target.classList[isIntersecting ? "add" : "remove"]("section-visible");
  });
});
const bsNavbarCollapse = new bootstrap.Collapse("#navbar-collapse", {
  toggle: false,
});
const bsScrollConfig = { target: "#navbar-sections", smoothScroll: true };
const toggleNavbarSections = (show = false) =>
  $("#navbar-sections")
    [show ? "removeClass" : "addClass"]("sections-hidden")
    .find("a")
    .attr("tabindex", show ? "0" : "-1");

export const pushRoute = (e) => {
  if (typeof e == "string") {
    history.pushState(null, null, e);
    replaceView(e);
    return;
  }
  let path = location.pathname;
  if (e.type == "click") {
    e.preventDefault();
    const href = e.target.getAttribute("href");
    if (href == path) return;
    history.pushState(null, null, href);
    if (href[0] == "#") return;
    path = href;
  }
  replaceView(path);
};

export const replaceView = async (path) => {
  let html = await $.get(`/html/views${path == "/" ? "/pocetna" : path}.html`);
  if (html.startsWith("<!"))
    html = /* html */ `
      <main class="flex-grow-1 d-flex justify-content-center align-items-center fs-5">
        404 — Stranica ne postoji
      </main>`;
  $("main").replaceWith(html);

  bsNavbarCollapse.hide(); // for mobile users
  $(".nav-link.active").removeClass("active");
  $(`.nav-link[href='${path}']`).addClass("active");
  $("[router-link]").off("click").on("click", pushRoute);
  $(window).scrollTop(0);
  toggleNavbarSections(path == "/o-nama");

  switch (path) {
    case "/":
      (await import("./typewriter.js")).default();
      break;
    case "/prijava":
    case "/registracija":
      (await import("./auth.js")).default();
      break;
    case "/o-nama":
      $("#o-nama > section").each((i, el) => sectionsObserver.observe(el));
      new bootstrap.ScrollSpy("#o-nama", bsScrollConfig); // nosonar
      if (location.hash) $(location.hash)[0].scrollIntoView();
      break;
    case "/novosti/1":
      const bsCarousel = new bootstrap.Carousel("#carousel-controls");
      $("#novost-1 [role='button']").on("click", (e) => {
        bsCarousel.to(e.target.dataset.n);
      });
      break;
    case "/nastavni-plan":
      (await import("./courses.js")).default();
      break;
  }
};
