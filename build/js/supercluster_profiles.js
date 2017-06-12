import cluster_data from './cluster_data.js';
import sc_stack from './sc_stack.js';
import bar_charts from './bar_charts.js';

export default function supercluster_profiles(container){

	var supercluster_profile_data = cluster_data.super;

	supercluster_profile_data.sort(function(a,b){
		return a.superclus2 - b.superclus2;
	});

	var tot_oow = d3.sum(supercluster_profile_data, function(d){return d.count});

	var sc_stacker = sc_stack();

	var wrap = d3.select(container);

	//one-time profile setup
	var slides = wrap.selectAll("div.supercluster-profile")
					 .data(supercluster_profile_data)
					 .enter().append("div")
					 .classed("supercluster-profile",true)
					 ;

	slides.each(function(d,i){
		//console.log(d);

		var thiz = d3.select(this);

		var COLOR = sc_stacker.color(d.superclus2);
		//thiz.append("div").classed("h-border",true);
		//console.log(d);
		var title_box = thiz.append("div");
		var title = title_box.append("p")
							 .classed("cluster-title",true);
			
			title.append("div").style("background-color", COLOR);
			title.append("span").text(sc_stacker.title(d.superclus2));

							 ;
		var svg = title_box.append("svg").style("width", "100%").style("height","50px");

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

		sc_stacker.stack(rect_data, svg);
		

		var content = thiz.append("div")
						  .style("min-height","100px")
						  .style("padding","1em")
						  .style("margin","0em 0em 0em 0em")
						  .style("width","100%")
						  .classed("makesans c-fix",true);

		var bar_chart_wrap = content.append("div").style("float","left");

		bar_charts(d, bar_chart_wrap, COLOR);

		var textWrap = content.append("div")
								.style("float","right")
								.classed("reading",true)
								.style("margin","3em 2em 0em 0em")
								.style("max-width","480px")
								.append("p")
								.text("[130-140 word overview of group.] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus iaculis, risus at finibus commodo, lorem leo suscipit ligula, eget vestibulum turpis lectus a arcu. Pellentesque elementum ex vitae risus maximus maximus eu sit amet mauris. Donec odio sem, pharetra in luctus a, bibendum sit amet ex. Aenean arcu nunc, ultrices vitae tortor quis, commodo hendrerit elit. Donec elementum, nisl et tincidunt pretium, neque diam ornare odio, ut congue nulla leo ac tellus. Phasellus ipsum lacus, scelerisque nec urna ac, sollicitudin eleifend enim. Praesent gravida tempor nisl at lacinia. Aliquam tincidunt enim ac turpis pretium, sed lacinia tortor sollicitudin. Quisque nec erat magna. Curabitur sodales, nisl eu commodo aliquet, mi lorem luctus felis, at euismod ipsum elit non leo. Integer non eleifend turpis. Vivamus feugiat sem eu libero accumsan ornare.");


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

	});

}