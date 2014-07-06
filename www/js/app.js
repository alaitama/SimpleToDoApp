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
      }
    }
  })

})

// CONTROLLERS
app.controller('TodosCtrl', function($scope, $ionicModal, TodosService) {
  $scope.todos = TodosService.todos
  
  $ionicModal.fromTemplateUrl('newTodo.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
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
    $scope.todos.push({
      title: data.newItem,
      done: false
    });
    data.newItem = '';
    $scope.closeModal();
  };
  
})

app.controller('TodoCtrl', function($scope, $ionicPopup, todo) {
  $scope.todo = todo
  
  // A confirm dialog
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete ToDo',
       template: 'Are you sure you want to delete this ToDo?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
       } else {
         console.log('You are not sure');
       }
     });
   };
   
})

// SERVICE 
app.factory('TodosService', function() {
  var todos = [
      {title: "Take out the trash", done: true},
      {title: "Do laundry", done: false},
      {title: "Start cooking dinner", done: false}
   ]

  return {
    todos: todos,
    getTodo: function(index) {
      return todos[index]
    }
  }
})
