document.getElementById("saibaMais").addEventListener("click", () => {
  document.getElementById("info").classList.toggle("hidden");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});