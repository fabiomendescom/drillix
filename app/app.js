'use strict';

// Declare app level module which depends on views, and components
var drillixApp = angular.module('drillix', ['ngRoute']);

drillixApp.factory("state", ["$window", function($window) {
	var service = {};
	
    service.getwindowstate = function() {
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
	 };
	 
     service.getwindowwidth = function() {
		 var w = angular.element($window);
		 return w.width();
	 }
	 
	 service.setDataModeState = function($scope) {
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
	 }
	 
	 service.setConclusionState = function($scope) {
		if ($scope.data.ui.conclusion_expanded) {
			$scope.data.ui.conclusion_pic = "fa-caret-down";
		} else {
			$scope.data.ui.conclusion_pic = "fa-caret-right";
		};		 
	 }
	 
	 service.setDataSliceState = function($scope) {
		if ($scope.data.ui.dataslice_expanded) {
			$scope.data.ui.dataslice_pic = "fa-caret-down";
		} else {
			$scope.data.ui.dataslice_pic = "fa-caret-right";
		};			 
	 }
	 
     service.conclusiontoggle = function ($scope) {
			if(!$scope.data.ui.conclusion_expanded) {
				$scope.data.ui.conclusion_pic = "fa-caret-down";
				$scope.data.ui.conclusion_expanded = true;
			} else {
				$scope.data.ui.conclusion_pic = "fa-caret-right";
				$scope.data.ui.conclusion_expanded = false;
			}
	 };
	 
     service.dataslicetoggle = function ($scope) {
			if(!$scope.data.ui.dataslice_expanded) {
				$scope.data.ui.dataslice_pic = "fa-caret-down";
				$scope.data.ui.dataslice_expanded = true;
			} else {
				$scope.data.ui.dataslice_pic = "fa-caret-right";
				$scope.data.ui.dataslice_expanded = false;
			}
	  }	

      service.timelineclick = function ($scope) {
			$scope.data.mode = "TIMELINE";
			$scope.class_timeline = "active";
			if ($scope.submode == undefined) {
				$scope.submode = "STATIC";
				$scope.classstatic = "active";
				$scope.classinteractive = "";
			}
	  }		 

      service.comparisonclick = function ($scope) {
			$scope.data.mode = "COMPARISON";
			$scope.class_comparison = "active";
	  }	

      service.singleclick = function ($scope) {
			$scope.data.mode = "SINGLE";
			$scope.class_single = "active";
	  }		  
	  
	  service.getLikeLabel = function(number) {
			switch(number) {
				case -2:
					return "Irrelevant";
					break;
				case -1:
					return "Not interesting";
					break;
				case 0:
					return "Neutral";
					break;
				case 1:
					return "Interesting";
					break;
				case 2:
					return "Very interesting";
					break;
			} 
		  
	  }
	  
      service.thumbupclick = function ($scope) {
		  if ($scope.data.likes < 2) {
			$scope.data.likes = $scope.data.likes + 1;
			$scope.data.likelabel = service.getLikeLabel($scope.data.likes);
		  }
	  }	

      service.thumbdownclick = function ($scope) {
		  if ($scope.data.likes > -2) {
			$scope.data.likes = $scope.data.likes - 1;
			$scope.data.likelabel = service.getLikeLabel($scope.data.likes);		  
		  }
	  }		
	  
      service.submodestaticclick = function ($scope) {
			$scope.data.submode = "STATIC";
	  }		 
	  
      service.submodeinteractiveclick = function ($scope) {
			$scope.data.submode = "INTERACTIVE";
	  }	   	  

	 service.setEventFunctions = function($scope) {
		$scope.conclusiontoggle = function () {
		  service.conclusiontoggle($scope);
		};
		$scope.dataslicetoggle = function () {
			service.dataslicetoggle($scope);
		};
		$scope.timelineclick = function () {
			service.timelineclick($scope);
		};	
		$scope.comparisonclick = function () {
			service.comparisonclick($scope);
		};	
		$scope.singleclick = function () {
			service.singleclick($scope);
		};		    
		$scope.thumbupclick = function () {
			service.thumbupclick($scope);
		};	
		$scope.thumbdownclick = function () {
			service.thumbdownclick($scope);
		};		
		$scope.submodestaticclick = function () {
			service.submodestaticclick($scope);
		};	   
		$scope.submodeinteractiveclick = function () {
			service.submodeinteractiveclick($scope);
		};	 					 
	 }
	 
	 service.setAnalysisFramework = function($scope,layout,analysis) {
		var maxwidth = $scope.analysiswidth;
		var analysisdata = layout($scope.data,maxwidth);
		var topxbase = analysis(analysisdata);
		var topgraphbase = d3.select("#analysis").datum(analysisdata).call(topxbase);  		 
	 }
	 
	 service.safeApply = function(scope,fn) {
		var phase = scope.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			scope.$apply(fn);
		}
	 };
	 
	 service.setInitialState = function($scope) {
		service.renderResize($scope);
		service.setDataModeState($scope);
		
		service.setConclusionState($scope);
		service.setDataSliceState($scope);
		$scope.data.likelabel = service.getLikeLabel($scope.data.likes);		
		
		if ($scope.submode == undefined) {
				$scope.submode = "STATIC";
				$scope.classstatic = "active";
				$scope.classinteractive = "";
		} 
	 }
	       
	 service.setBindings = function($scope, layout, analysis) {      
			var w = angular.element($window);     
			w.bind('resize', function () {
				service.safeApply($scope,function () { 
					service.renderResize($scope);
					if($scope.data != undefined) {
						$("#analysis").empty();
						var maxwidth = $scope.analysiswidth;
						var analysisdata = layout($scope.data,maxwidth);
						var topxbase = analysis(analysisdata);		
						var topgraphbase = d3.select("#analysis").datum(analysisdata).call(topxbase); 		
					}						
				});

			});	 
	}		 
	 
	 service.renderResize = function($scope) {
		    $scope.analysiswidth=0;
		    $scope.feederwidth=0;
		    $scope.buttonwidth=0;
			$scope.windowstate = service.getwindowstate();		
            var windowwidth = service.getwindowwidth();
            if($scope.windowstate=="DYNAMIC") {
				$scope.analysiswidth = windowwidth-15;
				$scope.feederwidth = windowwidth-30;
				$scope.buttonwidth = ($scope.analysiswidth-15)/2;
				$scope.classmenu1 = "";
				$scope.classmenu2 = "pull-right";
			} else {
				$scope.classmenu1 = "pull-right";
				$scope.classmenu2 = "pull-right";
				if($scope.windowstate=="SLIDABLE") {				
					$scope.analysiswidth = windowwidth-37;
					$scope.feederwidth = 375;						
				} else { //FULL
					$scope.analysiswidth = windowwidth - 415;
					$scope.feederwidth = 375;	
				}		
			}	                      
		 
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
	 
	 return service;
}]);

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

drillixApp.controller('drillixTopxController', ['$scope','$http', '$window', 'state', function($scope, $http, $window, state) {

    $scope.title = "";
     
    state.setEventFunctions($scope);
    state.setBindings($scope,drillix.layout.topx,drillix.analysis.topx);
     
	$http.get('data.json').
    success(function(data, status, headers, config) {
		$scope.data = data;
		state.setInitialState($scope);	
		state.setAnalysisFramework($scope,drillix.layout.topx,drillix.analysis.topx);     
    }).
    error(function(data, status, headers, config) {
      alert(status);
    });	
  
}]);
