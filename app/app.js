'use strict';

// Declare app level module which depends on views, and components
var drillixApp = angular.module('drillix', ['ngRoute']);

drillixApp.config(function($routeProvider){
  $routeProvider.when("/",
    {
      templateUrl: "main.html",
      controller: "drillixMainController"
    }
  );
  $routeProvider.when("/newanalysis",
    {
      templateUrl: "newanalysis.html",
      controller: "drillixNewAnalysisController"
    }
  );
  $routeProvider.when("/topx",
    {
      templateUrl: "topx/topx.html",
      controller: "drillixTopxController"
    }
  );
});

drillixApp.controller('drillixMainController', ['$scope','$http', '$window','$location', function($scope, $http, $window, $location) {
      $("#analysis").empty();
}]);

drillixApp.controller('drillixNewAnalysisController', ['$scope','$http', '$window','$location', function($scope, $http, $window, $location) {
      $("#analysis").empty();
      $scope.go = function ( path ) {
			$location.path( path );
	  }
}]);

drillixApp.controller('drillixTopxController', ['$scope','$http', '$window', function($scope, $http, $window) {

     $scope.title = "";
	
     $scope.getwindowstate = function() {
		 var w = angular.element($window);
		 if(w.width() <= 630) {
			 return "DYNAMIC";
		 } else {
			if (w.width() <= 1186) {
			    return "SLIDABLE";
			} else {
				return "FULL";
			}
		 }
	 }
     $scope.getwindowwidth = function() {
		 var w = angular.element($window);
		 return w.width();
	 }
	 
	$scope.renderResize = function() {
		    $scope.analysiswidth=0;
		    $scope.feederwidth=0;
		    $scope.buttonwidth=0;
 //        $scope.$apply(function () {
			$scope.windowstate = $scope.getwindowstate();		
            var windowwidth = $scope.getwindowwidth();
            if($scope.windowstate=="DYNAMIC") {
				$scope.analysiswidth = windowwidth-15;
				$scope.feederwidth = windowwidth-30;
				$scope.buttonwidth = ($scope.analysiswidth-15)/2;
			} else {
				if($scope.windowstate=="SLIDABLE") {				
					$scope.analysiswidth = windowwidth-37;
					$scope.feederwidth = 375;						
				} else { //FULL
					$scope.analysiswidth = windowwidth - 415;
					$scope.feederwidth = 375;	
				}		
			}	                      
 //        });
		 
		if ($scope.windowstate=="SLIDABLE") {
				$('.feedboxclass').hide();
			    $('.feedboxclassclone').remove();
				var newdude = $(".feedboxclass").clone().addClass("feedboxclassclone");
				newdude.addClass("slidertab").appendTo("#mainarea");	
				$(".feedboxclassclone").append('<a class="handleclone"></a>').show()
				$('.feedboxclassclone').width(375);
											    		
				$('.slidertab').tabSlideOut({
					tabHandle: '.handleclone',                     //class of the element that will become your tab
					pathToTabImage: 'newsfeed.png', //path to the image for the tab //Optionally can be set using css
					imageHeight: '32px',                     //height of tab image           //Optionally can be set using css
					imageWidth: '32px',                       //width of tab image            //Optionally can be set using css
					tabLocation: 'right',                      //side of screen where tab lives, top, right, bottom, or left
					speed: 300,                               //speed of animation
					action: 'click',                          //options: 'click' or 'hover', action to trigger animation
					topPos: '50px',                          //position from the top/ use if tabLocation is left or right
					leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top
					fixedPosition: false                      //options: true makes it stick(fixed position) on scroll	
				});						
		} else {
				$('.feedboxclassclone').remove();	
				$('.feedboxclass').show();
		}
	}
	
	$scope.safeApply = function(fn) {
	var phase = this.$root.$$phase;
	if(phase == '$apply' || phase == '$digest') {
		if(fn && (typeof(fn) === 'function')) {
			fn();
		}
		} else {
			this.$apply(fn);
		}
	};

      $scope.conclusiontoggle = function () {
			if(!$scope.data.ui.conclusion_expanded) {
				$scope.data.ui.conclusion_pic = "fa-caret-down";
				$scope.data.ui.conclusion_expanded = true;
			} else {
				$scope.data.ui.conclusion_pic = "fa-caret-right";
				$scope.data.ui.conclusion_expanded = false;
			}
	  };
	  
      $scope.dataslicetoggle = function () {
			if(!$scope.data.ui.dataslice_expanded) {
				$scope.data.ui.dataslice_pic = "fa-caret-down";
				$scope.data.ui.dataslice_expanded = true;
			} else {
				$scope.data.ui.dataslice_pic = "fa-caret-right";
				$scope.data.ui.dataslice_expanded = false;
			}
	  }	
	  
      $scope.timelineclick = function () {
			$scope.data.mode = "TIMELINE";
			$scope.class_timeline = "active";
	  }	
	  
      $scope.comparisonclick = function () {
			$scope.data.mode = "COMPARISON";
			$scope.class_comparison = "active";
	  }	
	  
      $scope.singleclick = function () {
			$scope.data.mode = "SINGLE";
			$scope.class_single = "active";
	  }		    

      $scope.thumbupclick = function () {
		  if ($scope.data.likes < 2) {
			$scope.data.likes = $scope.data.likes + 1;
			switch($scope.data.likes) {
				case -2:
					$scope.data.likelabel = "Irrelevant";
					break;
				case -1:
					$scope.data.likelabel = "Not interesting";
					break;
				case 0:
					$scope.data.likelabel = "Neutral";
					break;
				case 1:
					$scope.data.likelabel = "Interesting";
					break;
				case 2:
					$scope.data.likelabel = "Very interesting";
					break;
			} 
		  }
	  }	
	  
      $scope.thumbdownclick = function () {
		  if ($scope.data.likes > -2) {
			$scope.data.likes = $scope.data.likes - 1;
			switch($scope.data.likes) {
				case -2:
					$scope.data.likelabel = "Irrelevant";
					break;
				case -1:
					$scope.data.likelabel = "Not interesting";
					break;
				case 0:
					$scope.data.likelabel = "Neutral";
					break;
				case 1:
					$scope.data.likelabel = "Interesting";
					break;
				case 2:
					$scope.data.likelabel = "Very interesting";
					break;
			}
		  }
	  }		    
      
     var w = angular.element($window);     
     w.bind('resize', function () {
		$scope.safeApply(function () { 
			$scope.renderResize();
		});
		$("#analysis").empty();
		var maxwidth = $scope.analysiswidth;
		var analysisdata = drillix.layout.topx(data,maxwidth);
		var topxbase = drillix.analysis.topx(analysisdata);
		var topgraphbase = d3.select("#analysis").datum(analysisdata).call(topxbase); 			
	 });

	$http.get('data.json').
    success(function(data, status, headers, config) {
		$scope.renderResize();
		$scope.data = data;
		if ($scope.data.mode=="SINGLE") {
			$scope.class_single = "active";
			$scope.class_comparison = "";
			$scope.class_timeline = "";
		};
		if ($scope.data.mode=="COMPARISON") {
			$scope.class_comparison = "active";
			$scope.class_single = "";	
			$scope.class_timeline = "";		
		};
		if ($scope.data.mode=="TIMELINE") {
			$scope.class_comparison = "";
			$scope.class_single = "";
			$scope.class_timeline = "active";			
		}
		if ($scope.data.ui.conclusion_expanded) {
			$scope.data.ui.conclusion_pic = "fa-caret-down";
		} else {
			$scope.data.ui.conclusion_pic = "fa-caret-right";
		};
		if ($scope.data.ui.dataslice_expanded) {
			$scope.data.ui.dataslice_pic = "fa-caret-down";
		} else {
			$scope.data.ui.dataslice_pic = "fa-caret-right";
		};		
		
		switch($scope.data.likes) {
			case -2:
				$scope.data.likelabel = "Irrelevant";
				break;
			case -1:
				$scope.data.likelabel = "Not interesting";
				break;
			case 0:
				$scope.data.likelabel = "Neutral";
				break;
			case 1:
				$scope.data.likelabel = "Interesting";
				break;
			case 2:
				$scope.data.likelabel = "Very interesting";
				break;
		} 
	
		//$("#analysis").empty();
		var maxwidth = $scope.analysiswidth;
		var analysisdata = drillix.layout.topx(data,maxwidth);
		var topxbase = drillix.analysis.topx(analysisdata);
		var topgraphbase = d3.select("#analysis").datum(analysisdata).call(topxbase);       
    }).
    error(function(data, status, headers, config) {
      alert(status);
    });	
  
}]);
