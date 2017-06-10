export default function bar_charts(d, wrap, COLOR){

	var chartWrap1 = wrap.append("div").style("float", "left").style("margin","3em 2em 0em 0em");
	var chartWrap2 = wrap.append("div").style("float", "left").style("margin","3em 2em 0em 0em");

	var age_data = function(){
						return [{label:"25–34", value:d.a2534}, 
								{label:"35–44", value:d.a3544}, 
								{label:"45–44", value:d.a4554}, 
								{label:"55–64", value:d.a5564}];
					};

	var edu_data = function(){
			return [{label:"In school", value:d.insch}, 
					{label:"<HS", value:d.lths}, 
					{label:"HS", value:d.hs}, 
					{label:"Some college", value:d.sc}, 
					{label:"Associate's", value:d.aa},
					{label:"BA+", value:d.baplus}];
		}

	var race_data = function(){
			return [{label:"White", value:d.whiteNH}, 
					{label:"Black", value:d.blackNH}, 
					{label:"Hispanic", value:d.latino}, 
					{label:"Asian", value:d.asianNH},
					{label:"Other", value:d.otherNH}];				
		};

	var sex_data = function(){
			return [{label:"Male", value:d.male}, 
					{label:"Female", value:1-d.male}];		
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

	var chartWidget = function(title, data, stacked, wrapper){
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