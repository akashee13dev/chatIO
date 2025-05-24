const user = localStorage.getItem("username");
if (!user || user == null) {
    window.location.href = "/login/login.html";
}

window.addEventListener("unload", () => {
    socket.emit("logout");
    localStorage.removeItem("username")
    window.location.href = "/login/login.html";
});

document
    .getElementById("logout-btn")
    .addEventListener("click", () => {
        localStorage.removeItem("username")
        socket.emit("logout");
        window.location.href = "/login/login.html";
    });

document
    .getElementById("chat-form")
    .addEventListener("submit", function (e) {
        e.preventDefault(); // stop page reload

        const messageInput = document.getElementById("message-input");
        const message = messageInput
            .value
            .trim();

        if (message) {
            console.log("Sending message:", message);
            messageInput.value = "";
            socket.emit("sendMessage", message);
        }

    });

const socket = io( window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:8000" : "https://chatio-0ov4.onrender.com/",{
    query: {
        name: user
    }
});

function showPopup(user, isJoin) {
    let msg = user+ (isJoin ? " joined the chat" : " left the chat");
    const popup = document.getElementById("popup");
    popup.innerText = msg;
        if (isJoin) {
        popup.classList.remove("bg-red-600");
        popup.classList.add("bg-green-600");
      } else {
        popup.classList.remove("bg-green-600");
        popup.classList.add("bg-red-600");
      }
  
      popup.classList.remove("opacity-0");
      popup.classList.add("opacity-100");

    setTimeout(() => {
      popup.classList.remove("opacity-100");
      popup.classList.add("opacity-0");
    }, 3000);
  }


socket.on("addUsers", (users) => {
    
    if (users) {
        const newUser = users[users.length - 1];
    if (newUser !== localStorage.getItem("username")) {
      showPopup(newUser , true);
    }
        console.log("AddUsers Called ", users);
        const userList = document.getElementById("user-list");
        userList.innerHTML = '';
        for (let userName of users) {
            const li = document.createElement("li");
            li.className = "bg-gray-700 px-4 py-2 rounded-lg shadow";
            li.id = "user " + userName;
            li.textContent = userName;
            if (user === userName) {
                li.classList.add("font-bold", "bg-green-800");  
                li.textContent += " (You)";
            }
            userList.appendChild(li);
        }
    }
})

const updateMsg = (data) => {
    const msgUser = data.user;
    const time = data.Time;
    const message = data.message;
    
    let isMyMessage = user === msgUser;
    const msgContainer = document.getElementById("chat-messages");

    const div = document.createElement("div");
    div.className = "flex flex-col" + (isMyMessage
        ? " items-end"
        : "");

    const span = document.createElement("span");
    span.className = "text-sm text-gray-400";
    span.textContent = isMyMessage
        ? "You"
        : msgUser;

    const childdiv = document.createElement("div");
    childdiv.className = (isMyMessage
        ? "bg-blue-600 text-white"
        : "bg-gray-700 text-white") + " px-4 py-2 rounded-xl max-w-xs";
    childdiv.textContent = message;

    const timeSpan = document.createElement("span");
    timeSpan.className = "text-xs text-gray-500 mt-1";
    timeSpan.textContent = time;

    div.appendChild(span);
    div.appendChild(childdiv);
    div.appendChild(timeSpan);

    msgContainer.appendChild(div);
    msgContainer.scrollTo({
        top: msgContainer.scrollHeight,
        behavior: "smooth"
      });


}

socket.on("sendMessageFromServer", (data) => {
    updateMsg(data);
})

socket.on("removeUsers", (user) => {
    console.log("removeUsers Called");
    showPopup(user , false);
    const userList = document.getElementById("user-list");
    const li = document.getElementById("user " + user);
    userList.removeChild(li);
})

socket.on("populateOldData", (oldMessages) => {
    for (let msg of oldMessages) {
        updateMsg(msg);
    }
})