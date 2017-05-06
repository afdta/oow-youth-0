import waypoint from '../../../js-modules/on-scroll2.js';

//dot matrix module for out of work - v2

export default function dot_matrix(container){

	//private members
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

	var views = {};
	var nviews = -1;

	//dm object
	var dm = {};

	//register each view with the dot matrix and encapsuate view-specific variables
	//to do - handle scroll events
	//      - add a promote() or dig() method that promotes subgroups to groups
	dm.view = function(viewid){
		if(arguments.length > 0 && views.hasOwnProperty(viewid)){
			//return the view
			return views[viewid]
		}
		else{
			var id = arguments.length == 0 ? "view" + (++nviews) : viewid+"";

			var view = {};

			//private view variables
			var par = {
				groups:[],
				color:null,
				tot_people:0
			};

			//view.group (view.draw) will always call group() (draw()) with par as this
			view.group = function(name, num){
				var grouping = group.call(par, name, num);
				return grouping;
			};

			view.groups = function(array_of_groups){
				var i = -1;
				while(++i < array_of_groups.length){
					view.group(array_of_groups[i].name, array_of_groups[i].num)
				}
				return view;				
			}

			view.draw = function(){
				draw.call(par);
			}

			//register view
			views[id] = view;
			return view;
		}
	}

	//register a group with a view
	function group(name, num){
		var view = this;
		var id = view.groups.length;
		var grouping = {id:id, name:name, num:num};
		var subgroups = [];
		
		//register subgroups
		grouping.subgroup = function(name, num){
			var sid = subgroups.length;
			var sub = {id:sid, name:name, num:num};
			
			subgroups.push(sub);

			return grouping;
		}

		//convenience method to register an array of subgroups that look like: {name:[string], num:[num]}
		grouping.subgroups = function(array_of_subgroups){
			if(arguments.length > 0){
				var i = -1;
				while(++i < array_of_subgroups.length){
					grouping.subgroup(array_of_subgroups[i].name, array_of_subgroups[i].num)
				}
				return grouping;
			}
			else{
				return subgroups;
			}
		}

		//sum up subgroups, ensure subgroups are <= grouping total
		grouping.subgroups.sum = function(){
			if(subgroups.length > 0){
				var sum = d3.sum(subgroups, function(d){return d.num});

				if(sum > grouping.num){
					var message = {equals:false, note:"Increasing group total from " + grouping.num + " to " + sum};
					//increment grouping total and recompute total people for the view
					grouping.num = sum;
					view.tot_people = d3.sum(view.groups, function(d){return d.num});
				}
				else if(sum < grouping.num){
					var message = {equals:false, note:"Subgroup total of " + sum + " is less than group total of " + grouping.num};
				}
				else{
					var message = {equals:true, note:"Group total equals subgroup total"}
				}
			}
			else{
				var message = {equals:false, note:"No subgroups"}
			}
			return message;
		}

		view.groups.push(grouping);

		view.tot_people = d3.sum(view.groups, function(d){return d.num});

		return grouping;
	}

	function draw(){
		var groups = this.groups;
		var color = this.color;
		var tot_people = this.tot_people;

		var box = wrap.node().getBoundingClientRect();
		var w = Math.floor(box.right - box.left);
		var max_width = w - 50 > 1600 ? 1600 : w - 50;
		
		//determine number of dots ("pixels") to include in array
		if(w < 1100){
			pixels = 3000;
			radius = 2;		
		}
		else{
			pixels = 5000;
			radius = 3;
		}

		var flat = [];

		groups.forEach(function(d,i,a){
			var id = d.id;
			var name = d.name;
			var num = d.num;
			var subs = d.subgroups();
			if(subs.length > 0){
				subs.forEach(function(dd,ii,aa){
					flat.push({
								group:{id:id, name:name, num:num}, 
							   	subgroup:{id:dd.id, name:dd.name, num:dd.num, share:dd.num/tot_people}
							  });
				});
			}
			else{
				flat.push({
							group:{id:id, name:name, num:num}, 
						   	subgroup:{id:0, name:name, num:num, share:num/tot_people}
						   });
			}
		});

		//LEFT OFF HERE ...
		//translate shares to whole dots
		var wholenums = flat.map(function(d){return Math.floor(d.subgroup.share*pixels)});
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

		//console.log(flat);

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
		

		//var groups = split_peeps(proportions);


		//var g = svg.selectAll("g.pixels").data(groups);
		//g.exit().remove();
		//var G = g.enter().append("g").classed("pixels", true).merge(g);
		var p = svg.selectAll("circle.pixel").data(d3.range(0,pixels));
		p.exit().remove();
		p.enter().append("circle").classed("pixel",true).merge(p)
			.attr("cx",function(d,i){
				var col = Math.floor(d%ncols);
				return density + (col*density);
			})
			.attr("cy",function(d,i){
				var row = Math.floor(d/ncols);
				return density + (row*density);
			})
			.attr("fill", function(d,i){
				return d3.interpolatePlasma(d/pixels);
			})
			.attr("r",radius)
			.attr("stroke", function(d,i){
				return d3.interpolatePlasma(d/pixels);
			})
			.attr("stroke-opacity","0.5")
			;
	}
	
	return dm;
}
;