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
      if (LENGTH > 0)
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
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMSTRINGS.inputType).value, //will be either inc or exp
        description: document.querySelector(DOMSTRINGS.inputDescription).value,
        value: document.querySelector(DOMSTRINGS.inputValue).value
      }
    },
    addListItem: function (obj, type) {
      var HTML, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMSTRINGS.incomeContainer;
        HTML = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div >';
      } else if (type === 'exp') {
        element = DOMSTRINGS.expenseContainer;
        HTML = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace the placeholder text with some actual data
      newHtml = HTML.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // instert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function() {
      var fields = document.querySelectorAll(DOMSTRINGS.inputDescription + ', ' + DOMSTRINGS.inputValue);
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(element) {
        element.value = '';
      })
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
    UICtrl.addListItem(newItem, input.type);
    UICtrl.clearFields();

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