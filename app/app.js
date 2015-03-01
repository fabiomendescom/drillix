'use strict';

// Declare app level module which depends on views, and components
var drillixApp = angular.module('drillix', []);

drillixApp.controller('drillixController', ['$scope','$http', '$window', function($scope, $http, $window) {
     $scope.title = "Top 10";
     
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
       
     var w = angular.element($window);
     
     w.bind('resize', function () {
         $scope.$apply(function () {
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
            $scope.title = $scope.windowstate;
            
            $("#analysis").empty();
            var maxwidth = $scope.analysiswidth;
			var analysisdata = drillix.layout.topx(data,maxwidth);
			var topxbase = drillix.analysis.topx(analysisdata);
			var topgraphbase = d3.select("#analysis").datum(analysisdata).call(topxbase);             
            
            
         });
		 
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
	});

/*
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
*/	
  
}]);
