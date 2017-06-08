import supercluster_profile_data from './supercluster_data.js';
import palette from '../../../js-modules/palette.js';
import format from '../../../js-modules/formats.js';

export default function supercluster_profiles(container){

	//color credit: colorbrewer2.org
	var colors = ['#666666','#0d73d6','#65a4e5','#a6d854','#66c2a5','#fc8d62','#ffd92f','#e5c494']

	supercluster_profile_data.sort(function(a,b){
		return a.superclus2 - b.superclus2;
	});

	var tot_oow = d3.sum(supercluster_profile_data, function(d){return d.count});

	var supercluster_titles = [
		"",
		"Less educated prime-age people",
		"Diverse, less educated, and eyeing retirement",
		"Young, less-educated, and diverse",
		"Moderately educated older people",
		"Motivated and moderately educated younger people",
		"Highly educated, high-income older people",
		"Highly educated and engaged younger people"
	]

	var wrap = d3.select(container);

	//one-time profile setup
	var slides = wrap.selectAll("div.supercluster-profile")
					 .data(supercluster_profile_data)
					 .enter().append("div")
					 .classed("supercluster-profile",true)
					 ;

	slides.each(function(d,i){
		console.log(d);

		var thiz = d3.select(this);

		var COLOR = colors[d.superclus2];
		//thiz.append("div").classed("h-border",true);
		//console.log(d);
		var title_box = thiz.append("div");
		var title = title_box.append("p")
							 .classed("cluster-title",true);
			
			title.append("div").style("background-color", COLOR);
			title.append("span").text(supercluster_titles[d.superclus2]);

							 ;
		var svg = title_box.append("svg").style("width", "100%").style("height","50px").style("overflow","visible");

		var rect_data = supercluster_profile_data.map(function(d){
			return {count: d.count, id:d.superclus2, share:d.count/tot_oow}
		}).sort(function(a,b){
			var compare = 0;
			if(a.id==d.superclus2){
				compare = -1;
			}
			else if(b.id==d.superclus2){
				compare = 1;
			}
			else{
				compare = a.id - b.id;
			}
			return compare;
		});

		var cumulative = 0;
		rect_data.forEach(function(d,i,a){
			d.cumulative = cumulative;
			cumulative += d.share;
		});			

		var rects = svg.selectAll("rect").data(rect_data).enter().append("rect")
						.attr("width", function(d){return (d.share*100)+"%" })
						.attr("height","100%")
						.attr("fill",function(d,i){
							return colors[d.id]
						})
						.attr("x", function(d,i){
							return (d.cumulative*100)+"%";
						})
						.style("shape-rendering","crispEdges")
						.style("stroke","#eeeeee")
						.style("stroke-width","1")
						; 

		var texts = svg.selectAll("g").data(rect_data).enter().append("g")
						.selectAll("text").data(function(d){return [d,d]}).enter().append("text")
						.attr("x", function(d){return (100*(d.cumulative + d.share))+"%"})
						.attr("y", 50)
						.attr("dy",15)
						.attr("dx",-3)
						.attr("text-anchor","end")
						.text(function(d){return format.sh1(d.share)})
						.style("fill",function(d,i){
							return d3.color(colors[d.id]).darker(1.25);
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
						;

		var content = thiz.append("div")
						  .style("min-height","100px")
						  .style("padding","1em")
						  .style("margin","0em 0em 0em 0em")
						  .style("width","100%")
						  .classed("makesans c-fix",true);

		var textWrap = content.append("div")
								.style("float","right")
								.classed("reading",true)
								.style("margin","3em 2em 0em 0em")
								.style("max-width","480px")
								.append("p")
								.text("[130-140 word overview of group.] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus iaculis, risus at finibus commodo, lorem leo suscipit ligula, eget vestibulum turpis lectus a arcu. Pellentesque elementum ex vitae risus maximus maximus eu sit amet mauris. Donec odio sem, pharetra in luctus a, bibendum sit amet ex. Aenean arcu nunc, ultrices vitae tortor quis, commodo hendrerit elit. Donec elementum, nisl et tincidunt pretium, neque diam ornare odio, ut congue nulla leo ac tellus. Phasellus ipsum lacus, scelerisque nec urna ac, sollicitudin eleifend enim. Praesent gravida tempor nisl at lacinia. Aliquam tincidunt enim ac turpis pretium, sed lacinia tortor sollicitudin. Quisque nec erat magna. Curabitur sodales, nisl eu commodo aliquet, mi lorem luctus felis, at euismod ipsum elit non leo. Integer non eleifend turpis. Vivamus feugiat sem eu libero accumsan ornare.")
		
		var chartWrap1 = content.append("div").style("float", "left").style("margin","3em 2em 0em 0em");
		var chartWrap2 = content.append("div").style("float", "left").style("margin","3em 2em 0em 0em");

		var meet = content.append("div").style("margin","1em 0em 0em 0em")
										.style("padding","0em 0em 0em 0em")
										.style("clear","both")
										.classed("c-fix",true)
										;

		meet.append("p").text("Meet avatar1 and avatar2")
						.style("padding","1em 0em 0.25em 0em")
						.style("font-weight","bold");

		var profile1 = meet.append("div").classed("avatar-profile c-fix",true).style("margin-right","5%");
		var avatar1 = profile1.append("div").classed("avatar",true).append("img")
								.attr("src", "./build/wireframes/avatar1.png")
								.attr("alt", "Avatar image")
								;
			profile1.append("div").classed("avatar-text reading",true)
								  .append("p")
								  .text("Avatar1 is ... [Description here...] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit malesuada erat, eu scelerisque orci aliquet sagittis. Vivamus iaculis, risus at finibus commodo, lorem leo suscipit ligula, eget vestibulum turpis lectus a arcu. Pellentesque elementum ex vitae risus maximus maximus eu sit amet mauris.")

		var profile2 = meet.append("div").classed("avatar-profile c-fix",true).style("margin-left","5%");
		var avatar2 = profile2.append("div").classed("avatar",true).append("img")
								.attr("src", "./build/wireframes/avatar2.png")
								.attr("alt", "Avatar image")
								;
			profile2.append("div").classed("avatar-text reading",true)
								  .append("p")
								  .text("Avatar2 is ... [Description here...] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit malesuada erat, eu scelerisque orci aliquet sagittis. Vivamus iaculis, risus at finibus commodo, lorem leo suscipit ligula, eget vestibulum turpis lectus a arcu. Pellentesque elementum ex vitae risus maximus maximus eu sit amet mauris.")



		//var subtitle = content.append("p").style("line-height","1.5em");
		//	subtitle.append("span").html("• " + format.num0(d.count) + " out-of-work <br />");
		//	subtitle.append("span").html("• " + format.sh1(d.count/tot_oow) + " of the out-of-work in 137 jurisdictions");  
		

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
			var h = !!stack ? bar_height + pad*2 : ((bars.length*bar_height) + (bars.length+1)*pad);
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
					obs.y = pad + (i*bar_height);
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
					.attr("stroke-width",1)
					.attr("fill", function(d){return COLOR})
					.style("shape-rendering","crispEdges")
					;

		};
		
		//Age
		(function(){
			var vals = [{label:"25–34", value:d.a2534}, 
						{label:"35–44", value:d.a3544}, 
						{label:"45–44", value:d.a4554}, 
						{label:"55–64", value:d.a5564}]
						;
						console.log(vals);
			chartWidget("Age", vals, false, chartWrap1);
		})();

		//Education
		(function(){
			var vals = [{label:"<HS", value:d.lths}, 
						{label:"HS", value:d.hs}, 
						{label:"Some college", value:d.sc}, 
						{label:"Associate's", value:d.aa},
						{label:"BA+", value:d.baplus}]
						;
			chartWidget("Educational attainment", vals, false, chartWrap1);
		})();

		//Race
		(function(){
			var vals = [{label:"White", value:d.whiteNH}, 
						{label:"Black", value:d.blackNH}, 
						{label:"Hispanic", value:d.latino}, 
						{label:"Asian", value:d.asianNH},
						{label:"Other", value:d.otherNH}]
						;
			chartWidget("Race", vals, false, chartWrap1);			
		})();

		//Sex
		(function(){
			var vals = [{label:"Male", value:d.male}, 
						{label:"Female", value:1-d.male}]
						;
			chartWidget("Sex", vals, true, chartWrap2);
		})();



		//Disaility
		(function(){
			var vals = [{label:"Disability", value:d.dis}, 
						{label:"No disability", value:1-d.dis}]
						;
			chartWidget("Disabililty status", vals, true, chartWrap2);
		})();

		//LEP
		(function(){
			var vals = [{label:"LEP", value:d.lep}, 
						{label:"Non-Lep", value:1-d.lep}]
						;
			chartWidget("Limited English proficiency (LEP)", vals, true, chartWrap2);
		})();

		//Children
		(function(){
			var vals = [{label:"One or more", value:d.children}, 
						{label:"None", value:1-d.children}]
						;
			chartWidget("Is caring for children", vals, true, chartWrap2);
		})();

		//Looking for work
		(function(){
			var vals = [{label:"Looking", value:d.unemployed},
						{label:"Not looking", value:1-d.unemployed}
						]
						;
			chartWidget("Looking for work", vals, true, chartWrap2);
		})();

		//Worked in last year
		//(function(){
		//	var vals = [{label:"Yes", value:d.lastworked_pastyr}, 
		//				{label:"No", value:1-d.lastworked_pastyr}
		//				]
		//				;
		//	chartWidget("Worked in the last year", vals, true);
		//})();

	});

}