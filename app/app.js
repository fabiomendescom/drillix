'use strict';

// Declare app level module which depends on views, and components
var drillixApp = angular.module('drillix', []);

drillixApp.controller('drillixController', ['$scope','$http', '$window', function($scope, $http, $window) {
     $scope.title = "Top 10";
     
     var w = angular.element($window);
     
     w.bind('resize', function () {
		 if(w.width() < 630) {
			 $("#analysiscontainer").width(w.width()-30)
		 } else {
			 $("#analysiscontainer").width(630)
		 }
		if (w.width() > 630 && w.width() <= 1186) {
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
