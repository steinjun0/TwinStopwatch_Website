const user_icon = document.querySelector(".user_icon");
const user_tab = document.querySelector(".user_tab");
const chart_wrap = document.querySelector(".wrap_chart");

user_icon.addEventListener("click", () => {
  console.log("toggled!");
  user_tab.classList.toggle("active");
  user_icon.classList.toggle("active");
  chart_wrap.classList.toggle("active");
});

console.log("hello");

user_tab.classList.toggle("active");
user_icon.classList.toggle("active");
chart_wrap.classList.toggle("active");

function openUserTab() {
  user_tab.classList.toggle("active");
  user_icon.classList.toggle("active");
  chart_wrap.classList.toggle("active");
}
