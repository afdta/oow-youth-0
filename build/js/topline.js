import format from '../../../js-modules/formats.js';
import dimensions from '../../../js-modules/dimensions.js';
import interventions from './interventions.js';

export default function topline(container, cluster_data){
	var outer_wrap = d3.select(container).append("div").style("padding-right","2em");

	var shares_data = cluster_data.oow.map(function(d){
							return {FIPS_final:d.FIPS_final, share:d.count/d.totpop}
						}).filter(function(d){
							return !(d.FIPS_final in {"US":1});
						}).sort(function(a,b){
							return b.share - a.share;
						});
	var max_share = d3.max(shares_data, function(d){return d.share});
	var max_share_height = 2.75*15;	

	var refresh = {};
	var I = interventions();

	refresh.group = function(data, supercluster, text_color){

		outer_wrap.select("div").remove();
		var wrap = outer_wrap.append("div").style("min-height","30px"); //.style("min-width",min_width+"px");

		var tile_wrap1 = wrap.append("div").classed("basic-tile-row c-fix",true);
		var tile1 = tile_wrap1.append("div").classed("basic-tile",true);
			tile1.append("p").text("Out-of-work total for group").style("border-bottom","1px dotted "+text_color);
		var total_out_of_work = tile1.append("p").classed("big-stat",true).text(format.num0(data.count));

		var iwrap = wrap.append("div");

		I.grid_small(iwrap.node(), supercluster, text_color);

	}

	refresh.all = function(total, share, fips_final){

		outer_wrap.select("div").remove();

		var wrap = outer_wrap.append("div"); //.style("min-width",min_width+"px");

		var tile_wrap1 = wrap.append("div").classed("basic-tile-row c-fix",true);
		
		var tile1 = tile_wrap1.append("div").classed("basic-tile",true);
			tile1.append("p").text("Out-of-work total")
		var total_out_of_work = tile1.append("p").classed("big-stat",true).text(total);
		
		//var tile_wrap2 = wrap.append("div").classed("basic-tile-row c-fix",true);
		var tile2 = tile_wrap1.append("div").classed("basic-tile",true);
			tile2.append("p").text("Out of work share*")
		var tile2row2 = tile2.append("div").classed("c-fix", true);
		var share_out_of_work = tile2row2.append("p").classed("big-stat",true).style("float","left").text(share);
			tile2.append("p").classed("small-note",true).text("*Of the 25–64 year old civilian, non-insitutionalized population.")


		var share_distro = tile2row2.append("div")
									.style("float","left")
									.style("width","140px")
									.style("margin-top","0px")
									.style("margin-left","0.5em")
									.style("height","2.75em")
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

		share_distro.attr("fill",function(d){return d.FIPS_final==fips_final ? "#dc2a2a" : "#dddddd"});

	}

	return refresh;
}



