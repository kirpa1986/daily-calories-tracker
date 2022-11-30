const ItemCtrl = (() => {
  // Meal Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  Item.prototype.editItem = function (item) {
    this.name = item.name;
    this.calories = item.calories;
  };

  let maxId = 0;

  // Daily Meal Items List constructor
  const ItemList = function (date) {
    this.dailyItems = [];
    this.date = date;
    this.totalCalories = 0;
  };
  ItemList.prototype.addItem = function (item) {
    let id = maxId + 1;
    const newItem = new Item(id, item["name"], item["calories"]);
    this.dailyItems.push(newItem);
    this.totalCalories += item.calories;
    maxId = id;
    return newItem;
  };
  ItemList.prototype.getItemIndex = function (item) {
    return this.dailyItems.findIndex((element) => element.id === item.id);
  };
  ItemList.prototype.getItemFromDailyListByIndex = function (index) {
    return this.dailyItems[index];
  };
  ItemList.prototype.removeItem = function (itemIndex, itemCalories) {
    this.totalCalories -= itemCalories;
    this.dailyItems.splice(itemIndex, 1);
  };
  ItemList.prototype.updateItem = function (item, newItem) {
    this.totalCalories += newItem.calories - item.calories;
    item.editItem(newItem);
  };

  let currentItem = null;

  const dailyMealItemLists = new Map();

  // Public methods
  return {
    createItem: (id, name, calories) => {
      return new Item(id, name, calories);
    },
    createDailyList: (date) => {
      return new ItemList(date);
    },
    addNewDailyItem: (dailyList, item) => {
      const newItem = dailyList.addItem(item);
      return { dailyList: dailyList, newItem: newItem };
    },
    getDailyMealItemLists: () => {
      return dailyMealItemLists;
    },
    addNewDailyMealItemList: (date, newDailyMealList) => {
      dailyMealItemLists.set(date, newDailyMealList);
    },
    setDailyMealItemsListFromArray: (mealLists) => {
      mealLists.forEach((element) => {
        const date = element[0];
        const dailyMealItems = element[1].dailyItems;
        const newDailyMealList = ItemCtrl.createDailyList(date);
        dailyMealItemLists.set(date, newDailyMealList);
        dailyMealItems.forEach((item) => {
          ItemCtrl.addNewDailyItem(
            newDailyMealList,
            new Item(item.id, item.name, item.calories)
          );
        });
      });
    },
    getDailyMealItemListByDate: (date) => {
      return dailyMealItemLists.get(date);
    },
    setCurrentItem: (dailyList, mealItem, mealItemElement, mealItemIndex) => {
      if (dailyList) {
        currentItem = {
          dailyList: dailyList,
          mealItem: mealItem,
          mealItemElement: mealItemElement,
          mealItemIndex: mealItemIndex,
        };
      } else {
        currentItem = null;
      }
    },
    getCurrentItem: () => {
      return currentItem;
    },
  };
})();

export { ItemCtrl };
