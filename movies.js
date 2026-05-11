// movies.js
// Movies to Watch mini-app
// Reads TAOPROJECT master CSV, filters type = Movie, then renders searchable movie cards.

const MOVIE_DATA_URL = "TAOPROJECT_Master_Table - PWA.csv";
const OLD_NEW_CUTOFF_YEAR = 2010;

let allMovies = [];
let visibleMovies = [];
let allRows = [];

const elements = {
  searchInput: document.getElementById("movie-search"),
  eraSelect: document.getElementById("movie-era"),
  statusSelect: document.getElementById("movie-status"),
  ratingSelect: document.getElementById("movie-rating"),
  sortSelect: document.getElementById("movie-sort"),
  recommendedButton: document.getElementById("recommended-button"),
  resetButton: document.getElementById("reset-movie-filters"),
  resultsCount: document.getElementById("movie-results-count"),
  resultsContainer: document.getElementById("movie-results"),
  reviewPanel: document.getElementById("movie-review-panel"),
  reviewTitle: document.getElementById("movie-review-title"),
  reviewBody: document.getElementById("movie-review-body")
};

const controlDefaults = {
  era: [
    ["all", "All Eras"],
    ["old", "Old, before 2010"],
    ["new", "New, 2010+"]
  ],
  status: [
    ["all", "All Statuses"],
    ["want", "Want to Watch"],
    ["watched", "Watched"],
    ["maybe", "Maybe"]
  ],
  rating: [
    ["0", "Any Rating"],
    ["6", "6+"],
    ["7", "7+"],
    ["8", "8+"],
    ["9", "9+"]
  ],
  sort: [
    ["rating-desc", "Highest Rated"],
    ["want-rank", "Want Rank"],
    ["year-desc", "Newest"],
    ["year-asc", "Oldest"],
    ["title-asc", "Title"],
    ["director-asc", "Director"]
  ]
};

const searchAliases = {
  comedy: ["comedy", "funny", "satire", "absurd", "parody", "farce", "romantic comedy", "romcom", "screwball"],
  drama: ["drama", "serious", "emotional", "character", "relationship", "family", "melodrama"],
  horror: ["horror", "scary", "fear", "monster", "ghost", "supernatural", "slasher", "creepy", "terror"],
  thriller: ["thriller", "suspense", "mystery", "crime", "noir", "detective", "tense"],
  action: ["action", "fight", "battle", "chase", "explosion", "adventure", "martial arts"],
  fantasy: ["fantasy", "magic", "myth", "fairy tale", "epic", "dream", "surreal"],
  scifi: ["sci-fi", "science fiction", "space", "future", "robot", "alien", "technology", "dystopia"],
  "sci fi": ["sci-fi", "science fiction", "space", "future", "robot", "alien", "technology", "dystopia"],
  classic: ["classic", "old", "golden age", "academy", "oscar", "criterion", "pre-2010"],
  foreign: ["foreign", "international", "world cinema", "japanese", "french", "italian", "korean", "spanish", "german"],
  animated: ["animated", "animation", "anime", "cartoon", "pixar", "disney", "ghibli"],
  family: ["family", "kids", "children", "heartwarming", "animated", "adventure"],
  weird: ["weird", "strange", "surreal", "absurd", "experimental", "cult", "offbeat"],
  best: ["best", "favorite", "recommended", "high rated", "oscar", "award", "winner"]
};

document.addEventListener("DOMContentLoaded", initializeMoviesApp);

async function initializeMoviesApp() {
  ensureControlDefaults();
  showLoadingState();

  try {
    const csvText = await fetchCsv(MOVIE_DATA_URL);
    allRows = parseCsv(csvText);

    allMovies = allRows
      .filter(isMovieRow)
      .map((row, index) => normalizeMovie(row, index))
      .filter(movie => movie.title);

    console.log("Movie app debug");
    console.log("Total CSV rows:", allRows.length);
    console.log("Movie rows found:", allMovies.length);
    console.log("First row keys:", Object.keys(allRows[0] || {}));
    console.log("First movie:", allMovies[0] || null);

    bindControls();
    applyFiltersAndRender();
  } catch (error) {
    console.error("Movie app failed to load:", error);
    showErrorState(error);
  }
}

function ensureControlDefaults() {
  populateSelectIfEmpty(elements.eraSelect, controlDefaults.era, "all");
  populateSelectIfEmpty(elements.statusSelect, controlDefaults.status, "all");
  populateSelectIfEmpty(elements.ratingSelect, controlDefaults.rating, "0");
  populateSelectIfEmpty(elements.sortSelect, controlDefaults.sort, "rating-desc");

  if (elements.recommendedButton && !elements.recommendedButton.textContent.trim()) {
    elements.recommendedButton.textContent = "Recommended";
  }

  if (elements.resetButton && !elements.resetButton.textContent.trim()) {
    elements.resetButton.textContent = "Reset Filters";
  }
}

function populateSelectIfEmpty(selectElement, options, defaultValue) {
  if (!selectElement) return;

  if (!selectElement.options.length) {
    selectElement.innerHTML = options
      .map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
      .join("");
  }

  if (!selectElement.value) {
    selectElement.value = defaultValue;
  }
}

async function fetchCsv(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load ${url}. Status: ${response.status}`);
  }

  return response.text();
}

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  const text = csvText.replace(/^\uFEFF/, "");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      cell += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }

      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const usableRows = rows.filter(csvRow => csvRow.some(value => cleanValue(value)));

  if (!usableRows.length) return [];

  const headers = usableRows[0].map(header => cleanValue(header));
  const dataRows = usableRows.slice(1);

  return dataRows.map(csvRow => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = cleanValue(csvRow[index] || "");
    });

    return item;
  });
}

function isMovieRow(row) {
  return getField(row, ["type", "Type", "TYPE"]).toLowerCase() === "movie";
}

function normalizeMovie(row, index) {
  const year = toNumber(getField(row, ["year", "Year", "YEAR"]));

  const ratingFinal = toNumber(getField(row, ["Rating_Final", "rating_final", "Rating Final", "rating avg", "rating_avg"]));
  const ratingPersonal = toNumber(getField(row, ["Rating_Personal2", "rating_personal2", "rating_personal", "Rating Personal", "Personal Rating"]));
  const ratingRecommend = toNumber(getField(row, ["Rating_Recommend", "rating_recommend", "Rating Recommend", "Recommend Rating"]));
  const ratingTech = toNumber(getField(row, ["Rating_Tech", "rating_tech", "Rating Tech", "Technical Rating"]));
  const wantRank = toNumber(getField(row, ["WantRank", "want_rank", "Want Rank"]));

  const category = getField(row, ["category", "Category"]);
  const subcategory = getField(row, ["subcategory", "Subcategory", "SubCategory"]);
  const tags = getField(row, ["tags", "Tags"]);
  const watchedStatus = getField(row, ["WatchedStatus", "watched_status", "Watched Status", "status", "Status"]);
  const topAwards = getField(row, ["Top Awards", "top_awards", "TopAwards"]);

  const id = getField(row, ["id", "ID", "Id"]) || `movie-${index + 1}`;
  const title = getField(row, ["title", "Title"]);
  const director = getField(row, ["creator", "Creator", "director", "Director"]);

  const movie = {
    id,
    title,
    content: getField(row, ["content", "Content"]),
    director,
    year,
    era: year && year < OLD_NEW_CUTOFF_YEAR ? "old" : "new",
    category,
    subcategory,
    tags,
    watchedStatus,
    topAwards,
    wantRank,
    ratingFinal,
    ratingPersonal,
    ratingRecommend,
    ratingTech,
    importance: getField(row, ["importance", "Importance"]),
    favorite: getField(row, ["favorite", "Favorite"]),
    revisitFlag: getField(row, ["revisit_flag", "Revisit Flag", "revisit"]),
    context: getField(row, ["context", "Context"]),
    meaning: getField(row, ["meaning", "Meaning"]),
    notes: getField(row, ["notes", "Notes"]),
    source: getField(row, ["source", "Source"]),
    externalLink: getField(row, ["external_link", "External Link", "link", "Link"]),
    raw: row
  };

  movie.searchText = buildSearchText(movie);

  return movie;
}

function getField(row, possibleNames) {
  if (!row) return "";

  const rowKeys = Object.keys(row);

  for (const name of possibleNames) {
    if (Object.prototype.hasOwnProperty.call(row, name)) {
      return cleanValue(row[name]);
    }
  }

  for (const name of possibleNames) {
    const normalizedName = normalizeKey(name);
    const matchingKey = rowKeys.find(key => normalizeKey(key) === normalizedName);

    if (matchingKey) {
      return cleanValue(row[matchingKey]);
    }
  }

  return "";
}

function normalizeKey(value) {
  return cleanValue(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "")
    .replace(/-/g, "");
}

function cleanValue(value) {
  if (value === null || value === undefined) return "";

  const cleaned = String(value).trim();

  if (!cleaned) return "";
  if (cleaned.toLowerCase() === "nan") return "";

  return cleaned;
}

function toNumber(value) {
  const cleaned = cleanValue(value);

  if (!cleaned) return null;

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : null;
}

function getControlValue(element, fallbackValue) {
  if (!element) return fallbackValue;

  const value = cleanValue(element.value);

  return value || fallbackValue;
}

function buildSearchText(movie) {
  return [
    movie.title,
    movie.content,
    movie.director,
    movie.year,
    movie.era,
    movie.category,
    movie.subcategory,
    movie.tags,
    movie.watchedStatus,
    movie.topAwards,
    movie.ratingFinal,
    movie.ratingPersonal,
    movie.ratingRecommend,
    movie.ratingTech,
    movie.importance,
    movie.favorite,
    movie.context,
    movie.meaning,
    movie.notes,
    movie.source
  ]
    .filter(value => value !== null && value !== undefined && value !== "")
    .join(" ")
    .toLowerCase();
}

function bindControls() {
  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", applyFiltersAndRender);
  }

  if (elements.eraSelect) {
    elements.eraSelect.addEventListener("change", applyFiltersAndRender);
  }

  if (elements.statusSelect) {
    elements.statusSelect.addEventListener("change", applyFiltersAndRender);
  }

  if (elements.ratingSelect) {
    elements.ratingSelect.addEventListener("change", applyFiltersAndRender);
  }

  if (elements.sortSelect) {
    elements.sortSelect.addEventListener("change", applyFiltersAndRender);
  }

  if (elements.recommendedButton) {
    elements.recommendedButton.addEventListener("click", showRecommendedMovies);
  }

  if (elements.resetButton) {
    elements.resetButton.addEventListener("click", resetFilters);
  }
}

function applyFiltersAndRender() {
  const searchTerm = elements.searchInput ? elements.searchInput.value.trim() : "";
  const era = getControlValue(elements.eraSelect, "all");
  const status = getControlValue(elements.statusSelect, "all");
  const minimumRating = toNumber(getControlValue(elements.ratingSelect, "0")) || 0;
  const sortMode = getControlValue(elements.sortSelect, "rating-desc");

  visibleMovies = allMovies.filter(movie => {
    const matchesSearch = movieMatchesSearch(movie, searchTerm);
    const matchesEra = era === "all" || movie.era === era;
    const matchesStatus = status === "all" || normalizeStatus(movie.watchedStatus) === status;
    const matchesRating = minimumRating <= 0 || ((movie.ratingFinal || 0) >= minimumRating);

    return matchesSearch && matchesEra && matchesStatus && matchesRating;
  });

  visibleMovies = sortMovies(visibleMovies, sortMode);

  renderMovies(visibleMovies);
  updateResultsCount(visibleMovies.length);
}

function movieMatchesSearch(movie, rawSearchTerm) {
  if (!rawSearchTerm) return true;

  const normalizedSearch = rawSearchTerm.toLowerCase();
  const expandedTerms = expandSearchTerms(normalizedSearch);

  return expandedTerms.some(term => {
    if (!term) return false;

    if (movie.searchText.includes(term)) return true;

    if (term === "old") {
      return movie.year && movie.year < OLD_NEW_CUTOFF_YEAR;
    }

    if (term === "new") {
      return movie.year && movie.year >= OLD_NEW_CUTOFF_YEAR;
    }

    if (term === "recommended") {
      return isRecommendedMovie(movie);
    }

    if (term === "watched") {
      return normalizeStatus(movie.watchedStatus) === "watched";
    }

    if (term === "unwatched" || term === "want") {
      return normalizeStatus(movie.watchedStatus) === "want";
    }

    return false;
  });
}

function expandSearchTerms(searchTerm) {
  const terms = new Set();

  terms.add(searchTerm);

  const words = searchTerm
    .split(/\s+/)
    .map(word => word.trim())
    .filter(Boolean);

  words.forEach(word => {
    terms.add(word);

    if (searchAliases[word]) {
      searchAliases[word].forEach(alias => terms.add(alias));
    }
  });

  if (searchAliases[searchTerm]) {
    searchAliases[searchTerm].forEach(alias => terms.add(alias));
  }

  return Array.from(terms);
}

function normalizeStatus(status) {
  const value = cleanValue(status).toLowerCase();

  if (!value) return "unknown";

  if (["yes", "watched", "seen", "complete", "completed", "done"].includes(value)) {
    return "watched";
  }

  if (["want", "to watch", "watchlist", "unwatched", "no", "not watched", "todo", "to-do"].includes(value)) {
    return "want";
  }

  if (["maybe", "consider", "someday"].includes(value)) {
    return "maybe";
  }

  return value;
}

function sortMovies(movies, sortMode) {
  const sorted = [...movies];

  sorted.sort((a, b) => {
    switch (sortMode) {
      case "rating-desc":
        return compareNumbersDesc(a.ratingFinal, b.ratingFinal) || compareNumbersAsc(a.wantRank, b.wantRank) || compareTitles(a, b);

      case "rating-asc":
        return compareNumbersAsc(a.ratingFinal, b.ratingFinal) || compareTitles(a, b);

      case "want-rank":
        return compareNumbersAsc(a.wantRank, b.wantRank) || compareNumbersDesc(a.ratingFinal, b.ratingFinal) || compareTitles(a, b);

      case "year-desc":
        return compareNumbersDesc(a.year, b.year) || compareTitles(a, b);

      case "year-asc":
        return compareNumbersAsc(a.year, b.year) || compareTitles(a, b);

      case "title-asc":
        return compareTitles(a, b);

      case "director-asc":
        return (a.director || "").localeCompare(b.director || "") || compareTitles(a, b);

      default:
        return compareNumbersDesc(a.ratingFinal, b.ratingFinal) || compareTitles(a, b);
    }
  });

  return sorted;
}

function compareNumbersDesc(a, b) {
  const aHasValue = a !== null && a !== undefined;
  const bHasValue = b !== null && b !== undefined;

  if (!aHasValue && !bHasValue) return 0;
  if (!aHasValue) return 1;
  if (!bHasValue) return -1;

  return b - a;
}

function compareNumbersAsc(a, b) {
  const aHasValue = a !== null && a !== undefined;
  const bHasValue = b !== null && b !== undefined;

  if (!aHasValue && !bHasValue) return 0;
  if (!aHasValue) return 1;
  if (!bHasValue) return -1;

  return a - b;
}

function compareTitles(a, b) {
  return (a.title || "").localeCompare(b.title || "");
}

function showRecommendedMovies() {
  if (elements.searchInput) elements.searchInput.value = "";
  if (elements.eraSelect) elements.eraSelect.value = "all";
  if (elements.statusSelect) elements.statusSelect.value = "all";
  if (elements.ratingSelect) elements.ratingSelect.value = "0";
  if (elements.sortSelect) elements.sortSelect.value = "rating-desc";

  visibleMovies = allMovies
    .filter(movie => isRecommendedMovie(movie))
    .sort((a, b) => {
      return (
        compareNumbersDesc(a.ratingFinal, b.ratingFinal) ||
        compareNumbersAsc(a.wantRank, b.wantRank) ||
        compareTitles(a, b)
      );
    });

  renderMovies(visibleMovies);
  updateResultsCount(visibleMovies.length, "Recommended movies");
}

function isRecommendedMovie(movie) {
  const rating = movie.ratingFinal || 0;
  const recommend = movie.ratingRecommend || 0;
  const wantRank = movie.wantRank || null;
  const awards = (movie.topAwards || "").toLowerCase();
  const favorite = (movie.favorite || "").toLowerCase();
  const importance = toNumber(movie.importance) || 0;

  return (
    rating >= 8 ||
    recommend >= 8 ||
    importance >= 8 ||
    favorite === "true" ||
    favorite === "yes" ||
    (wantRank && wantRank <= 25) ||
    awards.includes("oscar") ||
    awards.includes("winner") ||
    awards.includes("palme") ||
    awards.includes("best film")
  );
}

function resetFilters() {
  if (elements.searchInput) elements.searchInput.value = "";
  if (elements.eraSelect) elements.eraSelect.value = "all";
  if (elements.statusSelect) elements.statusSelect.value = "all";
  if (elements.ratingSelect) elements.ratingSelect.value = "0";
  if (elements.sortSelect) elements.sortSelect.value = "rating-desc";

  hideReviewPanel();
  applyFiltersAndRender();
}

function renderMovies(movies) {
  if (!elements.resultsContainer) return;

  if (!allMovies.length) {
    elements.resultsContainer.innerHTML = `
      <div class="empty-card">
        <h2>No movie rows found</h2>
        <p>The CSV loaded, but no rows matched <strong>type = Movie</strong>.</p>
        <p>Open the Console and check <strong>First row keys</strong> and <strong>Total CSV rows</strong>.</p>
      </div>
    `;
    return;
  }

  if (!movies.length) {
    elements.resultsContainer.innerHTML = `
      <div class="empty-card">
        <h2>No movies found</h2>
        <p>Try a broader search, lower the rating filter, or reset the filters.</p>
      </div>
    `;
    return;
  }

  elements.resultsContainer.innerHTML = movies
    .map(movie => renderMovieCard(movie))
    .join("");

  const cardButtons = elements.resultsContainer.querySelectorAll("[data-movie-id]");

  cardButtons.forEach(button => {
    button.addEventListener("click", () => {
      const movieId = button.getAttribute("data-movie-id");
      const selectedMovie = allMovies.find(movie => String(movie.id) === String(movieId));

      if (selectedMovie) {
        showMovieReview(selectedMovie);
      }
    });
  });
}

function renderMovieCard(movie) {
  const yearLabel = movie.year || "Unknown year";
  const eraLabel = movie.year ? movie.era === "old" ? "Old" : "New" : "Unknown era";
  const directorLabel = movie.director || "Unknown director";
  const ratingLabel = formatRating(movie.ratingFinal);
  const categoryLabel = movie.category || "Uncategorized";
  const statusLabel = formatStatus(movie.watchedStatus);
  const awardsLabel = movie.topAwards ? `<span class="movie-pill">${escapeHtml(movie.topAwards)}</span>` : "";
  const rankLabel = movie.wantRank ? `<span class="movie-pill">Want Rank ${escapeHtml(String(movie.wantRank))}</span>` : "";

  return `
    <article class="movie-card">
      <div class="movie-card-main">
        <div>
          <p class="card-kicker">${escapeHtml(categoryLabel)}</p>
          <h2>${escapeHtml(movie.title)}</h2>
          <p class="movie-meta">
            ${escapeHtml(String(yearLabel))} · ${escapeHtml(eraLabel)} · ${escapeHtml(directorLabel)}
          </p>
        </div>

        <div class="movie-rating-badge" aria-label="Overall rating">
          ${escapeHtml(ratingLabel)}
        </div>
      </div>

      <div class="movie-detail-row">
        <span class="movie-pill">${escapeHtml(statusLabel)}</span>
        ${rankLabel}
        ${awardsLabel}
      </div>

      <div class="movie-card-actions">
        <button type="button" class="secondary-button" data-movie-id="${escapeHtml(String(movie.id))}">
          Review
        </button>
      </div>
    </article>
  `;
}

function showMovieReview(movie) {
  if (!elements.reviewPanel || !elements.reviewTitle || !elements.reviewBody) return;

  elements.reviewTitle.textContent = movie.title;

  const reviewText = movie.notes || movie.meaning || movie.context || movie.content || "";

  elements.reviewBody.innerHTML = `
    <p><strong>Director:</strong> ${escapeHtml(movie.director || "Unknown")}</p>
    <p><strong>Year:</strong> ${escapeHtml(String(movie.year || "Unknown"))}</p>
    <p><strong>Category:</strong> ${escapeHtml(movie.category || "Uncategorized")}</p>
    <p><strong>Status:</strong> ${escapeHtml(formatStatus(movie.watchedStatus))}</p>
    <p><strong>Overall Rating:</strong> ${escapeHtml(formatRating(movie.ratingFinal))}</p>
    <p><strong>Technical:</strong> ${escapeHtml(formatRating(movie.ratingTech))}</p>
    <p><strong>Recommend:</strong> ${escapeHtml(formatRating(movie.ratingRecommend))}</p>
    <p><strong>Personal:</strong> ${escapeHtml(formatRating(movie.ratingPersonal))}</p>
    <hr />
    <p>${reviewText ? escapeHtml(reviewText) : "No review added yet."}</p>
    ${
      movie.externalLink
        ? `<p><a href="${escapeHtml(movie.externalLink)}" target="_blank" rel="noopener noreferrer">External link</a></p>`
        : ""
    }
  `;

  elements.reviewPanel.hidden = false;
  elements.reviewPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideReviewPanel() {
  if (elements.reviewPanel) {
    elements.reviewPanel.hidden = true;
  }
}

function updateResultsCount(count, label = "Movies") {
  if (!elements.resultsCount) return;

  if (!allMovies.length && allRows.length) {
    elements.resultsCount.textContent = "Movies: 0";
    return;
  }

  elements.resultsCount.textContent = `${label}: ${count}`;
}

function formatRating(value) {
  if (value === null || value === undefined || value === "") {
    return "NR";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "NR";
  }

  return number.toFixed(1).replace(".0", "");
}

function formatStatus(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "watched") return "Watched";
  if (normalized === "want") return "Want to Watch";
  if (normalized === "maybe") return "Maybe";
  if (normalized === "unknown") return "No Status";

  return cleanValue(status) || "No Status";
}

function showLoadingState() {
  if (elements.resultsContainer) {
    elements.resultsContainer.innerHTML = `
      <div class="empty-card">
        <h2>Loading movies</h2>
        <p>Reading the master table and preparing the watchlist.</p>
      </div>
    `;
  }

  if (elements.resultsCount) {
    elements.resultsCount.textContent = "Loading movies...";
  }
}

function showErrorState(error) {
  if (elements.resultsContainer) {
    elements.resultsContainer.innerHTML = `
      <div class="empty-card">
        <h2>Could not load movies</h2>
        <p>${escapeHtml(error.message || "Unknown error")}</p>
        <p>Confirm that <strong>${escapeHtml(MOVIE_DATA_URL)}</strong> exists in the project root and is committed to GitHub.</p>
      </div>
    `;
  }

  if (elements.resultsCount) {
    elements.resultsCount.textContent = "Error loading movies";
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}