import cluster_data from './cluster_data.js';
import format from '../../../js-modules/formats.js';
import sc_stack from './sc_stack.js';
import bar_charts from './bar_charts.js';
import puma_maps from './puma_maps.js';

export default function jurisdiction_profiles(container){
	var sc_stacker = sc_stack();
	var jurisdiction_data = cluster_data.jurisdiction;
	var options_data = cluster_data.lookup.sort(function(a,b){return a.Name_final < b.Name_final ? -1 : 1});
	
	var place_lookup = {};
	(function(){
		var i = -1;
		while(++i < options_data.length){
			place_lookup[options_data[i].FIPS_final] = options_data[i].Name_final;
		}
	})();

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

	var outer_wrap = d3.select(container).classed("makesans c-fix", true);
	
	var title_wrap = outer_wrap.append("div").classed("c-fix",true).style("display","table").style("width","100%");

	var top_title = title_wrap.append("p").style("display","table-cell")
						.style("margin","0em 0em 0.5em 10px");
	var place_title = top_title.append("span")
				 .classed("font1x",false)
				 .style("font-weight","bold")
				 .text("Distribution of major out-of-work groups in ")
				 .append("span")
				 ;
		top_title.append("span").text(" | ");

   	top_title.append("span").html("<em>Select a segment to view underlying data</em>").style("white-space","nowrap")
	
	var select_wrap = title_wrap.append("div")
								.style("display","table-cell")
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

	//graphics

	
	//main stacked bar						   
	var svg = outer_wrap.append("svg").attr("width","100%").attr("height","50px");

	var wrap = outer_wrap.append("div")
						 .classed("center-child-div",true)
						 .append("div")
						 .classed("c-fix",true)
						 ;

	var data_title_wrap = wrap.append("div").style("margin","36px 0em 0em 10px");
	var data_title = data_title_wrap.append("p").style("line-height","1.5em").style("margin","0em");
	//var data_subtitle = data_title_wrap.append("p");

	//overall data
	var overall_data = wrap.append("div").style("float","left").style("margin","0em 6em 0em 0em");

	var tile_wrap1 = overall_data.append("div").classed("basic-tile-row",true);
	var tile1 = tile_wrap1.append("div").classed("basic-tile",true);
		tile1.append("p").text("Total out-of-work population")
	var total_out_of_work = tile1.append("p").classed("big-stat",true);
	
	var tile_wrap2 = overall_data.append("div").classed("basic-tile-row",true);
	var tile2 = tile_wrap2.append("div").classed("basic-tile",true);
		tile2.append("p").text("Out of work share*")
	var tile2row2 = tile2.append("div");
	var share_out_of_work = tile2row2.append("p").classed("big-stat",true).style("display","inline-block");
		tile2.append("p").classed("small-note",true).text("*Of the 25–64 year old civilian, non-insitutionalized population.")

	var shares_data = cluster_data.oow.map(function(d){
							return {FIPS_final:d.FIPS_final, share:d.count/d.totpop}
						}).filter(function(d){
							return !(d.FIPS_final in {"US":1});
						}).sort(function(a,b){
							return b.share - a.share;
						});
	var max_share = d3.max(shares_data, function(d){return d.share});
	var max_share_height = 40;
	var share_distro = tile2row2
								.append("div")
								.style("display","inline-block")
								.style("width","140px")
								.style("margin-top","5px")
								.style("height",max_share_height+"px")
								.style("vertical-align","top")
								.append("svg")
								.attr("width","100%")
								.attr("height","100%")
								.selectAll("rect")
								.data(shares_data)
								.enter()
								.append("rect")
								.attr("x",function(d,i){return i})
								.attr("y",function(d,i){return max_share_height-(max_share_height*d.share/max_share)})
								.attr("width","1px")
								.attr("height", function(d){return max_share_height*d.share/max_share})
								.attr("stroke-width","0")
								.attr("fill","#555555")
								;



	var bar_chart_wrap = wrap.append("div").style("float","left");

	var map_wrap = outer_wrap.append("div").style("width","100%").style("min-height","400px");

	var draw_puma_maps = puma_maps(map_wrap.node());

	function draw(id){
		var dat = nested_data[id];
		var sums = nested_sums[id];

		var place = id=="AGG" ? "all jurisdictions" : place_lookup[id];
		place_title.text(place);

		var oow = cluster_data.oow.filter(function(d){return d.FIPS_final==id});

		if(oow.length != 1){
			alert("Data error, please reload");
		}

		share_distro.attr("fill",function(d){return d.FIPS_final==id ? "#dc2a2a" : "#dddddd"})

		var tot = oow[0].count;
		var share = tot/oow[0].totpop;
		//console.log(oow);

		total_out_of_work.text(format.num0(tot));
		share_out_of_work.text(format.sh1(share));

		//console.log(dat);
		//rect_data should look like: [{count:x, share:count/total, id:superclus2}]
		var rect_data0 = [1,2,3,4,5,6,7].map(function(d){
			if(dat.hasOwnProperty(d+"")){
				var R = dat[d+""].map(function(dd){
					var obs = {};
					obs.count = dd.count;
					obs.id = dd.superclus2;
					obs.group = dd.group;
					obs.share = dd.count/tot;
					return obs;
				})
			}
			else{
				var R = [{count:0, id:d+"", cluster:null, share:0}]
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

		//console.log(rect_data);

		sc_stacker.stack(rect_data, svg, function(superclus2, group, rect_d){
			var color = sc_stacker.color(superclus2);
			var title = sc_stacker.title(superclus2) + " in " + place;
			var subtitle = rect_d.num_groups > 1 ? ("Cluster " + rect_d.num_group + " of " + rect_d.num_groups) : null;
			
			if(superclus2=="ALL" || superclus2==null){
				var D = oow;
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
				
				//console.log(D);
			}

			draw_profile(D, title, subtitle, color);
			draw_puma_maps(id, superclus2);
		}, true);

		//initialize with the overall out of work data
		draw_profile(oow, sc_stacker.title("ALL") + " in " + place, null, sc_stacker.color("ALL"));
		draw_puma_maps(id, "ALL");
		
		
		//place_title2.text(place);
	}

	//charts, etc
	function draw_profile(data, title, subtitle, color){
		data_title.html('<span style="font-size:0.8em">DETAILED DATA</span><br /><b class="font1x">' + title + "</b>" + (subtitle != null ? " | <em>" + subtitle + "</em>" : ""));
		//data_subtitle.html(subtitle);
		//console.log(data);
		//console.log(title);
		bar_charts(data, bar_chart_wrap, color);
	}

	draw(options_data[0].FIPS_final);

	select.on("change", function(d,i){
		var id = this.value;
		draw(id);
	});

}