const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const prioritySelect = document.getElementById("priority");

function addTask() {
    const taskText = inputBox.value.trim();
    const priorityValue = prioritySelect.value;

    if (!taskText) {
        alert("Lütfen bir görev girin!");
        return;
    }
    if (!priorityValue || priorityValue === "Öncelik") {
        alert("Lütfen bir öncelik seçin!");
        return;
    }

    const priorityText = prioritySelect.options[prioritySelect.selectedIndex].text;

    const li = document.createElement("li");
    li.textContent = taskText + " ";

    const priorityTag = document.createElement("strong");
    priorityTag.textContent = `(${priorityText})`;

    li.appendChild(priorityTag);
    li.appendChild(createDeleteButton(li)); 

    li.addEventListener("click", function () {
        this.classList.toggle("checked");
    });

    listContainer.appendChild(li);

    inputBox.value = "";
    prioritySelect.selectedIndex = 0;
}


function createDeleteButton(taskElement) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.style.marginLeft = "20px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.backgroundColor = "blue";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "10px";

    deleteBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // olayın parent elementlere yayılmasını önlemek için kullanılır

        const isConfirmed = confirm("Bu görevi silmek istediğinize emin misiniz?");
        if (isConfirmed) {
            taskElement.remove();
        }
    });

    return deleteBtn;
}


document.getElementById("filter-completed").addEventListener("click", function () {
    const allTasks = document.querySelectorAll("#list-container li");
    allTasks.forEach(task => {
        if (!task.classList.contains("checked")) {
            task.style.display = task.style.display === "none" ? "list-item" : "none";
        }
    });
});

document.getElementById("sort-priority").addEventListener("click", function () {
    const tasks = Array.from(document.querySelectorAll("#list-container li"));
    
    tasks.sort((a, b) => {
        const priorityOrder = { "Düşük": 1, "Orta": 2, "Yüksek": 3 };
        const aPriority = a.querySelector("strong").textContent.replace(/[()]/g, "").trim();
        const bPriority = b.querySelector("strong").textContent.replace(/[()]/g, "").trim();
        return priorityOrder[aPriority] - priorityOrder[bPriority];
    });

    tasks.forEach(task => listContainer.appendChild(task));
});
