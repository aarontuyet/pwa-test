let data = [];
let images = [];

async function loadData() {
  try {
    const dataRes = await fetch("data.json");
    data = await dataRes.json();

    const imgRes = await fetch("images.json");
    images = await imgRes.json();

    console.log("DATA LOADED:", data.length);
    console.log("IMAGES LOADED:", images.length);

    nextQuote(); // run once after load

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// IMPORTANT: actually call it
loadData();

function nextQuote() {
  if (!data || data.length === 0) return;

  const quotes = data.filter(item => item.type === "Quote" && item.content);
  if (quotes.length === 0) return;

  const q = quotes[Math.floor(Math.random() * quotes.length)];

  // reset
  document.getElementById("quote").innerText = "...";
  document.getElementById("author").innerText = "";

  setTimeout(() => {
    document.getElementById("quote").innerText = `"${q.content}"`;
    document.getElementById("author").innerText = `— ${q.creator || "Unknown"}`;

    // only set image if available
    if (images && images.length > 0) {
      const img = images[Math.floor(Math.random() * images.length)];
      document.getElementById("art-image").src = img;
    }

  }, 100);
}