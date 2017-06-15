import waypoint from '../../../js-modules/on-scroll2.js';

export default function funnel(container){
	var wrap = d3.select(container);

	//data should look like:
	//[{label: string, num: number, col: string}]

	var values = [{
				unemp_oow: 3.6,
				unemp_other: 0.4,
				nilf_oow: 7.614,
				nilf_other: 8.586,
				emp: 58.7
			 }];

	var keys_all = ["unemp_oow", "unemp_other", "nilf_oow", "nilf_other", "emp"];
	var cols = ["#dc2a2a", "#ff6464", "#65a4e5"];

	var cols = ['#fc8d62','#a6d854','#65a4e5','#e5c494'];

	var clips = 0;

	//keys1 and keys2 should look like: [{key:"unemp_oow", col:0}, ...] where col is 0, 1, or 2 (red, pink, or blue)
 	function add_layer(text, key_highlight, keys1, keys2){
		var slide = wrap.append("div")
						.style("margin","3em 0em 5em 0em")
						.style("opacity","0.5")
						.classed("c-fix",true);

		var marker = slide.append("div").classed("marker",true);
			marker.append("div");
		
		var text_wrap = slide.append("div")
						.classed("funnel-text-wrap left40 makesans", true)
						.style("opacity","0.5")
						;
		
		var svg_wrap = slide.append("div")
							.classed("left60",true);

		var svg = svg_wrap.append("svg").attr("width","100%").attr("height","60px");

		var rects = svg.append("g");

		var clipid = "clip" + (++clips);
		var clip = svg.append("defs")
						.append("clipPath")
						.attr("id", clipid)
						.append("rect")
						.attr("width","100%")
						.attr("height","40px")
						.attr("y","10")
						.attr("rx","13")
						.attr("ry","13")
						.attr("fill","#ffffff")
						;

		rects.attr("clip-path", "url(#" + clipid + ")")

		var text_ = [].concat(text);
		text_wrap.selectAll("p").data(text_).enter().append("p")
				.html(text)
				.style("margin","10px 0em 0em 2em")
				;

		

		var tot = d3.sum(keys_all, function(d){return values[0][d]});

		var stack1 = d3.stack().keys(keys1.map(function(d){return d.key}))(values);
		var colors1 = keys1.map(function(d){return cols[d.col]});

		//setup with enter selection only	
		rects.selectAll("rect.segment").data(stack1, function(d){return d.key})
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
							 .attr("height","40px")
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
			
				var update = rects.selectAll("rect.segment").data(stack2, function(d){return d.key});


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
						.delay(500)
						.duration(1200)
						.attr("stroke", function(d,i){
							return !!keys2[i].bump ? "#ffffff" : colors2[i];
						})
						.attr("width", function(d){
							var share =  100*(d[0][1] - d[0][0])/tot;
							return share+"%";
						})

					//if not bumped, transition color now
					t1.filter(function(d,i){return !keys2[i].bump})
						.attr("fill", function(d,i){
							return colors2[i]}
						)

				var t2 = t1.transition()
						.duration(2000)
						.attr("x", function(d){
							return (100*d[0][0]/tot)+"%";
						})

				var t3 = t2.transition()
						.duration(800)
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
				marker.classed("active",true);
				slide.transition().duration(500).style("opacity",1);	
			}
			waypoint(slide.node()).buffer(-1, 0.8).activate(activate);		
		}
		else{
			text_wrap.transition().duration(500).style("opacity",1);
			marker.classed("active",true);
			slide.transition().duration(500).style("opacity",1);
		} 		
	}

	add_layer('In the 130 study jurisdictions, there are 78.9 million people between the ages of 25 and 64 who are non-institutionalized civilians. This bar represents that entire group.',
			  null,
			  [{key:"unemp_oow", col:2}, {key:"unemp_other", col:2}, {key:"nilf_oow", col:2}, 
			   {key:"nilf_other", col:2}, {key:"emp", col:2}]
			  )

	add_layer('Of this 78.9 million, 4 million are <span class="unemployed-text">unemployed</span>—people who do not have a job, are available for work, and have actively looked for work in the last four weeks.',
		  null,
		  [{key:"unemp_oow", col:2}, {key:"unemp_other", col:2}, {key:"nilf_oow", col:2}, 
		   {key:"nilf_other", col:2}, {key:"emp", col:2}],
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:2}, 
		   {key:"nilf_other", col:2}, {key:"emp", col:2}]
		 )

	add_layer('An additional 16.2 million are considered <span class="nilf-text">not in the labor force</span>—people who are neither working nor looking for work. This is a heterogeneous group with different reasons for not entering the labor force, not all of which are readily observable. Individuals may be devoting time and energy towards other activities such as raising children, taking care of other family members, or going to school. They may be retired or have disabilities that preclude employment. They may be interested in working, but because they have not searched for a job in the past four weeks, they are not counted among the unemployed.',
		  null,
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:2}, 
		   {key:"nilf_other", col:2}, {key:"emp", col:2}],
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"nilf_other", col:1}, {key:"emp", col:2}]
		 )

	add_layer('Of the combined unemployed and not-in-the-labor-force populations—all people who are not presently working—we subtracted people receiving retirement and disability benefits, most students, and our best estimate of people who choose to be stay-at-home parents with sufficient earnings from a spouse who works. These subtractions amount to 10 percent of the unemployed and 53 percent of those not in the labor force.',
		  null,
		  [{key:"unemp_oow", col:0}, {key:"unemp_other", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"nilf_other", col:1}, {key:"emp", col:2}],
		  [{key:"unemp_oow", col:0}, {key:"nilf_oow", col:1}, 
		   {key:"emp", col:2}, {key:"unemp_other", col:2, bump:true}, {key:"nilf_other", col:2, bump:true}]
		 )

	add_layer('This leaves 11.3 million individuals defined as <span class="oow-text">out-of-work</span> (14 percent of the 25–64 year-old non-institutionalized civilian population.)',
	  null,
	  [{key:"unemp_oow", col:0}, {key:"nilf_oow", col:1}, 
	   {key:"unemp_other", col:2}, {key:"emp", col:2}, {key:"nilf_other", col:2}],
	  [{key:"unemp_oow", col:3}, {key:"nilf_oow", col:3}, 
	   {key:"unemp_other", col:2}, {key:"emp", col:2}, {key:"nilf_other", col:2}]
	 )
}
