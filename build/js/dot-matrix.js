
import unlist from '../../../js-modules/unlist.js';

//LEFT OFF HERE - WRITE A FUNCTION THAT GOES FROM GROUP/PARENT N to SUBGROUP/CHILD N
//DOTS ARE ID'D BY THEIR N

//dot matrix module for out of work - v2

export default function dot_matrix(container, dot_radius){

	//private members
	var wrap = d3.select(container).style("min-height","100px")
								   .style("margin","0.5em 1em")
								   .style("border-top","0px solid #dddddd")
								   ;
	var canwrap = wrap.append("div").style("margin","1em auto").style("position","relative");
	//var svg = svgwrap.append("svg").style("overflow","visible").attr("width","100%").attr("height","100%");
	var svg = canwrap.append("svg").attr("width","100%").attr("height","100%").style("posiiton","absolute");
	var canvas = canwrap.append("canvas");
	var context = canvas.node().getContext("2d");

	var pixels = 5000;
	var ncols = 100;
	var nrows = 50;
	
	var default_radius = arguments.length > 1 ? dot_radius : 4;
	var radius = default_radius;
	var pixel_pad = radius;

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

	//set dot-matrix dimensions
	dm.dim = function(){
		var box = wrap.node().getBoundingClientRect();
		var w = Math.floor(box.right - box.left);
		var max_width = 1920;
		var min_width = 320;
		var aspect = w > 900 ? 4/1.3 : 4/2.5;


		radius = Math.round(default_radius*(w/1920));
		if(radius < 2){radius = 2}
		pixel_pad = Math.round(radius/2.5);
	
		var bbox = (2*radius) + (2*pixel_pad);			
		
		//set a width less flex_space
		width = w - flex_space;
		if(width > max_width){
			width = max_width;
		}
		else if(width < min_width){
			width = min_width;
		}

		//how many columns of width 'bbox' fit in computed width
		ncols = Math.floor(width/bbox);
		//how many rows fit the selected aspect ratio
		nrows = Math.round(ncols/aspect);
		//how many dots ("pixels") to create
		pixels = ncols*nrows;

		//bind to svg selection and use that to compute canvas drawing


		//height based on nrows
		height = nrows*bbox;	

		canwrap.style("height",height+"px")
			   .style("width",width+"px");

		canvas.attr("height",height).attr("width",width);	

		return dm;
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
				groups:[[]],
				tot_people:0,
				level:0,
				level_drawn:null
			};

			view.group = function(name, id, num, color, merge_id){
				var g = {};
				g.name = name;
				g.id = id;
				g.num = num;
				g.col = arguments.length > 3 ? color : "#666666";
				g.level = par.level;

				//create merge (data-join) variables based on the level
				// ---A--- <--> ---B--- <--> ---C---
				// [l] [r]      [l] [r]      [l] [r]
				if(par.level==0){
					g.left = "level0";
					g.right = "level0";
					g.level0 = id;
				}
				else{
					g.left = "level"+(par.level-1);
					g.right = "level"+par.level;
					g[g.left] = arguments.length > 4 ? merge_id : id;
					g[g.right] = id;
				}

				g.order = par.groups[par.level].length;
				par.groups[par.level].push(g);

				return view;
			};

			//bind current state to view and update view
			view.bind = function(){
				
				par.tot_people = d3.sum(par.groups[0], function(d){return d.num});

				var groups = par.groups[par.level];
				var group_sum = d3.sum(groups, function(d){return d.num});

				//is this moving forward or backward
				var forward = par.level_drawn == null || par.level - par.level_drawn >= 0;

				//map groups to individual records in several steps:
				// (1)
				var g1 = groups.map(function(d,i,a){

					var share = d.num/par.tot_people;
					var whole = Math.floor(share*pixels);
					var remainder = (share*pixels)-whole;

					var g = {
						d:d,
						share:share,
						whole:whole,
						remainder:remainder
					}

					return g;
				});

				//sort by remainder
				g1.sort(function(a,b){
					return b.remainder - a.remainder;
				});
				//how many whole pixels accounted for
				var tot = d3.sum(g1, function(g){return g.whole});
				//need to add this many
				var toadd = pixels - tot;
				//increment, starting with largest remainders first
				var i = -1;
				while(++i < g1.length && toadd > 0){
					g1[i].whole_ = g1[i].whole;
					g1[i].whole = g1[i].whole + 1;
					toadd--;
				}

				//create an array of group objects, 1 for each dot
				var g2 = unlist(g1.map(function(grp){
					var range = d3.range(0, grp.whole);
					return range.map(function(d){
						var f = {};
						f.i = d;
						f.merge_level = forward ? grp.d.left : grp.d.right;
						f.data = grp.d;
						return f;
					});

				}) );				

				

				// diff < 0 implies the subgroups are less than the total should be
				var diff = group_sum - par.tot_people;
				try{
					if(diff !== 0){
						console.log("Totals do not match between levels.");
					}
				}
				catch(e){
					//no-op
				}

				console.log(par.level);
				console.log(g2);

				//set the level drawn to indicate the view is up to date 
				par.level_drawn = par.level;
				return view;

				///BIND TO SVG -- USE SELECTION TO DRAW TO CANVAS
				/*LEFT OFF HERE*/

				//merge by d[merge_level] + i i.e. group id + i

					/*var col = Math.floor(n/nrows);
					var row = n - (nrows*col);
					var box2 = bbox/2;
					var x = (col*bbox) + box2;
					var y = (row*bbox) + box2;*/

				context.clearRect(0, 0, width, height);

				array.forEach(function(d){
					context.moveTo(d.x + radius, d.y);
					context.strokeStyle = d.fill;
					context.fillStyle = d.fill;
					context.beginPath();
					context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
					//context.stroke();
					context.fill();
				});
				////



				
			}

			//move to the next state
			view.next = function(){
				var next_level = par.level + 1;
				var valid_move = par.level_drawn != null && 
								 Math.abs(next_level-par.level_drawn) == 1 &&
								 par.level < par.groups.length;
				if(valid_move){
					par.level += 1;
					if(par.level >= par.groups.length){
						par.groups.push([]);
					}
				}

				return view;
			}

			//move to the previous state
			view.prev = function(){
				var next_level = par.level - 1;
				var valid_move = par.level_drawn != null && 
								 Math.abs(next_level-par.level_drawn) == 1 &&
								 par.level > 0;
				if(valid_move){
					par.level -= 1;
				}

				return view;
			}




			//register view
			views[id] = view;
			return view;
		}
	}


		/*
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
		*/
	
	return dm;
}
;