var budgetController = (function () {
  function Expense(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expense.prototype.calcPercents = function(totalInc) {
    if(totalInc > 0)
      this.percentage = Math.round((this.value / totalInc) * 100);
  }

  Expense.prototype.getPercent = function () {
    return this.percentage;
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
    },
    budget: 0,
    percentage: -1
  }

  var calculateTotal = function (type) {
    var sum = 0;
    sum = budgetData.allItems[type].reduce(function (sum, item) {
      return sum + item.value;
    }, 0);
    budgetData.total[type] = sum;
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
    },
    deleteItem: function (type, id) {
      var ids, index;

      ids = budgetData.allItems[type].map(function(item) {
        return item.id;
      });

      index = ids.indexOf(id);
      if (index !== -1) {
        budgetData.allItems[type].splice(index, 1);
      }

    },
    calculateBudget: function () {
      calculateTotal('exp');
      calculateTotal('inc');
      budgetData.budget = budgetData.total.inc - budgetData.total.exp;
      if(budgetData.total.inc > 0)
        budgetData.percentage = Math.round((budgetData.total.exp / budgetData.total.inc) * 100);
    },
    calculatePercents: function () {
      budgetData.allItems.exp.forEach(function(item) {
        item.calcPercents(budgetData.total.inc);
      })
    },
    getPercentages: function () {
      var allPerc = budgetData.allItems.exp.map(function(item) {
        return item.getPercent();//item.percentage;
      });
      return allPerc;
    },
    getBudget: function () {
      return {
        budget: budgetData.budget,
        totalInc: budgetData.total.inc,
        totalExp: budgetData.total.exp,
        percentage: budgetData.percentage
      }
    },
    testing: function () {
      return budgetData;
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
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    expensePercLabel: '.item__percentage',
    percentLabel: '.budget__expenses--percentage',
    container: '.container',
    dateLabel: '.budget__title--month'
  };

  var formatNumber =  function (num, type) {
    if(num === 0 && type === '')
      return num.toFixed(2).toString();
    num = Math.abs(num);
    num = num.toFixed(2);
    var numSplit = num.split('.');
    var int = numSplit[0];
    var stringInt = '';
    var arr = int.toString().split('');
    for(var i = 0; i < arr.length; i++) {
      stringInt += arr[i];
      if ((arr.length - i - 1) % 3 === 0 && i !== arr.length - 1) 
        stringInt += ',';
    }

    return (type === 'exp' ? '-' : '+') + ' ' + stringInt + '.' + numSplit[1];
  };

  // Implement function for looping nodeList
  var nodeListForEach = function (list, callback) {
    for(var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMSTRINGS.inputType).value, //will be either inc or exp
        description: document.querySelector(DOMSTRINGS.inputDescription).value,
        value: parseFloat(document.querySelector(DOMSTRINGS.inputValue).value)
      }
    },
    addListItem: function (obj, type) {
      var HTML, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMSTRINGS.incomeContainer;
        HTML = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div</div >';
      } else if (type === 'exp') {
        element = DOMSTRINGS.expenseContainer;
        HTML = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace the placeholder text with some actual data
      newHtml = HTML.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // instert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function () {
      var fields = document.querySelectorAll(DOMSTRINGS.inputDescription + ', ' + DOMSTRINGS.inputValue);
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (element) {
        element.value = '';
      })
    },
    deleteListItem: function (selectorID) {
      var domEl = document.getElementById(selectorID);
      domEl.parentNode.removeChild(domEl);
    },
    displayBudget: function (obj) {
      var type = '';
      if(obj.budget > 0)
        type = 'inc';
      else if(obj.budget < 0)
        type = 'exp';
      
      document.querySelector(DOMSTRINGS.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMSTRINGS.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMSTRINGS.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if(obj.percentage > 0 && obj.percentage < 100)
        document.querySelector(DOMSTRINGS.percentLabel).textContent = obj.percentage + '%';
      else
        document.querySelector(DOMSTRINGS.percentLabel).textContent = '---';

    },
    displayPercents: function (percentsArr) {
      var fields = document.querySelectorAll(DOMSTRINGS.expensePercLabel);
      
      nodeListForEach(fields, function(item, index) {
        if(percentsArr[index] > 0 && percentsArr[index] < 100)
          item.textContent = percentsArr[index] + '%';
        else
          item.textContent = '---';
      });
    },
    displayMonth: function() {
      var now = new Date();
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var month = now.getMonth();
      var year = now.getFullYear();
      document.querySelector(DOMSTRINGS.dateLabel).textContent = monthNames[month].substr(0,3) + ' ' + year;
    },
    getDOMstrings: function () {
      return DOMSTRINGS;
    },
    changedType: function () {
      
      var fields = document.querySelectorAll(
        DOMSTRINGS.inputType + ',' +
        DOMSTRINGS.inputDescription + ',' +
        DOMSTRINGS.inputValue
      );

      var button = document.querySelector(DOMSTRINGS.inputButton);
      button.classList.toggle('red');

      nodeListForEach(fields, function(node) {
        node.classList.toggle('red-focus');
      })
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
  };

  // Calculate the budget and Display the budget on the UI
  var updateBudget = function () {
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {
    //
    budgetCtrl.calculatePercents();
    var percentages = budgetCtrl.getPercentages();
    UICtrl.displayPercents(percentages);
    // console.log(percentages);
  };

  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input = UICtrl.getInput();
    // console.log(input);
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //budgetCtrl.testing();

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      updateBudget();
      updatePercentages();
    }
    UICtrl.clearFields();
  };


  var ctrlDeleteItem = function (event) {
    var itemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID) {
      var splitID = itemID.split('-');
      var type = splitID[0];
      var id = parseInt(splitID[1]);

      // 1. delete the item in the data structure
      budgetCtrl.deleteItem(type, id);
      // 2. delete the item from UI
      UICtrl.deleteListItem(itemID);
      // 3. update and show the new budget
      updateBudget();
      updatePercentages();
    }
  };

  return {
    init: function () {
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1 
      });
      UICtrl.displayMonth();
      setupEventListner();
    }
  };

})(budgetController, UIController);

controller.init();