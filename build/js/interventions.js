export default function interventions(){
	var I = {};

	var descriptions = {};

	descriptions.initials = ["B","T","S","J","I","2","A","X"];

	descriptions.titles = {
		B:"Bridge programs",
		T:"Transitional jobs programs",
		S:"Social enterprises",
		J:"Job search assistance and case management",
		I:"Industry or sector-based programs",
		"2":"Two-generation programs",
		A:"ASAP (Accelerated Study in Associate Programs)",
		X:"The 8th one"
	}

	descriptions.short = {
		B:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		T:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		S:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		J:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		I:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		"2":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		A:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		X:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"]
	}

	descriptions.long = {
		B:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta purus rutrum tortor gravida, interdum scelerisque enim"],
		T:[],
		S:[],
		J:[],
		I:[],
		"2":[],
		A:[],
		X:[]
	}

	var body_wrap = d3.select("body");
	var show = function(id){
		d3.event.stopPropagation();
		var fixed = body_wrap.append("div")
			.style("position","fixed")
			.style("width","100%")
			.style("height","100%")
			.style("z-index","1000")
			.style("background-color","rgba(5, 55, 105, 0)")
			.style("top","0px")
			.style("left","0px")
			;
		fixed.transition()
			.style("background-color","rgba(5, 55, 105, 0.95)")
			;

		var table = fixed.append("div")
			.style("display","table")
			.style("max-width","800px")
			.style("width","90%")
			.style("height","100%")
			.style("margin","1em auto")
		var row = table.append("div")
			.style("display","table-row");
		var cell = row.append("div")
			.style("display","table-cell")
			.style("vertical-align","middle");

		var box = cell.append("div")
			.style("border","1px solid #ffffff")
			.style("position","relative")
			.style("padding","1em 2em")
			.classed("reading",true);

			box.selectAll("p")
				.data(descriptions.long[id])
				.enter()
				.append("p")
				.html(function(d,i){return d})
				.style("color","#ffffff")
				.style("font-weight", function(d,i){
					return i==0 ? "bold" : "normal";
				})

		var x_height = 30;
		var x_width = x_height;
		var xsvg = box.append("div")
			   .classed("make-sans",true)
			   .style("position","absolute")
			   .style("top","-"+x_height+"px")
			   .style("right","-"+x_width+"px")
			   .style("width",x_width+"px")
			   .style("height",x_height+"px")
			   .append("svg")
			   .attr("width","100%").attr("height","100%")
			   ;

			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","20%").attr("y2","80%");
			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","80%").attr("y2","20%");

			xsvg.selectAll("line").attr("stroke","#ffffff")
									.attr("stroke-width","5px");
		   ;

		fixed.on("mousedown", function(d,i){
			fixed.remove();
		});
		//
	}//end show


	//use 1: layout all the interventions in a large grid with text
	I.grid = function(container){
		var wrap = d3.select(container);

		var rows = wrap.selectAll("div").data([descriptions.initials.slice(0,4),descriptions.initials.slice(4)])
							.enter().append("div").classed("c-fix",true).style("margin","2em 0em")
							;

		var tiles = rows.selectAll("div.subway-tile").data(function(d){return d})
							.enter().append("div").classed("subway-tile",true);

		var headers = tiles.append("div").classed("tile-header",true);
		var dots = headers.append("div").classed("dot",true).style("cursor","pointer");
		var dot_labels = dots.append("p").text(function(d){return d});

		dots.on("mousedown", function(d){show(d)});

		var content = tiles.append("div").classed("tile-content reading",true);
		var text = content.selectAll("p").data(function(d){return descriptions.short[d]})
							.enter().append("p").text(function(d){return d})
							;
	}

	return I;
}
