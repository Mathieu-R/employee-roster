var app = angular.module('EmployeeRoster', ['ui.router', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
		// setup an abstract state for the tabs directive
		.state('employees', {
			url: '/'
		})
		// Each tab has its own nav history stack:
		.state('addEmploye', {
			url: '/employees/add',
			templateUrl: 'templates/add.html',
			controller: 'formController',
			controllerAs: 'form'
		})
		
		.state('editEmployee', {
			url: '/employees/edit/:number',
			templateUrl: 'templates/edit.html',
			controller: 'formController',
			controllerAs: 'form'
		});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
});


app.factory('EmployeeFactory', ['$http', function ($http) {
  var baseURL = '/employees';
	return {
		getEmployees(page) {
			page = page || 1;
			return $http.get(baseURL + '?page=' + page);
		},

		createEmployee(params) {
			return $http.post(baseURL, params);
		},

		getEmployee(number) {
			return $http.get(baseURL + '/' + number);
		},

		updateEmployee(number, params) {
			return $http.put(baseURL + '/' + number, params);
		},

		deleteEmployee(number) {
			return $http.delete(baseURL + '/' + number);
		}
	}
}]);

app.service('formService', [ function () {
	var state = {};
	var _addshow = false;

	state.addshow = function () {
		return _addshow;
	}

	state.set = {
		addshow(value) {
			_addshow = value;
		}
	}
}]);

app.controller('employeesController', ['$scope', '$state', 'EmployeeFactory', 'formService', function ($scope, $state, EmployeeFactory, formService) {
	$scope.editingrow = -1;
	$scope.employeenumber;
  $scope.selrows = [];
	$scope.employees = [];
	$scope.page = 1;
	$scope.addshow = false;
	$scope.employeeCount = 0;

	function fetchData(page) {
    EmployeeFactory.getEmployees(page)
      .then(function (response) {
        $scope.employees = response.data.employees;
				$scope.employeeCount = response.data.count;
      }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }

	function initTableModel() {
		$scope.selrows = [];
		$('table tr').removeClass('selected');
	};

	$scope.pageChanged = function (page) {
		fetchData(page);
	};

	$scope.delete = function () {
		//sort the No(order in table) array of checked rows.
		$scope.selrows.sort();

		for (i = $scope.selrows.length - 1; i >= 0; i--) {
      $scope.employeenumber = $scope.selrows[i] ;
      var emp = $scope.employees.find((employee) => employee.number == $scope.employeenumber);

      EmployeeFactory.deleteEmployee(emp.number)
        .then(function (response) {
          if ($scope.editingrow === emp.number) {
            $scope.addshow = false;
          }
          
          fetchData();
        }, function (error) {
            $scope.status = 'Unable to delete employee: ' + error.message;
        });
		}

		$scope.formMode = true;
		$scope.$apply();
	};

	$scope.openmodal = function (event) {
		if ($scope.selrows.length < 1)
			return;
		BootstrapDialog.show({
			title: 'Delete',
			message: 'Are you sure you want to delete  ' + ($scope.selrows.length >= 2 ? ' these ' + $scope.selrows.length + ' entries? ' : ' this entry? '),
			closable: false,
			buttons: [{
				label: '<i class="fa fa-trash"></i>&nbsp;&nbsp;Delete',
				cssClass: 'btn-lg btn-green delete-button-delete',
				action: function (dialogRef) {
					$scope.delete();
					dialogRef.close();
				}
			}, {
				label: '<i class="fa fa-times"></i>&nbsp;&nbsp;Cancel',
				cssClass: 'btn-lg btn-gray delete-button-cancel',
				action: function (dialogRef) {
					dialogRef.close();
				}
			}]
		});
	};

	$scope.edit = function () {
		$scope.employeenumber = $scope.selrows[0]
		$state.go('editEmployee', { number: $scope.employeenumber });
	};


	$scope.selectRow = function (event, number) {
    $(event.currentTarget).toggleClass('selected');
    var index = $scope.selrows.indexOf(number);
    
    if (index === -1)
      $scope.selrows.push(number);
    else
      $scope.selrows.splice(index, 1);
	};

	fetchData();

	$scope.$on('update', (e, msg) => {
		fetchData();
	});

	$scope.$on('editing', (e, msg) => {
		$scope.addshow = msg;
	});
}]);

app.controller('formController', ['$scope', '$rootScope', '$state', 'EmployeeFactory', '$stateParams',
	function ($scope, $rootScope, $state, EmployeeFactory, $stateParams) {
  $scope.formModel = {};
	$scope.editflag = 0;
	$scope.designations = [{
			name: 'Consultant',
			min: 30000,
			max: 35000,
			value: 30000
		}, {
			name: 'Senior Consultant',
			min: 36000,
			max: 40000,
			value: 36000
		}, {
			name: 'Lead',
			min: 41000,
			max: 45000,
			value: 41000
		}, {
			name: 'Assistant Manager',
			min: 46000,
			max: 50000,
			value: 460004
		}, {
			name: 'Manager',
			min: 51000,
			max: 55000,
			value: 510004
		}, {
			name: 'Senior Manager',
			min: 56000,
			max: 80000,
			value: 560004
		}
	];

	if ($stateParams.number) {
		$scope.editflag = 1;

		EmployeeFactory.getEmployee($stateParams.number)
			.then((response) => {
				var data = response.data;

				$scope.formModel.number = eval(data.number);
				$scope.formModel.firstName = data.firstName;
				$scope.formModel.lastName = data.lastName;
				$scope.formModel.middleName = data.middleName;
				$scope.formModel.age = eval(data.age);

				for (i = 0; i < $scope.designations.length; i++) {

					if ($scope.designations[i].name == data.designation) {
						$scope.formModel.designation = $scope.designations[i];
						$scope.formModel.salary = eval(data.salary);
					}
				}

			}, (err) => {
				$scope.status = 'Employee not found: ' + error.message;
			})
	} else {
		$scope.editflag = 0;
	}

	$rootScope.$broadcast('editing', true);

  $scope.onSubmit = function () {
		// Number is invalid
		if ($('#submita').attr('disabled') == 'disabled')
			return;

		if ($scope.duplicated) {
			$scope.formModel.number = '';
			return;
		}

		var employeeObj = {
			number: $scope.formModel.number,
			firstName: $scope.formModel.firstName,
			lastName: $scope.formModel.lastName,
			middleName: $scope.formModel.middleName,
			age: $scope.formModel.age,
			designation: $scope.formModel.designation.name,
			salary: $scope.formModel.salary
		};

		if ($scope.editflag == 1) {
			//insert.
			EmployeeFactory.updateEmployee(employeeObj.number, employeeObj)
        .then(function (response) {}, function (error) {
            $scope.status = 'Unable to uodate employee data: ' + error.message;
        });
		} else {
			//push.
			EmployeeFactory.createEmployee(employeeObj)
        .then(function (response) {}, function (error) {
            $scope.status = 'Unable to create employee: ' + error.message;
        });
		}

		$rootScope.$broadcast('update', null);
		$state.go('employees');
  };

	$scope.onNumberChange = function () {
		//check duplication.\
		if ($scope.employees == null || $scope.formModel.number == '') return;

		for (i = 0; i < $scope.employees.length; i++) {

			if ($scope.employees[i].number == $scope.formModel.number) {
				if ($scope.editflag == 1) {
					//when add.
					$scope.duplicated = true;
					return;
				} else {
					//when edit.
					if ($scope.employeenumber != i) {
						$scope.duplicated = true;
						return;
					}
				}
			}
		}
	}
}]);
