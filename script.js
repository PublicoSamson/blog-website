const defaultPosts = [
  {
    id: 1,
    author: "Admin",
    title: "Welcome to DevNotes!",
    content: "Feel free to leave a comment below or click 'Write Post' in the menu to publish your own article.",
    date: new Date().toLocaleDateString(),
    comments: [
      { user: "Maria", text: "Excited to try this out!" }
    ]
  }
];

function getPosts() {
  const saved = localStorage.getItem("blogPosts");
  return saved ? JSON.parse(saved) : defaultPosts;
}

function savePosts(posts) {
  localStorage.setItem("blogPosts", JSON.stringify(posts));
}

async function fetchQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  if (!quoteText) return;

  try {
    quoteText.textContent = "Fetching inspiration...";
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();
    quoteText.textContent = "${data.quote}";
    quoteAuthor.textContent = — ${data.author};
  } catch (error) {
    quoteText.textContent = '"Code is like humor. When you have to explain it, it’s bad."';
    quoteAuthor.textContent = "— Cory House";
  }
}

function renderPosts() {
  const container = document.getElementById("posts-container");
  if (!container) return;

  const posts = getPosts();
  container.innerHTML = "";

  posts.forEach((post) => {
    const commentsHTML = post.comments
      .map((c) => <div class="comment-item"><strong>${escapeHTML(c.user)}:</strong> ${escapeHTML(c.text)}</div>)
      .join("");

    const postCard = document.createElement("article");
    postCard.className = "card";
    postCard.innerHTML = `
      <h2>${escapeHTML(post.title)}</h2>
      <p class="post-meta">Posted by <strong>${escapeHTML(post.author)}</strong> on ${post.date}</p>
      <p>${escapeHTML(post.content)}</p>

      <div class="comments-section">
        <h4>Comments (${post.comments.length})</h4>
        <div class="comments-list">${commentsHTML || "<small>No comments yet.</small>"}</div>
        <form class="comment-form" data-id="${post.id}">
          <input type="text" class="comment-user" placeholder="Your name" required style="max-width: 140px;" />
          <input type="text" class="comment-text" placeholder="Write a comment..." required />
          <button type="submit" class="btn-secondary">Comment</button>
        </form>
      </div>
    `;
    container.appendChild(postCard);
  });

  document.querySelectorAll(".comment-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const postId = Number(form.getAttribute("data-id"));
      const user = form.querySelector(".comment-user").value.trim();
      const text = form.querySelector(".comment-text").value.trim();

      if (user && text) {
        const posts = getPosts();
        const targetPost = posts.find((p) => p.id === postId);
        targetPost.comments.push({ user, text });
        savePosts(posts);
        renderPosts();
      }
    });
  });
}

const postForm = document.getElementById("post-form");
if (postForm) {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const author = document.getElementById("author").value.trim();
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    const posts = getPosts();
    posts.unshift({
      id: Date.now(),
      author,
      title,
      content,
      date: new Date().toLocaleDateString(),
      comments: []
    });

    savePosts(posts);
    window.location.href = "index.html";
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag]));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuote();
  renderPosts();

  const quoteBtn = document.getElementById("new-quote-btn");
  if (quoteBtn) quoteBtn.addEventListener("click", fetchQuote);
});