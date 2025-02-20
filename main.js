const GREEN_HIGHLIGHT = "bg-green-300";
const RED_HIGHLIGHT = "bg-red-300";

let itemsPanel = document.getElementById("items-select-panel");
let itemsList = document.getElementById("items-list");
let closePanel = document.getElementById("close-panel-button");
let itemsButton = document.getElementById("item-selector");
let itemName = document.getElementById("item-name");
let itemDisplay = document.getElementById("item-display");
let itemWeight = document.getElementById("item-weight");
let itemMinStat = document.getElementById("min-stat");
let itemMaxStat = document.getElementById("max-stat");
let itemStats = document.getElementById("item-stats");
let effectsDisplay = document.getElementById("effects");
let increaseButton = document.getElementById("increase");

let dataParsed;
let itemSelect;

async function fetchData() {
  const response = await fetch("http://localhost:3000/");
  const data = await response.json();
  dataParsed = data;
}

await fetchData();

function randomizeActualWeight() {
  dataParsed.forEach((item) => {
    item.actualWeight = 0; // Initialize actualWeight for each item
    item.maxWeight = 0; // Initialize maxWeight for each item
    for (const stat in item.stats) {
      let min = item.stats[stat].minValue;
      let max = item.stats[stat].maxValue;
      let minVal = Math.ceil(min);
      let maxVal = Math.floor(max);
      item.stats[stat].actualValue =
        Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      item.actualWeight += item.stats[stat].actualValue; // Accumulate actualWeight
      item.maxWeight += max; // Accumulate maxWeight
    }
  });
}

randomizeActualWeight();

function displayItem() {
  itemsList.innerHTML = "";

  if (itemsPanel.classList.contains("block")) {
    dataParsed.forEach((item) => {
      let itemList = document.createElement("div");
      itemList.textContent = item.name + " .niv " + item.level;
      itemList.id = `item-${item.id}`;
      itemList.classList = "border-b-1 p-2 hover:bg-amber-400 cursor-pointer";

      itemList.addEventListener("click", () => {
        itemsPanel.classList.add("hidden");
        itemSelect = item;

        console.log("Item sélectionné:", item);
        const display = document.querySelector("main");
        display.style.display = "";

        itemName.textContent = item.name + " .Niv " + item.level;
        itemWeight.textContent = "";
        effectsDisplay.textContent = "";
        itemMinStat.textContent = "";
        itemMaxStat.textContent = "";
        itemStats.textContent = "";
        increaseButton.textContent = "";
        itemName.classList.remove("hidden");
        itemDisplay.classList.remove("hidden");

        effectsDisplay.innerHTML = "";
        itemMinStat.innerHTML = "";
        itemMaxStat.innerHTML = "";
        itemStats.innerHTML = "";

        item.actualWeight = 0;
        item.maxWeight = 0;
        for (const stat in item.stats) {
          const effect = stat;
          const min = item.stats[stat].minValue;
          const max = item.stats[stat].maxValue;
          const actualValue = item.stats[stat].actualValue;
          item.actualWeight += actualValue;
          item.maxWeight += max;

          effectsDisplay.innerHTML += `<p class="my-1">${effect}</p>`;
          itemMinStat.innerHTML += `<p class="my-1">${min}</p>`;
          itemMaxStat.innerHTML += `<p class="my-1">${max}</p>`;
          itemStats.innerHTML += `<p class="my-1">${actualValue}</p>`;
        }

        itemWeight.textContent = `Poids : ${item.actualWeight} / ${item.maxWeight}`;
        increaseStat(item.id);
      });

      itemsList.appendChild(itemList);
    });
  }
}

closePanel.addEventListener("click", () => {
  itemsPanel.classList.add("hidden");
  itemsPanel.classList.remove("block");
  const display = document.querySelector("main");
  display.style.display = "";
});

itemsButton.addEventListener("click", async () => {
  const display = document.querySelector("main");
  display.style.display = "none";
  itemsPanel.classList.remove("hidden");
  itemsPanel.classList.add("block");

  if (itemsPanel.classList.contains("block")) {
    displayItem();
  }
});

function increaseStat(itemId) {
  increaseButton.innerHTML = ""; // Clear previous buttons
  const item = dataParsed.find((it) => it.id === itemId);
  if (!item) return; // Handle item not found

  let statIndex = 0;
  for (const stat in item.stats) {
    let increaseStatButton = document.createElement("p");
    increaseStatButton.textContent = "+1";
    increaseStatButton.className =
      "flex justify-center items-center rounded-md cursor-pointer border-1 hover:bg-amber-400 transition duration-500 ease-in-out h-[24px] my-1 w-10";
    increaseStatButton.dataset.statIndex = statIndex; // Store index as data attribute
    increaseStatButton.dataset.itemId = itemId; // Store itemId as data attribute
    increaseButton.appendChild(increaseStatButton);
    statIndex++;
  }
}

increaseButton.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    // Check if a button was clicked
    const statIndex = parseInt(event.target.dataset.statIndex);
    const itemId = parseInt(event.target.dataset.itemId);
    const item = dataParsed.find((it) => it.id === itemId);
    changeItemStat(item, statIndex);
  }
});

function highlightLine(index, color) {
  let lines = document.querySelectorAll(
    `#item-stats p:nth-child(${index + 1})`
  ); // More specific selector

  lines.forEach((line) => {
    line.classList.add(color);
    setTimeout(() => {
      line.classList.remove(color);
    }, 500);
  });
}

function changeItemStat(item, statIndex) {
  if (!item || statIndex < 0) return;

  const tiers = [
    { weight: item.maxWeight * 0.2, critical: 0.5, neutral: 0.4 },
    { weight: item.maxWeight * 0.5, critical: 0.4, neutral: 0.5 },
    { weight: item.maxWeight * 0.7, critical: 0.3, neutral: 0.6 },
    { weight: item.maxWeight * 1, critical: 0.2, neutral: 0.7 },
    { weight: Infinity, critical: 0.1, neutral: 0.8 },
  ];

  let tier = tiers.find((t) => item.actualWeight <= t.weight);

  if (!tier) {
    console.error("Aucun tier trouvé pour le poids actuel.");
    return;
  }

  let criticalChance = tier.critical;
  let neutralChance = tier.neutral;

  let chance = Math.random();

  let currentStatIndex = 0;
  for (const stat in item.stats) {
    if (currentStatIndex === statIndex) {
      if (chance <= criticalChance) {
        item.stats[stat].actualValue += 1;
        console.log("Succès critique");
        highlightLine(statIndex, GREEN_HIGHLIGHT); // Utilise statIndex ici
      } else if (chance < criticalChance + neutralChance) {
        console.log("Succès neutre");
        highlightLine(statIndex, GREEN_HIGHLIGHT); // Utilise statIndex ici
      } else {
        console.log("Échec");
        highlightLine(statIndex, RED_HIGHLIGHT); // Utilise statIndex ici
        // Ici, tu peux ajouter la logique pour l'échec (réduction d'une autre stat, etc.)
      }
      break; // Important : arrête la boucle après avoir trouvé la bonne stat
    }
    currentStatIndex++;
  }
}
