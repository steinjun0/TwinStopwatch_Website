const user_icon = document.querySelector(".user_icon");
const user_tab = document.querySelector(".user_tab");

user_icon.addEventListener("click", () => {
  console.log("toggled!");
  user_tab.classList.toggle("active");
  user_icon.classList.toggle("active");
});

console.log("hello");

user_tab.classList.toggle("active");
user_icon.classList.toggle("active");

function openUserTab() {
  user_tab.classList.toggle("active");
  user_icon.classList.toggle("active");
}
