//dot matrix module for out of work - v1.0

export default function dot_matrix2(container){

	var wrap = d3.select(container).style("min-height","100px")
								   .style("margin","0.5em 1em")
								   .style("border-top","1px solid #dddddd")
								   ;
	var svgwrap = wrap.append("div").style("margin","1em auto");
	var svg = svgwrap.append("svg").style("overflow","visible").attr("width","100%").attr("height","100%");

	var pixels = 5000;
	var pixel_pad = 3;
	var radius = 4;
	var flex_space = 150;

	var width;
	var height;

	var proportions = [1];
	var split = false;

	var draw = function(){
		var box = wrap.node().getBoundingClientRect();
		var w = Math.floor(box.right - box.left);
		var max_width = w - 50 > 1600 ? 1600 : w - 50;
		
		if(w < 1100){
			pixels = 3000;
			radius = 2;		
		}
		else{
			pixels = 5000;
			radius = 3;
		}

		var density = (2*radius) + pixel_pad;
		
		//set a width that accomodates density size on each side
		width = w - (density*2) - flex_space;
		if(width > max_width){width = max_width - (density*2)}

		//how many columns of width 'density' fit in computed width
		var ncols = Math.floor(width/density);

		//how many rows are required to accommodate the width of all cells (of width 'density')
		var nrows = (Math.ceil((pixels*density)/width));

		//height based on nrows
		var height = nrows*density;

		//try to make a rectangle
		(function(){
			var ncols_ = ncols;
			var nrows_ = nrows;
			var i = -1;

			//iterate up to 10 times
			while(++i < ncols/2 && nrows_*ncols_ != pixels && ncols_ > 10){
				ncols_ -= 1;
				nrows_ = Math.ceil(pixels/ncols_);
			}

			if(nrows_ * ncols_ == pixels){
				nrows = nrows_;
				ncols = ncols_;

				width = (ncols * density) + density;
				height = (nrows * density) + density;
			}	
		})();

		//console.log("w: " + width + " h:" + height + " rows: " + nrows + " cols: " + ncols);

		svgwrap.style("height",height+"px")
			   .style("width",width+"px");

		var allpeeps = d3.range(0, pixels);
		
		var split_peeps = function(props){
			var propsum = d3.sum(props);
			//ensure that the sum is <= 1.0;
			var p = props.map(function(d){
				return d/propsum;
			});

			var wholenums = p.map(function(d){return Math.floor(d*pixels)});
			var remainders = p.map(function(d,i){
				return {index:i, value:((d*pixels)-Math.floor(d*pixels))};
			}).sort(function(a,b){return b.value-a.value});
			
			var addto = pixels - d3.sum(wholenums);

			var i = -1;
			while(addto > 0){
				i = (i+1)%remainders.length;
				wholenums[remainders[i].index] += 1;
				addto--;
			}



			var last = 0;
			return wholenums.map(function(d,i){
				var seq = d3.range(last, d+last);
				last = d+last;
				return seq;
			});
		}

		var groups = split_peeps(proportions);


		var g = svg.selectAll("g.pixels").data(groups);
		g.exit().remove();
		var G = g.enter().append("g").classed("pixels", true).merge(g);

		if(split){
			G.attr("transform", function(d,i){
				return "translate(0," + i*density + ")";
			});

			svgwrap.style("height",(height+(groups.length*density))+"px");
		}

		var p = G.selectAll("circle.pixel").data(function(d,i){
			return d.map(function(d){
				return {d:d, c: i==2 ? "#555555" : i==0 ? "#999999" : "#cccccc"}
			})
		});
		p.exit().remove();
		p.enter().append("circle").classed("pixel",true).merge(p)
			.attr("cx",function(d,i){
				var col = Math.floor(d.d%ncols);
				return density + (col*density);
			})
			.attr("cy",function(d,i){
				var row = Math.floor(d.d/ncols);
				return density + (row*density);
			})
			.attr("fill", function(d,i){
				return d.c;
			})
			.attr("r",radius)
			.attr("stroke", function(d,i){
				return d.c;
			})
			.attr("stroke-opacity","0.5")
			;
	}

	var dm = {};
	dm.proportions = function(gp){
		if(arguments.length > 0){
			proportions = gp;
			return dm;
		}
		else{
			return proportions;
		}
	}

	dm.split = function(){
		split = !split;
		return dm;
	}

	dm.draw = function(){
		setTimeout(draw, 0);
	};
	
	return dm;
}
;