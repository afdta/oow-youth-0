import sc_stack from './sc_stack.js';
import add_hand_icons from './add_hand_icons.js';

export default function interventions(){
	var I = {};

	var cols = sc_stack().color;
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
		"3":{"JS":1, "BP":1, "TJ":1, "SE":1, "SI":1, "2G":1, "AP":1, "AS":1},
		"4":{"JS":1},
		"5":{"JS":1, "BP":1, "SI":1, "2G":1, "AP":1, "AS":1},
		"6":{"JS":1},
		"7":{"JS":1}
	}

	descriptions.short = {
		BP:["<b>Bridge programs</b> prepare people with low academic skills for further education and training, sometimes in combination with occupational skills training."],
		TJ:["<b>Transitional jobs programs</b> provide short-term subsidized employment and supportive services to people with limited work experience and barriers to employment, and help participants find unsubsidized jobs."],
		SE:["<b>Social enterprises</b> are mission-driven businesses that hire people with limited work experience and barriers to employment to carry out the work of the business. The enterprise also provides supportive services to workers and helps them find other employment opportunities."],
		JS:["<b>Job search assistance and counseling</b> is a central feature of the public workforce system’s American Job Centers and other employment programs. It consists of in-person and individualized assistance, including skill and interest assessments, career and training planning, case management and referrals, and help with resume preparation and interviewing skills."],
		SI:["<b>Sector initiatives</b> identify employers’ skill and workforce needs in a given industry and region and develop recruiting, assessment, and training strategies to help employers find workers with the right skills."],
		"2G":["<b>Two-generation programs</b> link education, job training and career-building for low-income parents with early childhood education for their children, thus building human capital across generations."],
		AP:["<b>Apprenticeships</b> combine paid employment with on-the-job training and related classroom instruction."],
		AS:["<b>ASAP</b> (Accelerated Study in Associate Programs) was designed by the City University of New York to increase the graduation rate of low-income community college students seeking an Associate degree. The program requires students to attend full-time and provides a range of academic, financial, and personal supports."]
	}

	descriptions.long = {
		BP:['<b>Bridge programs</b>&nbsp;are for people who need additional academic preparation before enrolling in post-secondary education or job training.&nbsp;<a href="https://www2.ed.gov/about/offices/list/ovae/pi/cclo/brief-1-bridge-programs.pdf">Low literacy and math levels</a>&nbsp;prevent many adults from succeeding in job training or earning educational credentials, and bridge programs are&nbsp;<a href="http://www.air.org/sites/default/files/downloads/report/AIR_Changing_the_Odds_0.pdf">one response</a>&nbsp;to increase the completion rates of those in need of academic remediation.&nbsp;Some bridge programs focus on preparing for the GED and thus are designed expressly for people without high school diplomas, but others are open to high school graduates as well, depending on their skill levels. Bridge programs typically use a contextualized learning approach, in which students develop their academic skills in the context of occupational training or real-world scenarios such as career exploration.', '<a href="https://www.sbctc.edu/colleges-staff/programs-services/i-best/">I-BEST</a>&nbsp;and&nbsp;<a href="http://www.laguardia.edu/ACE/Programs/CCPI/BridgeProgram/">Bridge to College and Careers</a>&nbsp;are examples of bridge programs that have been evaluated, but there are many more, including those developed as part of multi-state initiatives such as&nbsp;<a href="http://www.jff.org/sites/default/files/publications/materials/BT_toolkit_June7.pdf">Breaking Through</a>,&nbsp;<a href="http://www.joycefdn.org/assets/images/joyceFnd_ShiftingGears3.0_update.pdf">Shifting Gears</a>, and&nbsp;<a href="http://www.jff.org/initiatives/accelerating-opportunity">Accelerating Opportunity</a>.'],
		TJ:['<b>Transitional jobs programs&nbsp;</b>are for people with limited work experience who would otherwise struggle to find employment.&nbsp;<a href="https://www.mdrc.org/sites/default/files/LookingForwardMemo_SubsidizedEmployment.pdf">These programs</a>&nbsp;provide short-term subsidized employment<b>&nbsp;</b>and supportive services<b>&nbsp;</b>based on the theory that the best way to learn to work is by working. A number of programs are&nbsp;<a href="https://www.mdrc.org/publication/implementation-and-early-impacts-next-generation-subsidized-employment-programs">currently being evaluated</a>, building on the lessons of previous evaluations, which have been mixed. The&nbsp;<a href="https://ceoworks.org/">Center for Employment Opportunities</a>, which serves previously incarcerated people, was found to significantly&nbsp;<a href="http://www.mdrc.org/sites/default/files/full_451.pdf">reduce recidivism</a>, but it did not increase subsequent unsubsidized employment,&nbsp;<a href="https://www.mdrc.org/publication/should-government-subsidize-jobs-unemployed">nor did other recently evaluated programs.</a>&nbsp;Some researchers have suggested that in addition to testing new strategies to improve employment outcomes of transitional jobs participants,&nbsp;<a href="http://www.mdrc.org/publication/transitional-jobs">it may also be important</a>&nbsp;to consider other benefits related to community-building and civic engagement. Individuals could build on their&nbsp;<a href="http://www.buildingbetterprograms.org/wp-content/uploads/2016/04/persistent-nonworkers.pdf">roles as community members and parents</a>&nbsp;by engaging in constructive, stipend-paying activities such as participating in an afterschool safety patrol or maintaining a community garden.', 'More information on transitional jobs is available via the&nbsp;<a href="https://www.heartlandalliance.org/nationalinitiatives/our-initiatives/national-transitional-jobs/">National Transitional Jobs Network</a>&nbsp;and a&nbsp;<a href="https://www.law.georgetown.edu/academics/centers-institutes/poverty-inequality/current-projects/upload/GCPI-Subsidized-Employment-Paper-20160413.pdf">report reviewing their history and effectiveness</a>.'],
		SE:['<b><a href="https://socialenterprise.us/about/social-enterprise/">Social enterprises</a></b>&nbsp;hire people with limited work experience who would otherwise struggle to find employment.&nbsp;They combine the social mission of a nonprofit with the market-driven approach of a business, and while they can focus on any of a number of social issues, the programs featured here focus specifically on employment. They run businesses in fields such as food service, groundskeeping, and maintenance, and directly hire the people they are serving. In conjunction with employment, the organizations&nbsp;provide supportive services and help employees find other job opportunities when they are ready.&nbsp;The organizations develop a mutually reinforcing relationship between the business and social missions—the social mission of serving the unemployed would not be financially viable without the business revenue, and the enterprise relies on participants as its workforce. A&nbsp;<a href="https://www.mathematica-mpr.com/news/mathematica-jobs-study-explores-social-enterprises-redf">recent evaluation</a>&nbsp;of social enterprises in California found that they increased employment levels among participants.','Social enterprises have grown in popularity in recent years, with&nbsp;<a href="https://ssir.org/topics/category/social_enterprise">active discussions</a>&nbsp;about the challenges and opportunities of melding nonprofit and for-profit business models. They have a variety of investors and financing models, with one foundation,&nbsp;<a href="http://redf.org/">REDF</a>, that focuses solely on employment-focused social enterprises and has made several commitments to expand and&nbsp;<a href="http://redf.org/what-we-do/lead/">strengthen the field</a>.'],
		JS:['<b>Job search assistance and counseling&nbsp;</b>refers broadly to services to help employers and job seekers connect more efficiently than they might otherwise. They reduce labor market friction by providing job candidates with information about job opportunities, in-demand skills, and training options. These services are central to the network of federally supported&nbsp;<a href="https://www.careeronestop.org/LocalHelp/AmericanJobCenters/american-job-centers.aspx">American Job Centers</a>, and are also incorporated into many other workforce programs. More specifically, such services consist of skill and interest assessments, career and training planning, case management and referrals, help with resume preparation and interviewing skills, and information on various job openings and associated skill and education requirements. They can be provided by staff or be self-service via a resource room and online offerings, and can be individualized or provided in group settings such as workshops.','<a href="http://research.upjohn.org/cgi/viewcontent.cgi?article=1161&amp;context=up_bookchapters">Past research</a>&nbsp;supports the effectiveness of publicly supported job search assistance, as does a more&nbsp;<a href="https://www.mathematica-mpr.com/our-publications-and-findings/publications/providing-public-workforce-services-to-job-seekers-15-month-impact-findings-on-the-wia-adult?MPRSource=TCSide">recent evaluation</a>&nbsp;of staff-assisted and personalized assistance in American Job Centers.'],
		SI:['<b>Sector initiatives&nbsp;</b>are partnerships among employers, educators, and other workforce stakeholders<b>&nbsp;</b>to identify and address the workforce needs of particular industries within a regional labor market. They have a “dual customer” approach, seeking to the meet the needs of both employers and workers. These partnerships identify employers’ skill and workforce needs, aggregate employer interest and demand, and develop recruiting, assessment, and training strategies to help employers find workers with the right skills. They reduce the inefficiencies of one-by-one engagements in which training organizations seek to meet the job placement and training needs of individual employers. The organization operating the sector strategy (often a training organization, consortium of employers, or local workforce investment board) develops expertise about a given industry’s occupational skill requirements, business practices, markets, and other factors that affect employers’ hiring and training needs.','A growing body of research supports their effectiveness (see&nbsp;<a href="http://www.aspenwsi.org/resource/ppvtuning-local-labor-market/">here</a>,&nbsp;<a href="http://www.mdrc.org/publication/encouraging-evidence-sector-focused-advancement-strategy-0">here</a>, and&nbsp;<a href="http://economicmobilitycorp.org/index.php?page=81">here</a>). The field is maturing, as evidenced by a&nbsp;<a href="https://www.aspeninstitute.org/publications/connecting-people-work/">book examining various aspects of sector-based workforce development&nbsp;</a>as well as networks such as the&nbsp;<a href="https://insightcced.org/our-areas-of-focus/workforce-development/national-network-of-sector-partners-nnsp/">National Network of Sector Practitioners</a>&nbsp;and the&nbsp;<a href="https://nationalfund.org/">National Fund for Workforce Solutions</a>.'],
		"2G":['<b>Two-generation programs&nbsp;</b>meet the needs of low-income<b>&nbsp;</b>parents and their children together. Different programs emphasize&nbsp;various aspects of family and economic well-being, with some specifically focused on employment. These provide training to low-income parents for in-demand jobs coupled with quality early childhood education for their young children. A two-generation approach is not new, but a fresh wave of programs and energy has emerged in the past five to ten years; see&nbsp;<a href="http://www.futureofchildren.org/sites/futureofchildren/files/media/helping_parents_helping_children_24_01_full_journal.pdf">here</a>&nbsp;for more background.','<a href="https://captulsa.org/families/family-advancement/careeradvance/">Career<i>Advance</i></a>, a program helping parents prepare for jobs in the health care field,&nbsp;<a href="http://b.3cdn.net/ascend/91a575b42e3dc4983b_t4m6v6upy.pdf">was recently found</a>&nbsp;to have positive effects on both parents and children. A network of practitioners, researchers, philanthropists, and educators,&nbsp;<a href="http://ascend.aspeninstitute.org/">Ascend</a>, is actively supporting the adoption and refinement of two-generation approaches.'],
		AP:['<b>Apprenticeships&nbsp;</b>take an “earn and learn” approach to education and training: apprentices earn wages while performing productive work and undergoing supervised, work-based training with related academic instruction. They represent the most structured model of employer engagement in training, since employers hire the apprentices and provide on-the-job training.',
			'Most apprenticeships&nbsp;<a href="http://ftp.iza.org/pp46.pdf">are clustered in construction and manufacturing</a>, although they exist in other fields such as utilities, auto and truck repair, police and fire, trucking, child care, and long-term care.&nbsp;<a href="https://www.mathematica-mpr.com/our-publications-and-findings/publications/an-effectiveness-assessment-and-costbenefit-analysis-of-registered-apprenticeship-in-10-states">An analysis</a>&nbsp;of&nbsp;registered apprenticeship in 10 states found large earnings gains among those who participated. (There are also apprenticeships that are not registered with the federal or state governments, although less is known about these.) Other research is also positive: one study reported that employers participating in registered apprenticeships&nbsp;<a href="https://www.brookings.edu/wp-content/uploads/2016/06/expand_apprenticeships_united_states_lerman.pdf">valued the program</a>&nbsp;and found that it helped meet their needs for skilled workers, and another identified<a href="http://www.esa.gov/reports/benefits-and-costs-apprenticeships-business-perspective"> productivity gains</a>&nbsp;for&nbsp;employers with apprenticeship programs.', 'For more information, see the&nbsp;<a href="https://innovativeapprenticeship.org/">American Institute for Innovative Apprenticeship</a>.'],
		AS:['<b>ASAP (Accelerated Study in Associate Programs)&nbsp;</b>is a comprehensive approach designed by the City University of New York to increase the graduation rate of low-income community college students seeking an Associate degree.&nbsp;<a href="http://www1.cuny.edu/sites/asap/">The program</a>&nbsp;requires students to attend full-time and provides a range of academic, financial, and personal supports. It was created in 2007 with support from the&nbsp;<a href="http://www1.nyc.gov/site/opportunity/index.page">New York City Center for Economic Opportunity</a>&nbsp;(now known as the Mayor’s Office for Economic Opportunity).','<a href="http://www.mdrc.org/project/evaluation-accelerated-study-associate-programs-asap-developmental-education-students#overview">An evaluation</a>&nbsp;found that ASAP almost doubled graduation rates, the largest effect the researchers had found in any large-scale evaluation of a higher education program. CUNY has expanded ASAP to serve more students across its colleges, and a&nbsp;<a href="http://www.mdrc.org/publication/bringing-cuny-accelerated-study-associate-programs-asap-ohio">replication study</a>&nbsp;in Ohio community colleges is underway.']
	}

	var body_wrap = d3.select("#out-of-work");
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
			.style("background-color","rgba(0, 0, 0, 0.75)")
			;

		var table = fixed.append("div")
			.style("display","table")
			.style("max-width","900px")
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
			.style("border","0px solid #ffffff")
			.style("padding","0px")
			.style("position","relative")
			.style("display","block")
			;

		var svg_ribbon = box_wrap.append("div")
								 .style("height","10px")
								 .append("svg").attr("width","100%")
								 .attr("height","100%")
								 .style("x","0px")
								 .style("y","0px")
								.style("display","block")
								.selectAll("rect").data([1,2,3,4,5,6,7]).enter()
								.append("rect").attr("width",(100/7)+"%").attr("height","100%").attr("x", function(d,i){return (i*(100/7))+"%"})
								.attr("fill", function(d,i){
									return cols(d);
								});

		var box = box_wrap.append("div").classed("makesans",true)
			.style("background-color","rgba(250, 250, 250, 1)")
			.style("position","relative")
			.style("padding","1em 1em 1em 1em")
			.style("line-height","1.4em")
			.style("overflow","auto")
			.style("max-height","85vh")
			;



			box.selectAll("p")
				.data(descriptions.long[id])
				.enter()
				.append("p")
				.html(function(d,i){return d})
				.style("font-weight", function(d,i){
					return i==0 ? "normal" : "normal";
				})
				.style("padding","0em 1em 1em 1em")
				.style("margin","1em 0em 1em 0em")

		var x_height = 30;
		var x_width = x_height;
		var xsvg = box_wrap.append("div")
			   .style("cursor","pointer")
			   .classed("make-sans",true)
			   .style("position","absolute")
			   .style("top","-"+(x_height+5)+"px")
			   .style("right","5px")
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

		box.on("mousedown", function(d,i){
			d3.event.stopPropagation();
		})

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

		var turn_on = descriptions.links[supercluster+""];

		var col = arguments.length > 2 ? text_color : "#333333";

		outer_wrap.select("div.subway-tile-small-grid").remove();	

		var wrap = outer_wrap.append("div").classed("c-fix subway-tile-small-grid",true).style("padding-left","0px");	

		var text_wrap = wrap.append("div").classed("c-fix",true);
			text_wrap.append("p").text("Effective practices for this group")
						.style("float","left").style("margin","0em 1em 0em 0")
						.style("padding","0px 10px 0em 10px")
						.append("span")
						.style("margin-left","6px")
						.classed("hand-icon",true)
						;


		add_hand_icons(container);


		var rows = wrap.selectAll("div.intervention-row").data([descriptions.initials.slice(0)]) //,descriptions.initials.slice(4)])
							.enter().append("div").classed("c-fix intervention-row",true).style("margin","0.75em 0em 0.5em 0px")
							.style("float","left")
							;
								
							
		var dots = rows.selectAll("div.subway-tile-dot").data(function(d){return d})
							.enter().append("div").classed("subway-tile-dot",true).style("float","left")
							.style("margin","0em 0.175em 0.35em 0.175em")
							.style("cursor",function(d){
								return turn_on.hasOwnProperty(d) ? "pointer" : "auto";
							})
							.style("background-color", function(d){
								if(turn_on.hasOwnProperty(d)){
									return text_color;
								}
								else{
									return "#dddddd";
								}
							})
							;

		dots.on("mousedown", function(d){
			if(turn_on.hasOwnProperty(d)){
				show(d);
			};
		});

		dots.append("p").text(function(d){return d})
							.style("color", function(d){
								if(turn_on.hasOwnProperty(d)){
									return supercluster in {"2":2, "6":1, "7":1} ? "#111111" : "#ffffff";
								}
								else{
									return "#ffffff";
								}
							});	

		var timer;
		var hover_text = wrap.append("p")
			.style("margin","0em 0em 0em 10px").style("font-size","1em")
			.style("font-style","italic")
			.style("clear","both")
			.html("&nbsp;")
			;
			
		dots.on("mouseenter", function(d){
			clearTimeout(timer);
			hover_text.text(descriptions.titles[d]).transition().duration(0).style("opacity",turn_on.hasOwnProperty(d) ? 1 : 0.35);
		})	
		dots.on("mouseleave", function(d){
			timer = setTimeout(function(){
				hover_text.html("&nbsp;").transition().duration(400).style("opacity","0");
			},150);
		})	

	}

	return I;
}
