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

effects.forEach((effect) => {
  let effectElement = document.createElement("div");
  effectElement.textContent = effect;
  effectElement.className = "effect : " + effects.indexOf(effect);
  effectsDisplay.appendChild(effectElement);
});

item1.minEffects.forEach((effect) => {
  let statElement = document.createElement("div");
  statElement.textContent = effect;
  itemMinStat.appendChild(statElement);
});

item1.maxEffects.forEach((effect) => {
  let statElement = document.createElement("div");
  statElement.textContent = effect;
  itemMaxStat.appendChild(statElement);
});

function DisplayStats(item) {
  item.effects.forEach((effect, index) => {
    let statElement = document.createElement("div");
    statElement.id = index;
    statElement.textContent = effect;
    itemStats.appendChild(statElement);
  });
}

DisplayStats(item1);

item1.effects.forEach((_, index) => {
  let increaseStat = document.createElement("div");
  increaseStat.textContent = "+1";
  increaseStat.className =
    "border-1 flex justify-center items-center rounded-md w-10 cursor-pointer";
  increaseStat.setAttribute("data-index", index);
  increaseButton.appendChild(increaseStat);
});

increaseButton.addEventListener("click", (event) => {
  if (event.target && event.target.matches("div[data-index]")) {
    let index = event.target.getAttribute("data-index");
    increaseState(item1, index);
  }
});

function increaseState(item, index) {
  let chance = Math.floor(Math.random() * 100);
  let otherIndex = Math.floor(Math.random() * effects.length);

  let increaseStat = document.getElementById(index);
  let decreaseStat = document.getElementById(otherIndex);

  function increaseColor() {
    increaseStat.classList.add("text-green-500");
    setTimeout(() => {
      increaseStat.classList.remove("text-green-500");
    }, 500);
  }

  function decreaseColor() {
    decreaseStat.classList.add("text-red-500");
    setTimeout(() => {
      decreaseStat.classList.remove("text-red-500");
    }, 500);
  }

  // Assurez-vous que otherIndex est différent de index
  while (otherIndex === index) {
    console.log("Boucle while exécutée");
    otherIndex = Math.floor(Math.random() * effects.length);
  }

  // Si c'est un succès critique alors on augmente (20%)
  if (chance <= 20) {
    item.effects[index] = item.effects[index] + 1;
    increaseColor();
  }

  // Si c'est un succès neutre alors on augmente (selon le jet) mais on baisse un des autres (60%)
  else if (chance > 20 && chance < 80) {
    if (item.effects[index] < Math.floor(item.maxEffects[index] * 0.33)) {
      item.effects[index] = item.effects[index] + 1;
      increaseColor();
    } else if (
      item.effects[index] < Math.floor(item.maxEffects[index] * 0.66)
    ) {
      if (Math.random() < 0.8) {
        item.effects[index] = item.effects[index] + 1;
        increaseColor();
      }
    } else {
      if (Math.random() < 1 / 3) {
        item.effects[index] = item.effects[index] + 1;
        increaseColor();
      }
    }

    if (item.effects[otherIndex] > 0) {
      item.effects[otherIndex] = item.effects[otherIndex] - 1;
      decreaseColor();
    }
  }

  // Si c'est un échec alors on n'augmente pas et on baisse un des autres (20%)
  else {
    if (item.effects[otherIndex] > 0) {
      item.effects[otherIndex] = item.effects[otherIndex] - 1;
      decreaseColor();
    }
  }

  increaseStat.textContent = item1.effects[index];
  document.getElementById(otherIndex).textContent = item1.effects[otherIndex];
}
