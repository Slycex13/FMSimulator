const GREEN_HIGHLIGHT = "bg-green-300";
const RED_HIGHLIGHT = "bg-red-300";

let itemsPanel = document.getElementById("items-select-panel");
let itemsList = document.getElementById("items-list");
let closePanelButton = document.getElementById("close-panel-button");
let openPanelButton = document.getElementById("item-selector");
let itemName = document.getElementById("item-name");
let itemDisplay = document.getElementById("item-display");
let itemWeight = document.getElementById("item-weight");
let itemMinStat = document.getElementById("min-stat");
let itemMaxStat = document.getElementById("max-stat");
let itemStats = document.getElementById("item-stats");

let dataParsed;
let itemSelect;

//Récupération des données (Items) sur le serveur
async function fetchData() {
  const response = await fetch("http://localhost:3000/");
  const data = await response.json();
  dataParsed = data;
}

//MAIN
await fetchData();
await randomizeActualWeight();

//Génère des valeurs aléatoire au items
async function randomizeActualWeight() {
  dataParsed.forEach((item) => {
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

function updateWeight(item) {
  item.actualWeight = 0;
  for (const stat in item.stats) {
    item.actualWeight += item.stats[stat].actualValue;
  }
  itemWeight.textContent = `Poids : ${item.actualWeight} / ${item.maxWeight}`;
}

//Charge la liste des items
function LoadAllItems() {
  itemsList.innerHTML = "";

  if (itemsPanel.classList.contains("block")) {
    dataParsed.forEach((items) => {
      let item = document.createElement("div");
      item.textContent = items.name + " .niv " + items.level;
      item.id = `item-${items.id}`;
      item.classList = "border-b-1 p-2 hover:bg-amber-400 cursor-pointer";
      item.addEventListener("click", () => {
        displayItem(items);
      });
      itemsList.appendChild(item);
    });
  }
}

openPanelButton.addEventListener("click", async () => {
  const display = document.querySelector("main");
  display.style.display = "none";
  itemsPanel.classList.toggle("hidden");

  if (!itemsPanel.classList.contains("hidden")) {
    LoadAllItems();
  }
});

closePanelButton.addEventListener("click", () => {
  itemsPanel.classList.toggle("hidden");
  itemsList.innerHTML = "";
  const display = document.querySelector("main");
  display.style.display = "";
});

//Affiche l'item sélectionné
function displayItem(item) {
  itemStats.innerHTML = "";
  itemsPanel.classList.toggle("hidden");
  console.log("Item sélectionné:", item);
  const display = document.querySelector("main");
  display.style.display = "";

  itemName.textContent = item.name + " .Niv " + item.level;

  itemName.classList.remove("hidden");
  itemDisplay.classList.remove("hidden");

  item.actualWeight = 0;
  item.maxWeight = 0;
  let actualValueIndex = 0;

  for (const stat in item.stats) {
    let itemStatsLine = document.createElement("div");
    itemStatsLine.classList = "grid grid-cols-5";

    let itemStatsValue = [
      stat,
      item.stats[stat].minValue,
      item.stats[stat].maxValue,
      item.stats[stat].actualValue,
    ];

    item.actualWeight += item.stats[stat].actualValue;
    item.maxWeight += item.stats[stat].maxValue;

    itemStatsValue.forEach((element, index) => {
      let itemStat = document.createElement("p");
      itemStat.textContent = element;
      itemStatsLine.appendChild(itemStat);
      if (index === 3) {
        itemStat.id = `actualValue-${actualValueIndex}`;
      }
    });
    increaseButton(itemStatsLine, actualValueIndex, stat, item);
    itemStats.appendChild(itemStatsLine);
    actualValueIndex++;
    itemWeight.textContent = `Poids : ${item.actualWeight} / ${item.maxWeight}`;
  }
}

//Ajoute le bouton d'augmentation à la ligne associé
function increaseButton(curentLine, index, stat, item) {
  let increaseStatButton = document.createElement("button");
  increaseStatButton.textContent = "+1";
  increaseStatButton.className =
    "flex justify-center items-center rounded-md cursor-pointer border-1 hover:bg-amber-400 transition duration-500 ease-in-out h-[24px] my-1 w-10";
  increaseStatButton.id = index;
  curentLine.appendChild(increaseStatButton);
  increaseStatButton.addEventListener("click", () => {
    changeStat(item, stat, curentLine, index);
  });
}

function highlightLine(line, color) {
  line.classList.add(color);
  setTimeout(() => {
    line.classList.remove(color);
  }, 500);
}

function exoItem(item) {
  let itemStatsLine = document.createElement("div");
  itemStatsLine.classList = "grid grid-cols-5";
  itemStats.appendChild(itemStatsLine);
}

function changeStat(item, stat, curentLine, index) {
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

  let otherStats = Object.keys(item.stats).filter((s) => s !== stat);
  let randomStat = otherStats[Math.floor(Math.random() * otherStats.length)];
  let randomStatIndex = Object.keys(item.stats).indexOf(randomStat);
  let randomStatElement = document.getElementById(
    `actualValue-${randomStatIndex}`
  );
  let randomStatLine = document.querySelector(
    `#actualValue-${randomStatIndex}`
  ).parentElement;

  let criticalChance = tier.critical;
  let neutralChance = tier.neutral;
  let chance = Math.random();

  if (chance <= criticalChance) {
    item.stats[stat].actualValue += 1;
    console.log("Succès critique");
    highlightLine(curentLine, GREEN_HIGHLIGHT);
  } else if (chance < criticalChance + neutralChance) {
    console.log("Succès neutre");
    item.stats[stat].actualValue += 1;
    if (item.stats[randomStat].actualValue > 0) {
      item.stats[randomStat].actualValue -= 1;
    }

    if (randomStatElement) {
      randomStatElement.textContent = item.stats[randomStat].actualValue;
    }

    highlightLine(curentLine, GREEN_HIGHLIGHT);

    highlightLine(randomStatLine, RED_HIGHLIGHT);
  } else {
    console.log("Echec");

    if (item.stats[randomStat].actualValue > 0) {
      item.stats[randomStat].actualValue -= 1;
    }
    highlightLine(randomStatLine, RED_HIGHLIGHT);
  }

  updateWeight(item);
  const actualValueElement = document.getElementById(`actualValue-${index}`);
  actualValueElement.textContent = item.stats[stat].actualValue;
}
