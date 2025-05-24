//Made by M.Andrew, slightly fixed by Tymur V. Pushnoy

//tvp fix: dynamic header/footer
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

document.addEventListener("DOMContentLoaded", loadChecklist);

document.getElementById("checklistButton").addEventListener("click", addItem);

function addItem() {
  const itemInput = document.getElementById("itemInput");
  const itemText = itemInput.value.trim();
  if (itemText === "") return;

  const checklist = document.getElementById("checklist");
  const li = document.createElement("li");

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", function () {
    toggleItem(checkbox);
  });

  // Create span for text
  const span = document.createElement("span");
  span.textContent = itemText;

  // Create remove button
  const button = document.createElement("button");
  button.className = "remove";
  button.textContent = "❌";
  button.addEventListener("click", function () {
    removeItem(button);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(button);
  checklist.appendChild(li);

  saveChecklist();
  itemInput.value = "";
}

function toggleItem(checkbox) {
  //find the span sibling (the task text)
  const span = checkbox.nextElementSibling;
  if (span) {
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
  }
  saveChecklist();
}

function removeItem(button) {
  button.parentElement.remove();
  saveChecklist();
}

function saveChecklist() {
  const items = Array.from(document.querySelectorAll("#checklist li")).map(
    (li) => ({
      text: li.innerText.replace("❌", "").trim(),
      checked: li.firstChild.checked,
    }),
  );
  localStorage.setItem("checklist", JSON.stringify(items));
}

function loadChecklist() {
  const savedItems = JSON.parse(localStorage.getItem("checklist")) || [];
  savedItems.forEach(({ text, checked }) => {
    const checklist = document.getElementById("checklist");
    const li = document.createElement("li");

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.addEventListener("change", function () {
      toggleItem(checkbox);
    });

    // Create span for text
    const span = document.createElement("span");
    span.textContent = text;

    // Create remove button
    const button = document.createElement("button");
    button.className = "remove";
    button.textContent = "❌";
    button.addEventListener("click", function () {
      removeItem(button);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(button);
    span.style.textDecoration = checked ? "line-through" : "none";
    checklist.appendChild(li);
  });
}
