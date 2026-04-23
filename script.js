let inp = document.getElementById("newTask");
let submit = document.getElementById("addTask");
let tasksContainer = document.getElementById("tasksContainer");

let arrTask = JSON.parse(localStorage.getItem("Tasks")) || [];

submit.addEventListener("click", () => {
  if (inp.value !== "" && arrTask.every((task) => task.name !== inp.value)) {
    addTasArr(inp.value);
    inp.value = "";
  }
});

inp.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (inp.value !== "" && arrTask.every((task) => task.name !== inp.value)) {
      addTasArr(inp.value);
      inp.value = "";
    }
  }
});

function addTasArr(taskName) {
  arrTask.push({
    id: Date.now(),
    name: taskName,
    completed: false,
  });
  addTasLocal(arrTask);
  addTasPage(arrTask);
}

function addTasLocal(arrTask) {
  localStorage.setItem("Tasks", JSON.stringify(arrTask));
}

function addTasPage(arrTask) {
  tasksContainer.innerHTML = "";
  arrTask.forEach((task) => {
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (task.completed) {
      taskDiv.classList.add("done");
    }
    taskDiv.setAttribute("data-id", task.id);
    taskDiv.innerHTML = `
      <span>${task.name}</span>
      <div class="options">
        <button class="check-btn">
          <i class="fa-regular ${task.completed ? "fa-square-check" : "fa-square"}"></i>
        </button>
        <button class="edit-btn">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button class="delete-btn">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    taskDiv.querySelector(".check-btn").addEventListener("click", (e) => {
      toggleStatus(e, task.id);
    });

    taskDiv.querySelector(".delete-btn").addEventListener("click", (e) => {
      deleteTask(e, task.id);
    });

    taskDiv.querySelector(".edit-btn").addEventListener("click", (e) => {
      editTask(e, task.id);
    });

    tasksContainer.appendChild(taskDiv);
  });
}

function toggleStatus(event, taskId) {
  const taskAttr = event.target.closest(".task");
  if (!taskAttr) return;

  const taskIndex = arrTask.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) return;

  arrTask[taskIndex].completed = !arrTask[taskIndex].completed;
  const isCompleted = arrTask[taskIndex].completed;
  if (isCompleted) {
    taskAttr.classList.add("done");
    taskAttr.querySelector(".check-btn").innerHTML =
      `<i class="fa-regular fa-square-check"></i>`;
  } else {
    taskAttr.classList.remove("done");
    taskAttr.querySelector(".check-btn").innerHTML =
      `<i class="fa-regular fa-square"></i>`;
  }
  addTasLocal(arrTask);
}

function deleteTask(event, taskId) {
  const targetTask = event.target.closest(".task");
  if (!targetTask) return;
  targetTask.remove();
  arrTask = arrTask.filter((task) => task.id !== taskId);
  addTasLocal(arrTask);
  if (arrTask.length === 0) {
    tasksContainer.innerHTML = `<span style="color:white; display:block; text-align:center; padding:20px;">🌟 لا يوجد مهام 🌟</span>`;
  }
}

function editTask(event, taskId) {
  const taskDiv = event.target.closest(".task");
  const taskSpan = taskDiv.querySelector("span");
  const currentText = taskSpan.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-span");
  input.value = currentText;

  taskSpan.replaceWith(input);
  input.focus();

  if (!taskDiv.querySelector(".confirm-task")) {
    input.insertAdjacentHTML(
      "beforebegin",
      `
    <div class="confirm-task">
      <button class ="yes"><i class="fa-solid fa-check" style="color: rgb(255, 255, 255);"></i></button>
      <button class ="no"><i class="fa-solid fa-xmark" style="color: rgb(255, 255, 255);"></i></button>
    </div>
    `,
    );
  }

  function saveEdit() {
    const newText = input.value.trim();
    if (newText !== "") {
      const taskIndex = arrTask.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        arrTask[taskIndex].name = newText;
        addTasLocal(arrTask);
      }

      const newSpan = document.createElement("span");
      newSpan.textContent = newText;

      input.replaceWith(newSpan);
    } else {
      noSave();
    }
  }

  function noSave() {
    const newSpan = document.createElement("span");
    newSpan.textContent = currentText;
    input.replaceWith(newSpan);
  }

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    }
  });

  const confirmDiv = taskDiv.querySelector(".confirm-task");
  taskDiv.querySelector(".yes").addEventListener("click", () => {
    confirmDiv.remove();
    saveEdit();
  });
  taskDiv.querySelector(".no").addEventListener("click", () => {
    confirmDiv.remove();
    noSave();
  });
}

function getData() {
  const taskData = localStorage.getItem("Tasks");

  if (taskData && taskData !== "[]") {
    addTasPage(JSON.parse(taskData));
  } else {
    tasksContainer.innerHTML = `<span style="color:white; display:block; text-align:center; padding:20px;">🌟 لا يوجد مهام 🌟</span>`;
  }
}

getData();

// Stars Effect
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let animationId = null;

let stars = [];
const starsNum = 100;

function reSizeCtx() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  for (let i = 0; i < starsNum; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random(),
      speed: Math.random() * 0.2 + 0.1,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();

    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  }
  animationId = requestAnimationFrame(drawStars);
}

window.addEventListener("resize", () => {
  reSizeCtx();
});

window.addEventListener("beforeunload", () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

reSizeCtx();
initStars();
drawStars();
