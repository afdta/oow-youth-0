
import unlist from '../../../js-modules/unlist.js';

//likely big speedups to be made:
//when registering new groups, run the calcs to produce the transition functions
//then create a transition function that takes startpos, finishpos. if there's a difference of one,
//then run the appropriate transition from either t=1 to t=0 or from t=0 to t=1. otherwise no transition,
//if say, you go from t=2 to t=0. also set transition duration based on speed of scroll. if above a certain
//speed, maybe have transition time of 0. 

//dot matrix module for out of work - v2

export default function dot_matrix(container, dot_radius){

	//private members
	var wrap = d3.select(container).append("div")
								   .style("min-height","100px")
								   .style("margin","0em 1em")
								   .style("border-top","0px solid #dddddd")

								   .classed("c-fix",true)
								   ;

	var title_wrap = wrap.append("div");	
	
	var summary_stats_wrap = wrap.append("div").style("width","35%").style("height","100%")
									.style("float","left").style("background-color","#eeeeee")
									;
	var summary_title_wrap = summary_stats_wrap.append("div").style("padding","1em 1em");

	var can_outer_wrap = wrap.append("div").style("width","65%").style("float","left");

	var canwrap = can_outer_wrap.append("div").style("margin","0em auto").style("position","relative");
	//var svg = svgwrap.append("svg").style("overflow","visible").attr("width","100%").attr("height","100%");
	var svg = canwrap.append("svg").attr("width","100%").attr("height","100%").style("position","absolute");
	var canvas = canwrap.append("canvas").style("position","relative");
	var context = canvas.node().getContext("2d");

	var pixels = 5000;
	var ncols = 100;
	var nrows = 50;
	
	var default_radius = arguments.length > 1 ? dot_radius : 4;
	var radius = default_radius;
	var pixel_pad = radius;
	var bbox = (2*radius) + (2*pixel_pad);	

	var flex_space = 0;

	var width;
	var height;

	var views = {};
	var nviews = -1;

	var lastbind;


	//dm object
	var dm = {};

	dm.title = function(t){
		var txt = [].concat(t);
		var p = title_wrap.selectAll("p").data(txt);
		p.enter().append("p").merge(p)
			.html(function(d,i){return d})
			;
	}

	dm.node = function(){
		return wrap.node();
	}

	//set dot-matrix dimensions
	dm.dim = function(){
		var box = can_outer_wrap.node().getBoundingClientRect();
		var w = Math.floor(box.right - box.left);
		var max_width = 1920;
		var min_width = 320;
		var aspect = w > 900 ? 4/1.5 : 4/3;


		radius = Math.round(default_radius*(w/1920));
		if(radius < 2){radius = 2}
		pixel_pad = Math.round(radius/2.5);
	
		bbox = (2*radius) + (2*pixel_pad);			
		
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

		summary_stats_wrap.style("height",height+"px");

		canvas.attr("height",height).attr("width",width);	

		return dm;
	}

	dm.responsive = function(){
		window.addEventListener("resize", function(){
			dm.dim();
			//redraw last drawn view
			if(!!lastbind){
				lastbind.bind();
			}	
		});

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
				text:{},
				tot_people:0,
				level:0,
				prev_bind:"level0",
				next_bind:"level0",
				level_drawn:null
			};

			view.group = function(name, id, num, color, merge_id){
				var d = {};
				d.name = name;
				d.id = id;
				d.merge_id = arguments.length > 4 ? merge_id : id;
				d.num = num;
				d.col = !!color ? color : "#666666";
				d.level = par.level;

				//create merge (data-join) variables based on the level
				// ---A--- <--> ---B--- <--> ---C---
				// [l] [r]      [l] [r]      [l] [r]
				// prev_ and next_bind are updated in view.next / view.prev

				d[par.prev_bind] = arguments.length > 4 ? merge_id : id;
				d[par.next_bind] = id;

				d.order = par.groups[par.level].length;
				par.groups[par.level].push(d);

				return view;
			};

			view.title = function(title_text){
				var txt = [].concat(title_text);
				par.text["level"+par.level] = txt;
				return view;
			}

			var transition_duration = 1000;
			var timer = d3.timer(function(elapsed) {
				  var fraction = d3.easePolyOut(elapsed/transition_duration);	
				  if(fraction >=1){
				  	fraction = 1;
				  	timer.stop();
				  }
				});

			//bind current group data to view and update view
			view.bind = function(){
				lastbind = view;
				
				if(par.text.hasOwnProperty("level"+par.level)){
					var txt = par.text["level"+par.level];
				}
				else{
					var txt = [];
				}
				var p = summary_title_wrap.selectAll("p").data(txt);
				p.exit().remove();
				p.enter().append("p").merge(p)
					.html(function(d,i){return d})
					;

				par.tot_people = d3.sum(par.groups[0], function(d){return d.num});

				var groups = par.groups[par.level];
				var group_sum = d3.sum(groups, function(d){return d.num});

				//what merge_level to merge by depends on if it's forward or backward/staying the same
				var forward = par.level_drawn == null || par.level - par.level_drawn > 0;
				var merge_level = forward ? par.prev_bind : par.next_bind;
				
				console.log(groups);

				//console.log(par.level_drawn + " | " + par.level);
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
				var g2 = unlist(g1.map(function(g){
					var range = d3.range(0, g.whole);
					return range.map(function(d){
						var f = {};
						f.d = g.d;
						return f;
					});

				}) );

				//make left/right (prev/next) merge values unique
				var lefts = {};
				var rights = {};

				g2.sort(function(a,b){
					var aval = a.d.id;
					var bval = b.d.id;
					var order0 = a.d.order - b.d.order;
					var order1 = aval < bval ? -1 : (aval == bval ? 0 : 1);

					return  order0 != 0 ? order0 : order1;
				});

				g2.forEach(function(f, n){

					//level group code, e.g. tot or emp
					var r = f.d[par.next_bind];
					var l = f.d[par.prev_bind];

					var rcount = rights.hasOwnProperty(r) ? rights[r]+1 : 0;
					var lcount = lefts.hasOwnProperty(l) ? lefts[l]+1 : 0;

					f[par.next_bind] = r + (rcount + "");
					f[par.prev_bind] = l + (lcount + "");

					rights[r] = rcount;
					lefts[l] = lcount;

					f.n = n;

					var col = Math.floor(n/nrows);
					var row = n - (nrows*col);
					var x = (col*bbox);
					var y = (row*bbox);

					f.xy = [x+(bbox/2),y+(bbox/2)];
					f.rxy = [x,y];

				});

				//console.log(g2);
				
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

				var update = svg.selectAll("rect").data(g2, function(f){
					return f[merge_level]
				});

				update.exit().remove(); //.transition().style("opacity",0).on("end", function(){d3.select(this).remove()})
				var rects = update.enter().append("rect").merge(update);

				var new_data = [];

				rects.each(function(d,i,a){
					var thiz = d3.select(this);
					
					var o = {}
					var x = thiz.attr("data-oldx");
					var y = thiz.attr("data-oldy");
					var c = thiz.attr("data-oldc");

					var x0 = x!=null ? +x : d.xy[0]; 
					var y0 = y!=null ? +y : d.xy[1];
					var col0 = c!=null ? c : "#ffffff";

					try{
						var x1 = d.xy[0];
						var y1 = d.xy[1];
						var col1 = d.d.col;
					}
					catch(e){
						var x1 = 0;
						var y1 = 0;
						var col1 = "#cccccc";
					}

					var tx = function(share){return x0 + share*(x1-x0);}
					var ty = function(share){return y0 + share*(y1-y0);}
					var tc = d3.interpolateRgb(col0, col1);

					new_data.push({xy:d.xy, tx:tx, ty:ty, tc:tc})
				});

				rects.attr("width", bbox).attr("height", bbox)
					//.transition().duration(5000)
					.attr("x", function(d,i){
						return d.rxy[0];
					})
					.attr("y", function(d,i){
						return d.rxy[1];
					})
					.attr("fill", function(d,i){
						return d.d.col;
					})
					.style("visibility","hidden")
					.attr("data-oldx", function(d){return d.xy[0]})
					.attr("data-oldy", function(d){return d.xy[1]})
					.attr("data-oldc", function(d){return d.d.col})
					;

				var counter = 0;
				function draw(t){
					context.clearRect(0, 0, width, height);
					new_data.forEach(function(d){
						var x = d.tx(t);
						var y = d.ty(t);

						context.moveTo(x + radius, y);
						context.strokeStyle = "#ffffff";
						context.fillStyle = d.tc(t);
						context.beginPath();
						context.arc(x, y, radius, 0, 2 * Math.PI);
						//context.stroke();
						context.fill();
					});
				}

				timer.stop();

				timer.restart(function(elapsed) {
				  var fraction = d3.easeCubic(elapsed/transition_duration);	
				  if(fraction >=1){
				  	fraction = 1;
				  	timer.stop();
				  }
				  draw(fraction);
				});


				//set the level drawn to indicate the view is up to date 
				par.level_drawn = par.level;
				return view;
		
			}

			function set_lr_bind(){
				if(par.level==0){
					par.prev_bind = "level0";
					par.next_bind = "level0";
				}
				else{
					par.prev_bind = "level" + (par.level-1);
					par.next_bind = "level" + par.level;
				}
			}

			//move to the next state or arbitrary level
			view.next = function(level){
				/*var next_level = par.level + 1;
				var valid_move = par.level_drawn != null && 
								 Math.abs(next_level-par.level_drawn) == 1 &&
								 par.level < par.groups.length;
				if(valid_move){
					par.level += 1;
					set_lr_bind();

					if(par.level >= par.groups.length){
						par.groups.push([]);
					}
				}*/

				//don't enforce valid levels
				if(arguments.length==0){
					par.level = par.level + 1;
					if(par.level >= par.groups.length){
						par.groups.push([]);
					}					
				}
				else if(level < par.groups.length){
					par.level = level;
				}
				set_lr_bind();

				return view;
			}

			//move to the previous state
			view.prev = function(){
				/*var next_level = par.level - 1;
				var valid_move = par.level_drawn != null && 
								 Math.abs(next_level-par.level_drawn) == 1 &&
								 par.level > 0;
				if(valid_move){
					par.level -= 1;
					set_lr_bind()
				}*/

				if(par.level > 0){
					par.level -= 1;
				}
				set_lr_bind();

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