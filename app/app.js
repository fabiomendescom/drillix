'use strict';

// Declare app level module which depends on views, and components
var drillixApp = angular.module('drillix', ['ngRoute']);

drillixApp.factory("state", ["$window", function($window) {
	var savedanalysis;
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
				savedanalysis.init();
				savedanalysis.renderTimelineStatic($scope.data);
			} else {
				savedanalysis.init();
				savedanalysis.renderTimelineInteractive($scope.data);				
			}
	  }		 

      service.comparisonclick = function ($scope) {
			$scope.data.mode = "COMPARISON";
			$scope.class_comparison = "active";
			savedanalysis.init();
			savedanalysis.renderComparison($scope.data);
	  }	

      service.singleclick = function ($scope) {
			$scope.data.mode = "SINGLE";
			$scope.class_single = "active";
			savedanalysis.init();
			savedanalysis.renderSingle($scope.data);
	  }		  
	  
	  service.getLikeLabel = function(number) {
			switch(number) {
				case -2:
					return "-2";
					break;
				case -1:
					return "-1";
					break;
				case 0:
					return "0";
					break;
				case 1:
					return "+1";
					break;
				case 2:
					return "+2";
					break;
			} 
		  
	  }
	  
      service.thumbupclick = function ($scope) {
		  if ($scope.data.likes < 2) {
			$scope.data.likes = $scope.data.likes + 1;
			$scope.data.likelabel = service.getLikeLabel($scope.data.likes);
		  };
		  if ($scope.data.likes == 0) {
			  $scope.data.likecolor = "black";
		  } else {
				if ($scope.data.likes > 0) {
					$scope.data.likecolor = "green";
				} else  {
					$scope.data.likecolor = "red";
				}
		  }
	  }	

      service.thumbdownclick = function ($scope) {
		  if ($scope.data.likes > -2) {
			$scope.data.likes = $scope.data.likes - 1;
			$scope.data.likelabel = service.getLikeLabel($scope.data.likes);		  
		  };
		  if ($scope.data.likes == 0) {
			  $scope.data.likecolor = "black";
		  } else {
				if ($scope.data.likes > 0) {
					$scope.data.likecolor = "green";
				} else  {
					$scope.data.likecolor = "red";
				}
		  }
	  }		
	  
      service.submodestaticclick = function ($scope) {
			$scope.data.submode = "STATIC";
			savedanalysis.init();
			savedanalysis.renderTimelineStatic($scope.data);
	  }		 
	  
      service.submodeinteractiveclick = function ($scope) {
			$scope.data.submode = "INTERACTIVE";
			savedanalysis.init();
			savedanalysis.renderTimelineInteractive($scope.data);			
	  }	   	 
	  
      service.titleeditclick = function ($scope) {
			$scope.data.title_edit = true;			
	  }	 	
	  
      service.titleeditcancelclick = function ($scope) {
			$scope.data.title_edit = false;			
	  }	 	
	  
      service.titleeditsaveclick = function ($scope) {
			$scope.data.title_edit = false;			
	  }	 
	  
      service.tagseditclick = function ($scope) {
			$scope.data.tags_edit = true;	
			$('#tags_tagsinput').remove();
			$('#tags').tagsInput({
				'height':'80px',
				'width':'100%'
			});		
	  }	 	
	  
      service.tagseditcancelclick = function ($scope) {
			$scope.data.tags_edit = false;			
	  }	 	
	  
      service.tagseditsaveclick = function ($scope) {
			$scope.data.tags_edit = false;		
	  }	 
	  
      service.detailseditclick = function ($scope) {
			$scope.data.details_edit = true;		
	  }	 	
	  
      service.detailseditcancelclick = function ($scope) {
			$scope.data.details_edit = false;			
	  }	 	
	  
      service.detailseditsaveclick = function ($scope) {
			$scope.data.details_edit = false;		
	  }	 
	  
      service.filtereditclick = function ($scope) {
			$scope.data.filter_edit = true;		
	  }	 	
	  
      service.filtereditcancelclick = function ($scope) {
			$scope.data.filter_edit = false;			
	  }	 	
	  
      service.filtereditsaveclick = function ($scope) {
			$scope.data.filter_edit = false;		
	  }	
	  
      service.settingseditclick = function ($scope) {
			$scope.data.settings_edit = true;		
	  }	 	
	  
      service.settingseditcancelclick = function ($scope) {
			$scope.data.settings_edit = false;			
	  }	 	
	  
      service.settingseditsaveclick = function ($scope) {
			$scope.data.settings_edit = false;		
	  }	
	  
      service.watcherseditclick = function ($scope) {
			$scope.data.watchers_edit = true;		
	  }	 	
	  
      service.watcherseditcancelclick = function ($scope) {
			$scope.data.watchers_edit = false;			
	  }	 	
	  
      service.watcherseditsaveclick = function ($scope) {
			$scope.data.watchers_edit = false;		
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
		$scope.titleeditclick = function () {
			service.titleeditclick($scope);
		};	
		$scope.titleeditcancelclick = function () {
			service.titleeditcancelclick($scope);
		};	
		$scope.titleeditsaveclick = function () {
			service.titleeditsaveclick($scope);
		};	
		$scope.tagseditclick = function () {
			service.tagseditclick($scope);
		};	
		$scope.tagseditcancelclick = function () {
			service.tagseditcancelclick($scope);
		};	
		$scope.tagseditsaveclick = function () {
			service.tagseditsaveclick($scope);
		};	
		$scope.detailseditclick = function () {
			service.detailseditclick($scope);
		};	
		$scope.detailseditcancelclick = function () {
			service.detailseditcancelclick($scope);
		};	
		$scope.detailseditsaveclick = function () {
			service.detailseditsaveclick($scope);
		};		
		$scope.filtereditclick = function () {
			service.filtereditclick($scope);
		};	
		$scope.filtereditcancelclick = function () {
			service.filtereditcancelclick($scope);
		};	
		$scope.filtereditsaveclick = function () {
			service.filtereditsaveclick($scope);
		};	
		$scope.settingseditclick = function () {
			service.settingseditclick($scope);
		};	
		$scope.settingseditcancelclick = function () {
			service.settingseditcancelclick($scope);
		};	
		$scope.settingseditsaveclick = function () {
			service.settingseditsaveclick($scope);
		};	
		$scope.watcherseditclick = function () {
			service.watcherseditclick($scope);
		};	
		$scope.watcherseditcancelclick = function () {
			service.watcherseditcancelclick($scope);
		};	
		$scope.watcherseditsaveclick = function () {
			service.watcherseditsaveclick($scope);
		};																				 
	 }
	 
	 service.setAnalysisFramework = function($scope,analysis) {
		var maxwidth = $scope.analysiswidth;
		analysis.setDrawingWidth(maxwidth);
		analysis.setHtmlElement("#analysis");
		savedanalysis = analysis;
		analysis.init();
		if($scope.data.mode=="SINGLE") {
			analysis.renderSingle($scope.data);	
		};
		if($scope.data.mode=="COMPARISON") {
			analysis.renderComparison($scope.data);
		};
		if($scope.data.mode=="TIMELINE") {
			if($scope.data.submode=="STATIC") {
				analysis.renderTimelineStatic($scope.data);
			} else {
				analysis.renderTimelineInteractive($scope.data);
			}
		}				 
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
		if ($scope.data.likes == 0) {
			  $scope.data.likecolor = "black";
		} else {
				if ($scope.data.likes > 0) {
					$scope.data.likecolor = "green";
				} else  {
					$scope.data.likecolor = "red";
				}
		}			
		
		if ($scope.submode == undefined) {
				$scope.submode = "STATIC";
				$scope.classstatic = "active";
				$scope.classinteractive = "";
		} 
	 }
	       
	 service.setBindings = function($scope, analysis) {    		  
			var w = angular.element($window);     
			w.bind('resize', function () {		
				service.safeApply($scope,function () { 
					service.renderResize($scope);
					analysis.setDrawingWidth($scope.analysiswidth);
					if($scope.data != undefined) {
						analysis.init();
						if($scope.data.mode=="SINGLE") {
							analysis.renderSingle($scope.data);	
						};
						if($scope.data.mode=="COMPARISON") {
							analysis.renderComparison($scope.data);
						};
						if($scope.data.mode=="TIMELINE") {
							if($scope.data.submode=="STATIC") {
								analysis.renderTimelineStatic($scope.data);
							} else {
								analysis.renderTimelineInteractive($scope.data);
							}
						}	
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
  $routeProvider.when("/topx-config",
    {
      templateUrl: "topx/topx-config.html",
      controller: "drillixTopxConfigController"
    }
  );
  $routeProvider.when("/association",
    {
      templateUrl: "association/association.html",
      controller: "drillixAssociationController"
    }
  );  
  $routeProvider.when("/8020",
    {
      templateUrl: "8020/8020.html",
      controller: "drillix8020Controller"
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

drillixApp.controller('drillixTopxController', ['$scope','$http', '$window', '$location', '$anchorScroll', 'state', function($scope, $http, $window, $location, $anchorScroll, state) {
       
    state.setEventFunctions($scope);
    state.setBindings($scope,drillix.analysis.topx);
     
	$http.get('data.json').
    success(function(data, status, headers, config) {
		$scope.data = data;
		state.setInitialState($scope);	
		state.setAnalysisFramework($scope,drillix.analysis.topx); 
		$scope.data.typename = "Top X Analysis";	
		//$location.hash('newanalysis');
		//$anchorScroll();	 
		//alert($location.url());
    }).
    error(function(data, status, headers, config) {
      alert(status);
    });	
      
}]);

drillixApp.controller('drillixTopxConfigController', ['$scope','$http', '$window', 'state', function($scope, $http, $window, state) {
     
    state.setEventFunctions($scope);
    state.setBindings($scope,drillix.analysis.topx);
     
	$http.get('data.json').
    success(function(data, status, headers, config) {
		$scope.data = data;
		state.setInitialState($scope);	
		state.setAnalysisFramework($scope,drillix.analysis.topx); 
		$scope.data.typename = "Top X Analysis (Configuration)";		    
    }).
    error(function(data, status, headers, config) {
      alert(status);
    });	
      
}]);


drillixApp.controller('drillixAssociationController', ['$scope','$http', '$window', 'state', function($scope, $http, $window, state) {

     
    state.setEventFunctions($scope);
    state.setBindings($scope,drillix.analysis.association);
     
	$http.get('data.json').
    success(function(data, status, headers, config) {
		$scope.data = data;
		state.setInitialState($scope);	
		state.setAnalysisFramework($scope,drillix.analysis.association);   
		$scope.data.typename = "Association Analysis";  
    }).
    error(function(data, status, headers, config) {
      alert(status);
    });	
}]);    
    
drillixApp.controller('drillix8020Controller', ['$scope','$http', '$window', 'state', function($scope, $http, $window, state) {
    
    state.setEventFunctions($scope);
    state.setBindings($scope,drillix.analysis.pareto8020);
     
	$http.get('data.json').
    success(function(data, status, headers, config) {
		$scope.data = data;
		state.setInitialState($scope);	
		state.setAnalysisFramework($scope,drillix.analysis.pareto8020);   
		$scope.data.typename = "80/20 Analysis";  
    }).
    error(function(data, status, headers, config) {
      alert(status);
    });	    
}]);
