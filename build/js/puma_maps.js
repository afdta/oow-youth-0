import sc_stack from './sc_stack.js';

//mapping module

export default function puma_maps(container){
	var cluster_title = sc_stack().title;

	var wrap = d3.select(container).classed("c-fix",true);

	//layout function
	var layout = function(superclus2){
		var o = {};

		var box = container.getBoundingClientRect();
		var width = box.right - box.left;

		var w = superclus2 == "ALL" ? Math.floor(width/7) : width;
		var h = w;
		var data = superclus2 === "ALL" ? [1,2,3,4,5,6,7] : [superclus2];

		var tiles = wrap.selectAll("div.map-tile").data(data);
		tiles.exit().remove();

		o.tiles = tiles.enter().append("div").classed("map-tile",true).merge(tiles)
						.style("float","left")
						.style("width",w+"px")
						//.style("height",h+"px")
						.style("background-color","#eeeeee")
						.style("border","1px solid #dddddd")
						;

		o.width = w;
		o.height = h;

		return o;

	}

	//draw function
	var draw = function(id, superclus2){
		var L = layout(superclus2);
		var file = "data/maps/"+id+".json";
		//var file = "build/data/shapefiles/subsetted/geojson/"+id;

		d3.json(file, function(err, dat){
			if(err){
				L.tiles.remove();
				console.log(err);
			}
			else{
				var extent = [[10,10],[L.width-20, L.height-20]];
				var geo = topojson.feature(dat, dat.objects.pumas);

				var proj = d3.geoAlbers().fitExtent(extent, geo);
				var path = d3.geoPath().projection(proj);

				console.log(geo);
				L.tiles.each(function(d){
					var thiz = d3.select(this);
					thiz.select("div").remove();
					var div = thiz.append("div");
					var title = div.append("p").text(cluster_title(d));
					var svg = div.append("svg").attr("height",L.height+"px").attr("width",L.width+"px");

					var puma0 = svg.selectAll("path").data(geo.features);
					puma0.exit().remove();
					puma0.enter().append("path").merge(puma0).attr("fill","#dddddd").attr("stroke","#333333").attr("d",path);

				});	
			}
		});

	}

	return draw;
}