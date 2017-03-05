var app = angular.module('EmployeeRoster', ['ui.bootstrap']);

app.factory('EmployeeFactory', ['$http', function ($http) {
  var baseURL = '/employees';

  return {
    getEmployees() {
      return $http.get(baseURL);
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
    },
  };
}]);

app.controller('EmployeeRosterCtrl', ['$scope', 'EmployeeFactory', function ($scope, EmployeeFactory) {
  $scope.formMode = true; //true : insert,  false : edit
	$scope.addshow = false;
	$scope.editingrow = -1;
	$scope.employeenumber;
  $scope.selrows = [];
  $scope.formModel;

  function fetchData() {
    EmployeeFactory.getEmployees()
      .then(function (response) {
        $scope.employees = response.data;
      }, function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
      });
  }

  function init() {
    fetchData();
    initFormModel();
    initTableModel();
  }
  
  function initFormModel() {
    $scope.formModel = {
      firstName: '',
      lastName: '',
      middleName: '',
      age: '',
      designation: '',
      salary: '',
      number: ''
    };

    $('input,select').removeClass('ng-dirty ng-touched ng-invalid ng-invalid-required');
  };

  function initTableModel() {
		$scope.duplicated = false;
		//$scope.addshow = false;
		$scope.selrows = [];

		$('table tr').removeClass('selected');
	};

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

	$scope.onCancel = function () {
		initFormModel();
		initTableModel();
		$scope.addshow = false;
	};

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

		if ($scope.editflag == 0) {
			//insert.
			EmployeeFactory.updateEmployee(employeeObj.number, employeeObj)
        .then(function (response) {}, function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
		} else {
			//push.
			EmployeeFactory.createEmployee(employeeObj)
        .then(function (response) {}, function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
		}

		// Clearing the form fields
		initFormModel();

		$scope.formMode = false;

		initTableModel();
		$scope.addshow = false;
    fetchData();
  };

	$scope.getMinSalaryfunction = function () {
		return $('span.min').html();
	};

	$scope.getMaxSalaryfunction = function () {
		return $('span.max').html();
	};

  $scope.add = function () {
		if ($scope.addshow && !$scope.formMode)
			return;

		$scope.employeenumber = -1;

		$scope.selrows = [];
		$('table tr').removeClass('selected');

		initFormModel();

		$scope.formMode = true;
		$scope.addshow = true;
		$scope.editflag = 1;
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
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
		}
		//disable the delete button.
		initTableModel();

		$scope.formMode = true;
		$scope.$apply();
	};

	$scope.edit = function () {
		if ($scope.addshow || $scope.selrows.length != 1)
			return;

		$scope.addshow = true;

		$scope.employeenumber = $scope.selrows[0];
    $scope.oldemployee = $scope.employees.find((employee) => employee.number == $scope.employeenumber);

		var data = $scope.oldemployee;

		$scope.editingrow = $scope.selrows[0];

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

		$scope.formMode = false;
		$scope.editflag = 0;
	};

  $scope.onNumberChange = function () {
		//check duplication.
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

		$scope.duplicated = false;
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

	$scope.selectRow = function (event, number) {
    $(event.currentTarget).toggleClass('selected');
    var index = $scope.selrows.indexOf(number);
    
    if (index === -1)
      $scope.selrows.push(number);
    else
      $scope.selrows.splice(index, 1);
	};

  init();

	$('a').mouseup(function () {
		$(this).blur();
	});
}]);
