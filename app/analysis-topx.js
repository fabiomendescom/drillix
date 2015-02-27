var data = {
	"title": "Top 5",
	"type": "TOPX",
	"mode": "single",
	"base": { 
		"data":[
			{"label": "Product A", "value": 545, "accumvalue": 1000, "perc": .10, "accumperc": .20},
			{"label": "Product B", "value": 200, "accumvalue": 1000, "perc": .10, "accumperc": .20},
			{"label": "Product C", "value": 150, "accumvalue": 1000, "perc": .10, "accumperc": .20},
			{"label": "Product D", "value": 150, "accumvalue": 1000, "perc": .10, "accumperc": .20},
			{"label": "Product E", "value": 120, "accumvalue": 1000, "perc": .10, "accumperc": .20}
		],
		"other": {
			"value": 1232,
			"label": "Other"
		}
	},
	"comparison" : {
		
	}
};

drillix = {};
drillix.analysis = {};

drillix.analysis.topx = function module() {

	var scale = 1;
	
	var boxheight=100;
	var boxwidth=600;
	var box_x = 20;
	var box_y = 40;
	
	var boxspacing = 25;
		
	function exports(_selection) {	
		_selection.each(function(_data) {
			//sizes
			boxheight = boxheight*scale;
			boxwidth = boxwidth*scale;
			numberranksize = boxheight*.3;
			numberfontsize = numberranksize*1.20;	
			boxspacing = boxspacing * scale;	
			labelfontsize = numberfontsize*.50;
							
			//positions	
			start_x = (box_x + numberranksize);
			start_y = (box_y + numberranksize);		
			circlestart_x = box_x + (numberranksize*1.50);
			circlestart_y = box_y + (numberranksize*1.50);
			numberstart_x = box_x + (numberranksize*1.10);
			numberstart_y = box_y + (numberranksize*1.80);

			//spacing
			labelxspacing = numberstart_x + (numberranksize*1.6);
			underlineoffsety = numberfontsize / 2.77;
			underlinesize = boxwidth * 0.96;
			barmargin = numberranksize * 1.4;
			baroffset = underlineoffsety * 3.2;
			barheight = numberranksize * .5;
			accumnumberoffset = baroffset * .85;
			valuesfontsize = labelfontsize * .5;
			numberoffset = accumnumberoffset + barheight + (valuesfontsize * 2);
						
			if (!svg) {
				//title
				var title = d3.select(this).append("h1")
					.attr("style","font-size:25px;padding:5px;text-align:center");
				
				title.append("img")
					.attr("src","datacilinder.png")
					.attr("style","width:16px;height:32px;margin-right:5px");
					
				title.append("span")
					.text("Top 5")		
					
				//title box
				var commenttitlelabel = d3.select(this).append("div").attr("style","margin-left:20px;font-weight:bold").text("Title");
				var commenttitlediv = d3.select(this).append("input")
					.attr("style","width:685px;margin-left:20px");	
										
				//comment box
				var commentdivlabel = d3.select(this).append("div").attr("style","margin-top:10px;margin-left:20px;font-weight:bold").text("Comment or Finding");
				var commentdiv = d3.select(this).append("textarea")
					.attr("rows","4")
					.attr("style","width:685px;margin-left:20px");										
				//filter areas div
				var filterdiv = d3.select(this).append("div")
				filterdiv.attr("style","margin:20px");
				var filtertbl = filterdiv.append("table")
					.attr("style","width:100%;");
				var filtertitle = filtertbl.append("tr");
				filtertitle.append("td")
					.attr("colspan","3")
					.attr("style","border:1px solid grey;padding:5px;width:100px;font-weight:bold;background-color:#F6F7F8;text-align:center")
					.text("Data Slice")
				var source = filtertbl
					.append("tr");
				source.append("td")
					.attr("style","border:1px solid grey;padding:5px;width:100px;font-weight:bold;background-color:#F6F7F8")
					.text("Data Context")
				source.append("td")
					.attr("style","border:1px solid grey;padding:5px;width:250px")
					.text("Context")
					.append("img")
					.attr("src","datacilinder.png")
					.attr("style","width:16px;height:16px;float:right");
				//Compare button
				var comparebox = source.append("td").attr("rowspan",6)
					.attr("style","border:1px solid grey;padding:5px;text-align:center");
				comparebox.append("div")
					.attr("style","padding:7px")
					.text("You can optionally compare this analysis with another filter, or do a timeseries analysis");
				comparebox.append("button")
					.text("Compare");
				comparebox.append("button")
					.text("Time Series");
				
				var timeframefrom = filtertbl
					.append("tr");
				timeframefrom.append("td")
					.attr("style","border:1px solid grey;padding:5px;font-weight:bold;background-color:#F6F7F8")
					.text("Timeframe");
				timeframefrom.append("td")
					.attr("style","border:1px solid grey;padding:5px")					
					.text("Jan/2001 - Feb/2001")
					.append("img")
					.attr("src","calendar.png")
					.attr("style","width:16px;height:16px;float:right");					
				var propertyhdr = filtertbl
					.append("tr");
				propertyhdr.append("td")
					.attr("colspan","2")
					.attr("style","border:1px solid grey;padding:5px;font-weight:bold;background-color:#F6F7F8")
					.text("Properties")
					.append("a")
					.attr("style", "margin-left: 5px;float:right")
					.text("Add New");

				var property1 = filtertbl
					.append("tr");
				property1.append("td")
					.attr("style","border:1px solid grey;padding:5px;font-weight:bold;background-color:#F6F7F8")
					.text("Region");
				var propertytext1 = property1.append("td")
					.attr("style","border:1px solid grey;padding:5px")
					.text("Latam");
				propertytext1.append("img")
					.attr("src","property.png")
					.attr("style","width:16px;height:16px;float:right")
																						
				propertytext1.append("img")
					.attr("src","delete.png")
					.attr("style","width:16px;height:16px;float:right");
					
				var measurehdr = filtertbl
					.append("tr")	
					.append("td")
					.attr("colspan","2")
					.attr("style","border:1px solid grey;padding:5px;font-weight:bold;background-color:#F6F7F8")
					.text("Measures");
					
				var property2 = filtertbl
					.append("tr");
					
					
				var propertytext2 = property2.append("td")
					.attr("colspan","2")
					.attr("style","border:1px solid grey;padding:5px")
					.text("Sales");
					
				propertytext2.append("img")
					.attr("src","property.png")
					.attr("style","width:16px;height:16px;float:right");								

				propertytext2.append("img")
					.attr("src","delete.png")
					.attr("style","width:16px;height:16px;float:right");
					
				var parametertable = filterdiv.append("table")
					.attr("style","width:100%;margin-top:10px");
					
				var filtertitleparm = parametertable.append("tr");
				filtertitleparm.append("td")
					.attr("colspan","3")
					.attr("style","border:1px solid grey;padding:5px;width:100px;font-weight:bold;background-color:#F6F7F8;text-align:center")
					.text("Analysis Parameters");
				var sourceparm = parametertable
					.append("tr");
				sourceparm.append("td")
					.attr("style","border:1px solid grey;padding:5px;width:100px;font-weight:bold;background-color:#F6F7F8")
					.text("Ranking Property");
				sourceparm.append("td")
					.attr("style","border:1px solid grey;padding:5px;width:250px")
					.text("Product")
					.append("img")
					.attr("src","datacilinder.png")
					.attr("style","width:16px;height:16px;float:right");
					
				var sourceparm2 = parametertable
					.append("tr");
				sourceparm2.append("td")
					.attr("style","border:1px solid grey;padding:5px;width:100px;font-weight:bold;background-color:#F6F7F8")
					.text("Ranking Measure");
				sourceparm2.append("td")
					.attr("style","border:1px solid grey;padding:5px;width:250px")
					.text("Sales")
					.append("img")
					.attr("src","datacilinder.png")
					.attr("style","width:16px;height:16px;float:right");					
																						
				var svg = d3.select(this).append("svg").classed("topx",true).attr("height",710).attr("width",694);
				svg.attr("border","1px solid");
												
				//comment box in graph
				var gvalue = svg.append("g");
				gvalue.attr('opacity',0);
				
				gvalue.append("rect")
				.transition()
				.style('stroke','grey')	
				.style('stroke-width',1)
				.style('fill', 'white')
				.attr('width', 140)
				.attr('height', 35)
				.attr('x',300)
				.attr('y',1);
				
				gvalue.append("text")
				.transition()
				.attr('stroke', 'blue')
				.attr('stroke-width',.3)
				.attr('width', 140)
				.attr('height', 33)
				.attr('y',15)
				.attr('x', 340)		
				.attr('font-family','"lucida grande", tahoma, verdana, arial, sans-serif')	
				.attr('font-weight','normal')					
				.attr('font-size', '13px')
				.text("Fabio Mendes");

				gvalue.append("text")
				.transition()
				.attr('stroke', 'blue')
				.attr('stroke-width',.3)
				.attr('width', 140)
				.attr('height', 33)
				.attr('y',32)
				.attr('x', 340)		
				.attr('font-family','"lucida grande", tahoma, verdana, arial, sans-serif')	
				.attr('font-weight','normal')					
				.attr('font-size', '13px')
				.text("Jan 3 10:00pm");
												
				gvalue.append("image")
				.transition()
				.attr('xlink:href','1.jpg')
				.style('stroke', 'black')
				.attr('x',301)
				.attr('y',2)				
				.attr('width',32)
				.attr('height',32);	
				
				gvalue
				.transition()
				.duration(2000)
				.attr('opacity',1);		
				
				var alarm = svg.append('g');	
				alarm.append('image')
				.attr('xlink:href','Alarm.png')
				.style('stroke', 'black')
				.attr('x',491)
				.attr('y',2)				
				.attr('width',32)
				.attr('height',32);			
								
				var container = svg.append("g").classed("container",true);
				container.append("g").classed("rankingbargroup",true);
			};				
			
			var rankingbars = svg.select(".container").select('.rankingbargroup').selectAll('.bar').data(_data.base.data);
			
			drawboxes(rankingbars,_data);	
			    
			
			var datapointline = svg.append('g');
			datapointline.append('line')
			    .attr('stroke', 'grey')
				.attr('y1',133)
				.attr('x1',370)
				.attr('y2',35)
				.attr('x2',370)
			
			var datapoint = svg.append('g')
			datapoint.append('circle')
				.attr('cy', 143)
				.attr('cx', 370) 
				.attr('r', 10)
				.attr('stroke', 'red')
				.attr('fill', 'white')	
			datapoint.append('circle')
				.attr('cy', 143)
				.attr('cx',370)
				.attr('r', 7) 
				.attr('stroke', 'red')
				.attr('fill', 'white')	
			datapoint.append('circle')
				.attr('cy', 143)
				.attr('cx',370)
				.attr('r', 4) 
				.attr('stroke', 'red')
				.attr('fill', 'white')	
			datapoint.append('circle')
				.attr('cy', 143)
				.attr('cx',370)
				.attr('r', 1) 
				.attr('stroke', 'red')
				.attr('fill', 'white')	
			datapoint.append('line')
				.attr('y1',143)
				.attr('x1',360)
				.attr('y2',143)
				.attr('x2',380)
				.attr('stroke', 'black') 
			datapoint.append('line')
				.attr('y1',133)
				.attr('x1',370)
				.attr('y2',153)
				.attr('x2',370)
				.attr('stroke', 'grey')
				 
			var alarmline = svg.append('g');
			alarmline.append('line')
			    .attr('stroke', 'grey')
				.attr('y1',133)
				.attr('x1',370)
				.attr('y2',34)
				.attr('x2',510)										
		});		
	};
	
	function drawboxes(rankingbars,data) {
		el = rankingbars.enter()
			.append('g');
		
		//ranking box
		el.append("rect")
			.classed('bar',true)
			.classed('shadow',true)
				.attr('fill','#ffffc0')
				.attr('opacity',.5)
				.attr('stroke','grey')
				.style('stroke-width',1)				
				.attr('x',start_x)
				.attr('y',function(d,i) {
					return start_y+(i*boxheight)+(i*boxspacing);
				})				
				.attr('width',boxwidth)
				.attr('height',boxheight);		
		
		//ranking number circles
		el.append("circle").classed('bar',true)
			.classed('shadow',true)
				.attr('fill','#ffffc0')
				.attr('stroke','grey')
				.style('stroke-width',1)
				.transition()
				.attr('cx',circlestart_x)
				.attr('cy',function(d,i) {
					return circlestart_y+(i*boxheight)+(i*boxspacing);
				})
				.attr('r',numberranksize)
				.attr('height',boxheight);	
				
		//ranking numbers
		el.append("text")
			.attr("font-size",numberfontsize)
			.attr('y',function(d,i) {
				return numberstart_y+(i*boxheight)+(i*boxspacing);
			})
			.attr("x",numberstart_x)
			.text(function(d,i){return i+1}
		);
		
		//dimention name
		el.append("text")
			.attr("font-size",labelfontsize)
			.transition()
			.attr('y',function(d,i) {
				return numberstart_y+(i*boxheight)+(i*boxspacing);
			})
			.attr("x",labelxspacing)
			.text(function(d,i){return d.label}
		);
		
		//dimension name underline
		el.append("line")
			.attr("x1",function(d,i) {
				return labelxspacing;
			})
			.attr("y1",function(d,i) {
				return numberstart_y+(i*boxheight)+(i*boxspacing) + underlineoffsety;
			})
			.attr("x2",function(d,i) {
				return numberstart_x+underlinesize;
			})
			.attr("y2",function(d,i) {
				return numberstart_y+(i*boxheight)+(i*boxspacing) + underlineoffsety;
			})
			.attr("style","stroke:grey;stroke-width:1");	
			
		//measurement bars
		el.append("rect")
			.attr("x",box_x+barmargin)
			.attr("y",function(d,i){
				return numberstart_y+(i*boxheight)+(i*boxspacing) + baroffset;
			})
			.attr('fill','#80FF80')
			.attr('stroke', '#80FF00')
			.attr('width',0)
			.transition()
			.duration(500)
			.attr("width",320)
			.attr("height",barheight)
			.attr("style","stroke:grey;stroke-width:1");

		el.append("text")
			.attr("font-family","monospace")
			.attr("font-size",valuesfontsize)
			.attr("x",box_x+barmargin)
			.attr("y",function(d,i){
				return numberstart_y+(i*boxheight)+(i*boxspacing) + accumnumberoffset;
			})
			.text(function(d,i){
				return "Accum:" + d.accumvalue;
			});

		el.append("text")
			.attr("font-family","monospace")
			.attr("font-size",valuesfontsize)
			.attr("x",box_x+barmargin)
			.attr("y",function(d,i){
				return numberstart_y+(i*boxheight)+(i*boxspacing) + numberoffset;
			})
			.text(function(d,i){
				return d.value;
			});
								
		//test drilldown lines
		//el.append("line")
		//	.attr("x1",function(d,i) {
		//		return start_x+(boxwidth)
		//	})
		//	.attr("y1",function(d,i){
		//		return start_y + (boxheight*i) + (boxspacing*i) + (boxheight/2)
		//	})
		//	.attr("x2",function(d,i){
		//		return 880;
		//	})
		//	.attr("y2",function(d,i){
		//		return $('#item'+(i+1)).position().top + ($('#item'+(i+1)).height()/2);
		//	})
		//	.attr("style","stroke:rgb(255,0,0);stroke-width:2");
	
	};
	
	function drawrankingboxes() {
		var datainput = data.data;
		var total = d3.sum(datainput);
		var grandtotal = total + data.other;
		var margin = 20;
		var boxheight = 60;
		var boxwidth = 100;
		var box_x = 100;
		var numbermargin = 10;

		var colorScale = d3.scale.linear().domain([0,datainput.length]).range(["blue","green"]);
	
		//EXPLANATION BOXES
		var runningy = margin;
		var lastboxindex = 0;	
		main.append("rect").attr("y",function(d,i){
			lastboxindex = i;
			return (i * boxheight) + margin;
		}).attr("stroke","black").attr("x", box_x).attr("width",boxwidth).style("fill",function(d,i){return colorScale(i)}).attr("opacity",.5).attr("height",boxheight);

		//NUMBER CIRCLES
		main.append("circle").attr("cy",function(d,i){
           return (i * boxheight) + margin + 30;
		}).attr("cx",150).attr("r",boxheight*.40).attr("fill","yellow").attr("opacity",.8);

		//SEQUENCE NUMBERS
		main.append("text").attr("font-size","36").attr("y",function(d,i){
			return (i * boxheight) + margin + 40;
		}).attr("x",140).text(function(d,i){return i+1});

		//EXPLANATION BOX TOP ITEM DESCRIPTION
		main.append("text").attr("font-weight","bold").attr("font-size","20").attr("y",function(d,i){
			return (i * boxheight) + margin+23;
		}).attr("x",box_x + numbermargin).attr("height",12).text(function(d,i){return d.label;}); //{return datainput.labels[i]}); 	

		//EXPLANATION BOXES CONTENT
		var runningtotal = 0;
		dec2 = d3.format(".2f");
		perc = d3.format(".2%");
		main.append("text").attr("font-weight","bold").attr("y",function(d,i){
			return (i * boxheight) + margin + (boxheight-10);
		}).attr("x",box_x + numbermargin).attr("height",12).text(function(d,i){
			runningtotal = runningtotal + d.value;
			return dec2(d) + " (" + perc(d/grandtotal) + ") " + "(Accum: " + perc(runningtotal/grandtotal) + ")";
		});      

	}
	
	return exports;
};

var topxbase = drillix.analysis.topx();
var topgraphbase = d3.select("#analysis").datum(data).call(topxbase);   
