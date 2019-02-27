import format from '../../../js-modules/formats.js';

export default function sc_stack(drop_shadow_ref){

	var colors = ['#666666','#65a4e5','#a6d854','#0d73d6','#fc8d62','#66c2a5','#e5c494','#ffd92f'];

	var titles = [
		"Total out-of-work population",
		"Less-educated prime-age people",
		"Diverse, less educated, and eyeing retirement",
		"Young, less-educated, and diverse",
		"Moderately educated older people",
		"Motivated and moderately educated younger people",
		"Highly educated, high-income older people",
		"Highly educated and engaged younger people"
	];

	var descriptions = {
		"1":"Members of this largest group have at most a high school diploma (or equivalent), and 44 percent did not complete high school. They are nearly all “prime age,” between 25 and 54 years old. The plurality is Latino, and nearly half were born outside the United States—although two-thirds of all members are U.S. citizens. A large percentage are English language-learners and over half speak a language other than English at home. Half are married and a third are supporting a child under 18 in their home. Compared with other groups, this group shows moderate levels of interest in work.",
		"2":"Members of this group were least likely both to be actively looking for work and to have worked in the previous year. Nearly all are over 55 and may be eyeing retirement, but are not receiving retirement or disability benefits. They are the least likely to be caring for children in their home. All completed at most high school; they are the most likely to report some form of disability; and just 61 percent speak English “very well,” the lowest rate of any group. Nearly half were born outside the United States, although 73 percent of all members are U.S. citizens.",
		"3":"Nearly all members of this group are under age 35. It is the most racially and ethnically diverse group, and has the highest rate of caring for children in the household—many with children under age 6—and single parents. At the same time, this group has the highest rate of young adults living in their parents’ home. Members have at most a high school diploma (or equivalent), and 41 percent have not completed high school. Median family income is $30,753, the lowest of any group; and 58 percent receive safety net support. More than one-third are actively looking for work.",
		"4":"All members of this group completed at least some college and at most an occupational certificate or Associate degree. Over half are 55 or older, and three-quarters are over the age of 46. This group is overwhelmingly native-born, white, and English-speaking. Perhaps related to their older-than-average age, an above-average share of this group reports some form of disability. They report moderate family incomes and moderate work engagement relative to the other groups.",
		"5":"This group has the highest rates of actively looking for work, and of school enrollment. They are in the beginning of their prime working years, at median age 33. Those in school are “nontraditional” students actively looking for work. All members have completed at least some college, and may have an occupational certificate or Associate degree. The majority are native-born and English-speaking. They have the second-highest rate of caring for children under 18, about the same as the less-educated prime-age group.",
		"6":"This is the wealthiest group, reporting median family income of $83,546. Two-thirds are married, the highest rate of any group, but few are caring for children. It is also the least racially and ethnically diverse group, and just 14 percent speak English less than very well. Twenty-nine percent were born outside the U.S., but like all members of the group, all possess a Bachelor degree or higher; and 88 percent of all members are U.S. citizens. They show moderate interest in work, comparable to that of the largest group of less-educated prime-age workers.",
		"7":"Among all groups, members of this group were the most likely to have worked in the previous year, and they have the second-highest rate of actively looking for work. They are the least likely of any group to report some form of disability. All members have at least a Bachelor degree and relatively high median family income. This group is predominantly white and Asian; 39 percent were born outside the United States. Over half are married, and a quarter are married with children—the highest rate of any group."
	}	

	var drop_shadow = arguments.length > 0 ? drop_shadow_ref : "url(#feBlur)";

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

	sc.overview = sc.description = function(superclus){
		if(superclus == "ALL" || superclus == null){
			return "";
		}
		else{
			return descriptions[superclus+""];
		}
	}

	var rect_height = 50;

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
		var rectsGE = rectsG0.enter().append("g").classed("rect-g",true);
			rectsGE.append("title");
		var rectsG = rectsGE.merge(rectsG0).style("pointer-events","all");

		rectsG.select("title").text(function(d){
			return sc.title(d.id);
		});

		rectsG.filter(function(d){return d.id==highlight}).raise();

		var rects0 = rectsG.selectAll("rect").data(function(d){return [d,d]});
			rects0.exit().remove();
		var rects = rects0.enter().append("rect").merge(rects0)
						.attr("height",function(d,i){return i==1 ? rect_height : rect_height+4})
						.attr("y",function(d,i){return i==1 ? 0 : -2})
						.style("shape-rendering","crispEdges")
						.style("stroke","#eeeeee")
						.style("stroke-width","0")
						.style("visibility",function(d,i){return i==1 ? "visible" : (d.id==highlight ? "visible" : "hidden")})
						.attr("filter", function(d,i){
							return i==0 && d.id==highlight ? drop_shadow : null;
						})
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
						.attr("y", rect_height)
						.attr("dy",17)
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
								.attr("y", rect_height)
								.attr("dy",35)
								.attr("dx",-3)
								.attr("text-anchor","end")
								.style("fill",function(d,i){
									return d3.color(sc.color(d.id)).darker(1.25);
								})
								.style("font-size","15px")
								.style("visibility","hidden")
								;

		if(!!add_borders){
			var line_rect_data = [];
			var r = -1;
			while(++r < rect_data.length){
				if(rect_data[r].count > 0){
					line_rect_data.push(rect_data[r]);
				}
			}

			var lines0 = svg.selectAll("line").data(line_rect_data, function(d){return d.mergeid});
				lines0.exit().remove();
			var lines = lines0.enter().append("line")
					.merge(lines0)
					.attr("y1",-2).attr("y2",rect_height+4)
					.attr("stroke","#ffffff")
					.attr("stroke-width","1px")
					.style("shape-rendering","auto")
					;

				//raise the selected above lines
				rectsG.filter(function(d){return d.id==highlight}).raise();
				//raise all but selected line above the rectG
				lines.filter(function(d){
					return d.id != highlight;
				}).raise();

				lines.transition()
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


		var text_num_fixed = false;
		if(arguments.length > 2 && typeof rect_callback == "function"){
			var selected_superclus = "ALL";
			var selected_group = "ALL";
			rectsG.on("mousedown", function(d,i){
				
				if(d.id === selected_superclus && d.group === selected_group){
					//reset to no selection
					selected_superclus = "ALL";
					selected_group = "ALL";
				}
				else{
					selected_superclus = d.id;
					selected_group = d.group;
					d3.select(this).raise();
				}

				lines.filter(function(d){
					return d.id != selected_superclus || d.group != selected_group;
				}).raise();

				rects.filter(function(d,i){return i==0})
						.style("visibility", function(d,i){
							return d.id===selected_superclus && d.group===selected_group ? "visible" : "hidden";
						}).attr("filter", function(d,i){
							return d.id===selected_superclus ? drop_shadow : null;
						})

				text_num_fixed = selected_superclus == "ALL" ? false : i;
				text_num_fixed = false; //never fix, for now
				
				text_nums.style("visibility", function(d,j){
					return j==i ? "visible" : "hidden";
				})

				rect_callback(selected_group, selected_superclus, d);
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

	}

	return sc;
}