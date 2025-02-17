let itemName = document.getElementById("item-name");
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

let item1 = new ItemTemplate(
  "Chapeau de l'aventurier",
  11,
  [1, 1, 1, 1, 1],
  [10, 10, 10, 10, 10]
);

itemName.textContent = item1.name + " " + "(niveau " + item1.level + ")";

function DisplayEffects(index) {
  let effectElement = document.createElement("div");
  effectElement.textContent = effects[index];
  effectElement.id = index;
  effectElement.setAttribute("line-index", index);
  effectsDisplay.appendChild(effectElement);
}

function DisplayMinStat(item, index) {
  let minStat = document.createElement("div");
  minStat.textContent = item.minEffects[index];
  minStat.id = index;
  minStat.setAttribute("line-index", index);

  itemMinStat.appendChild(minStat);
}

function DisplayMaxStat(item, index) {
  let maxStat = document.createElement("div");
  maxStat.textContent = item.maxEffects[index];
  maxStat.id = index;
  maxStat.setAttribute("line-index", index);

  itemMaxStat.appendChild(maxStat);
}

function DisplayStats(item, index) {
  let itemStat = document.createElement("div");
  itemStat.textContent = item.effects[index];
  itemStat.id = index;
  itemStat.setAttribute("stat-index", index);
  itemStat.setAttribute("line-index", index);
  itemStats.appendChild(itemStat);
}

function increaseStat(index) {
  let increaseStat = document.createElement("div");
  increaseStat.textContent = "+1";
  increaseStat.className =
    "border-1 flex justify-center items-center rounded-md w-10 cursor-pointer";
  increaseStat.setAttribute("btn-index", index);
  increaseButton.appendChild(increaseStat);
}

function loadItem(item) {
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

function changeItemStat(item, index) {
  let chance = Math.floor(Math.random() * 100);
  let attempts = 0; // Compteur de tentatives

  if (effects.length > 1) {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * effects.length);
      attempts++;

      if (attempts > 20) {
        // Si plus de 20 tentatives, on considère qu'il y a un problème
        console.error(
          "Trop de tentatives pour générer randomIndex différent de index. Vérifiez votre logique."
        );
        return; // Ou prendre une autre action
      }
    } while (randomIndex === index);

    console.log(index, randomIndex);

    if (chance <= 40) {
      // succès critique
      item.effects[index] = item.effects[index] + 1;
      refreshDisplay(item, index);
      highlightLine(index, "bg-green-300");
    } else if (chance > 40 && chance < 90) {
      // succès neutre
      item.effects[index] = item.effects[index] + 1;
      item.effects[randomIndex] = item.effects[randomIndex] - 1;
      refreshDisplay(item, index);
      highlightLine(index, "bg-green-300");
      refreshDisplay(item, randomIndex);
      highlightLine(randomIndex, "bg-red-300");
    } else if (chance >= 90) {
      // échec critique
      item.effects[randomIndex] = item.effects[randomIndex] - 1;
      refreshDisplay(item, randomIndex);
      highlightLine(randomIndex, "bg-red-300");
    }
  }
}
