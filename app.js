//BUDGET CONTROLLER
var budgetController = (function(){
    
    var Expense = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage = -1; 
    };
    
    
    //making a prototype for expenses
    Expense.prototype.calcPercentage=function(totalIncome)
    {
     if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
     }
        else
            this.percentage=-1;
    };
    
    Expense.prototype.getPercentage=function()
    {
        return this.percentage;
    };
    
    
    
    var Income = function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    calculateTotal=function(type){
    var sum=0;
    data.allItems[type].forEach(function(cur){
        sum+=cur.value;
    });
        data.totals[type]=sum;
    
    
    }
    
    
    // our global data structure
    var data={
    allItems:{exp:[]   ,   inc:[] },
    totals:{exp: 0     ,   inc:0  },
    budget:0,
    percentage: -1    
        
    };
    
    
    
    return {
        addItem: function(type,des,val){
            var newItem,ID;
            
            // create new id
            if(data.allItems[type].length>0){
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else ID=0;
            
            //create new item based on inc or exp type
            if(type === 'exp')
            {
                 newItem=new Expense(ID,des,val);
             }
            else if(type === 'inc')
                {
                    newItem=new Income(ID,des,val);
                }
            //Push it into our data structure
            data.allItems[type].push(newItem);
            
            //return new item
            return newItem;
        },
        
        deleteItem : function(type,id){
            var ids,index;
          // map receives a callback function and returns a brand new array baaki sb same like forEach
            
            
            //id=6
            //ids=[ 1 2 4 6 8 ]
            //index=3
            ids =data.allItems[type].map(function(current){
                return current.id;
            });
            //ids is a array of ids of all elements
            
            index=ids.indexOf(id);
            
            if(index !== -1)
                {   //splice is use to remove elements
                    data.allItems[type].splice(index,1);
                    //splice(index of array element, no of elements to be deleted)
                }
        },
        
        
        calculateBudget:function(){
        
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate the budget i-e
            data.budget=data.totals.inc-data.totals.exp;
            
            //calculate the percent of income we spent
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }
            
        },
        calculatePercentages :function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        //pehle sbke leeye calculate
        getPercentages:function()
        {   
            var allPercentages=data.allItems.exp.map(function(cur){
                
                return cur.getPercentage();
            });
            return allPercentages;
        },
       // fir sbka array me store 
        getBudget: function(){
            
            return{
                budget: data.budget,
                totalIncome:data.totals.inc,
                expenses: data.totals.exp,
                percentage:data.percentage
            }
        },
        
        testing:function(){
        console.log(data);
        }
    
    };
    
    
    
})();

   



//////////////////////////////////////////////////////////////////////////////////////////
//UI CONTROLLER
var UIController = (function(){
    
    // all dom strings here
    var DOMstrings={
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton : '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercentageLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
        
        
    };
   var formatNumber = function(num,type)
        {  var numSplit,int,dec,type;
            // + or - before the number
            
            // exactly to decimal point
            
            // commas seprating thousands
            
            
            num=Math.abs(num);
            num=num.toFixed(2);  // js converts automatically number to object so that we can prform methods on them ,,,, so it will return a string 
            numSplit=num.split('.');
         int=numSplit[0];
         dec=numSplit[1];
            
         
         if(int.length > 3)
             {
                 int=int.substr(0,int.length-3) + ','+int.substr(int.length-3,3);
             }
         
         return (type==='exp' ? '-' : '+')+' '+int+'.'+dec;
         
        };
    
    
     var nodeListForEach=function(list,callback)
            { for(var i=0;i<list.length;i++){
                callback(list[i],i);
            }
            };
    
    
    return {
        getinput: function(){
            return{
             type : document.querySelector(DOMstrings.inputType).value, // either inc or exp
             description : document.querySelector(DOMstrings.inputDescription).value,
             value : parseFloat(document.querySelector(DOMstrings.inputValue).value )                                    }
        },
        addListItem:function(obj,type)
        { var html,newHtml,element;
         
         
            // create html string with placeholder tag 
         if(type==='inc'){
             element=DOMstrings.incomeContainer;
           html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
         }
         
         else if(type==='exp'){
             element=DOMstrings.expensesContainer;
           html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
         }
           
         
         //replace it with actual data
            newHtml=html.replace('%id%',obj.id);
           newHtml=newHtml.replace('%description%',obj.description);
          newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
           
         
         //insert the html into DOM
         document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
            
        },
        
        deleteListitem: function(selectorID){
            
            //we can only remove a child
            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        
        clearFileds:function(){
            var fileds,fieldsArray;
            //querySelector returns a lists like a array 
            // so solution is to create list a array by using
           fields= document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            //fields.slice() will not work because it is a function of arrays
           fieldsArray= Array.prototype.slice.call(fields);
            // it will return a array
            
            
            fieldsArray.forEach(function(current,index,array){
                current.value="";
            });
            // to focus it again on description
            fieldsArray[0].focus();
            
        },
        displayBudget: function(obj){
            var type;
            obj.budget>0 ? type='inc': type='exp';
            
    document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
    document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalIncome,'inc');
    document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.expenses,'exp');
                   
          
        if(obj.percentage>0)
            {
                 document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage +'%';
            }
        else{
            document.querySelector(DOMstrings.percentageLabel).textContent='--';
        } 
            
            
        },
        displayPercentages:function(percentages)
        {
            
            var fields=document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            
           
             nodeListForEach(fields,function(current,index){
                 if(percentages[index]>0)
                     current.textContent =percentages[index] + '%';
                 else{
                     current.textContent ='--';
                 }
             });
            
            
        },
        displayDate:function(){
          var now,year,month,months;
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            now=new Date(); 
          year=now.getFullYear();
            month=now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent=months[month]+' '+year;
            
        },
        
        
        changedType: function()
        {
          var fields=document.querySelectorAll(
          DOMstrings.inputType+','+DOMstrings.inputValue+','+DOMstrings.inputDescription
          );
            nodeListForEach(fields,function(cur){
                
                cur.classList.toggle('red-focus');
                
            });
            
        document.querySelector(DOMstrings.inputButton).classList.toggle('red');
            
        },
        
        
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
    
    
})();



/////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL APP CONTROLLER
var controller= (function(budgetCtrl , UICtrl)
                 
{     // all event listeners in one place
    var setupEventListeners=function(){
         var DOM=UICtrl.getDOMstrings();
        
         document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
    
         document.addEventListener('keypress',function(event){
               if( event.keyCode === 13 || event.which === 13)
                    {
                          ctrlAddItem();
                    }
         });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        //for event delegation 
        //so not to do for each and every element 
    document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);   
    
    };
    
        
    var updateBudget=function(){
     //1. calculate the budget
        budgetCtrl.calculateBudget();
        
     //2. return the budget
        var budget=budgetCtrl.getBudget();
        
     //3. display budget on UI
        UICtrl.displayBudget(budget);
        
    }
    
    var updatePercentages =function()
    {
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. read percentages from budgetcontroller
      var percentages = budgetCtrl.getPercentages();
        
        //3. update UI with new percentages
        UICtrl.displayPercentages(percentages);
    }
 
 
    // one function to do all the work 
    var ctrlAddItem = function()
    {   var input,newItem;
        
        //1. get field input data
        input=UICtrl.getinput();
       
     
     if(input.description !=="" && !isNaN(input.value) && input.value>0){
        //2. add item to budget controller
        newItem=budgetCtrl.addItem(input.type,input.description,input.value);
     
        //3. add an item to UI
        UICtrl.addListItem(newItem,input.type);
     
        //4.clear the fields
        UICtrl.clearFileds();
     
        //5.calculate and update budget
        updateBudget();
         
         //6. calculate and update percentages
         updatePercentages();
    }
    };
         
    var ctrlDeleteItem = function(event)
    {   var itemID,splitID,ID;
    // console.log(event.target);
     
        
      itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
     console.log(itemID);
     if(itemID)
         {
          splitID  =itemID.split('-');   //breaking a atring in different parts
             type=splitID[0];
             ID=parseInt(splitID[1]);
             
             //1. delete item drom ds
             budgetCtrl.deleteItem(type,ID);
             
             //2. delete from UI
             UICtrl.deleteListitem(itemID);
             
             //3. update and show the UI
             updateBudget();
            
              //4. calculate and update percentages
             updatePercentages();
         }
    };
        

    return {
        init: function(){
            UICtrl.displayBudget({
                budget: 0,
                totalIncome:0,
                expenses: 0,
                percentage:-1
            });
            setupEventListeners();
            UICtrl.displayDate();
        }
    }
        
    
})(budgetController, UIController);

controller.init();