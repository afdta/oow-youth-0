import cluster_data from './cluster_data.js';
import format from '../../../js-modules/formats.js';
import sc_stack from './sc_stack.js';
import bar_charts from './bar_charts.js';

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
	var nested_sums = nest2.object(jurisdiction_data);

	var outer_wrap = d3.select(container).classed("makesans c-fix", true);
	
	var title_wrap = outer_wrap.append("div").classed("c-fix",true).style("display","table").style("width","100%");

	var top_title = title_wrap.append("p").style("display","table-cell")
						.style("margin","0em 0em 0.5em 10px");
	var place_title = top_title.append("span")
				 .style("font-weight","bold")
				 .text("Distribution of major out-of-work groups in ")
				 .append("span")
				 ;
		top_title.append("span").text(" | ");

   	top_title.append("span").html("<em>Select a segment to view underlying data</em>").style("white-space","nowrap")

	/*title_wrap.append("p")
			  .text("Explore the out-of-work population by jurisdiction")
			  .classed("cluster-title",true)
			  .style("display","table-cell");*/


	//var place_title = title_wrap.append("p").style("float","left");
	
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

	function draw(id){
		var dat = nested_data[id];
		var sums = nested_sums[id];

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

		//rect_data should look like: [{count:x, share:count/total, id:superclus2}]
		var rect_data = [1,2,3,4,5,6,7].map(function(d,i){
			
			var r = {id:d}; //id is numeric
			if(sums.hasOwnProperty(d+"")){ 
				r.count = sums[d+""];
			}
			else{
				r.count = 0;
			}
			r.share = r.count / tot; 
			return r;
		});

		sc_stacker.stack(rect_data, svg, function(superclus2){
			var color = sc_stacker.color(superclus2);
			var title = sc_stacker.title(superclus2);
			if(superclus2=="ALL"){
				var D = oow;
			}
			else{
				var D = dat[superclus2];
			}
			draw_profile(D, title, color);
		});

		//initialize with the overall out of work data
		draw_profile(oow, sc_stacker.title("ALL"), sc_stacker.color("ALL"));
		
		var place = id=="AGG" ? "all jurisdictions" : place_lookup[id];
		place_title.text(place);
		//place_title2.text(place);
	}

	//charts, etc
	function draw_profile(data, title, color){
		//console.log(data);
		//console.log(title);
		bar_charts(data, bar_chart_wrap, color);
	}

	draw(options_data[0].FIPS_final);

	select.on("change", function(d,i){
		var id = this.value;
		draw(id);
	});

























	return null;

	var tot_oow = d3.sum(jurisdiction_data, function(d){return d.count});



	

	//one-time profile setup
	var slides = wrap.selectAll("div.supercluster-profile")
					 .data(supercluster_profile_data)
					 .enter().append("div")
					 .classed("supercluster-profile",true)
					 ;

	slides.each(function(d,i){
		//console.log(d);

		var thiz = d3.select(this);

		var COLOR = colors[d.superclus2];
		//thiz.append("div").classed("h-border",true);
		//console.log(d);
		var title_box = thiz.append("div");
		var title = title_box.append("p")
							 .classed("cluster-title",true);
			
			title.append("div").style("background-color", COLOR);
			title.append("span").text(about_clusters.titles[d.superclus2]);

							 ;
		var svg = title_box.append("svg").style("width", "100%").style("height","50px").style("overflow","visible");

		var rect_data = supercluster_profile_data.map(function(d){
			return {count: d.count, id:d.superclus2, share:d.count/tot_oow}
		}).sort(function(a,b){
			var compare = 0;
			if(a.id==d.superclus2){
				compare = -1;
			}
			else if(b.id==d.superclus2){
				compare = 1;
			}
			else{
				compare = a.id - b.id;
			}
			return compare;
		});

		var cumulative = 0;
		rect_data.forEach(function(d,i,a){
			d.cumulative = cumulative;
			cumulative += d.share;
		});			

		var rects = svg.selectAll("rect").data(rect_data).enter().append("rect")
						.attr("width", function(d){return (d.share*100)+"%" })
						.attr("height","100%")
						.attr("fill",function(d,i){
							return colors[d.id]
						})
						.attr("x", function(d,i){
							return (d.cumulative*100)+"%";
						})
						.style("shape-rendering","crispEdges")
						.style("stroke","#eeeeee")
						.style("stroke-width","1")
						; 

		var texts = svg.selectAll("g").data(rect_data).enter().append("g")
						.selectAll("text").data(function(d){return [d,d]}).enter().append("text")
						.attr("x", function(d){return (100*(d.cumulative + d.share))+"%"})
						.attr("y", 50)
						.attr("dy",15)
						.attr("dx",-3)
						.attr("text-anchor","end")
						.text(function(d){return format.sh1(d.share)})
						.style("fill",function(d,i){
							return d3.color(colors[d.id]).darker(1.25);
						})
						.style("stroke-opacity",function(d,i){
							return i == 0 ? 0.4 : 1;
						})
						.style("stroke",function(d,i){
							return i == 0 ? "#eeeeee" : null;
						})
						.style("stroke-width",function(d,i){
							return i == 0 ? 3 : null;
						})
						.style("font-weight",function(d,i){
							return i == 0 ? "normal" : "normal";
						})
						.style("font-size","15px")
						;

		var content = thiz.append("div")
						  .style("min-height","100px")
						  .style("padding","1em")
						  .style("margin","0em 0em 0em 0em")
						  .style("width","100%")
						  .classed("makesans c-fix",true);

		var textWrap = content.append("div")
								.style("float","right")
								.classed("reading",true)
								.style("margin","3em 2em 0em 0em")
								.style("max-width","480px")
								.append("p")
								.text("[130-140 word overview of group.] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus iaculis, risus at finibus commodo, lorem leo suscipit ligula, eget vestibulum turpis lectus a arcu. Pellentesque elementum ex vitae risus maximus maximus eu sit amet mauris. Donec odio sem, pharetra in luctus a, bibendum sit amet ex. Aenean arcu nunc, ultrices vitae tortor quis, commodo hendrerit elit. Donec elementum, nisl et tincidunt pretium, neque diam ornare odio, ut congue nulla leo ac tellus. Phasellus ipsum lacus, scelerisque nec urna ac, sollicitudin eleifend enim. Praesent gravida tempor nisl at lacinia. Aliquam tincidunt enim ac turpis pretium, sed lacinia tortor sollicitudin. Quisque nec erat magna. Curabitur sodales, nisl eu commodo aliquet, mi lorem luctus felis, at euismod ipsum elit non leo. Integer non eleifend turpis. Vivamus feugiat sem eu libero accumsan ornare.")
		
		var chartWrap1 = content.append("div").style("float", "left").style("margin","3em 2em 0em 0em");
		var chartWrap2 = content.append("div").style("float", "left").style("margin","3em 2em 0em 0em");

		var meet = content.append("div").style("margin","1em 0em 0em 0em")
										.style("padding","0em 0em 0em 0em")
										.style("clear","both")
										.classed("c-fix",true)
										;

		meet.append("p").text("Meet avatar1 and avatar2")
						.style("padding","1em 0em 0.25em 0em")
						.style("font-weight","bold");

		var profile1 = meet.append("div").classed("avatar-profile c-fix",true).style("margin-right","5%");
		var avatar1 = profile1.append("div").classed("avatar",true).append("img")
								.attr("src", "./build/wireframes/avatar1.png")
								.attr("alt", "Avatar image")
								;
			profile1.append("div").classed("avatar-text reading",true)
								  .append("p")
								  .text("Avatar1 is ... [Description here...] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit malesuada erat, eu scelerisque orci aliquet sagittis. Vivamus iaculis, risus at finibus commodo, lorem leo suscipit ligula, eget vestibulum turpis lectus a arcu. Pellentesque elementum ex vitae risus maximus maximus eu sit amet mauris.")

		var profile2 = meet.append("div").classed("avatar-profile c-fix",true).style("margin-left","5%");
		var avatar2 = profile2.append("div").classed("avatar",true).append("img")
								.attr("src", "./build/wireframes/avatar2.png")
								.attr("alt", "Avatar image")
								;
			profile2.append("div").classed("avatar-text reading",true)
								  .append("p")
								  .text("Avatar2 is ... [Description here...] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin blandit malesuada erat, eu scelerisque orci aliquet sagittis. Vivamus iaculis, risus at finibus commodo, lorem leo suscipit ligula, eget vestibulum turpis lectus a arcu. Pellentesque elementum ex vitae risus maximus maximus eu sit amet mauris.")



		//var subtitle = content.append("p").style("line-height","1.5em");
		//	subtitle.append("span").html("• " + format.num0(d.count) + " out-of-work <br />");
		//	subtitle.append("span").html("• " + format.sh1(d.count/tot_oow) + " of the out-of-work in 137 jurisdictions");  
		

		var chartWidget = function(title, data, stacked, wrapper){
			var stack = arguments.length > 2 ? !!stacked : false;
			var bars = data.filter(function(d){return d.value >= 0.0045});
			var colScale = d3.interpolateLab("#eeeeee", COLOR);

			var wrap = wrapper.append("div").classed("chart-widget", true);
			wrap.append("p").html(title).style("margin","0em 0em 0em 0em");
			var svg = wrap.append("svg");
			var bar_height = 15;
			var pad = 5;
			var w = 320;
			var h = !!stack ? bar_height + pad*2 : ((bars.length*bar_height) + (bars.length+1)*pad);
			svg.style("height",h+"px").style("width",w+"px");

			var cumulative = 0;

			var mapped = bars.map(function(d,i){
				var obs = {};
				obs.label = d.label;
				obs.value = d.value;
				obs.width = (obs.value*100)+"%";
				if(!!stack){
					obs.x = (cumulative*100)+"%";
					obs.y = pad;
					cumulative = cumulative + d.value;
				}
				else{
					obs.y = pad + (i*bar_height);
					obs.x = "0%"
				}
				return obs;
			});

			svg.selectAll("rect").data(mapped).enter().append("rect")
					.attr("x", function(d){return d.x})
					.attr("y", function(d){return d.y})
					.attr("width", function(d){return d.width})
					.attr("height", function(d){return bar_height})
					.attr("stroke", "#ffffff")
					.attr("stroke-width",1)
					.attr("fill", function(d){return COLOR})
					.style("shape-rendering","crispEdges")
					;

		};
		
		//Age
		(function(){
			var vals = [{label:"25–34", value:d.a2534}, 
						{label:"35–44", value:d.a3544}, 
						{label:"45–44", value:d.a4554}, 
						{label:"55–64", value:d.a5564}]
						;
						//console.log(vals);
			chartWidget("Age", vals, false, chartWrap1);
		})();

		//Education
		(function(){
			var vals = [{label:"<HS", value:d.lths}, 
						{label:"HS", value:d.hs}, 
						{label:"Some college", value:d.sc}, 
						{label:"Associate's", value:d.aa},
						{label:"BA+", value:d.baplus}]
						;
			chartWidget("Educational attainment", vals, false, chartWrap1);
		})();

		//Race
		(function(){
			var vals = [{label:"White", value:d.whiteNH}, 
						{label:"Black", value:d.blackNH}, 
						{label:"Hispanic", value:d.latino}, 
						{label:"Asian", value:d.asianNH},
						{label:"Other", value:d.otherNH}]
						;
			chartWidget("Race", vals, false, chartWrap1);			
		})();

		//Sex
		(function(){
			var vals = [{label:"Male", value:d.male}, 
						{label:"Female", value:1-d.male}]
						;
			chartWidget("Sex", vals, true, chartWrap2);
		})();



		//Disaility
		(function(){
			var vals = [{label:"Disability", value:d.dis}, 
						{label:"No disability", value:1-d.dis}]
						;
			chartWidget("Disabililty status", vals, true, chartWrap2);
		})();

		//LEP
		(function(){
			var vals = [{label:"LEP", value:d.lep}, 
						{label:"Non-Lep", value:1-d.lep}]
						;
			chartWidget("Limited English proficiency (LEP)", vals, true, chartWrap2);
		})();

		//Children
		(function(){
			var vals = [{label:"One or more", value:d.children}, 
						{label:"None", value:1-d.children}]
						;
			chartWidget("Is caring for children", vals, true, chartWrap2);
		})();

		//Looking for work
		(function(){
			var vals = [{label:"Looking", value:d.unemployed},
						{label:"Not looking", value:1-d.unemployed}
						]
						;
			chartWidget("Looking for work", vals, true, chartWrap2);
		})();

		//Worked in last year
		//(function(){
		//	var vals = [{label:"Yes", value:d.lastworked_pastyr}, 
		//				{label:"No", value:1-d.lastworked_pastyr}
		//				]
		//				;
		//	chartWidget("Worked in the last year", vals, true);
		//})();

	});

}