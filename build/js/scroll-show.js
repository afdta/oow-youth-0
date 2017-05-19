import waypoint from '../../../js-modules/on-scroll2.js';

export default function scroll_show(container_node){
	var O = {};

	//track the header: 0-default, 1-fixed, 2-absolute
	var position = 0;
	var pos_change_callback = null;

	var height = 91;
	
	var wrap_outer = d3.select(container_node).style("width","100%");
	var wrap = wrap_outer.append("div").style("width","100%").style("position","relative");

	var fixedPanel = null;

	O.panel = function(){
		var wp = null;
		var panel_outer = wrap.append("div")
							 .classed("c-fix",true)
							 .style("height","100%")
							 .style("max-height","100vh")
							 .style("min-height","90vh")
							 .style("width","100%")
							 .style("position",null)
							 .style("z-index","1")
							 ;

		var panel = panel_outer.append("div").style("width","100%").style("height","auto");

		if(fixedPanel===null){
			//first panel is the fixed one
			fixedPanel = panel;
			afix(panel_outer, panel);
		}

		var wp = waypoint(panel_outer.node()).buffer(0.5);
		var p = {};

		p.init = function(fn){
			fn.call(panel);
			return p;
		}

		p.activate = function(fn, reactivate_when_in_view){
			reactivate_when_in_view = true;
			wp.activate(function(box, window_height){
				fn.call(panel, box, window_height)
			}, reactivate_when_in_view);
			return p;
		}

		p.scroll = function(fn){
			wp.scroll(function(box, window_height){
				fn.call(panel, box, window_height)
			});
			return p;
		}

		p.wrap = panel_outer;
		p.panel = panel;
		p.node = panel.node();

		return p;
	}

	//scroll event handler
	function afix(outer_panel, inner_panel, top_pad){

		var parent = wrap.node(); //parent is the div that holds the panels
		var container = outer_panel.node();
		var inner = inner_panel;

		outer_panel.style("z-index","2");
		wrap.classed("panel-wrap",true);

		var top_pad = arguments.length > 2 ? top_pad : 50;

		function pos(){
			var window_height = Math.max(document.documentElement.clientHeight, (window.innerHeight || 0));

			try{
				var rect = container.getBoundingClientRect();
				var height_fixed = rect.bottom - rect.top;

				var past_bottom = (!!parent && parent.getBoundingClientRect().bottom < window_height-height_fixed-top_pad) ? true : false;
				if(rect.top < 0 && !past_bottom){
					if(position !== 1){
						inner.interrupt()
							 .style("position","fixed")
							 //.style("bottom", (-height_fixed+"px"))
							 //.style("height", height_fixed+"px")
							 //.style("background-color",null)
							 .style("left","0px")
							 .style("top","0")
							 //.style("width","100%")
							 .transition()
							 .duration(400)
							 .style("top",top_pad+"px")
							 //.style("bottom","-1px")
							 //.on("end", function(d,i){
							 	//force repaint. sometime transition results in a 1px gap
							 //	inner.style("bottom","-1px").style("display","block");
							 //})
							 ;
						position = 1;
						if(!!pos_change_callback){
							pos_change_callback(1);
						}
					}
				}
				else if(rect.top < 0 && past_bottom){
					if(position !== 2){
						inner.interrupt()
							 .transition()
							 .duration(0)
							 .style("position","absolute")
							 //.style("bottom","auto")
							 //.style("height",height+"px")
							 //.style("background-color",background_color)
							 .style("top","calc(100% + 2em)")
							 .style("left","0px")
							 //.style("width","100%")
							 ;
						position = 2;
						if(!!pos_change_callback){
							pos_change_callback(2);
						}
					}
				}
				else{
					inner.interrupt().transition().duration(0)
							 .style("position","relative")
							 //.style("width","auto")
							 //.style("height",height+"px")
							 //.style("background-color",background_color)
							 .style("top",null)
							 //.style("bottom","auto")
							 ;
					position = 0;
					if(!!pos_change_callback){
						pos_change_callback(0);
					}
				}
			}
			catch(e){
				console.log(e);
				if(!!inner){
					inner.style("position","relative");//.style("width","auto");
				}
			}
		}

		window.addEventListener("scroll", pos);
		window.addEventListener("resize", pos);

		//set up in next tick
		setTimeout(function(){pos()}, 0);

		//insurance
		setTimeout(function(){pos()}, 3000);
	}

	return O;
}
