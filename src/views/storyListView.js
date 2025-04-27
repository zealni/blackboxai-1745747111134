import Api from '../models/api.js';

export default class StoryListView {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.token = localStorage.getItem("token");
    this.userName = localStorage.getItem("userName");
    this.map = null;
    this.markers = [];
  }

  async render() {
    if (!this.token) {
      this.rootElement.innerHTML = `
        <section class="p-4 max-w-md mx-auto">
          <p class="text-center text-red-600">You must <a href="#login" class="text-blue-600 underline">login</a> to view stories.</p>
        </section>
      `;
      return;
    }

    this.rootElement.innerHTML = `
      <section class="p-4 max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Stories</h1>
        <p class="mb-4">Welcome, ${this.userName} | <a href="#" id="logout" class="text-red-600 underline">Logout</a> | <a href="#add" class="text-green-600 underline">Add New Story</a></p>
        <div id="story-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
        <h2 class="text-xl font-semibold mt-8 mb-2">Map</h2>
        <div id="map" aria-label="Story locations map"></div>
      </section>
    `;

    this.rootElement.querySelector("#logout").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.location.hash = "#login";
    });

    await this.loadStories();
  }

  async loadStories() {
    const storyListEl = this.rootElement.querySelector("#story-list");
    storyListEl.innerHTML = "Loading stories...";

    try {
      const data = await Api.getStories(this.token, 1, 20, 1);
      if (data.error) {
        storyListEl.innerHTML = '<p class="text-red-600">Failed to load stories.</p>';
        return;
      }

      if (!this.map) {
        this.initMap();
      }

      storyListEl.innerHTML = "";
      this.clearMarkers();

      data.listStory.forEach((story) => {
        const storyItem = document.createElement("article");
        storyItem.className = "border rounded p-4 shadow hover:shadow-lg transition cursor-pointer";
        storyItem.tabIndex = 0;
        storyItem.setAttribute("role", "button");
        storyItem.setAttribute("aria-label", `View story by ${story.name}`);
        storyItem.innerHTML = `
          <img src="${story.photoUrl}" alt="Photo of story by ${story.name}" class="w-full h-48 object-cover rounded mb-2" />
          <h3 class="text-lg font-semibold">${story.name}</h3>
          <p class="text-sm text-gray-600 mb-1">${new Date(story.createdAt).toLocaleString()}</p>
          <p class="mb-2">${story.description}</p>
        `;

        storyItem.addEventListener("click", () => {
          window.location.hash = `#story-${story.id}`;
        });
        storyItem.addEventListener("keypress", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            window.location.hash = `#story-${story.id}`;
          }
        });

        storyListEl.appendChild(storyItem);

        if (story.lat !== null && story.lon !== null) {
          const marker = L.marker([story.lat, story.lon]).addTo(this.map);
          marker.bindPopup(`<b>${story.name}</b><br />${story.description}`);
          this.markers.push(marker);
        }
      });
    } catch (error) {
      storyListEl.innerHTML = '<p class="text-red-600">Error loading stories.</p>';
    }
  }

  initMap() {
    this.map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }
}
