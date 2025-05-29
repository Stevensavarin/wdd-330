export function initQuickViewModal() { //Steven Savarin W04
  const modal = document.getElementById("quick-view-modal");
  const modalImage = document.getElementById("modal-image");
  const modalBrand = document.getElementById("modal-brand");
  const modalName = document.getElementById("modal-name");
  const modalPrice = document.getElementById("modal-price");
  const closeBtn = modal.querySelector(".close");

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("quick-view-btn")) {
      const btn = e.target;
      modalImage.src = btn.dataset.image;
      modalBrand.textContent = btn.dataset.brand;
      modalName.textContent = btn.dataset.name;
      modalPrice.textContent = btn.dataset.price;
      modal.style.display = "flex";
    }

    if (e.target === closeBtn || e.target === modal) {
      modal.style.display = "none";
    }
  });
}//Steven Savarin W04
