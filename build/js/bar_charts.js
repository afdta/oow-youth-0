import format from '../../../js-modules/formats.js';

export default function bar_charts(input_datarray, outer_wrap, col){
	var color = arguments.length > 2 ? col : "#444444";

	outer_wrap.select("div").remove();

	var wrap = outer_wrap.append("div").classed("c-fix",true).style("margin","0em 0em");

	var chartWrap1 = wrap.append("div").style("float", "left").style("width","48%").style("min-width","250px").style("margin-right","4%");
	var chartWrap2 = wrap.append("div").style("float", "left").style("width","48%").style("min-width","250px");

	//datarray will always be an array of length 1
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

		var scale = d3.scaleLinear().domain([0,tot]).range([0,0.8]);

		return {raw: wrought, stacked:stacked, total:tot, scale:scale, nbars:keys.length, binary:false, labels:labels};
	}

	//a special case data stacker that takes a single key and returns a stack:
	// [[group_a0, group_a1], [group_b0, group_b1]] where group_a is yes, group_b is no (1-yes)
	var data_stacker2 = function(key, keylabel, otherlabel){
		var datarray = datarray_.slice(0);
		var tot = d3.sum(datarray, function(d){return d.count});
		var map1 = datarray.map(function(d,i){
			//in the current version, there will only be one group represented
			var group = {id:"count"+i};
			group.yes = d[key]*d.count;
			group.yes_share = d[key];
			group.no = (1-d[key])*d.count;
			group.no_share = (1-d[key]);
			return group;
		});

		//do the stacking
		var cumulative = {yes:0, no:d3.sum(map1, function(d){return d.yes})}
		var map2 = map1.map(function(d,i){
			//[yes, no]
			var new_yes_top = cumulative.yes+d.yes;
			var new_no_top = cumulative.no+d.no;
			var Y = [cumulative.yes, new_yes_top];
			var N = [cumulative.no, new_no_top];
				Y.data = d;
				Y.isyes = true;
				N.data = d;
				N.isyes = false;
			var group = [Y,N];
			cumulative.yes = new_yes_top;
			cumulative.no = new_no_top;
			group.id = d.id;
			return group;
		});

		var scale = d3.scaleLinear().domain([0,tot]).range([0,0.8]);

		return {raw:map1, stacked:map2, total:tot, scale:scale, nbars:1, binary:true, labels:null};
	}

	var chartWidget = function(title, data, wrapper){
		var bars = data.stack;
		var wrap = wrapper.append("div").classed("chart-widget", true);
		wrap.append("p").html(title)
						.style("margin","0em 0em 0.5em 0em")
						.style("padding","0px 10px 0.25em 10px")
						.style("border-bottom","1px dotted " + color)
						;
		
		var outer_svg = wrap.append("div").style("margin-left",data.labels==null ? "10px" : "0px").append("svg").style("overflow","visible");
		var svg = outer_svg.append("svg").style("overflow","visible");
		var labels = outer_svg.append("g");
		var anno = svg.append("g");
		
		//var w = chart_width-20;
		var label_width = 100;
		var label_pos = 35;

		var yaxis = labels.append("line").attr("x1",label_pos+"%")
										 .attr("x2",label_pos+"%")
										 .attr("y1","0%")
										 .attr("y2","100%")
										 .attr("stroke","#555555")
										 .style("shape-rendering","crispEdges")
										 .style("visibility","hidden");
		
		var bar_height = 15;
		var pad = 5;

		var h = data.nbars*bar_height + data.nbars + (2*pad);
		
		if(data.labels !== null){
			var l0 = labels.selectAll("text").data(data.labels);
			l0.exit().remove();
			var l1 = l0.enter().append("text").merge(l0);

			l1.text(function(d){return d})
				.attr("text-anchor","end")
				.attr("x",label_pos+"%")
				.attr("y", function(d,i){
					return pad+(i*(bar_height+1))
				})
				.attr("dx","-5px")
				.attr("dy",13)
				.text(function(d){
					return d;
				})
				.style("fill","#555555")
				.style("font-size","15px")
				;

			yaxis.style("visibility","visible");
		}		


		outer_svg.attr("width","100%").attr("height",h+"px");

		svg.attr("height","100%")
		   .attr("width", data.labels !== null ? (100-label_pos)+"%" : "100%")
		   .attr("x", data.labels !== null ? label_pos+"%" : "0%")
		   ;

		//groups are clusters / subgroups (only 1 in this version of graphic -- not stacked)
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
						  	return data.binary && i==1 ? 0.2 : 1;
						  })
						  .attr("stroke", "#ffffff")
						  .style("shape-rendering","crispEdges")
						  ;

		var t0 = anno.selectAll("g.group").data(data.stacked);
			t0.exit().remove();
		var tg = t0.enter().append("g")
							.classed("group",true)
							.merge(t0)
							;

		var txt0 = tg.selectAll("text").data(function(d){return d});
			txt0.exit().remove();
		var txts = txt0.enter()
						  .append("text")
						  .merge(txt0)
						  .attr("x", function(d){return (100*data.scale(d[1]))+"%" })
						  .attr("y", function(d,i){return data.binary ? pad : pad+(i*(bar_height+1))})
						  .attr("dy","13")
						  .attr("dx","3")
						  .style("font-size","15px")
						  .style("fill","#555555")
						  .attr("fill-opacity", function(d,i){
						  	//if it's a binary stack, the second obs in each group is the "no" (1-"yes")
						  	return data.binary && i==1 ? 0.35 : 1;
						  })
						  .text(function(d){
						  	if(data.binary){
						  		return d.isyes ? format.sh1(d.data.yes_share) : "";
						  	}
						  	else{
						  		return d.data.share0 > 0 && d.data.share0 < 1 ? format.sh1(d.data.share0) : format.sh0(d.data.share0);
						  	}
						  	
						  })
						  ;

	}

	var age_data = data_stacker(["a2534","a3544","a4554","a5564"], ["25–34","35–44","45–54","55–64"]);
	var edu_data = data_stacker(["lths","hs","sc","aa","baplus"],["<HS","HS","Some college","Associate","BA+"]);
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
	chartWidget("Has a disability", disability_data, chartWrap2);
	chartWidget("Limited English proficiency (LEP)", lep_data, chartWrap2);
	chartWidget("Caring for children", children_data, chartWrap2);
	chartWidget("Looking for work", looking_data, chartWrap2);

}