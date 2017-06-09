import format from '../../../js-modules/formats.js';

export default function sc_stack(){
	//color credit: colorbrewer2.org
	var colors = ['#666666','#0d73d6','#65a4e5','#a6d854','#66c2a5','#fc8d62','#ffd92f','#e5c494'];

	var titles = [
		"",
		"Less educated prime-age people",
		"Diverse, less educated, and eyeing retirement",
		"Young, less-educated, and diverse",
		"Moderately educated older people",
		"Motivated and moderately educated younger people",
		"Highly educated, high-income older people",
		"Highly educated and engaged younger people"
	];

	var sc = {};

	sc.color = function(superclus){
		return colors[+superclus];
	}

	sc.title = function(superclus){
		return titles[+superclus];
	}

	//rect_data should look like: [{count:x, share:count/total, id:superclus2}]
	sc.stack = function(rect_data, svg){
		var cumulative = 0;
		rect_data.forEach(function(d,i,a){
			d.cumulative = cumulative;
			cumulative += d.share;
		});		

		svg.style("overflow","visible");

		var transition_duration = 1000;	

		var rects0 = svg.selectAll("rect").data(rect_data, function(d){return d.id});
			rects0.exit().remove();
		var rects = rects0.enter().append("rect").merge(rects0)
						.attr("height","100%")
						.style("shape-rendering","crispEdges")
						.style("stroke","#eeeeee")
						.style("stroke-width","1")
						.transition()
						.duration(transition_duration)
						.attr("fill",function(d,i){
							return sc.color(d.id);
						})
						.attr("x", function(d,i){
							return (d.cumulative*100)+"%";
						})
						.attr("width", function(d){return (d.share*100)+"%" })

						; 

		var textG0 = svg.selectAll("g").data(rect_data).style("opacity","0");
			textG0.exit().remove();
		var textG = textG0.enter().append("g").merge(textG0);

		var texts0 = textG.selectAll("text").data(function(d){return d.share > 0.03 ? [d,d] : []});
			texts0.exit().remove();
		var texts = texts0.enter().append("text").merge(texts0)
						.attr("x", function(d){return (100*(d.cumulative + d.share))+"%"})
						.attr("y", 50)
						.attr("dy",15)
						.attr("dx",-3)
						.attr("text-anchor","end")
						.text(function(d){return format.sh1(d.share)})
						.style("fill",function(d,i){
							return d3.color(sc.color(d.id)).darker(1.25);
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
						
		textG.transition()
			.delay(transition_duration)
			.duration(transition_duration/2)
			.style("opacity","1")
			;
	}

	return sc;
}