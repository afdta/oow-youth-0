//Array.isArray polyfill. Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray?v=control
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

//flatten an array of arrays
function unlist(arr, recursive){
  //flatten one level
  var flat = [].concat.apply([], arr)
  
  if(arguments.length > 1 && !!recursive){
  	//determine if there are arrays in the flattened array
  	var i = -1;
    var nested_arrays = false;
    while(++i < flat.length){
    	if(Array.isArray(flat[i])){
      		nested_arrays = true;
        	break;
      	}
    }
    //if there are nested arrays, recurse, otherwise just return
    return nested_arrays ? unlist(flat, recursive) : flat;
  }
  else{
	return flat;
  }
}


//dot matrix module for out of work - v2

export default function dot_matrix(container, dot_radius){

	//private members
	var wrap = d3.select(container).style("min-height","100px")
								   .style("margin","0.5em 1em")
								   .style("border-top","1px solid #dddddd")
								   ;
	var svgwrap = wrap.append("div").style("margin","1em auto");
	var svg = svgwrap.append("svg").style("overflow","visible").attr("width","100%").attr("height","100%");

	var pixels = 5000;
	var pixel_pad = 3;
	var default_radius = arguments.length > 1 ? dot_radius : 4;
	var flex_space = 150;

	var width;
	var height;

	var views = {};
	var nviews = -1;

	//dm object
	var dm = {};

	dm.node = function(){
		return container;
	}

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
				flat:[],
				tot_people:0,
				state: null
			};

			//view.group (view.draw) will always call group() (draw()) with par as this
			view.group = function(name, id, num, color){
				var grouping = group.call(par, name, id, num, color);
				grouping.init = view.init; //expose on grouping object
				grouping.group = view.group; //expose
				return grouping;
			};

			view.groups = function(array_of_groups){
				var i = -1;
				while(++i < array_of_groups.length){
					view.group(array_of_groups[i].name, array_of_groups[i].num)
				}
				return view;				
			}

			//to do -- keep track of state in par
			view.init = function(){
				var redraw = init.call(par);
				view.drawGroups = function(duration){
					par.state = "groups";
					redraw(duration);
				};
				view.drawSubgroups = function(duration){
					par.state = "subgroups";
					redraw(duration);
				}
				return view;
			}

			view.drawGroups = function(){
				//no-op
			}

			view.drawSubgroups = function(){
				//no-op
			}

			//register view
			views[id] = view;
			return view;
		}
	}

	function promote(){
		var flat = this.flat;
	}

	//register a group with a view
	function group(name, id, num, color){
		var view = this;
		var order = view.groups.length;
		var grouping = {id:id, name:name, num:num, order:order};
		if(arguments.length > 3){
			grouping.col = color;
		}
		else{
			grouping.col = "#666666";
		}

		var subgroups = [];
		
		//register subgroups
		grouping.subgroup = function(name, sid, num, color){
			var order = subgroups.length;
			var sub = {id:sid, name:name, num:num, order:order};
			if(arguments.length > 3){
				sub.col = color;
			}
			else{
				sub.col = "#666666";
			}
			subgroups.push(sub);

			return grouping;
		}

		//convenience method to register an array of subgroups that look like: {name:[string], num:[num]}
		grouping.subgroups = function(array_of_subgroups){
			if(arguments.length > 0){
				var i = -1;
				while(++i < array_of_subgroups.length){
					grouping.subgroup(array_of_subgroups[i].name, 
									  array_of_subgroups[i].id, 
									  array_of_subgroups[i].num)
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

	function init(){
		var groups = this.groups;
		var tot_people = this.tot_people;
		var par = this;

		var box = wrap.node().getBoundingClientRect();
		var w = Math.floor(box.right - box.left);
		var max_width = 1920;
		var min_width = 320;
		var aspect = w > 900 ? 4/1.3 : 4/2.5;


		var radius = Math.round(default_radius*(w/1920));
	
		var density = (2*radius) + pixel_pad;			
		
		//set a width that accomodates density size on each side
		width = w - (density*2) - flex_space;
		if(width > max_width){
			width = max_width - (density*2);
		}
		else if(width < min_width){
			width = min_width - (density*2);
		}

		
		//how many columns of width 'density' fit in computed width
		var ncols = Math.floor(width/density);

		var nrows = Math.round(ncols/aspect);
		
		pixels = ncols*nrows;

		//how many rows are required to accommodate the width of all cells (of width 'density')
		//var nrows = (Math.ceil((pixels*density)/width));

		//height based on nrows
		var height = nrows*density + density*2;	

		svgwrap.style("height",height+"px")
			   .style("width",width+"px");	


		var g1 = groups.map(function(d,i,a){
			var id = d.id;
			var name = d.name;
			var num = d.num;
			var subs = d.subgroups();

			var share = num/tot_people;
			var whole = Math.floor(share*pixels);
			var remainder = (share*pixels)-whole;

			return {group:{
							id:id,
							name:name,
							num:num,
							share:share,
							whole:whole,
							remainder:remainder,
							col:d.col,
							order:d.order,
							subs:subs
						}
				   }
		});

		//allocate all pixels
		(function(){
			//sort by remainder
			g1.sort(function(a,b){return b.group.remainder - a.group.remainder});
			//how many whole pixels accounted for
			var tot = d3.sum(g1, function(d){return d.group.whole});
			//need to add this many
			var toadd = pixels - tot;
			//increment, starting with largest remainders first
			var i = -1;
			while(++i < g1.length && toadd > 0){
				g1[i].group.whole_ = g1[i].group.whole;
				g1[i].group.whole = g1[i].group.whole + 1;
				toadd--;
			}
		})();

		//allocate subgroup pixels (dots)
		//to do: prove it doesn't matter from a precision standpoint if you control subgroups to group level or total level
		var s1 = g1.map(function(d,i,a){
			var subs = d.group.subs;
			var gtot = d.group.num; //total people in group
			var gpixels = d.group.whole; //number of pixels allocated to group
			
			if(subs.length > 0){
				var subfull = subs.map(function(dd,ii,aa){
					var share = dd.num/gtot; //control to group level
					var whole = Math.floor(share*gpixels);
					var remainder = (share*gpixels) - whole;
					
					return {group:d.group, 
							subgroup:{id:dd.id, 
									  name:dd.name, 
									  num:dd.num, 
									  share:share, 
									  whole: whole,
									  remainder:remainder,
									  order:dd.order,
									  col: dd.col
									}
							}

				});

				subfull.sort(function(a,b){return b.subgroup.remainder - a.subgroup.remainder});
				//how many whole pixels accounted for in subgroup
				var subtot = d3.sum(subfull, function(d){return d.subgroup.whole});
				//need to add this many
				var toadd = gpixels - subtot;
				//increment, starting with largest remainders first
				var j = -1;
				while(++j < subfull.length && toadd > 0){
					subfull[j].subgroup.whole_ = subfull[j].subgroup.whole;
					subfull[j].subgroup.whole = subfull[j].subgroup.whole + 1;
					toadd--;
				}

				return subfull;
			}
			else{
				return { 
					group:d.group, 
					subgroup:{id:0, 
							  name:d.group.name, 
							  num:d.group.num, 
						   	  share:1,
						   	  whole:d.group.whole,
						   	  remainder:0,
						   	  order:0,
						   	  col:d.group.col
						} 
				};
			}
		});

		function draw(duration){
			//sort by group then subgroup in order they were added
			var flat = unlist(s1);

			if(par.state == "groups" || par.state == null){
				flat.sort(function(a,b){
					if(a.group.order < b.group.order){
						var i = -1;
					}
					else if(a.group.order > b.group.order){
						var i = 1;
					}
					else if(a.subgroup.order < b.subgroup.order){
						var i = -1;
					}
					else if(a.subgroup.order > b.subgroup.order){
						var i = 1;
					}
					else{
						var i = 0;
					}
					return i;
				});
			}
			else if(par.state == "subgroups"){
				flat.sort(function(a,b){
					if(a.subgroup.id < b.subgroup.id){
						var i = -1;
					}
					else if(a.subgroup.id > b.subgroup.id){
						var i = 1;
					}
					else if(a.group.order < b.group.order){
						var i = -1;
					}
					else if(a.group.order > b.group.order){
						var i = 1;
					}
					else{
						var i = 0;
					}
					return i;
				});				
			}

			var num_before = 0;

			flat.forEach(function(d){
				d.subgroup.num_before = num_before;
				num_before = d.subgroup.whole + num_before;
			});

			var g_subgroups = svg.selectAll("g.sub-group").data(flat, function(d,i){return "g"+d.group.id+"s"+d.subgroup.id});
			g_subgroups.exit().remove();

			var p = g_subgroups.enter().append("g").classed("sub-group",true).merge(g_subgroups)
					.selectAll("circle.pixel").data(function(d,i){
						var start = d.subgroup.num_before;
						var end = start + d.subgroup.whole;
						var range = d3.range(start, end);
						return range.map(function(dd){
							return {d:dd, group:d.group, subgroup:d.subgroup}
						});
					});
			p.exit().remove();

			var dur = arguments.length == 0 || duration==null ? 1000 : duration;
			
			var P = p.enter().append("circle").classed("pixel",true).merge(p)
						.attr("r",radius)
						.attr("stroke-opacity","0.5")
						.transition().duration(dur)
						.attr("cx",function(d,i){
							var col = Math.floor(d.d/nrows);
							return density + (col*density);
						})
						.attr("cy",function(d,i){
							var col = Math.floor(d.d/nrows);
							var row = d.d - (nrows*col);
							return density + (row*density);
						})
						.attr("fill", function(d,i){
							if(par.state == null){
								return d3.interpolatePlasma(d.d/pixels);
							}
							else if(par.state == "groups"){
								return d.group.col;
							}
							else{
								return d.subgroup.col;
							}
							
						})
						.attr("stroke", function(d,i){
							if(par.state == null){
								return d3.interpolatePlasma(d.d/pixels);
							}
							else if(par.state == "groups"){
								return d.group.col;
							}
							else{
								return d.subgroup.col;
							}
						})
						;

						console.log(P);

		}


		draw(0);

		return draw;
	}
	
	return dm;
}
;