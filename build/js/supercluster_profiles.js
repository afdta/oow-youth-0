import cluster_data from './cluster_data.js';
import sc_stack from './sc_stack.js';
import bar_charts from './bar_charts.js';
import avatars from './avatars.js';
import interventions from './interventions.js';

export default function supercluster_profiles(container){

	var supercluster_profile_data = cluster_data.super;

	var order = {"3":1, "1":2, "2":3, "5":4, "4":5, "7":6, "6":7}
	supercluster_profile_data.sort(function(a,b){
		var aval = order[a.superclus2+""];
		var bval = order[b.superclus2+""];
		return aval - bval;
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

	var I = interventions();

	slides.each(function(d,i){

		var thiz = d3.select(this);

		var COLOR = sc_stacker.color(d.superclus2);

		var title_box = thiz.append("div").style("margin-bottom","1em");
		var title = title_box.append("p")
							 .classed("cluster-title",true);
			
			title.append("div").style("background-color", COLOR);
			title.append("span").text(sc_stacker.title(d.superclus2));

							 ;
		var svg = title_box.append("svg").style("width", "100%").style("height","80px");

		var rect_data = supercluster_profile_data.map(function(d){
			return {count: d.count, id:d.superclus2, mergeid:d.superclus2, group:null, share:d.count/tot_oow}
		});



		sc_stacker.stack(rect_data, svg, null, true, d.superclus2);
		

		var wrap = thiz.append("div").classed("c-fix topline-bar-charts makesans",true)

		//overview_text
		var left_side = wrap.append("div").classed("left40",true).style("margin-top","5px");
		var overview_wrap = left_side.append("div").classed("reading",true).style("margin-left","10px")
			overview_wrap.append("p").classed("font1x",true).text("Overview").style("font-weight","bold").style("margin-bottom","0.4em")
			overview_wrap.append("p").text(sc_stacker.description(d.superclus2));

		var intervention_wrap = left_side.append("div").classed("c-fix",true);

		I.grid_small(intervention_wrap.node(), d.superclus2, COLOR);
		
		//bar charts
		var bar_chart_wrap = wrap.append("div").style("float","left").classed("left60",true).style("margin-top","5px");


		bar_charts(d, bar_chart_wrap, COLOR);

		var meet = wrap.append("div").style("margin","1em 0em 0em 0em")
										.style("padding","0em 0em 0em 0em")
										.style("clear","both")
										.classed("c-fix",true)
										;

		avatars(meet.node(), d.superclus2);
	});

}