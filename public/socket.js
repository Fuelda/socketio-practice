let socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
// const messages = document.getElementById("messages");

console.log("socket.jsを読み込み");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("submitされた");
  if (input.value) {
    socket.emit("send message", input.value);
    input.value = "";
  }
});

socket.on("show message", (msg) => {
  let item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
});
