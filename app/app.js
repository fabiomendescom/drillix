'use strict';

// Declare app level module which depends on views, and components
var drillixApp = angular.module('drillix', []);

drillixApp.controller('drillixController', ['$scope','$http', function($scope, $http) {

 $http.get('data.json').success(function(data) {
  $scope.data = data;

  $scope.display = {};	
  
  $scope.$watch(function(scope) { return scope.data.mode },
     function(newValue, oldValue) {
		$scope.display.mode = $scope.data.mode;
		if($scope.data.mode=="single") {
			$scope.display.singlecls = "col-md-12";
			$scope.display.singlecls2 = "col-md-12";
			$scope.display.issingle = false;
		} else {
			$scope.display.singlecls = "col-md-6";
			$scope.display.singlecls2 = "col-md-5";
			$scope.display.issingle = true;
		};                   
     }
  );
  
  $scope.toggleCompare = function() {
	  if($scope.data.mode=="single") {
         $scope.data.mode = "compare";
      } else {
		 $scope.data.mode = "single";
	  }
  };  

 });	  
  
}]);
