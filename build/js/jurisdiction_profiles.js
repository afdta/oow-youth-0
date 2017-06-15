import cluster_data from './cluster_data.js';
import format from '../../../js-modules/formats.js';
import sc_stack from './sc_stack.js';
import bar_charts from './bar_charts.js';
import puma_maps from './puma_maps.js';
import topline from './topline.js';
import interventions from './interventions.js';

export default function jurisdiction_profiles(container){
	var sc_stacker = sc_stack();
	
	//DATA
	var jurisdiction_data = cluster_data.jurisdiction;
	var options_data = cluster_data.lookup.sort(function(a,b){return a.Name_final < b.Name_final ? -1 : 1});
	

	//NEST DATA
	var nest = d3.nest().key(function(d){return d.FIPS_final})
						.key(function(d){return d.superclus2});

	var nest2 = d3.nest().key(function(d){return d.FIPS_final})
						.key(function(d){return d.superclus2})
						.rollup(function(d){
							return d3.sum(d, function(obs){return obs.count});
						});

	var nested_data = nest.object(jurisdiction_data); 
	var nested_data2 = nest.entries(jurisdiction_data);
	var nested_sums = nest2.object(jurisdiction_data);

	//BUILD A PLACE NAME LOOKUP
	var place_lookup = {};
	(function(){
		var i = -1;
		while(++i < options_data.length){
			place_lookup[options_data[i].FIPS_final] = options_data[i].Name_final;
		}
	})();
	
	//DOM STRUCTURE---------------
		var outer_wrap = d3.select(container).classed("makesans c-fix", true).style("margin-top","2em");
		
		
		//title above ribbon
		var title_wrap = outer_wrap.append("div").classed("c-fix",true).style("display","table").style("width","100%");

		var top_title = title_wrap.append("p").style("display","table-cell")
			.style("padding","0em 2em 0.5em 10px")
			.style("line-height","1.25em")
			.style("vertical-align","bottom");

		var place_title = top_title.append("span").classed("font1x",true).style("font-weight","bold")
					 				.text("Distribution of major out-of-work groups in ").append("span");
			
			top_title.append("span").text(" | ");
			top_title.append("span").html("<em>Select a segment to view underlying data</em>").style("white-space","nowrap")
		
		//select menu
		var select_wrap = title_wrap.append("div")
									.style("display","table-cell")
									.style("vertical-align","bottom")
									.style("padding-bottom", "0.75em")
									.append("div")
									.style("padding","0.25em 0.25em 0em 0.25em")
									.style("border-bottom","1px solid #aaaaaa")
									.style("float","right")
									;

		var select = select_wrap.append("select").style("width","100%");
		var options = select.selectAll("option").data(options_data)
							.enter().append("option")
							.attr("value", function(d){return d.FIPS_final})
							.text(function(d){return d.FIPS_final=="AGG" ? "All jurisdictions" : d.Name_final})
							;
		
		//ribbon svg (stacked bar)				   
		var svg = outer_wrap.append("svg").attr("width","100%").attr("height","50px");

		//wrapper of topline data readout and bar charts
		var wrap = outer_wrap.append("div")
							 .classed("c-fix topline-bar-charts",true)
							 ;

		var data_title_wrap = wrap.append("div").style("margin","36px 0em 0em 0px").style("padding","0em 10px 0px 10px");
		var data_title = data_title_wrap.append("p").style("line-height","1.5em").style("margin","0em");

		//topline data readouot
		var left_side = wrap.append("div").classed("left30",true);
		var topline_data_wrap = left_side.append("div");
		//var intervention_wrap = left_side.append("div");
		
		//bar charts
		var bar_chart_wrap = wrap.append("div").style("float","left").classed("left70",true).style("margin-top","2em");

		//map wrapper
		var map_wrap = outer_wrap.append("div").style("min-height","20px");

	//END DOM STRUCTURE------------

	//INITIALIZE THE TOPLINE AND MAPPING MODULES, GET REDRAW FUNCTIONS
	var draw_topline = topline(topline_data_wrap.node(), cluster_data);
	var draw_puma_maps = puma_maps(map_wrap.node());


	//FUNCTION TO DRAW BAR CHARTS
	function draw_bar_charts(data, title, subtitle, color){
		data_title.html('<span style="font-size:0.8em">DETAILED DATA</span><br /><b class="font1x">' + title + "</b>" + 
							(subtitle != null ? " | <em>" + subtitle + "</em>" : ""))
							;

		bar_charts(data, bar_chart_wrap, color);
	}

	//DRAW THE JUSRISDICTION PROFILE (id is the jurisdiction id)
	function draw(id){
		var dat = nested_data[id];
		var sums = nested_sums[id];

		var place = id=="AGG" ? "all jurisdictions" : place_lookup[id];
		place_title.text(place);

		var oow = cluster_data.oow.filter(function(d){return d.FIPS_final==id});

		if(oow.length != 1){
			alert("Data error, please reload");
		}

		
		var tot = oow[0].count;
		var share = tot/oow[0].totpop;

		draw_topline.all(format.num0(tot), format.sh1(share), id);

		//rect_data should look like: [{count:x, share:count/total, id:superclus2}]
		//the data in rect_data0 will be nested when there are multiple groups within a supercluster
		var rect_data0 = [1,2,3,4,5,6,7].map(function(d){
			if(dat.hasOwnProperty(d+"")){
				var R = dat[d+""].map(function(dd){
					var obs = {};
					obs.count = dd.count;
					obs.id = dd.superclus2;
					obs.group = dd.group;
					obs.share = dd.count/tot;
					obs.color = sc_stacker.color(dd.superclus2);
					return obs;
				});
			}
			else{
				var R = [{count:0, id:d+"", group:null, share:0, color:"#e0e0e0"}]
			}
			return R;
		});

		//flatten rect_data
		var rect_data = [];
		rect_data0.forEach(function(d){
			var num_subs = d.length;
			d.forEach(function(dd, ii){
				dd.mergeid = ii==0 ? "sc" + dd.id : "sc" + dd.id + "g" + dd.group;
				dd.num_groups = num_subs;
				dd.num_group = ii+1;
				rect_data.push(dd);
			})
		})

		//to do: is this proper use of group/superclus2
		sc_stacker.stack(rect_data, svg, function(group, superclus2, rect_d){
			var color = sc_stacker.color(superclus2);
			var title = sc_stacker.title(superclus2) + " in " + place;
			var subtitle = rect_d.num_groups > 1 ? ("Cluster " + rect_d.num_group + " of " + rect_d.num_groups) : null;
			
			if(superclus2=="ALL" || superclus2==null){
				var D = oow;
				draw_topline.all(format.num0(tot), format.sh1(share));
			}
			else{
				var i=-1;
				var D = [];
				while(++i < dat[superclus2].length){
					if(dat[superclus2][i].group === group){
						D = dat[superclus2][i];
						break;
					}
				}
				draw_topline.group(D, superclus2, color);
			}
			//console.log(D);

			draw_bar_charts(D, title, subtitle, color);

			//args: geoid, group, superclus, 
			draw_puma_maps(id, group, superclus2, rect_data);
			//map_title.style("visibility","visible");

		}, true);

		//INITIALIZE BAR CHARTS AND MAP WITH ALL GROUPS (MAPS) / TOTAL OUT OF WORK (BAR CHARTS)

		//initialize with the overall out of work data
		draw_bar_charts(oow, sc_stacker.title("ALL") + " in " + place, null, sc_stacker.color("ALL"));
		
		//args: geoid, group, superclus
		draw_puma_maps(id, "ALL", "ALL", rect_data);		
		
	}


	//INITIALIZE THE FIRST PROFILE IN THE JURISDICTION LIST
	draw(options_data[0].FIPS_final);

	//REDRAW PROFILE ON SELECTION
	select.on("change", function(d,i){
		var id = this.value;
		draw(id);
	});

}