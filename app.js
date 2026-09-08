const AREA_RULES = [
  [/\btogoshi ginza\b/i, "Togoshi Ginza", "Shinagawa City"],
  [/\bkichij[ōo]ji\b/i, "Kichijoji", "Musashino City"],
  [/(?:shimokitazawa|\bshimo\b)/i, "Shimokitazawa", "Setagaya City"],
  [/\bkoenji\b/i, "Koenji", "Suginami City"],
  [/\bhatagaya\b/i, "Hatagaya", "Shibuya City"],
  [/\b(?:jimbocho|jinbocho)\b/i, "Jimbocho", "Chiyoda City"],
  [/\basakusa\b/i, "Asakusa", "Taito City"],
  [/\bakihabara\b|\bakiba\b/i, "Akihabara", "Chiyoda City"],
  [/\b(?:ikebukuro|ikebukoro)\b/i, "Ikebukuro", "Toshima City"],
  [/\bjiyugaoka\b/i, "Jiyugaoka", "Meguro City"],
  [/\bkamata\b/i, "Kamata", "Ota City"],
  [/\bnakameguro\b/i, "Nakameguro", "Meguro City"],
  [/\bdaikanyama\b/i, "Daikanyama", "Shibuya City"],
  [/\bharajuku\b/i, "Harajuku", "Shibuya City"],
  [/\bebisu\b/i, "Ebisu", "Shibuya City"],
  [/\bginza\b/i, "Ginza", "Chuo City"],
  [/\btsukiji\b/i, "Tsukiji", "Chuo City"],
  [/\bueno\b/i, "Ueno", "Taito City"],
  [/\byanaka\b/i, "Yanaka", "Taito City"],
  [/\bkappabashi\b/i, "Kappabashi", "Taito City"],
  [/\bshinjuku\b/i, "Shinjuku", "Shinjuku City"],
  [/\bshibuya\b/i, "Shibuya", "Shibuya City"],
  [/\bishiwara\b/i, "Ishiwara", "Sumida City"],
  [/\btaihei\b/i, "Taihei", "Sumida City"],
];

const WARD_RULES = [
  [/\b(?:taito|tiato) (?:city|cuty)\b/i, "Taito City"],
  [/\bkat(?:s|sh)ushika city\b/i, "Katsushika City"],
  [/\bshibuya(?: city)?\b/i, "Shibuya City"],
  [/\bshinjuku(?: city)?\b/i, "Shinjuku City"],
  [/\bsetagaya(?: city)?\b/i, "Setagaya City"],
  [/\bsuginami(?: city)?\b/i, "Suginami City"],
  [/\bnakano(?: city)?\b/i, "Nakano City"],
  [/\bnerima(?: city)?\b/i, "Nerima City"],
  [/\bchiyoda(?: city)?\b/i, "Chiyoda City"],
  [/\bchuo(?: city)?\b/i, "Chuo City"],
  [/\bminato(?: city)?\b/i, "Minato City"],
  [/\bbunkyo(?: city)?\b/i, "Bunkyo City"],
  [/\btoshima(?: city)?\b/i, "Toshima City"],
  [/\bitabashi(?: city)?\b/i, "Itabashi City"],
  [/\bmeguro(?: city)?\b/i, "Meguro City"],
  [/\bshinagawa(?: city)?\b/i, "Shinagawa City"],
  [/\bota(?: city)?\b/i, "Ota City"],
  [/\bsumida(?: city)?\b/i, "Sumida City"],
  [/\bkoto(?: city)?\b/i, "Koto City"],
  [/\bedogawa(?: city)?\b/i, "Edogawa City"],
  [/\bchofu(?: city)?\b/i, "Chofu City"],
  [/\bmusashino(?: city)?\b/i, "Musashino City"],
];

const ZONES = new Map([
  ["Shibuya City", "West Tokyo"], ["Shinjuku City", "West Tokyo"],
  ["Setagaya City", "West Tokyo"], ["Suginami City", "West Tokyo"],
  ["Nakano City", "West Tokyo"], ["Nerima City", "West Tokyo"],
  ["Musashino City", "West Tokyo"], ["Chofu City", "West Tokyo"],
  ["Chiyoda City", "Central Tokyo"], ["Chuo City", "Central Tokyo"],
  ["Minato City", "Central Tokyo"], ["Bunkyo City", "Central Tokyo"],
  ["Taito City", "East Tokyo"], ["Sumida City", "East Tokyo"],
  ["Koto City", "East Tokyo"], ["Edogawa City", "East Tokyo"],
  ["Katsushika City", "East Tokyo"], ["Toshima City", "North Tokyo"],
  ["Itabashi City", "North Tokyo"], ["Meguro City", "South Tokyo"],
  ["Shinagawa City", "South Tokyo"], ["Ota City", "South Tokyo"],
]);

const CATEGORY_GROUPS = new Map([
  ["Listening bars", "Eat & drink"], ["Kissaten", "Eat & drink"],
  ["Food", "Eat & drink"], ["Bars", "Eat & drink"], ["Coffee", "Eat & drink"],
  ["Vintage (and normal) clothes", "Shopping"], ["Shops", "Shopping"],
  ["Flea markets", "Shopping"], ["Parks", "Nature & heritage"],
  ["Shrines/Temples", "Nature & heritage"], ["Venues", "Culture & nightlife"],
  ["Museums", "Culture & nightlife"], ["Books", "Culture & nightlife"],
  ["Queer", "Culture & nightlife"], ["Misc", "Things to do"],
  ["Sento", "Bath & wellness"], ["Neighborhoods", "Neighborhoods"],
  ["Day trips from Tokyo", "Day trips"],
]);

const state = {
  places: [],
  query: "",
  category: "All",
  zone: "All areas",
  groupBy: "category",
};

function cleanText(value) {
  return value
    .replace(/^\s*(?:–|—|--|,|:)\s*/, "")
    .replace(/\\([+!])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

const LOCATION_TERM = "(?:shibuya|shinjuku|shimokitazawa|koenji|hatagaya|jiyugaoka|jimbocho|jinbocho|asakusa|akihabara|ikebukuro|ikebukoro|kamata|nakameguro|daikanyama|harajuku|ebisu|ginza|tsukiji|ueno|yanaka|kappabashi|ishiwara|taihei|musashino|chofu|saitama|matsudo|chiba|(?:taito|tiato|katshushika|katsushika|setagaya|suginami|nakano|nerima|chiyoda|chuo|minato|bunkyo|toshima|itabashi|meguro|shinagawa|ota|sumida|koto|edogawa)(?: city| cuty)?)";
const TRAILING_LOCATION = new RegExp(`(?:\\s*,\\s*|\\s+[.!…]+\\s*|\\s{2,}|\\s+in\\s+)(?:${LOCATION_TERM})(?:\\s*,?\\s*${LOCATION_TERM})?\\s*$`, "i");
const TRAILING_CITY = new RegExp(`\\s+(?:${LOCATION_TERM.replace("|musashino", "|musashino city|musashino")})\\s*$`, "i");
const INLINE_LOCATION = new RegExp(`,\\s*(?:${LOCATION_TERM})(?:\\s*,?\\s*${LOCATION_TERM})?\\s*[–—-]\\s*`, "i");
const LOCATION_ONLY = new RegExp(`^(?:${LOCATION_TERM})(?:\\s*,?\\s*${LOCATION_TERM})?$`, "i");

export function stripLocationMetadata(note) {
  if (LOCATION_ONLY.test(note.trim())) return "";
  return note
    .replace(INLINE_LOCATION, " – ")
    .replace(TRAILING_LOCATION, "")
    .replace(TRAILING_CITY, "")
    .replace(/[,.]\s*$/, "")
    .trim();
}

function inferLocation(place) {
  const haystack = `${place.note} ${place.name}`;
  const areaRule = AREA_RULES.find(([pattern]) => pattern.test(place.note))
    ?? AREA_RULES.find(([pattern]) => pattern.test(place.name));
  let neighborhood = areaRule?.[1] ?? "";
  let ward = areaRule?.[2] ?? "";

  const wardRule = WARD_RULES.find(([pattern]) => pattern.test(place.note))
    ?? WARD_RULES.find(([pattern]) => pattern.test(place.name));
  if (wardRule) ward = wardRule[1];

  if (/\bsaitama\b/i.test(haystack)) return {neighborhood: "Saitama", ward: "", zone: "Beyond Tokyo"};
  if (/\bmatsudo\b|\bchiba\b/i.test(haystack)) return {neighborhood: "Matsudo", ward: "Chiba", zone: "Beyond Tokyo"};
  if (place.category === "Day trips from Tokyo") return {neighborhood: place.name, ward: "", zone: "Day trips"};

  return {
    neighborhood,
    ward,
    zone: ZONES.get(ward) ?? (neighborhood ? "Greater Tokyo" : "Area to confirm"),
  };
}

export function parsePlaces(markdown) {
  const places = [];
  let region = "Japan";
  let category = "Uncategorized";
  let parentPlace = null;

  for (const line of markdown.split("\n")) {
    const heading = line.match(/^\*\*(.+?)\*\*\s*$/)?.[1]?.replace(/:$/, "");
    if (heading) {
      if (heading === heading.toUpperCase()) region = heading;
      else category = heading;
      continue;
    }

    const parentItem = line.match(/^-\s+([^\s\[].*?):\s*(.*)$/);
    if (parentItem) {
      parentPlace = {
        id: `place-${places.length + 1}`,
        name: cleanText(parentItem[1]),
        url: "",
        note: cleanText(parentItem[2]),
        category,
        categoryGroup: CATEGORY_GROUPS.get(category) ?? category,
        region,
        children: [],
      };
      Object.assign(parentPlace, inferLocation(parentPlace));
      places.push(parentPlace);
      continue;
    }

    const item = line.match(/^\s*-\s+\[([^\]]+)]\((https:\/\/maps\.app\.goo\.gl\/[^)]+)\)\s*(.*)$/);
    if (!item) continue;
    const isChild = /^\s{2,}-\s+/.test(line) && parentPlace;
    const place = {
      id: isChild ? `${parentPlace.id}-child-${parentPlace.children.length + 1}` : `place-${places.length + 1}`,
      name: cleanText(item[1]),
      url: item[2],
      note: cleanText(item[3]),
      category,
      categoryGroup: CATEGORY_GROUPS.get(category) ?? category,
      region,
    };
    Object.assign(place, inferLocation(place));
    place.note = stripLocationMetadata(place.note);
    if (isChild) parentPlace.children.push(place);
    else {
      parentPlace = null;
      places.push(place);
    }
  }

  for (const neighborhood of places.filter((place) => place.category === "Neighborhoods")) {
    neighborhood.relatedPlaces = places.filter((place) =>
      place.id !== neighborhood.id &&
      place.category !== "Neighborhoods" &&
      place.neighborhood === neighborhood.neighborhood,
    );
  }

  return places;
}

function subPlaces(place) {
  return place.children?.length ? place.children : place.relatedPlaces ?? [];
}

const COLLECTIONS = {
  "Listening bars": [
    ["Listening bars", /.*/],
  ],
  Bars: [
    ["Cocktail & beer bars", /.*/],
  ],
  Queer: [
    ["Queer bars", /.*/],
  ],
  Kissaten: [
    ["Kissaten", /.*/],
  ],
  Coffee: [
    ["Coffee shops & cafés", /.*/],
  ],
  Venues: [
    ["Live venues", /.*/],
  ],
  Museums: [
    ["Museums", /.*/],
  ],
  Books: [
    ["Bookshops", /.*/],
  ],
  "Vintage (and normal) clothes": [
    ["Vintage & clothing", /.*/],
  ],
  "Flea markets": [
    ["Flea & antique markets", /.*/],
  ],
  Parks: [
    ["Parks & gardens", /.*/],
  ],
  "Shrines/Temples": [
    ["Shrines & temples", /.*/],
  ],
  Food: [
    ["Izakayas", /\bizakaya\b/i],
    ["Sushi & seafood", /sushi|sashimi|seafood|uogashi|uo kusa|donburi/i],
    ["Noodles", /ramen|udon|menmen|nakiryu/i],
    ["Drinks", /beer|cola/i],
    ["Cafés, sweets & bakeries", /\bcaf[eé]\b|coffee|sweet|bread|pastry|pudding|matcha/i],
    ["Markets & casual bites", /market|stall|croquette|onigiri|bento|cafeteria|haikara/i],
    ["Dining & other", /.*/],
  ],
  Shops: [
    ["Shopping streets & markets", /shopping street|\bmarket\b|Bonus Track/i],
    ["Fashion & beauty", /clothes|clothing|second.hand|vintage|glasses|cosmetic|hair|pyjama|loungewear|Blue Elephant|ReFa|JINS/i],
    ["Records, books & stationery", /record|book|stationery|Animate/i],
    ["Kitchen, ceramics & home", /kitchen|ceramic/i],
    ["Electronics, games & hobby", /electrical|electronic|game|comic|arcade|hobby|railway|Yodobashi|Sofmap|GiGO|Lashinbang/i],
    ["Specialty & department stores", /.*/],
  ],
};

export function groupCategoryPlaces(places) {
  const groupedIds = new Set();
  const collections = [];

  for (const [category, rules] of Object.entries(COLLECTIONS)) {
    const categoryPlaces = places.filter((place) => place.category === category);
    for (const [name, pattern] of rules) {
      const children = categoryPlaces.filter((place) =>
        !groupedIds.has(place.id) && pattern.test(`${place.name} ${place.note}`),
      );
      if (children.length === 0) continue;
      children.forEach((place) => groupedIds.add(place.id));
      collections.push({
        id: `collection-${category.toLocaleLowerCase()}-${collections.length + 1}`,
        name,
        note: `${children.length} saved ${children.length === 1 ? "place" : "places"}.`,
        url: "",
        category,
        categoryGroup: categoryPlaces[0]?.categoryGroup ?? category,
        region: "TOKYO",
        neighborhood: "",
        ward: "",
        zone: "Tokyo",
        children,
        isCollection: true,
      });
    }
  }

  return [...places.filter((place) => !groupedIds.has(place.id)), ...collections];
}

function searchable(place) {
  return [
    place.name,
    place.note,
    place.category,
    place.categoryGroup,
    place.neighborhood,
    place.ward,
    place.zone,
    ...subPlaces(place).flatMap((child) => [child.name, child.note, child.category]),
  ]
    .join(" ")
    .toLocaleLowerCase();
}

function filteredPlaces() {
  const query = state.query.toLocaleLowerCase();
  const visible = state.places.filter((place) =>
    (!query || searchable(place).includes(query)) &&
    (state.category === "All" || place.categoryGroup === state.category) &&
    (state.zone === "All areas" || place.zone === state.zone),
  );
  return state.groupBy === "category" ? groupCategoryPlaces(visible) : visible;
}

export function locationLabel(place) {
  if (place.isCollection) return `${place.children.length} places around Tokyo`;
  const ward = place.ward === `${place.neighborhood} City` ? "" : place.ward;
  return [place.neighborhood, ward].filter(Boolean).join(" · ") || "Tokyo area";
}

function renderFilterButtons(container, values, selected, onSelect) {
  container.replaceChildren(...values.map((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = value === selected ? "filter-chip active" : "filter-chip";
    button.setAttribute("aria-pressed", String(value === selected));
    button.textContent = value;
    button.addEventListener("click", () => onSelect(value));
    return button;
  }));
}

function renderFilters() {
  const categories = ["All", ...new Set(state.places.map((place) => place.categoryGroup))];
  const zones = ["All areas", ...new Set(state.places.map((place) => place.zone))];
  renderFilterButtons(document.querySelector("#category-filters"), categories, state.category, (value) => {
    state.category = value;
    render();
  });
  renderFilterButtons(document.querySelector("#area-filters"), zones, state.zone, (value) => {
    state.zone = value;
    render();
  });
}

function renderCard(place) {
  const children = subPlaces(place);
  const article = document.createElement("article");
  article.className = `place-card${children.length ? " has-sub-places" : ""}${children.length > 6 ? " is-scrollable" : ""}`;
  article.innerHTML = `
    <span class="place-category">${place.category}</span>
    <h3>${place.name}</h3>
    <p class="place-location"><i data-lucide="map-pin"></i>${locationLabel(place)}</p>
    ${place.note ? `<p class="place-note">${place.note}</p>` : ""}
    ${children.length ? `<div class="sub-place-list">${children.map((child) => `
      <a class="sub-place-card" href="${child.url}" target="_blank" rel="noreferrer">
        <span>
          <strong>${child.name}</strong>
          <small class="sub-place-location"><i data-lucide="map-pin"></i>${locationLabel(child)}</small>
          ${child.note ? `<small class="sub-place-note">${child.note}</small>` : ""}
        </span>
        <i data-lucide="arrow-up-right"></i>
      </a>
    `).join("")}</div>` : ""}
    ${place.url ? `<a class="card-map-link" href="${place.url}" target="_blank" rel="noreferrer">Open in Google Maps <i data-lucide="arrow-up-right"></i></a>` : ""}
  `;
  return article;
}

function groupLabel(place) {
  return state.groupBy === "area" ? place.zone : place.categoryGroup;
}

function renderPlaces() {
  const visible = filteredPlaces();
  const groups = new Map();
  for (const place of visible) {
    const label = groupLabel(place);
    groups.set(label, [...(groups.get(label) ?? []), place]);
  }
  const content = document.querySelector("#places");
  document.querySelector("#result-count").textContent = `${visible.length} of ${state.places.length} places`;
  content.replaceChildren();

  if (visible.length === 0) {
    const empty = document.querySelector("#empty-state").content.cloneNode(true);
    content.append(empty);
    return;
  }

  for (const [label, places] of groups) {
    const section = document.createElement("section");
    section.className = "place-group";
    const heading = document.createElement("div");
    heading.className = "group-heading";
    heading.innerHTML = `<h2>${label}</h2><span>${places.length}</span>`;
    const grid = document.createElement("div");
    grid.className = "place-grid";
    grid.append(...places.map(renderCard));
    section.append(heading, grid);
    content.append(section);
  }
  window.lucide?.createIcons();
}

function render() {
  renderFilters();
  renderPlaces();
}

async function initialize() {
  const response = await fetch("./japan.md", {cache: "no-store"});
  if (!response.ok) throw new Error(`Could not load japan.md (HTTP ${response.status})`);
  state.places = parsePlaces(await response.text());

  document.querySelector("#search").addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    renderPlaces();
  });
  document.querySelectorAll("[data-group-by]").forEach((button) => {
    button.addEventListener("click", () => {
      state.groupBy = button.dataset.groupBy;
      document.querySelectorAll("[data-group-by]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderPlaces();
    });
  });
  render();
}

if (typeof document !== "undefined") {
  initialize().catch((error) => {
    document.querySelector("#places").innerHTML = `<section class="load-error"><h2>The map could not be loaded</h2><p>${error.message}</p></section>`;
  });
}