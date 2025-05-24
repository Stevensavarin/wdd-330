//Made by M.Andrew, slightly fixed by Tymur V. Pushnoy

//tvp fix: dynamic header/footer
import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

document.addEventListener("DOMContentLoaded", loadChecklist);

function addItem() {
  const itemInput = document.getElementById("itemInput");
  const itemText = itemInput.value.trim();
  if (itemText === "") return;

  const checklist = document.getElementById("checklist");
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="toggleItem(this)"> ${itemText} 
                    <button onclick="removeItem(this)">❌</button>`;
  checklist.appendChild(li);

  saveChecklist();
  itemInput.value = "";
}

function toggleItem(checkbox) {
  checkbox.parentElement.style.textDecoration = checkbox.checked
    ? "line-through"
    : "none";
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
    li.innerHTML = `<input type="checkbox" ${checked ? "checked" : ""} onclick="toggleItem(this)"> ${text} 
  <button class="remove" onclick="removeItem(this)">❌</button>`;
    li.style.textDecoration = checked ? "line-through" : "none";
    checklist.appendChild(li);
  });
}
