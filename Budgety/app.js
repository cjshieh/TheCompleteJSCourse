var budgetController = (function () {

})();

var UIController = (function () {
  var DOMSTRINGS = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton:'.add__btn'
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMSTRINGS.inputType).value, //will be either inc or exp
        description: document.querySelector(DOMSTRINGS.inputDescription).value,
        value: document.querySelector(DOMSTRINGS.inputValue).value
      }
    },
    getDOMstrings: function() {
      return DOMSTRINGS;
    }
  }
})();

var controller = (function (budgetCtrl, UICtrl) {

  var setupEventListner = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

  }

  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input = UICtrl.getInput();
    // console.log(input);
    // 2. Add the item to the budget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init: function() {
      setupEventListner();
    }
  };

})(budgetController, UIController);

controller.init();