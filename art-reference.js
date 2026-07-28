let references = [];
let currentCategory = "gesture";
let currentList = [];
let currentIndex = -1;

const categorySelect = document.getElementById("category-select");
const randomButton = document.getElementById("random-image-button");
const previousButton = document.getElementById("previous-image-button");
const nextButton = document.getElementById("next-image-button");

const referenceImage = document.getElementById("reference-image");
const referenceEmpty = document.getElementById("reference-empty");

async function loadReferences() {
  try {
    const response = await fetch("art-references.json");

    if (!response.ok) {
      throw new Error("Could not load art-references.json.");
    }

    references = await response.json();
    setCategory(currentCategory);
  } catch (error) {
    showEmptyState(
      "Could not load references",
      "Check art-references.json and try again."
    );

    console.error(error);
  }
}

function setCategory(category) {
  currentCategory = category;
  currentList = references.filter((item) => item.category === currentCategory);
  currentIndex = -1;

  referenceImage.hidden = true;
  referenceImage.removeAttribute("src");

  if (currentList.length > 0) {
    showEmptyState(
      "Ready to practice",
      `${currentList.length} references available. Click Random Reference to begin.`
    );
  } else {
    showEmptyState(
      "No references yet",
      `There are no images in ${formatCategoryName(category)} right now.`
    );
  }
}

function showReference(index) {
  if (!currentList.length) {
    setCategory(currentCategory);
    return;
  }

  currentIndex = (index + currentList.length) % currentList.length;

  const item = currentList[currentIndex];

  referenceImage.src = item.src;
  referenceImage.alt = `${formatCategoryName(item.category)} reference`;
  referenceImage.hidden = false;

  referenceEmpty.hidden = true;
}

function showRandomReference() {
  if (!currentList.length) {
    setCategory(currentCategory);
    return;
  }

  if (currentList.length === 1) {
    showReference(0);
    return;
  }

  let nextIndex = Math.floor(Math.random() * currentList.length);

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * currentList.length);
  }

  showReference(nextIndex);
}

function showEmptyState(title, message) {
  referenceEmpty.hidden = false;
  referenceEmpty.innerHTML = `
    <div class="empty-card">
      <h2>${title}</h2>
      <p>${message}</p>
    </div>
  `;
}

function formatCategoryName(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

categorySelect.addEventListener("change", (event) => {
  setCategory(event.target.value);
});

randomButton.addEventListener("click", showRandomReference);

previousButton.addEventListener("click", () => {
  if (currentList.length) {
    showReference(currentIndex - 1);
  }
});

nextButton.addEventListener("click", () => {
  if (currentList.length) {
    showReference(currentIndex + 1);
  }
});

referenceImage.addEventListener("error", () => {
  referenceImage.hidden = true;
  referenceImage.removeAttribute("src");

  showEmptyState(
    "Reference unavailable",
    navigator.onLine
      ? "This image could not be loaded. Try another reference."
      : "This image has not been saved for offline use yet. Open it once while online, then it will remain available offline."
  );
});

loadReferences();
