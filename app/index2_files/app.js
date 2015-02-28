'use strict';

// Declare app level module which depends on views, and components
var drillixApp = angular.module('drillix', []);

drillixApp.controller('drillixController', ['$scope','$http', function($scope, $http) {
     $scope.title = "Top 10";

	 var g = document.getElementById("analysisscript");
	 if (g!=undefined) {
		g.parentNode.removeChild(g);
	 }
	
	 var wf = document.createElement('script');
	 wf.id = "analysisscript";
	 wf.src = "analysis-topx.js";
	 wf.type = 'text/javascript';
	 document.getElementById("scriptcontainer").appendChild(wf);	
	 $scope.newentry = false;
	 
	$http.get('data.json').success(function(data) {

	});	  
	
	$scope.goBasket = function() {	
		$('#analysis').empty();
		var g = document.getElementById("analysisscript");
		if (g!=undefined) {
			g.parentNode.removeChild(g);
		}
	
		var wf = document.createElement('script');
		wf.id = "analysisscript";
		wf.src = "analysis-basket.js";
		wf.type = 'text/javascript';
		document.getElementById("scriptcontainer").appendChild(wf);			
	};	
	
	$scope.newanalysis = function() {	
		$scope.newentry = true;
		//$('#analysis').empty();
		var g = document.getElementById("analysisscript");
		if (g!=undefined) {
			g.parentNode.removeChild(g);
		}
	
		var wf = document.createElement('script');
		wf.id = "analysisscript";
		wf.src = "newanalysis.js";
		wf.type = 'text/javascript';
		document.getElementById("scriptcontainer").appendChild(wf);			
	};	
	
  
}]);
