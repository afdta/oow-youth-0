import supercluster_profile_data from './supercluster_data.js';
import palette from '../../../js-modules/palette.js';
import format from '../../../js-modules/formats.js';

export default function supercluster_profiles(container){
	console.log(palette);
	var pal = palette();

	//color credit: colorbrewer2.org
	var colors = ['#666666','#0d73d6','#65a4e5','#a6d854','#66c2a5','#fc8d62','#ffd92f','#e5c494']

	supercluster_profile_data.sort(function(a,b){
		return a.superclus2 - b.superclus2;
	});

	var tot_oow = d3.sum(supercluster_profile_data, function(d){return d.count});

	var supercluster_titles = [
		"",
		"Less educated prime-age people (38%)",
		"Motivated and moderately educated younger people (14%)",
		"Young, less-educated, and diverse (11%)",
		"Highly educated, high-income older people (11%)",
		"Moderately educated older people (12%)",
		"Highly educated, high-income older people (11%)",
		"Highly educated and engaged younger people (9%)",
		"Diverse, less educated, and eyeing retirement (6%)"
	]

	var wrap = d3.select(container);

	//one-time profile setup
	var slides = wrap.selectAll("div.supercluster_profile")
					 .data(supercluster_profile_data)
					 .enter().append("div")
					 .classed("supercluster_profile",true)

					 ;

	slides.each(function(d,i){
		//console.log(d);

		var thiz = d3.select(this)
					  .style("margin","2em 0em")
					  .style("box-sizing","border-box")
					  .style("min-height","90vh")
					  ;
		//thiz.append("div").classed("h-border",true);
		console.log(d);
		var title_box = thiz.append("div");
		var title = title_box.append("p")
							 .classed("cluster-title",true);
			
			title.append("div").style("background-color", colors[d.superclus2]);
			title.append("span").text(supercluster_titles[d.superclus2]);

							 ;
		var svg = title_box.append("svg").style("width", "100%").style("height","50px");

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
						; 

		var content = thiz.append("div")
						  .style("background-color","#eeeeee")
						  .style("min-height","100px")
						  .style("padding","1em")
						  .style("width","100%")
						  .classed("makesans",true);

		var subtitle = content.append("p").style("line-height","1.5em");
			subtitle.append("span").html("• " + format.num0(d.count) + " out-of-work <br />");
			subtitle.append("span").html("• " + format.sh1(d.count/tot_oow) + " of the out-of-work in 137 jurisdictions");  
		

		//var stack = content.append()
		
		//Age
		(function(){

		})();

		//Race
		(function(){

		})();

		//Sex
		(function(){

		})();

		//Education
		(function(){

		})();

		//Disaility
		(function(){

		})();

		//LEP
		(function(){

		})();

		//Children
		(function(){

		})();

		//Looking for work
		(function(){

		})();

		//Worked in last year
		(function(){

		})();

	});

}