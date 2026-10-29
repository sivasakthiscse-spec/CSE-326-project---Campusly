// Replace this sample array with the shared event service when the team integrates modules.
const events = [
  { id: "evt-001", title: "Design your first brand", category: "Workshop", date: "2026-11-05T15:30:00", venue: "Innovation Lab · Block C", eligibility: "Open to all students", capacity: 40, registered: 28, description: "A hands-on creative session on turning a good idea into a visual identity. Bring your laptop and leave with a brand board you made yourself.", symbol: "✳", theme: "purple", duration: "2 hours" },
  { id: "evt-002", title: "The future of clean energy", category: "Talk", date: "2026-11-07T11:00:00", venue: "Main Auditorium", eligibility: "Open to all students", capacity: 180, registered: 94, description: "Hear from a new generation of engineers building practical climate solutions, followed by an open Q&A with the speakers.", symbol: "☼", theme: "peach", duration: "1 hour" },
  { id: "evt-003", title: "Open mic on the lawn", category: "Social", date: "2026-11-09T17:00:00", venue: "East Lawn", eligibility: "Open to all students", capacity: 75, registered: 69, description: "A relaxed evening of songs, stories, and stand-up under the open sky. Come to perform or just cheer your friends on.", symbol: "♫", theme: "mint", duration: "2.5 hours" },
  { id: "evt-004", title: "Build sprint: tiny solutions", category: "Competition", date: "2026-11-12T09:00:00", venue: "Tech Hub · Floor 2", eligibility: "Teams of 2–4 students", capacity: 48, registered: 48, description: "A one-day team challenge to build a small, useful solution for campus life. Mentors, snacks, and judging are included.", symbol: "⌘", theme: "yellow", duration: "6 hours" },
  { id: "evt-005", title: "Make a film in one afternoon", category: "Workshop", date: "2026-11-15T13:00:00", venue: "Media Studio", eligibility: "Open to all students", capacity: 24, registered: 9, description: "Learn the basics of storyboarding, shooting, and editing a short film using the gear already in your pocket.", symbol: "▶", theme: "blue", duration: "3 hours" },
  { id: "evt-006", title: "Culture club: food & stories", category: "Social", date: "2026-11-18T16:30:00", venue: "Student Commons", eligibility: "Open to all students", capacity: 60, registered: 17, description: "Share a favorite snack, a family recipe, or a story from home. A welcoming afternoon for meeting people across campus.", symbol: "✿", theme: "rose", duration: "2 hours" }
];

const grid = document.querySelector("#event-grid");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");
const dialog = document.querySelector("#event-dialog");
const toast = document.querySelector("#toast");
let activeCategory = "All";
let selectedEvent = null;
let toastTimer;

const dateParts = (date) => {
  const parsed = new Date(date);
  return {
    day: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(parsed),
    month: new Intl.DateTimeFormat("en", { month: "short" }).format(parsed).toUpperCase(),
    full: new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(parsed),
    time: new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(parsed)
  };
};

const seatsFor = (event) => Math.max(0, event.capacity - event.registered);

function availability(event) {
  const seats = seatsFor(event);
  if (seats === 0) return { text: "Fully booked", className: "full" };
  if (seats <= Math.ceil(event.capacity * 0.2)) return { text: `${seats} spots left`, className: "low" };
  return { text: `${seats} spots left`, className: "" };
}

function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = events
    .filter((event) => activeCategory === "All" || event.category === activeCategory)
    .filter((event) => `${event.title} ${event.category} ${event.venue} ${event.description}`.toLowerCase().includes(query))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  document.querySelector("#all-count").textContent = events.length;
  resultsCount.textContent = `Showing ${filtered.length} of ${events.length} events`;
  emptyState.hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
  grid.innerHTML = filtered.map((event) => {
    const date = dateParts(event.date);
    const spots = availability(event);
    return `<article class="event-card" data-event-id="${event.id}" tabindex="0" aria-label="View ${event.title} details">
      <div class="card-art ${event.theme}"><span class="event-category">${event.category}</span><span class="event-date-badge"><strong>${date.day}</strong><span>${date.month}</span></span><span class="event-symbol" aria-hidden="true">${event.symbol}</span></div>
      <div class="card-body"><div class="card-meta"><span>◷ &nbsp;${date.time}</span><span>⌖ &nbsp;${event.venue.split(" · ")[0]}</span></div><h3 class="card-title">${event.title}</h3><p class="card-description">${event.description}</p><div class="card-footer"><span class="seat-label ${spots.className}"><strong>${spots.text}</strong></span><span class="card-arrow" aria-hidden="true">↗</span></div></div>
    </article>`;
  }).join("");
}

function openEvent(eventId) {
  selectedEvent = events.find((event) => event.id === eventId);
  if (!selectedEvent) return;
  const date = dateParts(selectedEvent.date);
  const spots = availability(selectedEvent);
  const art = document.querySelector("#dialog-art");
  art.className = `dialog-art ${selectedEvent.theme}`;
  document.querySelector("#dialog-category").textContent = selectedEvent.category;
  document.querySelector("#dialog-symbol").textContent = selectedEvent.symbol;
  document.querySelector("#dialog-date").textContent = `${date.full} · ${date.time}`;
  document.querySelector("#dialog-title").textContent = selectedEvent.title;
  document.querySelector("#dialog-description").textContent = selectedEvent.description;
  document.querySelector("#dialog-when").textContent = `${date.full}, ${date.time} (${selectedEvent.duration})`;
  document.querySelector("#dialog-where").textContent = selectedEvent.venue;
  document.querySelector("#dialog-eligibility").textContent = selectedEvent.eligibility;
  const seatLabel = document.querySelector("#dialog-seats");
  seatLabel.textContent = spots.text;
  seatLabel.className = `seats-indicator ${spots.className}`;
  document.querySelector("#register-button").disabled = seatsFor(selectedEvent) === 0;
  document.querySelector("#integration-hint").textContent = seatsFor(selectedEvent) === 0
    ? "This event has reached its registration limit."
    : "Registration will connect to the team registration module.";
  dialog.showModal();
}

document.querySelector("#event-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-event-id]");
  if (card) openEvent(card.dataset.eventId);
});
document.querySelector("#event-grid").addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-event-id]")) {
    event.preventDefault();
    openEvent(event.target.dataset.eventId);
  }
});
searchInput.addEventListener("input", renderEvents);
document.querySelector(".category-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  renderEvents();
});
document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "All";
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.category === "All"));
  renderEvents();
  searchInput.focus();
});
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#register-button").addEventListener("click", () => {
  if (!selectedEvent || seatsFor(selectedEvent) === 0) return;
  // Integration contract: pass selectedEvent.id to the registration module.
  document.dispatchEvent(new CustomEvent("event-registration-request", { detail: { eventId: selectedEvent.id } }));
  toast.textContent = `Ready to register for “${selectedEvent.title}”. Connect the registration module to continue.`;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
});

renderEvents();
