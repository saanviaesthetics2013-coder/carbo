// =====================
// REVEAL ANIMATION
// =====================
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add("show");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// =====================
// SCROLL TOP BUTTON
// =====================
const scrollBtn = document.getElementById("scrollTopBtn");
if (scrollBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =====================
// LIKES + BOOKMARKS
// =====================
function toggleLike(postId) {
  let likes = JSON.parse(localStorage.getItem("technova_likes") || "{}");
  likes[postId] = !likes[postId];
  localStorage.setItem("technova_likes", JSON.stringify(likes));
  updateLikeUI(postId);
}

function toggleBookmark(postId) {
  let bookmarks = JSON.parse(localStorage.getItem("technova_bookmarks") || "{}");
  bookmarks[postId] = !bookmarks[postId];
  localStorage.setItem("technova_bookmarks", JSON.stringify(bookmarks));
  updateBookmarkUI(postId);
}

function updateLikeUI(postId) {
  const likes = JSON.parse(localStorage.getItem("technova_likes") || "{}");
  const btn = document.querySelector(`[data-like='${postId}']`);
  if (btn) {
    btn.innerText = likes[postId] ? "❤️ Liked" : "🤍 Like";
  }
}

function updateBookmarkUI(postId) {
  const bookmarks = JSON.parse(localStorage.getItem("technova_bookmarks") || "{}");
  const btn = document.querySelector(`[data-bookmark='${postId}']`);
  if (btn) {
    btn.innerText = bookmarks[postId] ? "🔖 Saved" : "📌 Save";
  }
}

function initPostButtons(postId) {
  updateLikeUI(postId);
  updateBookmarkUI(postId);

  const likeBtn = document.querySelector(`[data-like='${postId}']`);
  const saveBtn = document.querySelector(`[data-bookmark='${postId}']`);

  if (likeBtn) likeBtn.onclick = () => toggleLike(postId);
  if (saveBtn) saveBtn.onclick = () => toggleBookmark(postId);
}

// =====================
// POSTS PAGE RENDER
// =====================
function renderPosts(listId) {
  const container = document.getElementById(listId);
  if (!container || typeof POSTS === "undefined") return;

  container.innerHTML = "";

  POSTS.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card reveal";

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="meta">
        <span class="tag">${p.category}</span>
        <span class="tag">📅 ${p.date}</span>
        <span class="tag">⏳ ${p.readTime}</span>
      </div>
      <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
        <a class="btn btn-primary" href="${p.file}">📖 Read</a>
        <button class="btn btn-ghost" data-like="${p.id}">🤍 Like</button>
        <button class="btn btn-ghost" data-bookmark="${p.id}">📌 Save</button>
      </div>
    `;

    container.appendChild(card);

    setTimeout(() => {
      initPostButtons(p.id);
      revealOnScroll();
    }, 10);
  });
}

// =====================
// SEARCH + FILTER POSTS
// =====================
function initSearchFilter(searchId, categoryId, listId) {
  const search = document.getElementById(searchId);
  const category = document.getElementById(categoryId);
  const container = document.getElementById(listId);

  if (!search || !category || !container || typeof POSTS === "undefined") return;

  function filterPosts() {
    const query = search.value.toLowerCase();
    const cat = category.value;

    container.innerHTML = "";

    POSTS.filter((p) => {
      const matchText =
        p.title.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.tags.join(" ").toLowerCase().includes(query);

      const matchCat = cat === "All" || p.category === cat;

      return matchText && matchCat;
    }).forEach((p) => {
      const card = document.createElement("div");
      card.className = "card reveal";

      card.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="meta">
          <span class="tag">${p.category}</span>
          <span class="tag">📅 ${p.date}</span>
          <span class="tag">⏳ ${p.readTime}</span>
        </div>
        <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn-primary" href="${p.file}">📖 Read</a>
          <button class="btn btn-ghost" data-like="${p.id}">🤍 Like</button>
          <button class="btn btn-ghost" data-bookmark="${p.id}">📌 Save</button>
        </div>
      `;

      container.appendChild(card);

      setTimeout(() => {
        initPostButtons(p.id);
        revealOnScroll();
      }, 10);
    });
  }

  search.addEventListener("input", filterPosts);
  category.addEventListener("change", filterPosts);

  filterPosts();
}

// =====================
// SHARE BUTTON (POST PAGE)
// =====================
function sharePost() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    });
  } else {
    alert("Sharing not supported. Copy link manually.");
  }
}
