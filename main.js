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

let actualWeight = 0;
let maxWeight = 0;
let itemSelect;

// Récupération du json sur le serveur
let dataParsed;

async function fetchData() {
  const response = await fetch("http://localhost:3000/");
  const data = await response.json();
  dataParsed = data;
}

//Attend d'avoir récupérer et stocker les valeurs dans dataParsed
await fetchData();

//Randomize le jet actuel de l'item
function randomizeActualWeight() {
  dataParsed.forEach((item) => {
    for (const stat in item.stats) {
      let min = item.stats[stat].minValue;
      let max = item.stats[stat].maxValue;
      let minVal = Math.ceil(min);
      let maxVal = Math.floor(max);
      item.stats[stat].actualValue =
        Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
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
        const interf = document.querySelector("main");
        interf.style.opacity = 1;

        itemName.textContent = item.name + " .Niv " + item.level;
        itemWeight.textContent = "";
        effectsDisplay.textContent = "";
        itemMinStat.textContent = "";
        itemMaxStat.textContent = "";
        itemStats.textContent = "";
        increaseButton.textContent = "";
        itemName.classList.remove("hidden");
        itemDisplay.classList.remove("hidden");
        actualWeight = 0;
        maxWeight = 0;

        for (const stat in item.stats) {
          const effect = stat;
          const min = item.stats[stat].minValue;
          const max = item.stats[stat].maxValue;
          const actualValue = item.stats[stat].actualValue;
          actualWeight += actualValue;
          maxWeight += max;

          effectsDisplay.innerHTML += `<p>${effect}</p>`;
          itemMinStat.innerHTML += `<p>${min}</p>`;
          itemMaxStat.innerHTML += `<p>${max}</p>`;
          itemStats.innerHTML += `<p>${actualValue}</p>`;
          increaseStat(item.id);
        }

        itemWeight.innerHTML += `Poids : ${actualWeight} / ${maxWeight}`;
      });

      itemsList.appendChild(itemList);
    });
  }
}

closePanel.addEventListener("click", () => {
  itemsPanel.classList.add("hidden");
  itemsPanel.classList.remove("block");
  const interf = document.querySelector("main");
  interf.style.opacity = 1;
});

itemsButton.addEventListener("click", async () => {
  const interf = document.querySelector("main");
  interf.style.opacity = 0.5;
  itemsPanel.classList.remove("hidden");
  itemsPanel.classList.add("block");

  if (itemsPanel.classList.contains("block")) {
    displayItem();
  }
});

function increaseStat(index) {
  let increaseStat = document.createElement("p");
  increaseStat.textContent = "+1";
  increaseStat.className =
    "flex justify-center items-center rounded-md cursor-pointer border-1 hover:bg-amber-400 transition duration-500 ease-in-out h-[24px] my-1 w-10";
  increaseStat.setAttribute("btn-index", index);
  increaseButton.appendChild(increaseStat);
}

increaseButton.addEventListener("click", () => {
  changeItemStat(itemSelect);
});

function highlightLine(index, color) {
  let lines = document.querySelectorAll(`[line-index="${index}"]`);

  lines.forEach((line) => {
    line.classList.add(color);
    setTimeout(() => {
      line.classList.remove(color);
    }, 500);
  });
}

function changeItemStat(item) {
  for (const stat in item.stats) {
    item.stats[stat].actualValue += 1;
    console.log(item);
  }
}
/*const tiers = [
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

  if (chance <= criticalChance) {
    item.stats[0] += 1;
    refreshDisplay(item, index);
    highlightLine(index, GREEN_HIGHLIGHT);
    console.log("Succès critique");
  }
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
}*/
