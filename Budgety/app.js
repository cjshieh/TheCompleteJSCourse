var budgetController = (function () {
  function Expense(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var budgetData = {
    allItems: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0
    }
  }

  return {
    // set budgetData return new element
    addItem: function (type, des, val) {
      var newItem, ID;
      var LENGTH = budgetData.allItems[type].length;
      // Create new ID
      if(LENGTH > 0)
        ID = budgetData.allItems[type][LENGTH - 1].id + 1;
      else
        ID = 0;
      // Create new item based on 'inc' or 'exp' type
      if (type === 'inc') {
        newItem = new Income(ID, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      }
      budgetData.allItems[type].push(newItem);

      return newItem;
    }
  }
})();

var UIController = (function () {
  var DOMSTRINGS = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMSTRINGS.inputType).value, //will be either inc or exp
        description: document.querySelector(DOMSTRINGS.inputDescription).value,
        value: document.querySelector(DOMSTRINGS.inputValue).value
      }
    },
    getDOMstrings: function () {
      return DOMSTRINGS;
    }
  }
})();

var controller = (function (budgetCtrl, UICtrl) {

  var setupEventListner = function () {
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
    var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //budgetCtrl.testing();

    // 3. Add the item to the UI

    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init: function () {
      setupEventListner();
    }
  };

})(budgetController, UIController);

controller.init();