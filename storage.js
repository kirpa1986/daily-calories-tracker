const StorageCtrl = (() => {
    return {
        getMealListsFromLocalStorage: () => {
            return localStorage.getItem('mealItems');
        },
        updateMealListsInLocalStorage: (mealLists) => {
            localStorage.setItem('mealItems', mealLists);
        }
    }

})();

export { StorageCtrl }