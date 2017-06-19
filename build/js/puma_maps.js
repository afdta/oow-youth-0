import sc_stack from './sc_stack.js';
import dir from '../../../js-modules/rackspace.js';

export default function puma_maps(container){


	var cluster_title = sc_stack().title;
	var cluster_color = sc_stack().color;

	var wrap = d3.select(container).classed("c-fix puma-map-wrap",true);

	var map_title = wrap.append("p").classed("font1x",true)
							.style("margin","1em 0em 0em 10px")
							.append("b")
							.text("Geographic distribution of each major group");

	var topo_repo = {};

	//layout function
	var layout = function(rect_data, topo){

		//try to get an aspect ratio
		try{
			var bbwidth = topo.bbox[2] - topo.bbox[0];
			var bbheight = topo.bbox[3] - topo.bbox[1];
			var aspect = Math.abs(bbheight/bbwidth);
		}
		catch(e){
			var aspect = 0.8;
		}

		var o = {};

		var box = container.getBoundingClientRect();
		var width = box.right - box.left;

		var num_wide = 4;

		if(width > 1100 && rect_data.length <= 6){
			num_wide =  aspect > 0.45 ? 6 : 4;
		}
		else if(width > 800){
			num_wide =  aspect > 0.45 ? 4 : 2;
		}
		else{
			num_wide = aspect > 0.45 ? 2 : 1;
		}

		var sm_width = Math.floor(width/num_wide);

		var w = sm_width;
		var h = w*aspect;

		var tiles = wrap.selectAll("div.map-tile").data(rect_data);
		tiles.exit().remove();

		o.tiles = tiles.enter().append("div").classed("map-tile",true).merge(tiles)
						.style("float","left")
						.style("width",w+"px")
						;

		o.width = w;
		o.height = h;
		o.num_wide = num_wide;

		return o;
	}

	//draw takes a group id and a topojson object -- it computes a layout and draws
	var draw = function(group, rect_data, topo, jurisdiction_name){
		
		var L = layout(rect_data, topo);

		var extent = [[20,20],[L.width-20, L.height-20]];
		var geo = topojson.feature(topo, topo.objects.pumas);

		var proj = d3.geoEquirectangular().fitExtent(extent, geo);
		var path = d3.geoPath().projection(proj);

		map_title.text("Geographic distribution of each major group in " + jurisdiction_name);

		//the d bound to each tile is the same as the d bound to the big stacked bar segments
		//props: id (supercluster), group, count, share (of out of work), num_groups (total groups within superclus), num_group (arbitrary number of group)
		L.tiles.each(function(d){
			var thiz = d3.select(this);
			thiz.select("div").remove();
			
			var title_text = cluster_title(d.id);
			var subtitle_text = d.num_groups > 1 ? (" (<em>Cluster " + d.num_group + " of " + d.num_groups) + "</em>)" : "";

			var div = thiz.append("div");
			var title_wrap = div.append("div").style("height", (L.num_wide > 4 ? 6.5 : 5.5)+"em").style("position","relative").style("margin","0px 10px")
					.style("border-bottom", (d.group === group ? "6px solid" : "1px dotted" ) + d.color);
			var title = title_wrap.append("p")
					.html(title_text + subtitle_text)
					.style("line-height","1.4em")
					.style("position","absolute")
					.style("bottom","1px")
					.style("margin","0em 10px 5px 10px")
					;

			var svg = div.append("svg").attr("height",L.height+"px").attr("width",L.width+"px");

			var filler = d3.interpolateLab("#ffffff", d3.color(d.color).darker(0.15));

			var data_accessor = function(puma, max_val){
				//should always be a grp variable
				var indicator = !!d.group ? "grp"+d.group : "sc"+d.id;

				var val = puma.properties[indicator];

				if(val===null){
					var sh = null;
				}
				else if(arguments.length > 1){
					var sh = max_val != 0 ? val/max_val : null;
				}
				else{
					var sh = val;
				}

				return sh;
			}

			var max_share = d3.max(geo.features, function(d){return data_accessor(d)});

			var puma0 = svg.selectAll("path").data(geo.features);
			puma0.exit().remove();
			puma0.enter().append("path").merge(puma0).attr("fill",function(puma){
				var share = data_accessor(puma, max_share);
				
				return share===null ? "#efefef" : filler(share);
			}).attr("stroke","#cccccc").attr("d",path);

		});
	}	

	//callback should first layout, then draw
	var get_topo = function(geo_id, callback){
		if(topo_repo.hasOwnProperty(geo_id)){
			var topo = topo_repo[geo_id];
			callback(topo);
		}
		else{
			var file =  dir.url("maps", geo_id+".json");
			try{
				d3.json(file, function(err, dat){
					if(!!err){
						callback(null);
					}
					else{
						topo_repo[geo_id] = dat;
						callback(dat);
					}
				});
			}
			catch(e){
				//console.log(e);
				callback(null);
			}
		}
	}

	//the main draw function
	var current_id = "AGG";
	var current_group = "ALL";

	//id is geoid, group is cluster id
	var do_all = function(id, group, superclus, rect_data, jurisdiction_name){
		//keep track globally of the most recently selected geo and group
		current_id = id;
		current_group = group;

		var rect_data_ = [];
		var r = -1;
		while(++r < rect_data.length){
			if(rect_data[r].count > 0){
				rect_data_.push(rect_data[r]);
			}
		}
		//callback will be called with the topojson object once retrieved
		//if the locally-bound id var diverges from the current_id (say, if this was the first of two quick requests)
		//then callback is a no-op
		var async_callback = function(topo){
			if(id!==current_id || topo == null){
				wrap.style("visibility", topo == null ? "hidden" : "visible");
				return null; //no-op
			}
			else{
				wrap.style("visibility","visible").style("height","auto");
				draw(group, rect_data_, topo, jurisdiction_name);

			}
		}

		get_topo(id, async_callback);
	}

	//draw function return
	return do_all;
}