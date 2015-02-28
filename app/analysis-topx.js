var data = {
	"defaults" : {
		"scale" : "1",
		"boxheight" : "100",
		"boxwidth" : "600",
		"leftmargin" : "20",
		"topmargin" : "40",
		"boxspacing": "25"
	},
	"title": "Top 5",
	"type": "TOPX",
	"mode": "single",
	"parameters" : [
		{"rankingproperty" : "Product"},
		{"rankingmeasure" : "Sales"}
	],
	"base": { 
		"dataslice" : {
			"datacontext": "Context",
			"timefrom" : "2010-01-01",
			"timeto" : "2010-01-31",
			"properties" : [
				{
					"property" : {
						"name" : "Region",
						"type" : ""
					}
				},
				{
					"property" : {
						"name" : "State",
						"type" : ""
					}					
				}
			],
			"measures" : [
				{
					"measure" : {
						"name" : "value",
						"type" : ""
					}
				}
			]
		},
		"data":[
			{
				"label": "Product A", 
				"value": 545,
				"comments": [
					{
						"from": "Fabio Mendes",
						"image": "1.jpg",
						"date" : "Jan 3, 10:00pm",
						"comment": "This is a comment"
					}
				],
				"alarms" : [
					{
						"image": "Alarm.png"
					}
				]
			},
			{
				"label": "Product B", 
				"value": 200,
				"comments" : []
			},
			{
				"label": "Product C", 
				"value": 150,
				"comments" : []
			},
			{
				"label": "Product D", 
				"value": 150,
				"comments" : []
			},
			{
				"label": "Product E", 
				"value": 120,
				"comments" : []
			}
		],
		"other": {
			"label": "Other",
			"value": 1232,
			"comments" : []
		}
	},
	"comparison" : {
		
	}
};

drillix = {};
drillix.analysis = {};
drillix.layout = {};	

drillix.layout.topx = function(dt) {
	var tmpdata = dt;
	
	var scale = parseInt(dt.defaults.scale);	
	var boxheight = parseInt(dt.defaults.boxheight);
	var boxwidth = parseInt(dt.defaults.boxwidth);
	var box_x = parseInt(dt.defaults.leftmargin);
	var box_y = parseInt(dt.defaults.topmargin);	
	var boxspacing = parseInt(dt.defaults.boxspacing);

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
	
	measurebarmaxwidth = boxwidth * .95;
	measurebarratio = measurebarmaxwidth / tmpdata.base.data[0].value;
	
	i=0;
	while (i < tmpdata.base.data.length) {
		tmpdata.base.data[i].x = start_x;
		tmpdata.base.data[i].y = start_y+(i*boxheight)+(i*boxspacing);	
		tmpdata.base.data[i].width = boxwidth;
		tmpdata.base.data[i].height = boxheight;	
		tmpdata.base.data[i].ranking_x = circlestart_x;
		tmpdata.base.data[i].ranking_y = circlestart_y+(i*boxheight)+(i*boxspacing);
		tmpdata.base.data[i].rankingcirclesize = numberranksize;
		tmpdata.base.data[i].rankingfontsize = numberranksize;
		tmpdata.base.data[i].rankingnumber_x = numberstart_x;		
		tmpdata.base.data[i].rankingnumber_y = numberstart_y+(i*boxheight)+(i*boxspacing);
		tmpdata.base.data[i].rankingnumber = i+1;
		tmpdata.base.data[i].labelfontsize = labelfontsize;
		tmpdata.base.data[i].rankingtext_y = numberstart_y+(i*boxheight)+(i*boxspacing);
		tmpdata.base.data[i].rankingtext_x = labelxspacing;
		tmpdata.base.data[i].textunderline_y = numberstart_y+(i*boxheight)+(i*boxspacing) + underlineoffsety;
		tmpdata.base.data[i].textunderline_start = labelxspacing;
		tmpdata.base.data[i].textunderline_end = numberstart_x+underlinesize;
		tmpdata.base.data[i].measurebar_x = box_x+barmargin;
		tmpdata.base.data[i].measurebar_y = numberstart_y+(i*boxheight)+(i*boxspacing) + baroffset;
		tmpdata.base.data[i].measurebar_width = tmpdata.base.data[i].value * measurebarratio;
		tmpdata.base.data[i].measurebar_height = barheight;
		tmpdata.base.data[i].measurevaluefontsize = valuesfontsize;
		tmpdata.base.data[i].measurevalue_x = box_x+barmargin;
		tmpdata.base.data[i].measurevalue_y = numberstart_y+(i*boxheight)+(i*boxspacing) + accumnumberoffset;
		
		j=0;
		while (j < tmpdata.base.data[i].comments.length) {
			tmpdata.base.data[i].comments[j].box_x = 300;
			tmpdata.base.data[i].comments[j].box_y = 1;
			tmpdata.base.data[i].comments[j].box_height = 35;
			tmpdata.base.data[i].comments[j].box_width = 140;
									
			tmpdata.base.data[i].comments[j].from_x = 340;
			tmpdata.base.data[i].comments[j].from_y = 15;
			tmpdata.base.data[i].comments[j].from_height = 33;
			tmpdata.base.data[i].comments[j].from_width = 140;

			tmpdata.base.data[i].comments[j].date_x = 340;
			tmpdata.base.data[i].comments[j].date_y = 32;
			tmpdata.base.data[i].comments[j].date_height = 33;
			tmpdata.base.data[i].comments[j].date_width = 140;
			
			tmpdata.base.data[i].comments[j].image_x = 301;
			tmpdata.base.data[i].comments[j].image_y = 2;		
			
			j++;
		}
		i++;
	}
	
    return tmpdata;
 };

drillix.analysis.topx = function module(dt) {
		
	function exports(_selection)	 {	
		_selection.each(function(_data) {

			if (!svg) {
				//title
				var title = d3.select(this).append("h1")
					.attr("style","font-size:25px;padding:5px;text-align:center");
				
				title.append("img")
					.attr("src","datacilinder.png")
					.attr("style","width:16px;height:32px;margin-right:5px");
					
				title.append("span")
					.text(_data.title)		
					
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
							
								
				var container = svg.append("g").classed("container",true);
				container.append("g").classed("rankingbargroup",true);
			};				
			
			var rankingbars = svg.select(".container").select('.rankingbargroup').selectAll('.bar').data(_data.base.data);
			
			// Draw boxes    	

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
					.attr('x',function(d,i) {
						return d.x;
					})
					.attr('y',function(d,i) {
						return d.y;
					})				
					.attr('width',function(d,i) {
						return d.width;
					})
					.attr('height',function(d,i) {
						return d.height;
					});		
		
			//ranking number circles
			el.append("circle").classed('bar',true)
				.classed('shadow',true)
					.attr('fill','#ffffc0')
					.attr('stroke','grey')
					.style('stroke-width',1)
					.transition()
					.attr('cx', function(d,i) {
						return d.ranking_x;
					})
					.attr('cy',function(d,i) {
						return d.ranking_y;
					})
					.attr('r',function(d,i) {
						return d.rankingcirclesize;
					})
					.attr('height',function(d,i) {
						return d.height;
					});	
				
			//ranking numbers
			el.append("text")
				.attr("font-size",function(d,i) {
					return d.rankingfontsize;
				})
				.attr('y',function(d,i) {
					return d.rankingnumber_y;
				})
				.attr("x",function(d,i) {
					return d.rankingnumber_x;
				})
				.text(function(d,i){
					return d.rankingnumber;
				});
		
			//dimension name
			el.append("text")
				.attr("font-size", function(d,i) {
					return d.labelfontsize;
				})
				.transition()
				.attr('y',function(d,i) {
					return d.rankingtext_y;
				})
				.attr("x",function(d,i) {
					return d.rankingtext_x;
				})
				.text(function(d,i) {
					return d.label;
				});
		
			//dimension name underline
			el.append("line")
				.attr("x1",function(d,i) {
					return d.textunderline_start;
				})
				.attr("y1",function(d,i) {
					return d.textunderline_y;
				})
				.attr("x2",function(d,i) {
					return d.textunderline_end;
				})
				.attr("y2",function(d,i) {
					return d.textunderline_y;
				})
				.attr("style","stroke:grey;stroke-width:1");	
			
			//measurement bars
			el.append("rect")
				.attr("x",function(d,i) {
					return d.measurebar_x;
				})
				.attr("y",function(d,i){
					return d.measurebar_y;
				})
				.attr('fill','#80FF80')
				.attr('stroke', '#80FF00')
				.attr('width',0)
				.transition()
				.duration(500)
				.attr("width",function(d,i) {
					return d.measurebar_width;
				})
				.attr("height",function(d,i) {
					return d.measurebar_height;
				})
				.attr("style","stroke:grey;stroke-width:1");
		
			el.append("text")
				.attr("font-family","monospace")
				.attr("font-size",function(d,i) {
					return d.measurevaluefontsize;
				})
				.attr("x",function(d,i) {
					return d.measurevalue_x;
				})
				.attr("y",function(d,i) {
					return d.measurevalue_y;
				})
				.text(function(d,i) {
					return d.value;
				});		
		});		
	};
	
	function drawboxes(rankingbars,data) {
	};
	
	return exports;
};

var analysisdata = drillix.layout.topx(data);
var topxbase = drillix.analysis.topx(analysisdata);
var topgraphbase = d3.select("#analysis").datum(analysisdata).call(topxbase);   
