import waypoint from '../../../js-modules/on-scroll2.js';

export default function funnel(container){
	var wrap = d3.select(container);

	//data should look like:
	//[{label: string, num: number, col: string}]

	var values = [{
				unemp_oow: 4.5,
				unemp_other: 0.5,
				nilf_oow: 9.2,
				nilf_other: 13.8,
				emp: 72
			 }];

	var keys_all = ["unemp_oow", "unemp_other", "nilf_oow", "nilf_other", "emp"];
	var cols = ["#dc2a2a", "#ff6464", "#0d73d6"];

	//keys1 and keys2 should look like: [{key:"unemp_oow", col:0}, ...] where col is 0, 1, or 2 (red, pink, or blue)
 	function add_layer(text, key_highlight, keys1, keys2){
		var slide = wrap.append("div").style("margin","3em 0em 7em 0em").style("opacity","0.4");
		var svg = slide.append("svg").attr("width","100%").attr("height","50px");
		var text_wrap = slide.append("div")
						.classed("funnel-text-wrap", true)
						.style("opacity","0")
						;

			var text_ = [].concat(text);
			text_wrap.selectAll("p").data(text_).enter().append("p")
					.html(text)
					;

		

		var tot = d3.sum(keys_all, function(d){return values[0][d]});

		var stack1 = d3.stack().keys(keys1.map(function(d){return d.key}))(values);
		var colors1 = keys1.map(function(d){return cols[d.col]});

		//setup with enter selection only	
		svg.selectAll("rect.segment").data(stack1, function(d){return d.key})
							 .enter()
							 .append("rect")
							 .classed("segment",true)
							 .attr("fill", function(d,i){
							 	return colors1[i]}
							 )
							 .attr("stroke", function(d,i){
							 	return colors1[i]}
							 )
							 .attr("stroke-width","1px")
							 .attr("height","35px")
							 .attr("width", function(d){
							 	var share =  100*(d[0][1] - d[0][0])/tot;
							 	return share+"%";
							 })
							 .attr("x", function(d){
							 	return (100*d[0][0]/tot)+"%";
							 })
							 .attr("y","10px")
							 .style("shape-rendering","crispEdges")
							 ;

		if(arguments.length > 3){
			function activate(){
				var stack2 = d3.stack().keys(keys2.map(function(d){return d.key}))(values);
				var colors2 = keys2.map(function(d){return cols[d.col]});
			
				var update = svg.selectAll("rect.segment").data(stack2, function(d){return d.key});


				var all = update.enter()
						.append("rect")
						.attr("height","35px")
						.attr("stroke-width","1px")
						.attr("y","10px")
						.classed("segment",true)
						.merge(update)
						.style("shape-rendering", "auto")
						;

					all.filter(function(d,i){return !!keys2[i].bump}).raise();

				var t1 = all.transition()
						.delay(1000)
						.duration(500)
						.attr("y", function(d, i){
							return !!keys2[i].bump ? "0px" : "10px"
						})

					//if not bumped, transition color now
					t1.filter(function(d,i){return !keys2[i].bump})
						.attr("fill", function(d,i){
							return colors2[i]}
						)
						.attr("stroke", function(d,i){
							return colors2[i]}
						)

				var t2 = t1.transition()
						.duration(2000)
						.attr("width", function(d){
							var share =  100*(d[0][1] - d[0][0])/tot;
							return share+"%";
						})
						.attr("x", function(d){
							return (100*d[0][0]/tot)+"%";
						})

				var t3 = t2.transition()
						.duration(500)
						.attr("y", "10px")
						.attr("fill", function(d,i){
							return colors2[i]}
						)
						.attr("stroke", function(d,i){
							return colors2[i]}
						)
						.on("end", function(){
							d3.select(this).style("shape-rendering", "crispEdges")
						})
						;

				text_wrap.transition().duration(500).style("opacity",1);
				slide.transition().duration(500).style("opacity",1);	
			}
			waypoint(slide.node()).buffer(-1, 0.7).activate(activate);		
		}
		else{
			text_wrap.transition().duration(500).style("opacity",1);
			slide.transition().duration(500).style("opacity",1);
		} 		
	}

	add_layer('In the United States, there are XX million people between the ages of 25 and 64 who are not living in group quarters or institutionalized. The bar above represents this entire group.',
			  null,
			  [{key:"unemp_oow", col:2}, {key:"unemp_other", col:2}, {key:"nilf_oow", col:2}, 
			   {key:"nilf_other", col:2}, {key:"emp", col:2}]
			  )

	add_layer('Of this XX million, YY million are <span class="red-text">unemployed</span>—people who do not have a job, are available for work, and have actively looked for work in the last four weeks.',
		  null,
		  [{key:"unemp_oow", col:2}, {key:"unemp_other", col:2}, {key:"nilf_oow", col:2}, 
		   {key:"nilf_other", col:2}, {key:"emp", col:2}],
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:2}, 
		   {key:"nilf_other", col:2}, {key:"emp", col:2}]
		 )

	add_layer('An additional ZZ million are considered <span class="pink-text">not in the labor force</span>—people who are neither working nor looking for work. This is a heterogenous group with different reasons for not entering the labor force, not all of which are readily observable. Individuals may be devoting time and energy towards other activities such as raising children, taking care of other family members, or going to school. They may be retired or have disabilities that preclude employment. They may be interested in working, but because they have not searched for a job in the past four weeks, they are not counted among the unemployed.',
		  null,
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:2}, 
		   {key:"nilf_other", col:2}, {key:"emp", col:2}],
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"nilf_other", col:1}, {key:"emp", col:2}]
		 )

	add_layer('Of the <span class="red-text">unemployed</span>, we subtracted people receiving retirement and disability benefits and students living in group quarters (primarily college dormitories). This amounts to X, or x% of the unemployed.',
		  null,
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"nilf_other", col:1}, {key:"emp", col:2}],
		  [{key:"unemp_oow", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"nilf_other", col:1}, {key:"unemp_other", col:2, bump:true}, {key:"emp", col:2}]
		 )

	add_layer('Finally, of those <span class="pink-text">not in the labor force</span>, we subtracted all students, people receiving retirement and disability benefits, and our estimate of people who choose to be stay-at-home parents with sufficient earnings from a spouse who works. This amounts to Y people, or y% of those not in the labor force.',
		  null,
		  [{key:"unemp_oow", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"nilf_other", col:1}, {key:"unemp_other", col:2, bump:true}, {key:"emp", col:2}],
		  [{key:"unemp_oow", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"unemp_other", col:2}, {key:"emp", col:2}, {key:"nilf_other", col:2, bump:true}]
		 )

	add_layer('This leaves O individuals defined as <span class="red-text">out of work</span> (o% of the 25 to 64 year old population.) [Need a new color for out of work]',
	  null,
	  [{key:"unemp_oow", col:0}, {key:"nilf_oow", col:1}, 
	   {key:"unemp_other", col:2}, {key:"emp", col:2}, {key:"nilf_other", col:2}],
	  [{key:"unemp_oow", col:0}, {key:"nilf_oow", col:0}, 
	   {key:"unemp_other", col:2}, {key:"emp", col:2}, {key:"nilf_other", col:2}]
	 )
}
