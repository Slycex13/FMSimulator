import items from "./items.json" assert { type: "json" };

const GREEN_HIGHLIGHT = "bg-green-300";
const RED_HIGHLIGHT = "bg-red-300";

let itemsList = document.getElementById("items-list");
let itemName = document.getElementById("item-name");
let itemWeight = document.getElementById("item-weight");
let itemMinStat = document.getElementById("min-stat");
let itemMaxStat = document.getElementById("max-stat");
let itemStats = document.getElementById("item-stats");
let effectsDisplay = document.getElementById("effects");
let increaseButton = document.getElementById("increase");
let effects = ["inteligence", "force", "agilité", "sagesse", "chance"];

function ItemTemplate(name, level, minEffects, maxEffects) {
  this.name = name;
  this.level = level;
  this.minEffects = minEffects;
  this.maxEffects = maxEffects;
  this.effects = this.randomizeEffects(minEffects, maxEffects);
}

ItemTemplate.prototype.randomizeEffects = function (minEffects, maxEffects) {
  return minEffects.map((min, index) => {
    let max = maxEffects[index];
    let minVal = Math.ceil(min);
    let maxVal = Math.floor(max);
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  });
};

const itemsParse = items.items;

itemsParse.forEach((item) => {
  let itemList = document.createElement("div");
  itemList.textContent = item.name + " .niv " + item.level + " ";

  itemsList.appendChild(itemList);
});

let item1 = new ItemTemplate(
  "Chapeau de l'aventurier",
  11,
  [1, 1, 1, 1, 1],
  [10, 10, 10, 10, 10]
);

itemName.textContent = item1.name + " " + "(niveau " + item1.level + ")";
itemWeight.textContent =
  "Poids : " + getActualWeight(item1) + "/" + getMaxWeight(item1);

function DisplayEffects(index) {
  let effectElement = document.createElement("div");
  effectElement.textContent = effects[index];
  effectElement.id = index;
  effectElement.className = "my-1";
  effectElement.setAttribute("line-index", index);
  effectsDisplay.appendChild(effectElement);
}

function DisplayMinStat(item, index) {
  let minStat = document.createElement("div");
  minStat.textContent = item.minEffects[index];
  minStat.id = index;
  minStat.className = "my-1";
  minStat.setAttribute("line-index", index);

  itemMinStat.appendChild(minStat);
}

function DisplayMaxStat(item, index) {
  let maxStat = document.createElement("div");
  maxStat.textContent = item.maxEffects[index];
  maxStat.className = "my-1";
  maxStat.id = index;
  maxStat.setAttribute("line-index", index);

  itemMaxStat.appendChild(maxStat);
}

function DisplayStats(item, index) {
  let itemStat = document.createElement("div");
  itemStat.textContent = item.effects[index];
  itemStat.className = "my-1";
  itemStat.id = index;
  itemStat.setAttribute("stat-index", index);
  itemStat.setAttribute("line-index", index);
  itemStats.appendChild(itemStat);
}

function increaseStat(index) {
  let increaseStat = document.createElement("div");
  increaseStat.textContent = "+1";
  increaseStat.className =
    "flex justify-center items-center rounded-md cursor-pointer border-1 hover:bg-amber-400 transition duration-500 ease-in-out h-[24px] my-1 w-10";
  increaseStat.setAttribute("btn-index", index);
  increaseButton.appendChild(increaseStat);
}

function loadItem(item) {
  itemMinStat.innerHTML = "";
  itemMaxStat.innerHTML = "";
  itemStats.innerHTML = "";
  effectsDisplay.innerHTML = "";
  increaseButton.innerHTML = "";

  for (let i = 0; i < item.effects.length; i++) {
    DisplayEffects(i);
    DisplayMinStat(item, i);
    DisplayMaxStat(item, i);
    DisplayStats(item, i);
    increaseStat(i);
  }
}

loadItem(item1);

increaseButton.addEventListener("click", (event) => {
  if (event.target && event.target.matches("div[btn-index]")) {
    let index = event.target.getAttribute("btn-index");
    changeItemStat(item1, index);
  }
});

function refreshDisplay(item, index) {
  let itemStat = document.querySelector(`[stat-index="${index}"]`);
  itemStat.textContent = item.effects[index];
}

function highlightLine(index, color) {
  let lines = document.querySelectorAll(`[line-index="${index}"]`);

  lines.forEach((line) => {
    line.classList.add(color);
    setTimeout(() => {
      line.classList.remove(color);
    }, 500);
  });
}

function getActualWeight(item) {
  let totalWeight = 0;

  item.effects.forEach((effect, index) => {
    totalWeight += effect;
  });
  return totalWeight;
}

function getMaxWeight(item) {
  let totalWeight = 0;

  item.maxEffects.forEach((effect, index) => {
    totalWeight += effect;
  });
  return totalWeight;
}

function changeItemStat(item, index) {
  let actualWeight = getActualWeight(item);
  let maxWeight = getMaxWeight(item);

  const tiers = [
    { weight: maxWeight * 0.2, critical: 0.5, neutral: 0.4 },
    { weight: maxWeight * 0.5, critical: 0.4, neutral: 0.5 },
    { weight: maxWeight * 0.7, critical: 0.3, neutral: 0.6 },
    { weight: maxWeight * 1, critical: 0.2, neutral: 0.7 },
    { weight: Infinity, critical: 0.1, neutral: 0.8 },
  ];

  let tier = tiers.find((t) => actualWeight <= t.weight);

  let criticalChance = tier.critical;
  let neutralChance = tier.neutral;

  let chance = Math.random();

  if (
    chance <= criticalChance &&
    item.effects[index] < item.maxEffects[index] * 2
  ) {
    item.effects[index] += 1;
    refreshDisplay(item, index);
    highlightLine(index, GREEN_HIGHLIGHT);
    console.log("Succès critique");
  } else if (
    chance > criticalChance &&
    chance < criticalChance + neutralChance
  ) {
    if (item.effects[index] < item.maxEffects[index] * 2) {
      item.effects[index] += 1;
      refreshDisplay(item, index);
      highlightLine(index, GREEN_HIGHLIGHT);
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * item.effects.length);
    } while (randomIndex === index);

    if (item.effects[randomIndex] > 0) {
      item.effects[randomIndex] = Math.max(item.effects[randomIndex] - 1, 0);
      refreshDisplay(item, randomIndex);
      highlightLine(randomIndex, RED_HIGHLIGHT);
    }

    console.log("Succès neutre");
  } else {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * item.effects.length);
    } while (randomIndex === index);

    if (item.effects[randomIndex] > 0) {
      item.effects[randomIndex] = Math.max(item.effects[randomIndex] - 1, 0);
      refreshDisplay(item, randomIndex);
      highlightLine(randomIndex, RED_HIGHLIGHT);
    }

    console.log("Echec");
  }

  itemWeight.textContent =
    "Poids : " + getActualWeight(item1) + "/" + getMaxWeight(item1);
}
