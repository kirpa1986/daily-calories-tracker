import { ItemCtrl } from "./item.js";
import { UICtrl } from "./ui.js";
import { StorageCtrl } from "./storage.js";
import { Utils } from "./utils.js";

const App = (() => {
  const selectors = UICtrl.getSelectors();

  const loadEventListeners = () => {
    // Adding new meal to the current day meal list
    selectors.addMealBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const mealDate = UICtrl.getDate();

      const newMeal = UICtrl.getMealInput();

      if (newMeal) {
        let dailyMealList = ItemCtrl.getDailyMealItemListByDate(mealDate);
        if (!dailyMealList) {
          dailyMealList = ItemCtrl.createDailyList(mealDate);
          ItemCtrl.addNewDailyMealItemList(mealDate, dailyMealList);
          UICtrl.clearMealItemList();
        }
        const updatedDailyMealList = ItemCtrl.addNewDailyItem(
          dailyMealList,
          newMeal
        );
        StorageCtrl.updateMealListsInLocalStorage(
          JSON.stringify(Array.from(ItemCtrl.getDailyMealItemLists()))
        );
        UICtrl.updateTotalDailyCalories(
          updatedDailyMealList.dailyList.totalCalories
        );
        UICtrl.addNewMeal(updatedDailyMealList.newItem);
        UICtrl.clearInput();
      }
    });
    selectors.datePicker.addEventListener("change", (e) => {
      const currentDayMeals = ItemCtrl.getDailyMealItemListByDate(
        e.target.value
      );
      if (currentDayMeals) {
        UICtrl.showDailyMealItems(currentDayMeals);
        UICtrl.updateTotalDailyCalories(currentDayMeals.totalCalories);
      } else {
        UICtrl.showEmptyMealListMessage();
        UICtrl.updateTotalDailyCalories(0);
      }
    });
    // Selecting meal item from the list
    selectors.mealItemList.addEventListener("click", (e) => {
      const currentMealList = ItemCtrl.getDailyMealItemListByDate(
        UICtrl.getDate()
      );
      if (e.target.classList.contains("meal-edit")) {
        const mealRowDiv = e.target.parentElement.parentElement;
        const mealObj = {
          id: parseInt(mealRowDiv.querySelector(".meal-id").textContent),
        };
        const itemIndexInDailyItems = currentMealList.getItemIndex(mealObj);
        const mealItem = currentMealList.getItemFromDailyListByIndex(
          itemIndexInDailyItems
        );
        ItemCtrl.setCurrentItem(
          currentMealList,
          mealItem,
          mealRowDiv.parentElement,
          itemIndexInDailyItems
        );
        selectors.addMealBtnDiv.hidden = true;
        selectors.editMealBtnsDiv.hidden = false;
        selectors.updateMealBtn.disabled = true;
        UICtrl.setCurrentItemForEdit(mealItem);
      }
    });
    // Handling Back button
    selectors.backBtn.addEventListener("click", (e) => {
      selectors.addMealBtnDiv.hidden = false;
      selectors.editMealBtnsDiv.hidden = true;
      ItemCtrl.setCurrentItem(null);
      UICtrl.clearInput();
    });
    // Removing meal item from the current daily meal list
    selectors.deleteMealBtn.addEventListener("click", (e) => {
      const currentItem = ItemCtrl.getCurrentItem();
      currentItem.dailyList.removeItem(
        currentItem.mealItemIndex,
        currentItem.mealItem.calories
      );

      UICtrl.removeItemFromList(currentItem.mealItemElement);
      UICtrl.updateTotalDailyCalories(currentItem.dailyList.totalCalories);

      if (currentItem.dailyList.dailyItems.length === 0) {
        UICtrl.showEmptyMealListMessage();
        // console.log(ItemCtrl.getDailyMealItemLists(), currentItem.dailyList.date);
        ItemCtrl.getDailyMealItemLists().delete(currentItem.dailyList.date);
      }
      StorageCtrl.updateMealListsInLocalStorage(
        JSON.stringify(Array.from(ItemCtrl.getDailyMealItemLists()))
      );
      selectors.addMealBtnDiv.hidden = false;
      selectors.editMealBtnsDiv.hidden = true;
      ItemCtrl.setCurrentItem(null);
      UICtrl.clearInput();
    });

    selectors.mealItemForm.addEventListener("keyup", (e) => {
      if (ItemCtrl.getCurrentItem()) {
        const currentItem = ItemCtrl.getCurrentItem();
        const updatedMeal = UICtrl.getMealInput();
        if (
          currentItem.mealItem.name != updatedMeal.name ||
          currentItem.mealItem.calories != updatedMeal.calories
        ) {
          selectors.updateMealBtn.disabled = false;
        } else {
          selectors.updateMealBtn.disabled = true;
        }
      }
    });

    // Updating meal item in the current daily meal list
    selectors.updateMealBtn.addEventListener("click", (e) => {
      const currentItem = ItemCtrl.getCurrentItem();
      const updatedMeal = UICtrl.getMealInput();
      currentItem.dailyList.updateItem(currentItem.mealItem, updatedMeal);
      UICtrl.editItemInMealList(currentItem.mealItemElement, updatedMeal);
      StorageCtrl.updateMealListsInLocalStorage(
        JSON.stringify(Array.from(ItemCtrl.getDailyMealItemLists()))
      );
      UICtrl.updateTotalDailyCalories(currentItem.dailyList.totalCalories);
      selectors.addMealBtnDiv.hidden = false;
      selectors.editMealBtnsDiv.hidden = true;
      ItemCtrl.setCurrentItem(null);
      UICtrl.clearInput();
    });
  };

  return {
    init: () => {
      // Set Current Date
      const today = Utils.formatDate(new Date());
      selectors.datePicker.value = today;
      // Load all MealLists
      const dailyMealItemLists = StorageCtrl.getMealListsFromLocalStorage();
      if (dailyMealItemLists) {
        // Create all needed objects based on the value saved in the local storage
        ItemCtrl.setDailyMealItemsListFromArray(JSON.parse(dailyMealItemLists));
        // Get today's meal list
        const currentDayMeals = ItemCtrl.getDailyMealItemListByDate(today);
        if (currentDayMeals) {
          UICtrl.showDailyMealItems(currentDayMeals);
          UICtrl.updateTotalDailyCalories(currentDayMeals.totalCalories);
        } else {
          UICtrl.showEmptyMealListMessage();
          UICtrl.updateTotalDailyCalories(0);
        }
      } else {
        UICtrl.showEmptyMealListMessage();
        UICtrl.updateTotalDailyCalories(0);
      }
      // Load EventListeners
      loadEventListeners();
    },
  };
})();

App.init();
