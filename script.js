const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const msgInput = document.querySelector("#content");
const postContainer = document.querySelector("#postContainer");

// eingabe User Name vie Prompt wenn im LocalStarge nichts vermerkt ist
let nickName = localStorage.getItem("Benutzer");
if (!nickName) {
  const nick = prompt("Enter your nick name");
  nickName = nick;
  saveNick();
}
function saveNick() {
  localStorage.setItem("Benutzer", nickName);
}
// Leeren des LocalStorage bei neuem nutzer im selben Browser
function removeUser() {
  localStorage.removeItem("Benutzer");
  nickName = "";
  titleInput.value = "";
  msgInput.value = "";
}
// übergabe des LocalStorage an das Inputfeld im HTML
titleInput.value = nickName;

async function getMessage() {
  const response = await fetch("https://dci-chat-api.herokuapp.com/messages");
  const posts = await response.json();
  console.log(posts);
  // reverse ändert die reihenfolge der angezeigten Nachrichten,
  posts.reverse();
  if (posts.length > 1) {
    const githubResult = document.getElementById("postContainer");
    githubResult.textContent = "";
    posts.map((x) => {
      githubResult.innerHTML += `
        <div>
          <h2>From: ${x.from}</h2>
          <p>Message: ${x.message}</p>
          <button class="delete">Delete</button>
        </div>
        `;
    });
  }

  /*.forEach((element) => {
    const post = renderMessage(element.from, element.message, element.id);
    postContainer.appendChild(post);
  });*/
}
// Automatische Aktualisierung
//setInterval(getMessage, 1000);

// erzeugt die Nachricht im Div Container
/*function renderMessage(title, content, id) {
  const post = document.createElement("div");
  const titleElement = document.createElement("h3");
  const contentElement = document.createElement("p");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";

  titleElement.textContent = title;
  contentElement.textContent = content;

  post.id = "post" + id;

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    deletePost(id);
  });

  post.appendChild(titleElement);
  post.appendChild(contentElement);
  post.appendChild(deleteButton);
  return post;
}*/

getMessage();

// die Nachricht wird an den Server gesendet

form.addEventListener("submit", createMessage);

async function createMessage(event) {
  event.preventDefault();
  const postContent = msgInput.value;
  if (!nickName) {
    nickName = titleInput.value;
    localStorage.setItem("Benutzer", nickName);
  }

  const title = nickName;

  const payload = {
    from: title,
    message: postContent,
    userId: 1,
  };

  console.log(title, postContent);
  const response = await fetch("https://dci-chat-api.herokuapp.com/new", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const data = await response.json();
  const post = renderMessage(data.from, data.message, data.id);
  postContainer.prepend(post);
}

// nachricht löschen

async function deletePost(id) {
  const response = await fetch("https://dci-chat-api.herokuapp.com/" + id, {
    method: "DELETE",
  });
  const data = await response.json();

  console.log("deleted:", data);
}
