var app = angular.module('ionicApp', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/todos')

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: 'main.html'
  })
  
  $stateProvider.state('app.help', {
    url: '/help',
    views: {
      help: {
        templateUrl: 'help.html'
      }
    }
  })
  
  $stateProvider.state('app.todos', {
    abstract: true,
    url: '/todos',
    views: {
      todos: {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  })

  $stateProvider.state('app.todos.index', {
    url: '',
    templateUrl: 'todos.html',
    controller: 'TodosCtrl'
  })

  $stateProvider.state('app.todos.detail', {
    url: '/:todo',
    templateUrl: 'todo.html',
    controller: 'TodoCtrl',
    resolve: {
      todo: function($stateParams, TodosService) {
        return TodosService.getTodo($stateParams.todo)
      },
      idxTodo: function($stateParams) {
        //console.log($stateParams.todo)
        return $stateParams.todo
      }
    }
  })

})

// CONTROLLERS
app.controller('TodosCtrl', function($scope, $ionicModal, TodosService) {
  console.log("init TodosCtrl");
  
  $scope.todos = TodosService.todos
  
  $ionicModal.fromTemplateUrl('newTodo.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
    $scope.shouldBeOpen = true;
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.shouldBeOpen = false;
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  
  //function to add items to the existing list
  $scope.AddItem = function (data) {
    
    TodosService.addTodo(data.newItem);
    
    data.newItem = '';
    $scope.closeModal();
  };
  
})

app.controller('TodoCtrl', function($scope, $state, $ionicPopup, todo, idxTodo, TodosService) {
  $scope.todo = todo
  $scope.todos = TodosService.todos
  
  // A confirm dialog
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete ToDo',
       template: 'Are you sure you want to delete this ToDo?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure ' + idxTodo);
         
         TodosService.deleteTodo(idxTodo)
         //$state.go("app.todos")
         //$state.reload()
         $state.go('app.todos.index');
         
       } else {
         console.log('You are not sure');
       }
     });
   };
   
   $scope.editTodo = function() {
     console.log("init editTodo")
     TodosService.saveTodos();
     $state.go('app.todos.index');
   };
   
})

// SERVICE 
app.factory('TodosService', function() {
  /*
  var todos = [
      {title: "Take out the trash", done: true},
      {title: "Do laundry", done: false},
      {title: "Start cooking dinner", done: false}
   ]
   */
   console.log("init TodosService");
   //todos = "";
   var todos = localStorage.getItem("todos");
   
   if(todos == undefined || todos == null || todos == "") {
     console.log("initialize todo variable");
     todos = new Array(0);
   }
   else {
     todos = JSON.parse(localStorage["todos"]);
   }
   //localStorage.setItem("todos", todos)
   console.log("end TodosService");

  return {
    todos: todos,
    getTodo: function(index) {
      return todos[index]
    },
    deleteTodo: function(index) {
      todos.splice(index, 1)
      console.log("Delete task " + index)
      localStorage.setItem("todos", JSON.stringify(todos))
    },
    addTodo: function(todoTitle) {
      console.log("addTodo");
      
      todos.push({
        title: todoTitle,
        done: false
      });
      
      localStorage.setItem("todos", JSON.stringify(todos))
    },
    saveTodos: function() {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }
})

// DIRECTIVES
app.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === "true") { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
    }
  };
});
