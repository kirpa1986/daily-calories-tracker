const UICtrl = (() => {
  const selectors = {
    mealItemForm: document.getElementById("mealItemForm"),
    mealNameInput: document.getElementById("mealItemInput"),
    caloriesInput: document.getElementById("calInput"),
    addMealBtn: document.getElementById("addMealBtn"),
    addMealBtnDiv: document.getElementById("addMealBtnDiv"),
    datePicker: document.getElementById("datePicker"),
    editMealBtnsDiv: document.getElementById("editMealBtnsDiv"),
    updateMealBtn: document.getElementById("updateMealBtn"),
    deleteMealBtn: document.getElementById("deleteMealBtn"),
    backBtn: document.getElementById("backBtn"),
    mealItemList: document.getElementById("item-list"),
    totalDailyCalories: document.getElementById("totalDailyCalories"),
  };
  const validateInput = () => {
    if (selectors.mealNameInput.value === "") {
      selectors.mealNameInput.classList.add("is-invalid");
      selectors.mealNameInput.parentElement.classList.add("is-invalid");
      return false;
    } else {
      selectors.mealNameInput.classList.remove("is-invalid");
      selectors.mealNameInput.parentElement.classList.remove("is-invalid");
      return true;
    }
  };

  return {
    getSelectors: () => {
      return selectors;
    },
    getMealInput: () => {
      if (validateInput()) {
        let calories = selectors.caloriesInput.value
          ? parseInt(selectors.caloriesInput.value)
          : 0;
        return { name: selectors.mealNameInput.value, calories: calories };
      }
    },

    // Show all added meal items from Meal Item List
    showDailyMealItems: (dailyMealItems) => {
      selectors.mealItemList.innerHTML = "";
      dailyMealItems.dailyItems.forEach((meal) => {
        UICtrl.addNewMeal(meal);
      });
    },

    addNewMeal: (meal) => {
      let style = meal.calories !== 0 ? "" : "bg-warn";
      selectors.mealItemList.innerHTML += `
                  <li class="list-group-item ${style}">
                  <div class="row align-items-center">
                      <div class="col"><span class="meal-id" hidden>${meal.id}</span><i class="fa-solid fa-utensils"></i> - <span class="fw-bold meal-name">${meal.name}:</span> <span class="meal-calories">${meal.calories}</span> Calories</div>
                      <div class="col-auto text-primary"><i
                              class="fa-solid fa-pencil meal-edit"></i></div>
              </li>`;
    },
    updateTotalDailyCalories: (cal) => {
      selectors.totalDailyCalories.textContent = cal;
    },
    getDate: () => {
      return selectors.datePicker.value;
    },
    clearInput: () => {
      selectors.mealNameInput.value = "";
      selectors.caloriesInput.value = "";
    },
    clearMealItemList: () => {
      selectors.mealItemList.innerHTML = "";
    },
    showEmptyMealListMessage: () => {
      selectors.mealItemList.innerHTML = `<li class="list-group-item text-center">No items have been added yet</li>`;
    },
    setCurrentItemForEdit: (item) => {
      selectors.mealNameInput.value = item.name;
      selectors.caloriesInput.value = item.calories;
    },
    removeItemFromList: (itemEl) => {
      itemEl.remove();
    },
    editItemInMealList: (itemEl, newItem) => {
      itemEl.querySelector(".meal-name").textContent = `${newItem.name}:`;
      itemEl.querySelector(
        ".meal-calories"
      ).textContent = `${newItem.calories}`;

      if (newItem.calories === 0) {
        itemEl.classList.add('bg-warn');
      } else {
        itemEl.classList.remove('bg-warn');
      }
    },
  };
})();

export { UICtrl };
