const $ = (selector, root = document) => root.querySelector(selector);

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function visibleItems(items = []) {
  return items.filter((item) => item.visible !== false);
}

function homeItems(items = []) {
  return visibleItems(items).filter((item) => item.featuredOnHome !== false);
}

function setHtml(selector, html) {
  const target = $(selector);
  if (target) target.innerHTML = html;
}

function setSiteBasics(data, pageTitle) {
  $("#site-name").textContent = data.site.name || "Ramichai";
  document.title = pageTitle || `${data.site.name || "Ramichai"} | Photography and Videography Portfolio`;
  $("meta[name='description']")?.setAttribute("content", data.site.metaDescription || "");
  document.querySelectorAll(".topnav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const page = document.body.dataset.page || "home";
    const active = (page === "home" && (href === "/" || href === "index.html")) ||
      (page === "work" && (href === "/work" || href === "work.html")) ||
      (page === "personal" && (href === "/personal" || href === "personal.html")) ||
      (page === "films" && (href === "/films" || href === "films.html"));
    link.classList.toggle("is-active", active);
  });
}

function projectUrl(type, id) {
  return `project.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
}

function pageLink(path) {
  const links = {
    "/": "index.html",
    "/work": "work.html",
    "/personal": "personal.html",
    "/films": "films.html",
    "/#services": "index.html#services",
    "/#about": "index.html#about",
    "/#contact": "index.html#contact",
    "#contact": "index.html#contact",
    "#personal": "personal.html"
  };
  return links[path] || path || "index.html";
}

function imageUrl(url, width = 1200) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (!/imagekit\.io/i.test(raw)) return raw;
  const transform = `tr=w-${width},q-82,f-auto`;
  if (/([?&])tr=/.test(raw)) return raw;
  return `${raw}${raw.includes("?") ? "&" : "?"}${transform}`;
}

function img(src, alt, options = {}) {
  const width = options.width || 1200;
  const attrs = [
    `src="${escapeHtml(imageUrl(src, width))}"`,
    `alt="${escapeHtml(alt || "")}"`,
    `decoding="async"`
  ];
  if (options.eager) {
    attrs.push(`loading="eager"`, `fetchpriority="high"`);
  } else {
    attrs.push(`loading="lazy"`);
  }
  return `<img ${attrs.join(" ")}>`;
}

function renderSectionHead(label, title, copy) {
  return `
    <div class="section-head">
      <div>
        <div class="section-label">${escapeHtml(label)}</div>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <p class="section-copy">${escapeHtml(copy)}</p>
    </div>
  `;
}

function renderPageHero(label, title, copy, stats = []) {
  return `
    <div class="page-hero-copy">
      <div class="eyebrow">${escapeHtml(label)}</div>
      <h1>${escapeHtml(title)}</h1>
      <p class="hero-text">${escapeHtml(copy)}</p>
    </div>
    <div class="page-stats">
      ${stats.map((stat) => `
        <div class="meta-slip">
          <b>${escapeHtml(stat.value)}</b>
          <span>${escapeHtml(stat.label)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderHero(data) {
  const hero = data.hero;
  setHtml("#hero", `
    <div class="hero-copy">
      <div class="eyebrow">${escapeHtml(hero.eyebrow)}</div>
      <h1>${escapeHtml(hero.title)}</h1>
      <p class="hero-text">${escapeHtml(hero.text)}</p>
      <span class="hero-scribble">${escapeHtml(hero.scribble)}</span>
      <div class="hero-actions">
        <a class="btn" href="work.html">View client work <span aria-hidden="true">-&gt;</span></a>
        <a class="btn secondary" href="${escapeHtml(data.site.instagramUrl)}" target="_blank" rel="noopener">Instagram ${escapeHtml(data.site.instagram)}</a>
      </div>
      <div class="hero-meta" aria-label="Portfolio highlights">
        <div class="meta-slip"><b>Video</b><span>brand films, reels and recaps</span></div>
        <div class="meta-slip"><b>Photo</b><span>client shoots and personal frames</span></div>
        <div class="meta-slip"><b>IG</b><span>${escapeHtml(data.site.instagram)}</span></div>
      </div>
    </div>
    <div class="hero-board" aria-label="Featured portfolio still">
      <div class="tape one"></div>
      <div class="tape two"></div>
      <div class="location-stamp"><b>${escapeHtml(data.site.name)}</b>photo + video portfolio</div>
      <figure class="hero-image">
        ${img(hero.imageUrl, hero.imageAlt, { width: 1400, eager: true })}
        <figcaption class="hero-caption">
          <strong>${escapeHtml(hero.captionTitle)}</strong>
          <span>${escapeHtml(hero.captionText)}</span>
        </figcaption>
      </figure>
    </div>
    <div class="scroll-note">selected work below</div>
  `);
}

function renderFeatured(data) {
  const featured = data.featuredVideo || {};
  if (featured.visible === false) {
    setHtml("#featured-video", "");
    return;
  }
  const notes = (featured.notes || []).map((note) => `
    <article class="brief-card ${escapeHtml(note.color || "teal")}">
      <b>${escapeHtml(note.title)}</b>
      <p>${escapeHtml(note.text)}</p>
    </article>
  `).join("");
  setHtml("#featured-video", `
    ${renderSectionHead(featured.label, featured.title, featured.description)}
    <div class="reel-shell">
      <a class="video-stage" href="${escapeHtml(featured.videoUrl)}" target="_blank" rel="noopener" aria-label="Open featured video">
        ${img(featured.imageUrl, featured.headline, { width: 1200 })}
        <span class="play-button" aria-hidden="true">&#9658;</span>
        <span class="video-title">
          <span>${escapeHtml(featured.kicker)}</span>
          <strong>${escapeHtml(featured.headline)}</strong>
        </span>
      </a>
      <div class="reel-notes">${notes}</div>
    </div>
  `);
}

function renderList(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderVideoScreen(video) {
  const embedUrl = (video.embedUrl || "").trim();
  const thumbnail = escapeHtml(video.thumbnailUrl || "");
  const title = escapeHtml(video.title || "Client video");
  if (embedUrl && /\.(mp4|webm|mov)(\?.*)?$/i.test(embedUrl)) {
    return `<video controls poster="${thumbnail}" preload="metadata" src="${escapeHtml(embedUrl)}"></video>`;
  }
  if (embedUrl) {
    return `
      <iframe
        src="${escapeHtml(embedUrl)}"
        title="${title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    `;
  }
  return `
    <a class="client-video-poster" href="${escapeHtml(video.watchUrl || "#contact")}" target="_blank" rel="noopener" aria-label="Open ${title}">
      ${img(video.thumbnailUrl, video.thumbnailAlt || video.title, { width: 900 })}
      <span class="play-button" aria-hidden="true">&#9658;</span>
    </a>
  `;
}

function renderClientVideo(video, mode = "archive") {
  const externalLabel = video.platform ? `Watch on ${video.platform}` : "Open video";
  return `
    <article class="client-video-card" data-category="${escapeHtml(video.category || "")}">
      <div class="client-video-screen">${renderVideoScreen(video)}</div>
      <div class="client-video-copy">
        <div class="client-kicker">${escapeHtml(video.format || "Client video")} / ${escapeHtml(video.client || "Client")}</div>
        <h3>${escapeHtml(video.title)}</h3>
        <p>${escapeHtml(video.description)}</p>
        <ul class="mini-list">${renderList(video.deliverables || [])}</ul>
        <div class="project-links">
          <a class="text-link" href="${projectUrl("video", video.id)}">${mode === "home" ? "Open project" : "Project page"} <span aria-hidden="true">-&gt;</span></a>
          <a class="text-link muted-link" href="${escapeHtml(video.watchUrl || "#contact")}" target="_blank" rel="noopener">${escapeHtml(externalLabel)}</a>
        </div>
      </div>
    </article>
  `;
}

function renderPhotoPreview(photos = []) {
  return photos.slice(0, 3).map((photo) => `
    ${img(photo.url, photo.alt || photo.caption || "Client photo", { width: 260 })}
  `).join("");
}

function renderClientPhotoShoot(shoot, mode = "archive") {
  return `
    <article class="shoot-card" data-category="${escapeHtml(shoot.category || "")}">
      <a class="shoot-card-link" href="${projectUrl("photo", shoot.id)}">
        <span class="shoot-cover">
          ${img(shoot.coverUrl, shoot.coverAlt || shoot.title, { width: 900 })}
          <span>${escapeHtml(shoot.shootType || "Photo shoot")}</span>
        </span>
        <span class="shoot-summary-copy">
          <span class="client-kicker">${escapeHtml(shoot.client || "Client")} / ${escapeHtml(shoot.category || "photos")}</span>
          <strong>${escapeHtml(shoot.title)}</strong>
          <span>${escapeHtml(shoot.description)}</span>
          <span class="shoot-details">${(shoot.details || []).map((detail) => `<em>${escapeHtml(detail)}</em>`).join("")}</span>
          <span class="shoot-open">${mode === "home" ? "Open shoot" : "View full photo set"}</span>
        </span>
      </a>
      <div class="photo-strip">${renderPhotoPreview(shoot.photos || [])}</div>
    </article>
  `;
}

function renderHomeClientWork(data) {
  const videos = homeItems(data.clientVideos || []).slice(0, 2);
  const shoots = homeItems(data.clientPhotoShoots || []).slice(0, 2);
  const home = data.home || {};
  setHtml("#work", `
    ${renderSectionHead("Selected client work", home.selectedWorkTitle || "Selected client work, not the whole archive.", home.selectedWorkText || "The homepage shows a curated preview and sends people into the full client archive.")}
    <div class="client-note-row" aria-label="Client work types">
      <div><b>Brand films</b><span>Lead videos and campaign-style edits.</span></div>
      <div><b>Social videos</b><span>Reels, cutdowns and vertical clips.</span></div>
      <div><b>Photo shoots</b><span>Client galleries live on detail pages.</span></div>
    </div>
    <div class="client-video-grid">${videos.map((video) => renderClientVideo(video, "home")).join("")}</div>
    <div class="shoot-list home-shoot-list">${shoots.map((shoot) => renderClientPhotoShoot(shoot, "home")).join("")}</div>
    <div class="section-cta">
      <a class="btn" href="work.html">Open full client archive <span aria-hidden="true">-&gt;</span></a>
    </div>
  `);
}

function renderClientArchive(data) {
  const videos = visibleItems(data.clientVideos || []);
  const shoots = visibleItems(data.clientPhotoShoots || []);
  setHtml("#work", `
    ${renderSectionHead("Client archive", "All client videos and photo shoots.", "Use this page as the growing archive. Add as many clients as you want without making the home page heavy.")}
    <div class="client-note-row" aria-label="Client work types">
      <div><b>${videos.length}</b><span>client videos in the archive</span></div>
      <div><b>${shoots.length}</b><span>client photo shoots</span></div>
      <div><b>${videos.length + shoots.length}</b><span>total client projects</span></div>
    </div>
    <div class="work-subhead">
      <div>
        <div class="section-label">Client videos</div>
        <h3>Brand films, reels, event recaps and social edits.</h3>
      </div>
      <p>Each video has a project page, an optional embed for watching on the website, and a link to Instagram or YouTube.</p>
    </div>
    <div class="filters" aria-label="Client video categories">
      <button class="pill active" type="button" data-filter="all">All videos</button>
      <button class="pill" type="button" data-filter="brand">Brand films</button>
      <button class="pill" type="button" data-filter="social">Social</button>
      <button class="pill" type="button" data-filter="event">Events</button>
      <button class="pill" type="button" data-filter="video">Other video</button>
    </div>
    <div class="client-video-grid">${videos.map(renderClientVideo).join("")}</div>

    <div class="work-subhead photo-subhead">
      <div>
        <div class="section-label">Client photo shoots</div>
        <h3>Every shoot leads to its own full gallery.</h3>
      </div>
      <p>The archive stays clean, while each client page can hold all photos from that specific shoot.</p>
    </div>
    <div class="shoot-list">${shoots.map(renderClientPhotoShoot).join("")}</div>
  `);
}

function renderServices(data) {
  setHtml("#services", `
    ${renderSectionHead("What I shoot", "A clear range of photo and video work.", "Simple categories keep the focus on the visuals and make it easy to understand what kind of work Ramichai creates.")}
    <div class="services-grid">
      ${(data.services || []).map((service, index) => `
        <article class="service-card">
          <div class="service-icon">${String(index + 1).padStart(2, "0")}</div>
          <h3>${escapeHtml(service.title)}</h3>
          <p>${escapeHtml(service.text)}</p>
          <ul>${renderList(service.items || [])}</ul>
        </article>
      `).join("")}
    </div>
  `);
}

function renderProject(item) {
  const shape = item.shape === "tall" ? " tall" : "";
  return `
    <article class="project" data-category="${escapeHtml(item.category || "")}">
      <div class="project-media${shape}">
        ${img(item.mediaUrl, item.mediaAlt || item.title, { width: 900 })}
        <span class="project-type">${escapeHtml(item.type)}</span>
      </div>
      <div class="project-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="project-details"><span>${escapeHtml(item.detailA)}</span><span>${escapeHtml(item.detailB)}</span></div>
      </div>
    </article>
  `;
}

function renderPersonal(data, mode = "full") {
  const items = mode === "home" ? homeItems(data.personalWork || []).slice(0, 3) : visibleItems(data.personalWork || []);
  const home = data.home || {};
  setHtml("#personal", `
    ${renderSectionHead("Personal work", mode === "home" ? (home.personalTitle || "Personal work with its own space.") : "Self-directed photos and videos.", mode === "home" ? (home.personalText || "A small preview lives here, while the full personal page can grow.") : "This is for work you make for yourself: experiments, walks, friends, places, moods, frames and edits that show your taste outside commissioned projects.")}
    <div class="work-grid">${items.map(renderProject).join("")}</div>
    ${mode === "home" ? '<div class="section-cta"><a class="btn secondary" href="personal.html">Open personal work <span aria-hidden="true">-&gt;</span></a></div>' : ""}
  `);
}

function renderShortFilms(data, mode = "full") {
  const films = mode === "home" ? homeItems(data.shortFilms || []).slice(0, 1) : visibleItems(data.shortFilms || []);
  const home = data.home || {};
  setHtml("#short-films", `
    ${renderSectionHead("Short films", mode === "home" ? (home.filmsTitle || "Short films have a cinematic shelf.") : "Narrative work, posters and YouTube links.", mode === "home" ? (home.filmsText || "Narrative work gets its own page.") : "Short films live here with poster frames, loglines, embedded YouTube videos and direct watch links.")}
    <div class="film-showcase">
      ${films.map((film, index) => `
        ${index === 2 ? '<div class="film-strip" aria-hidden="true"><div></div><div></div><div></div></div>' : ""}
        <article class="film-entry">
          <div class="film-screen">
            ${img(film.posterUrl, film.posterAlt || film.title, { width: 1000 })}
            <a class="youtube-play" href="${escapeHtml(film.youtubeUrl)}" target="_blank" rel="noopener" aria-label="Watch ${escapeHtml(film.title)} on YouTube">&#9658;</a>
          </div>
          <div class="film-info">
            <span>${escapeHtml(film.status)}</span>
            <h3>${escapeHtml(film.title)}</h3>
            <p>${escapeHtml(film.description)}</p>
            <div class="film-actions">
              <a href="${escapeHtml(film.youtubeUrl)}" target="_blank" rel="noopener">Watch on YouTube</a>
              <a href="${mode === "home" ? "films.html" : escapeHtml(pageLink(film.secondaryUrl || "/#contact"))}">${mode === "home" ? "Open films page" : escapeHtml(film.secondaryLabel || "More info")}</a>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `);
}

function renderProcess() {
  const steps = [
    ["STEP 01", "Understand the idea", "We define the feeling, subject, location, timing and kind of visuals the project needs."],
    ["STEP 02", "Plan the shoot", "References, location, schedule and shot ideas are prepared before the day."],
    ["STEP 03", "Film and photograph", "The shoot stays organized, calm and efficient, with room for real moments to happen."],
    ["STEP 04", "Edit and select", "The best clips and photos are shaped into a consistent look and rhythm."],
    ["STEP 05", "Deliver clearly", "You receive clean exports for Instagram, web, sharing and archive use."]
  ];
  setHtml("#process", `
    ${renderSectionHead("How I work", "Simple steps from first idea to final edit.", "A calm, organized flow keeps the shoot focused while leaving room for real moments to happen.")}
    <div class="process-grid">
      ${steps.map((step) => `<article class="step"><span class="step-number">${step[0]}</span><h3>${step[1]}</h3><p>${step[2]}</p></article>`).join("")}
    </div>
  `);
}

function renderAbout(data) {
  const about = data.about;
  setHtml("#about", `
    <div class="about-wrap">
      <div class="portrait-stack">
        <div class="portrait">${img(about.imageUrl, about.title, { width: 900 })}</div>
        <div class="about-note">${escapeHtml(about.note)}</div>
      </div>
      <div class="about-copy">
        <div class="section-label">${escapeHtml(about.label)}</div>
        <h2>${escapeHtml(about.title)}</h2>
        ${(about.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        <div class="tools-list">${(about.tools || []).map((tool) => `<div class="tool-line">${escapeHtml(tool)}</div>`).join("")}</div>
      </div>
    </div>
  `);
}

function renderContact(data) {
  const contact = data.contact;
  setHtml("#contact", `
    <div class="contact-wrap">
      <div>
        <div class="section-label">Contact</div>
        <h2>${escapeHtml(contact.title)}</h2>
        <p class="section-copy">${escapeHtml(contact.text)}</p>
        <div class="contact-lines">
          ${(contact.lines || []).map((line) => `
            <div class="contact-line">
              <span>${escapeHtml(line.label)}</span>
              <span>${line.url ? `<a href="${escapeHtml(line.url)}" target="_blank" rel="noopener">${escapeHtml(line.value)}</a>` : escapeHtml(line.value)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="contact-note">
        <span>last page note</span>
        <strong>${escapeHtml(data.site.instagram)}</strong>
        <p>Follow the work, see the latest visuals, or send a DM there.</p>
        <a class="btn" href="${escapeHtml(data.site.instagramUrl)}" target="_blank" rel="noopener">Open Instagram <span aria-hidden="true">-&gt;</span></a>
      </div>
    </div>
  `);
}

function renderFooter(data) {
  setHtml("#footer", `
    <span>&copy; 2026 ${escapeHtml(data.site.name)}. Photography and videography portfolio.</span>
    <div class="footer-links">
      <a href="work.html">Client Work</a>
      <a href="personal.html">Personal</a>
      <a href="films.html">Short Films</a>
      <a href="index.html#services">What I shoot</a>
      <a href="index.html#contact">Contact</a>
    </div>
  `);
}

function renderProjectDetail(data) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const type = params.get("type") || "";
  const video = visibleItems(data.clientVideos || []).find((item) => item.id === id);
  const shoot = visibleItems(data.clientPhotoShoots || []).find((item) => item.id === id);
  const item = type === "photo" ? shoot : (video || shoot);
  if (!item) {
    setHtml("#project-detail", `
      <div class="not-found">
        <div class="section-label">Project not found</div>
        <h1>This project is not in the portfolio yet.</h1>
        <p class="hero-text">It may be hidden from the public site or the link may be old.</p>
        <a class="btn" href="work.html">Back to client work</a>
      </div>
    `);
    return;
  }

  const isVideo = video && (!shoot || type !== "photo");
  document.title = `${item.title} | ${data.site.name}`;
  if (isVideo) {
    setHtml("#project-detail", `
      <div class="project-detail">
        <a class="back-link" href="work.html">&lt;- Back to client work</a>
        <div class="project-hero-detail">
          <div>
            <div class="eyebrow">${escapeHtml(video.format || "Client video")} / ${escapeHtml(video.client || "Client")}</div>
            <h1>${escapeHtml(video.title)}</h1>
            <p class="hero-text">${escapeHtml(video.longDescription || video.description)}</p>
            <div class="detail-meta">
              <span>${escapeHtml(video.date || "Project")}</span>
              <span>${escapeHtml(video.location || video.platform || "Video")}</span>
              <span>${escapeHtml(video.category || "client")}</span>
            </div>
          </div>
          <div class="detail-actions">
            <a class="btn" href="${escapeHtml(video.watchUrl || "index.html#contact")}" target="_blank" rel="noopener">Open ${escapeHtml(video.platform || "video")}</a>
            <a class="btn secondary" href="index.html#contact">Contact</a>
          </div>
        </div>
        <div class="detail-video">${renderVideoScreen(video)}</div>
        <div class="detail-grid">
          <article class="detail-card">
            <h2>Deliverables</h2>
            <ul>${renderList(video.deliverables || [])}</ul>
          </article>
          <article class="detail-card">
            <h2>Project note</h2>
            <p>${escapeHtml(video.description)}</p>
          </article>
        </div>
      </div>
    `);
    return;
  }

  setHtml("#project-detail", `
    <div class="project-detail">
      <a class="back-link" href="work.html">&lt;- Back to client work</a>
      <div class="project-hero-detail">
        <div>
          <div class="eyebrow">${escapeHtml(shoot.shootType || "Client photos")} / ${escapeHtml(shoot.client || "Client")}</div>
          <h1>${escapeHtml(shoot.title)}</h1>
          <p class="hero-text">${escapeHtml(shoot.longDescription || shoot.description)}</p>
          <div class="detail-meta">
            <span>${escapeHtml(shoot.date || "Photo shoot")}</span>
            <span>${escapeHtml(shoot.location || "Client gallery")}</span>
            <span>${escapeHtml(shoot.category || "photos")}</span>
          </div>
        </div>
        <div class="detail-actions">
          <a class="btn" href="index.html#contact">Ask about a shoot</a>
          <a class="btn secondary" href="work.html">Archive</a>
        </div>
      </div>
      <figure class="detail-cover">
        ${img(shoot.coverUrl, shoot.coverAlt || shoot.title, { width: 1400 })}
      </figure>
      <div class="detail-grid">
        <article class="detail-card">
          <h2>Shoot details</h2>
          <ul>${renderList(shoot.details || [])}</ul>
        </article>
        <article class="detail-card">
          <h2>Photo set</h2>
          <p>${escapeHtml(shoot.description)}</p>
        </article>
      </div>
      ${renderShootGallery(shoot.photos || [])}
    </div>
  `);
}

function renderShootGallery(photos = []) {
  const firstBatch = 12;
  return `
    <div class="shoot-gallery detail-gallery" data-gallery-batch="12">
      ${photos.map((photo, index) => renderShootPhoto(photo, index >= firstBatch)).join("")}
    </div>
    ${photos.length > firstBatch ? `<div class="gallery-actions"><button class="btn secondary" type="button" data-load-gallery>Load more photos</button></div>` : ""}
  `;
}

function renderShootPhoto(photo, deferred = false) {
  return `
    <figure class="shoot-photo${deferred ? " is-deferred" : ""}">
      ${img(photo.url, photo.alt || photo.caption || "Client photo", { width: 1100 })}
      ${photo.caption ? `<figcaption>${escapeHtml(photo.caption)}</figcaption>` : ""}
    </figure>
  `;
}

function wireGalleryLoadMore() {
  document.querySelectorAll("[data-load-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      const gallery = button.closest(".project-detail")?.querySelector(".detail-gallery");
      if (!gallery) return;
      const batch = Number(gallery.dataset.galleryBatch || 12);
      const next = Array.from(gallery.querySelectorAll(".shoot-photo.is-deferred")).slice(0, batch);
      next.forEach((photo) => photo.classList.remove("is-deferred"));
      if (!gallery.querySelector(".shoot-photo.is-deferred")) button.remove();
    });
  });
}

function wireFilters() {
  document.querySelectorAll(".filters").forEach((filterGroup) => {
    const filterButtons = filterGroup.querySelectorAll(".pill");
    const section = filterGroup.closest("section");
    const projects = section ? section.querySelectorAll(".project, .client-video-card") : [];
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.filter || "all";
        section?.classList.add("is-filtering");
        filterButtons.forEach((item) => item.classList.remove("active"));
        filterButtons.forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
        button.classList.add("active");
        projects.forEach((project) => {
          const categories = (project.dataset.category || "").split(" ");
          project.classList.toggle("is-hidden", selected !== "all" && !categories.includes(selected));
        });
        window.setTimeout?.(() => section?.classList.remove("is-filtering"), 240);
      });
    });
  });
}

function wireScrollState() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || typeof window.addEventListener !== "function") return;
  const sync = () => topbar.classList.toggle("is-scrolled", window.scrollY > 16);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function wireMobileNav() {
  const topbar = document.querySelector(".topbar");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".topnav");
  if (!topbar || !toggle || !nav) return;

  const setOpen = (open) => {
    topbar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(!topbar.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) setOpen(false);
  }, { passive: true });
}

function wireHeroParallax() {
  const heroBoard = document.querySelector(".hero-board");
  if (!heroBoard || typeof window.addEventListener !== "function") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  heroBoard.addEventListener("pointermove", (event) => {
    const rect = heroBoard.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    heroBoard.style.setProperty("--mx", x.toFixed(3));
    heroBoard.style.setProperty("--my", y.toFixed(3));
  });
  heroBoard.addEventListener("pointerleave", () => {
    heroBoard.style.setProperty("--mx", "0");
    heroBoard.style.setProperty("--my", "0");
  });
}

function wireReveals() {
  const targets = document.querySelectorAll([
    ".page-hero-copy",
    ".page-stats .meta-slip",
    ".section-head",
    ".reel-shell",
    ".client-note-row",
    ".client-video-card",
    ".shoot-card",
    ".film-entry",
    ".step",
    ".about-wrap",
    ".contact-wrap",
    ".project-hero-detail",
    ".detail-video",
    ".detail-cover",
    ".detail-card"
  ].join(","));

  targets.forEach((target, index) => {
    target.classList.add("reveal", `reveal-delay-${index % 4}`);
  });

  if (typeof IntersectionObserver !== "function" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  targets.forEach((target) => observer.observe(target));
}

function wireMotion() {
  wireMobileNav();
  wireScrollState();
  wireHeroParallax();
  wireReveals();
}

function renderHome(data) {
  setSiteBasics(data);
  renderHero(data);
  renderFeatured(data);
  renderHomeClientWork(data);
  renderServices(data);
  renderPersonal(data, "home");
  renderShortFilms(data, "home");
  renderProcess();
  renderAbout(data);
  renderContact(data);
  renderFooter(data);
}

function renderWorkPage(data) {
  setSiteBasics(data, `Client Work | ${data.site.name}`);
  setHtml("#page-hero", renderPageHero(
    "Client Work",
    "A scalable archive for client videos and photo shoots.",
    "The homepage stays curated. This page can grow with every brand film, reel, event recap and client photo gallery.",
    [
      { value: visibleItems(data.clientVideos || []).length, label: "videos" },
      { value: visibleItems(data.clientPhotoShoots || []).length, label: "photo shoots" },
      { value: "full", label: "client archive" }
    ]
  ));
  renderClientArchive(data);
  renderFooter(data);
}

function renderPersonalPage(data) {
  setSiteBasics(data, `Personal Work | ${data.site.name}`);
  setHtml("#page-hero", renderPageHero(
    "Personal Work",
    "Self-directed photos and videos.",
    "A separate space for taste, experiments, walks, friends, places, moods and edits outside commissioned work.",
    [
      { value: visibleItems(data.personalWork || []).length, label: "personal pieces" },
      { value: "photo", label: "frames" },
      { value: "video", label: "edits" }
    ]
  ));
  renderPersonal(data, "full");
  renderFooter(data);
}

function renderFilmsPage(data) {
  setSiteBasics(data, `Short Films | ${data.site.name}`);
  setHtml("#page-hero", renderPageHero(
    "Short Films",
    "A cinematic shelf for narrative work.",
    "This page can grow into posters, YouTube embeds, loglines, scene tests and future full short films.",
    [
      { value: visibleItems(data.shortFilms || []).length, label: "film slots" },
      { value: "YouTube", label: "watch links" },
      { value: "story", label: "narrative work" }
    ]
  ));
  renderShortFilms(data, "full");
  renderFooter(data);
}

async function init() {
  const data = await loadContent();
  const page = document.body.dataset.page || "home";
  if (page === "work") renderWorkPage(data);
  if (page === "project") {
    setSiteBasics(data, `Project | ${data.site.name}`);
    renderProjectDetail(data);
    renderFooter(data);
  }
  if (page === "personal") renderPersonalPage(data);
  if (page === "films") renderFilmsPage(data);
  if (page === "home") renderHome(data);
  wireGalleryLoadMore();
  wireFilters();
  wireMotion();
}

async function loadContent() {
  const attempts = ["data/content.json", "/api/content"];
  const errors = [];
  for (const url of attempts) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        errors.push(`${url}: ${response.status}`);
        continue;
      }
      return await response.json();
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
  throw new Error(`Could not load content. Tried ${errors.join(", ")}`);
}

init().catch((error) => {
  document.body.innerHTML = `<main class="notebook"><section class="not-found"><h1>Could not load portfolio</h1><p class="hero-text">${escapeHtml(error.message)}</p></section></main>`;
});
