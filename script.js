// ============================================
//   D&D Sheet Hub — Create Character Script
// ============================================

const abilities = [
  { id: "str", label: "STR", name: "Strength" },
  { id: "dex", label: "DEX", name: "Dexterity" },
  { id: "con", label: "CON", name: "Constitution" },
  { id: "int", label: "INT", name: "Intelligence" },
  { id: "wis", label: "WIS", name: "Wisdom" },
  { id: "cha", label: "CHA", name: "Charisma" },
];

// Build ability score cards dynamically
const abilityGrid = document.getElementById("abilityGrid");

abilities.forEach((ab) => {
  const card = document.createElement("div");
  card.className = "ability-card";
  card.innerHTML = `
    <span class="ability-name">${ab.label}</span>
    <input
      class="ability-input"
      type="number"
      min="1"
      max="20"
      value="10"
      id="${ab.id}"
      name="${ab.id}"
      aria-label="${ab.name}"
    />
    <span class="ability-mod" id="${ab.id}-mod">+0</span>
  `;
  abilityGrid.appendChild(card);

  const input = card.querySelector("input");
  const modEl = card.querySelector(".ability-mod");

  const updateMod = () => {
    const val = Math.max(1, Math.min(20, parseInt(input.value) || 10));
    const mod = Math.floor((val - 10) / 2);
    modEl.textContent = (mod >= 0 ? "+" : "") + mod;
  };

  input.addEventListener("input", updateMod);
  updateMod();
});

// Image preview
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const previewWrap = document.getElementById("previewWrap");
const dropIcon = document.getElementById("dropIcon");
const dropText = document.getElementById("dropText");

let imageDataUrl = "";

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) {
    imageDataUrl = "";
    previewWrap.style.display = "none";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    imageDataUrl = String(reader.result || "");
    imagePreview.src = imageDataUrl;
    previewWrap.style.display = "block";
    dropIcon.style.display = "none";
    dropText.style.display = "none";
  };
  reader.readAsDataURL(file);
});

// Save character
const form = document.getElementById("characterForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    level: Number(form.level.value),
    class: form.class.value,
    race: form.race.value,
    background: form.background.value,
    stats: {
      str: Number(form.str.value),
      dex: Number(form.dex.value),
      con: Number(form.con.value),
      int: Number(form.int.value),
      wis: Number(form.wis.value),
      cha: Number(form.cha.value),
    },
    notes: form.notes.value.trim(),
    image: imageDataUrl,
    updatedAt: new Date().toISOString(),
  };

  if (!data.name || !data.class || !data.race) {
    statusMsg.textContent = "Please fill in name, class, and race.";
    statusMsg.style.color = "#c94a4a";
    return;
  }

  localStorage.setItem("dnd_character", JSON.stringify(data));
  statusMsg.style.color = "#c9a45a";
  statusMsg.textContent =
    "Character inscribed ✦ Head to Character Sheet to view your hero.";
});

// Clear form
const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  form.reset();
  imageDataUrl = "";
  imagePreview.src = "";
  previewWrap.style.display = "none";
  dropIcon.style.display = "";
  dropText.style.display = "";

  // Reset ability modifiers
  abilities.forEach((ab) => {
    const modEl = document.getElementById(`${ab.id}-mod`);
    if (modEl) modEl.textContent = "+0";
  });

  statusMsg.style.color = "#7a6a50";
  statusMsg.textContent = "Scroll cleared.";
});
