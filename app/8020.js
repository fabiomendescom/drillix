

drillix.analysis.pareto8020 = function() {
	var drawingwidth;
	var htmlelement;
	
	var layout = function(dt,maxwidth) {
		return "";		
	};
	
	return {
		init : function() {
			$(htmlelement).empty();
		},
		
		setDrawingWidth: function(width) {
			drawingwidth = width;
		},
		
		setHtmlElement: function(element) {
			htmlelement = element;
		},
		
		renderSingle: function(data) {
				d3.xml("8020-single.svg", "image/svg+xml", function(xml) {
					if (!svg) {
						var svg = d3.select(htmlelement).append("svg").classed("topx",true).attr("height",3000).attr("width",1200);
						svg.attr("border","1px solid");
						var importedNode = document.importNode(xml.documentElement, true);
						svg.node().appendChild(importedNode);
					}							
				});
		},
		
		renderComparison: function(data) {
				d3.xml("association-comp.svg", "image/svg+xml", function(xml) {
					if (!svg) {
						var svg = d3.select(htmlelement).append("svg").classed("topx",true).attr("height",3000).attr("width",1200);
						svg.attr("border","1px solid");
						var importedNode = document.importNode(xml.documentElement, true);
						svg.node().appendChild(importedNode);
					}							
				});
		},
		
		renderTimelineStatic: function(data) {
				d3.xml("association-timestatic.svg", "image/svg+xml", function(xml) {
					if (!svg) {
						var svg = d3.select(htmlelement).append("svg").classed("topx",true).attr("height",3000).attr("width",1200);
						svg.attr("border","1px solid");
						var importedNode = document.importNode(xml.documentElement, true);
						svg.node().appendChild(importedNode);
					}							
				});
		},
		
		renderTimelineInteractive: function(data) {
				this.renderSingle(data);
		},
		
		renderConfig: function(data) {
				this.renderSingle(data);
		}
	};
}();



