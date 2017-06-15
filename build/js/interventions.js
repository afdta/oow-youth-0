export default function interventions(){
	var I = {};

	// Order and final names of major groups:
	// 1.“Young, less-educated, and diverse” (supercluster 3)
	// 2.“Less-educated prime-age people” (supercluster 1)
	// 3.“Diverse, less-educated, and eyeing retirement” (supercluster 2)
	// 4.“Motivated and moderately educated younger people” (supercluster 5)
	// 5.“Moderately educated older people” (supercluster 4)
	// 6.“Highly educated and engaged younger people” (supercluster 7)
	// 7.“Highly educated, high-income older people” (supercluster 6)

	var descriptions = {};

	descriptions.initials = ["BP","TJ","SE","JS","SI","2G","AP","AS"];

	descriptions.titles = {
		BP:"Bridge programs",
		TJ:"Transitional jobs",
		SE:"Social enterprises",
		JS:"Job search assistance and counseling",
		SI:"Sector initiatives",
		"2G":"Two-generation programs",
		AP:"Apprenticeships",
		AS:"ASAP (Accelerated Study in Associate Programs)"
	}

	descriptions.links = {
		"ALL":{"JS":1},
		"1":{"JS":1, "BP":1, "TJ":1, "SE":1, "SI":1, "2G":1, "AP":1},
		"2":{"JS":1},
		"3":{"JS":1, "BP":1, "TJ":1, "SE":1, "SI":1, "2G":1, "AP":1},
		"4":{"JS":1},
		"5":{"JS":1, "BP":1, "SI":1, "2G":1, "AP":1, "AS":1},
		"6":{"JS":1},
		"7":{"JS":1}
	}

	descriptions.short = {
		BP:["<b>Bridge programs</b> prepare people with low academic skills for further education and training, sometimes in combination with occupational skills training"],
		TJ:["<b>Transitional job programs</b> provide short-term subsidized employment and supportive services to people with limited work experience and barriers to employment, and help participants find unsubsidized jobs"],
		SE:["<b>Social enterprises</b> are mission-driven business enterprises that hire people with limited work experience and barriers to employment to carry out the work of the business. The enterprise also provides supportive services to workers and helps them find other employment opportunities."],
		JS:["<b>Job search assistance and counseling</b> is a central feature of the public workforce system’s American Job Centers and other employment programs. It consists of in-person and individualized assistance, including skill and interest assessments, career and training planning, case management and referrals, and help with resume preparation and interviewing skills."],
		SI:["<b>Sector initiatives</b> identify employers’ skill and workforce needs in a given industry and region and develop recruiting, assessment, and training strategies to help employers find workers with right skills."],
		"2G":["<b>Two-generation programs</b> link education, job training and career-building for low-income parents with early childhood education for their children, thus building human capital across generations."],
		AP:["<b>Apprenticeships</b> combine paid employment with on-the-job training and related classroom instruction."],
		AS:["<b>ASAP</b> (Accelerated Study in Associate Programs) was designed by the City University of New York to increase the graduation rate of low-income community college students seeking an associate’s degree. The program requires students to attend full-time and provides a range of academic, financial, and person supports."]
	}

	descriptions.long = {
		BP:["<b>Bridge programs</b> prepare people with low academic skills for further education and training, sometimes in combination with occupational skills training"],
		TJ:["<b>Transitional job programs</b> provide short-term subsidized employment and supportive services to people with limited work experience and barriers to employment, and help participants find unsubsidized jobs"],
		SE:["<b>Social enterprises</b> are mission-driven business enterprises that hire people with limited work experience and barriers to employment to carry out the work of the business. The enterprise also provides supportive services to workers and helps them find other employment opportunities."],
		JS:["<b>Job search assistance and counseling</b> is a central feature of the public workforce system’s American Job Centers and other employment programs. It consists of in-person and individualized assistance, including skill and interest assessments, career and training planning, case management and referrals, and help with resume preparation and interviewing skills."],
		SI:["<b>Sector initiatives</b> identify employers’ skill and workforce needs in a given industry and region and develop recruiting, assessment, and training strategies to help employers find workers with right skills."],
		"2G":["<b>Two-generation programs</b> link education, job training and career-building for low-income parents with early childhood education for their children, thus building human capital across generations."],
		AP:["<b>Apprenticeships</b> combine paid employment with on-the-job training and related classroom instruction."],
		AS:["<b>ASAP</b> (Accelerated Study in Associate Programs) was designed by the City University of New York to increase the graduation rate of low-income community college students seeking an associate’s degree. The program requires students to attend full-time and provides a range of academic, financial, and person supports."]
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
			.style("background-color","rgba(5, 55, 105, 0.85)")
			;

		var table = fixed.append("div")
			.style("display","table")
			.style("max-width","800px")
			.style("width","100%")
			.style("height","100%")
			.style("margin","1em auto")
		var row = table.append("div")
			.style("display","table-row");
		var cell = row.append("div")
			.style("display","table-cell")
			.style("vertical-align","middle")
			;

		var box_wrap = cell.append("div")
			.style("border","1px solid #ffffff")
			.style("padding","1px")
			.style("position","relative")
			;
			
		var box = box_wrap.append("div").classed("makesans",true)
			.style("background-color","rgba(250, 250, 250, 1)")
			.style("position","relative")
			.style("padding","1em 1em")
			.style("line-height","1.6em")
			;

			box.selectAll("p")
				.data(descriptions.long[id])
				.enter()
				.append("p")
				.html(function(d,i){return d})
				.style("font-weight", function(d,i){
					return i==0 ? "normal" : "normal";
				})

		var x_height = 30;
		var x_width = x_height;
		var xsvg = box_wrap.append("div")
			   .style("cursor","pointer")
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
							.enter().append("div").classed("c-fix",true).style("margin","0em 0em")
							;

		var tiles = rows.selectAll("div.subway-tile").data(function(d){return d})
							.enter().append("div").classed("subway-tile",true);

		var headers = tiles.append("div").classed("tile-header",true);
		var dots = headers.append("div").classed("dot",true).style("cursor","pointer");
		var dot_labels = dots.append("p").text(function(d){return d});

		dots.on("mousedown", function(d){show(d)});

		var content = tiles.append("div").classed("tile-content reading",true);
		var text = content.selectAll("p").data(function(d){return descriptions.short[d]})
							.enter().append("p").html(function(d){return d})
							;
	}

	I.grid_small = function(container, supercluster, text_color){
		var outer_wrap = d3.select(container);

		var col = arguments.length > 2 ? text_color : "#333333";

		outer_wrap.select("div.subway-tile-small-grid").remove();

		var wrap = outer_wrap.append("div").classed("c-fix subway-tile-small-grid",true).style("padding-left","0px");

		var rows = wrap.selectAll("div").data([descriptions.initials.slice(0,4),descriptions.initials.slice(4)])
							.enter().append("div").classed("c-fix",true).style("margin","0.75em 0em 0.75em 0px")
							.style("float","left")
							;
								
							
		var dots = rows.selectAll("div.subway-tile-dot").data(function(d){return d})
							.enter().append("div").classed("subway-tile-dot",true).style("float","left")
							.style("margin-right","0.35em")
							;

		dots.append("p").text(function(d){return d});						
	}

	return I;
}
