import format from '../../../js-modules/formats.js';

export default function sc_stack(){
	//color credit: colorbrewer2.org
	var colors = ['#666666','#0d73d6','#65a4e5','#a6d854','#66c2a5','#fc8d62','#ffd92f','#e5c494'];

	var titles = [
		"Total out-of-work population",
		"Less educated prime-age people",
		"Diverse, less educated, and eyeing retirement",
		"Young, less-educated, and diverse",
		"Moderately educated older people",
		"Motivated and moderately educated younger people",
		"Highly educated, high-income older people",
		"Highly educated and engaged younger people"
	];

	var sc = {};

	sc.color = function(superclus){
		if(superclus == "ALL" || superclus == null){
			return colors[0];
		}
		else{
			return colors[+superclus];
		}
	}

	sc.title = function(superclus){
		if(superclus == "ALL" || superclus == null){
			return titles[0];
		}
		else{
			return titles[+superclus];
		}
	}

	//rect_data should look like: [{count:x, share:count/total, id:superclus2}]
	sc.stack = function(rect_data, svg, rect_callback, add_borders, highlight){
		var cumulative = 0;
		rect_data.forEach(function(d,i,a){
			d.cumulative = cumulative;
			cumulative += d.share;
		});		

		svg.style("overflow","visible");

		var transition_duration = 1000;	

		var rectsG0 = svg.selectAll("g.rect-g").data(rect_data, function(d){return d.mergeid});
			rectsG0.exit().transition().duration(1000).style("opacity","0").on("end", function(){d3.select(this).remove()});
		var rectsG = rectsG0.enter().append("g").classed("rect-g",true).merge(rectsG0).style("pointer-events","all");

		var rects0 = rectsG.selectAll("rect").data(function(d){return [d,d]});
			rects0.exit().remove();
		var rects = rects0.enter().append("rect").merge(rects0)
						.attr("height",function(d,i){return i==1 ? "100%" : "108%"})
						.attr("y",function(d,i){return i==1 ? "0%" : "-4%"})
						.style("shape-rendering","crispEdges")
						.style("stroke","#eeeeee")
						.style("stroke-width","0")
						.style("visibility",function(d,i){return i==1 ? "visible" : (d.id==highlight ? "visible" : "hidden")})
						;

			rects.transition()
				.duration(transition_duration)
				.attr("fill",function(d,i){
					var col = sc.color(d.id);
					return i<2 ? col : d3.color(col).darker();
				})
				.attr("x", function(d,i){
					return (d.cumulative*100)+"%";
				})
				.attr("width", function(d){return (d.share*100)+"%" })
				; 

		var textG0 = svg.selectAll("g.text-g").data(rect_data).style("opacity","0");
			textG0.exit().remove();
		var textG = textG0.enter().append("g").classed("text-g",true).merge(textG0);

		var texts0 = textG.selectAll("text").data(function(d){return d.share > 0.03 ? [d,d] : []});
			texts0.exit().remove();
		var texts = texts0.enter().append("text").merge(texts0)
						.attr("x", function(d){return (100*(d.cumulative + d.share))+"%"})
						.attr("y", "100%")
						.attr("dy",16)
						.attr("dx",-3)
						.attr("text-anchor","end")
						.text(function(d){return format.sh1(d.share)})
						.style("fill",function(d,i){
							return d3.color(sc.color(d.id)).darker(1.25);
						})
						.style("stroke-opacity",function(d,i){
							return i == 0 ? 0.4 : 1;
						})
						.style("stroke",function(d,i){
							return i == 0 ? "#eeeeee" : null;
						})
						.style("stroke-width",function(d,i){
							return i == 0 ? 3 : null;
						})
						.style("font-weight",function(d,i){
							return i == 0 ? "normal" : "normal";
						})
						.style("font-size","15px")
						
		textG.transition()
			.delay(transition_duration)
			.duration(transition_duration/2)
			.style("opacity","1")
			;

		var text_num0 = svg.selectAll("text.count").data(rect_data);
			text_num0.exit().remove();
		var text_nums = text_num0.enter().append("text")
								.classed("count",true)
								.merge(text_num0)
								.text(function(d,i){
									return format.num0(d.count)
								}) 
								.attr("x", function(d){return (100*(d.cumulative + d.share))+"%"})
								.attr("y", "100%")
								.attr("dy",35)
								.attr("dx",-3)
								.attr("text-anchor","end")
								.style("fill",function(d,i){
									return d3.color(sc.color(d.id)).darker(1.25);
								})
								.style("font-size","15px")
								.style("visibility","hidden")
								;

		var text_num_fixed = false;
		if(arguments.length > 2 && typeof rect_callback == "function"){
			var selected_superclus = null;
			var selected_group = null;
			rectsG.on("mousedown", function(d,i){
				if(d.id === selected_superclus && d.group === selected_group){
					selected_superclus = null;
					selected_group = null;
				}
				else{
					selected_superclus = d.id;
					selected_group = d.group;
				}

				rectsG.selectAll("rect").filter(function(d,i){return i==0}).style("visibility", function(d,i){
					return d.id===selected_superclus && d.group===selected_group ? "visible" : "hidden";
				})

				text_num_fixed = selected_superclus == "ALL" ? false : i;
				text_num_fixed = false; //never fix, for now
				
				text_nums.style("visibility", function(d,j){
					return j==i ? "visible" : "hidden";
				})
				//rects.style("stroke",function(d,i){return sc.color(d.id)});
				//if(selected_superclus!="ALL"){
				//	d3.select(this)
				//	  .style("stroke",function(d,i){
				//		return d3.color(sc.color(d.id)).darker();
				//	}).raise();
				//}
				rect_callback(selected_superclus, selected_group, d);
			}).style("cursor","pointer");
		}

		rectsG.on("mouseenter",function(d,i){
			text_nums.style("visibility", function(d,j){
				return j==i ? "visible" : "hidden";
			});			
		});

		rectsG.on("mouseleave",function(d,i){
			text_nums.style("visibility", function(d,j){
				return j===text_num_fixed ? "visible" : "hidden";
			});			
		});

		if(!!add_borders){
			var lines0 = svg.selectAll("line").data(rect_data, function(d){return d.mergeid});
			lines0.exit().remove();
			lines0.enter().append("line")
					.merge(lines0)
					.attr("y1","-5%").attr("y2","105%")
					.attr("stroke","#ffffff")
					.attr("stroke-width","1px")
					.style("shape-rendering","auto")
					.transition()
					.duration(transition_duration)
					.attr("x1", function(d){
						return ((d.cumulative+d.share)*100)+"%";
					})
					.attr("x2", function(d){
						return ((d.cumulative+d.share)*100)+"%";
					})
					.on("end",function(d){
						d3.select(this).style("shape-rendering","crispEdges")
					})
					;
		}
	}

	return sc;
}