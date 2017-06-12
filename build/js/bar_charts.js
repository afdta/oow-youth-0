export default function bar_charts(input_datarray, wrap, col){
	var color = arguments.length > 2 ? col : "#444444";
	wrap.selectAll("div").remove();

	var chartWrap1 = wrap.append("div").style("float", "left").style("margin","3em 2em 0em 0em");
	var chartWrap2 = wrap.append("div").style("float", "left").style("margin","3em 2em 0em 0em");

	var datarray_ = [].concat(input_datarray);
	//datarray: an array of data objects

	var data_stacker = function(keys, labels){
		var datarray = datarray_.slice(0);
		var tot = d3.sum(datarray, function(d){return d.count});
		
		var wrought = keys.map(function(key,i){
			var obs = {};
			obs.variable = key;
			obs.varlabel = labels[i];
			for(var j=0; j<datarray.length; j++){
				obs["group_share"+j] = datarray[j][key];
				obs["share"+j] = datarray[j][key]*datarray[j].count / tot;
				obs["count"+j] = datarray[j][key]*datarray[j].count;
			}
			return obs;
		});

		var countKeys = d3.range(0, datarray.length).map(function(d){return "count"+d});

		var stacked = d3.stack().keys(countKeys)(wrought);

		var scale = d3.scaleLinear().domain([0,tot]).range([0,0.9]);

		return {raw: wrought, stacked:stacked, total:tot, scale:scale, nbars:keys.length, binary:false, labels:labels};
	}

	//a special case data stacker that takes a single key and returns a stack:
	// [[group_a0, group_a1], [group_b0, group_b1]] where group_a is yes, group_b is no (1-yes)
	var data_stacker2 = function(key, keylabel, otherlabel){
		var datarray = datarray_.slice(0);
		var tot = d3.sum(datarray, function(d){return d.count});
		var map1 = datarray.map(function(d,i){
			var group = {id:"count"+i};
			group.yes = d[key]*d.count;
			group.no = (1-d[key])*d.count;
			return group;
		});

		//do the stacking
		var cumulative = {yes:0, no:d3.sum(map1, function(d){return d.yes})}
		var map2 = map1.map(function(d,i){
			//[yes, no]
			var new_yes_top = cumulative.yes+d.yes;
			var new_no_top = cumulative.no+d.no;
			var group = [[cumulative.yes, new_yes_top],
						 [cumulative.no, new_no_top]];
			cumulative.yes = new_yes_top;
			cumulative.no = new_no_top;
			group.id = d.id;
			return group;
		});

		var scale = d3.scaleLinear().domain([0,tot]).range([0,0.9]);

		return {raw:map1, stacked:map2, total:tot, scale:scale, nbars:1, binary:true, labels:null};
	}

	var chartWidget = function(title, data, wrapper){
		//var bars = data.filter(function(d){return d.value >= 0.0045});
		//var colScale = d3.interpolateLab("#eeeeee", COLOR);
		var bars = data.stack;
		var wrap = wrapper.append("div").classed("chart-widget", true);
		wrap.append("p").html(title)
						.style("margin","0em 0em 0.5em 0em")
						.style("padding","0px 10px 0.25em 10px")
						.style("border-bottom","1px dotted " + color)
						//.style("font-weight","bold");
		
		var outer_svg = wrap.append("svg").style("overflow","visible");
		var svg = outer_svg.append("svg").style("overflow","visible");
		var labels = outer_svg.append("g");
		var yaxis = labels.append("line").attr("x1","0")
										 .attr("x2","0")
										 .attr("y1","0%")
										 .attr("y2","100%")
										 .attr("stroke","#555555")
										 .style("shape-rendering","crispEdges")
										 .style("visibility","hidden");
		
		var bar_height = 15;
		var pad = 5;
		var w = 320;
		var label_width = 100;
		var h = data.nbars*bar_height + data.nbars + (2*pad);
		
		if(data.labels !== null){
			var l0 = labels.selectAll("text").data(data.labels);
			l0.exit().remove();
			var l1 = l0.enter().append("text").merge(l0);

			l1.text(function(d){return d})
				.attr("text-anchor","end")
				.attr("x","0")
				.attr("y", function(d,i){
					return pad+(i*(bar_height+1))
				})
				.attr("dx","-5px")
				.attr("dy",12)
				.text(function(d){
					return d;
				})
				.style("fill","#555555")
				.style("font-size","15px")
				;
			labels.attr("transform","translate("+label_width+",0)");
			yaxis.style("visibility","visible");
		}		

		outer_svg.attr("width",w+"px").attr("height",h+"px")
		svg.attr("height","100%")
		   .attr("width", data.labels !== null ? (w-label_width)+"px" : w+"px")
		   .attr("x", data.labels !== null ? label_width+"px" : "0px")
		   ;

		var groups0 = svg.selectAll("g.group").data(data.stacked);
			groups0.exit().remove();
		var groups = groups0.enter()
							.append("g")
							.classed("group",true)
							.merge(groups0)
							;

		var rects0 = groups.selectAll("rect").data(function(d){return d});
			rects0.exit().remove();
		var rects = rects0.enter()
						  .append("rect")
						  .merge(rects0)
						  .attr("x", function(d){return (100*data.scale(d[0]))+"%" })
						  .attr("y", function(d,i){return data.binary ? pad : pad+(i*(bar_height+1))})
						  .attr("height", bar_height)
						  .attr("width", function(d){return (100*(data.scale(d[1])-data.scale(d[0])))+"%" })
						  .attr("fill", color)
						  .attr("fill-opacity", function(d,i){
						  	//if it's a binary stack, the second obs in each group is the "no" (1-"yes")
						  	return data.binary && i==1 ? 0.35 : 1;
						  })
						  .attr("stroke", "#ffffff")
						  .style("shape-rendering","crispEdges")
						  ;
	}

	var age_data = data_stacker(["a2534","a3544","a4554","a5564"], ["25–34","35–44","45–44","55–64"]);
	var edu_data = data_stacker(["lths","hs","sc","aa","baplus"],["<HS","HS","Some college","Associate's","BA+"]);
	var race_data = data_stacker(["whiteNH","blackNH","latino","asianNH","otherNH"],
								 ["White",  "Black",  "Latino","Asian",  "Other"]);

	var sex_data = data_stacker2("male", "Male", "Female");
	var disability_data = data_stacker2("dis", "Disabled", "Not disabled");
	var lep_data = data_stacker2("lep", "LEP", "Non-LEP");
	var children_data = data_stacker2("children", "One or more", "None");
	var looking_data = data_stacker2("unemployed", "Looking", "Not looking");

	chartWidget("Age", age_data, chartWrap1);
	chartWidget("Educational attainment", edu_data, chartWrap1);
	chartWidget("Race", race_data, chartWrap1);	

	chartWidget("Male share", sex_data, chartWrap2);
	chartWidget("Disability status", disability_data, chartWrap2);
	chartWidget("Limited English proficiency (LEP)", lep_data, chartWrap2);
	chartWidget("Is caring for children", children_data, chartWrap2);
	chartWidget("Looking for work", looking_data, chartWrap2);


	return null;


	//deprecated...
	var age_data = function(){


						return [{label:"25–34", value:d.a2534}, 
								{label:"35–44", value:d.a3544}, 
								{label:"45–44", value:d.a4554}, 
								{label:"55–64", value:d.a5564}];
					};

	var edu_data = function(){
			var D = [//{label:"In school", value:d.insch}, 
					{label:"<HS", value:d.lths}, 
					{label:"HS", value:d.hs}, 
					{label:"Some college", value:d.sc}, 
					{label:"Associate's", value:d.aa},
					{label:"BA+", value:d.baplus}];
					//console.log(d3.sum(D, function(d){return d.value}));
			return D;
		}

	var race_data = function(){
			var D = [{label:"White", value:d.whiteNH}, 
					{label:"Black", value:d.blackNH}, 
					{label:"Hispanic", value:d.latino}, 
					{label:"Asian", value:d.asianNH},
					{label:"Other", value:d.otherNH}];
					//console.log(d3.sum(D, function(d){return d.value}));	
			return D;			
		};

	var sex_data = function(){
			var D = [{label:"Male", value:d.male}, 
					{label:"Female", value:1-d.male}];
			//console.log(d3.sum(D, function(d){return d.value}));
			return D		
		};

	var disability_data = function(){
			return [{label:"Disability", value:d.dis}, 
					{label:"No disability", value:1-d.dis}];
			
		};

	var lep_data = function(){
			return [{label:"LEP", value:d.lep}, 
					{label:"Non-Lep", value:1-d.lep}];
		};

	var children_data = function(){
			return [{label:"One or more", value:d.children}, 
					{label:"None", value:1-d.children}]
					;
		};

	var looking_data = function(){
			return [{label:"Looking", value:d.unemployed},
					{label:"Not looking", value:1-d.unemployed}
					];
		};

		//Worked in last year
		//(function(){
		//	var vals = [{label:"Yes", value:d.lastworked_pastyr}, 
		//				{label:"No", value:1-d.lastworked_pastyr}
		//				]
		//				;
		//	chartWidget("Worked in the last year", vals, true);
		//})();

	var chartWidgetDeprecated = function(title, data, stacked, wrapper){
			var stack = arguments.length > 2 ? !!stacked : false;
			var bars = data.filter(function(d){return d.value >= 0.0045});
			var colScale = d3.interpolateLab("#eeeeee", COLOR);

			var wrap = wrapper.append("div").classed("chart-widget", true);
			wrap.append("p").html(title).style("margin","0em 0em 0em 0em");
			var svg = wrap.append("svg");
			var bar_height = 15;
			var pad = 5;
			var w = 320;
			var h = !!stack ? bar_height + pad*2 : ((bars.length*bar_height) + (bars.length*1) + (2*pad));
			svg.style("height",h+"px").style("width",w+"px");

			var cumulative = 0;

			var mapped = bars.map(function(d,i){
				var obs = {};
				obs.label = d.label;
				obs.value = d.value;
				obs.width = (obs.value*100)+"%";
				if(!!stack){
					obs.x = (cumulative*100)+"%";
					obs.y = pad;
					cumulative = cumulative + d.value;
				}
				else{
					obs.y = pad + (i*(bar_height+1));
					obs.x = "0%"
				}
				return obs;
			});

			svg.selectAll("rect").data(mapped).enter().append("rect")
					.attr("x", function(d){return d.x})
					.attr("y", function(d){return d.y})
					.attr("width", function(d){return d.width})
					.attr("height", function(d){return bar_height})
					.attr("stroke", "#ffffff")
					.attr("stroke-width",0)
					.attr("fill", function(d,i){
						return COLOR;
						//return !!stack && i==1 ? "#dddddd" : COLOR
					})
					.attr("fill-opacity", function(d,i){
						return !!stack && i==1 ? 0.35 : 1;
					})
					.style("shape-rendering","crispEdges")
					;

		};
		
		chartWidget("Age", age_data(), false, chartWrap1);
		chartWidget("Educational attainment", edu_data(), false, chartWrap1);
		chartWidget("Race", race_data(), false, chartWrap1);	
		chartWidget("Male share", sex_data(), true, chartWrap2);
		chartWidget("Disability status", disability_data(), true, chartWrap2);
		chartWidget("Limited English proficiency (LEP)", lep_data(), true, chartWrap2);
		chartWidget("Is caring for children", children_data(), true, chartWrap2);
		chartWidget("Looking for work", looking_data(), true, chartWrap2);

}