//"out of work" population project, june 2017
//add browser compat message: test for svg, array.filter and map

//shared js-modules
import dir from '../../../js-modules/rackspace.js';

//unused
import card from '../../../js-modules/card-api.js';
import nameshort from '../../../js-modules/nameshort.js';
import met_map from '../../../js-modules/met-map.js';
import format from '../../../js-modules/formats.js';

//out of work modules
import funnel from './funnel.js';
import scroll_show from './scroll-show.js';
import supercluster_profiles from './supercluster_profiles.js';

dir.local("./").add("data")
//dir.add("data", "outof-work/data");

//main out of work function to run on load
function main(){

	funnel(document.getElementById("view0-wrap"));
	supercluster_profiles(document.getElementById("view2-wrap"));

	return null;
	//

	//scroll show 0
	var ss0 = scroll_show(document.getElementById("view0-wrap"));

	//add panels to scroll show -- the first panel is fixed and contains the dot matrix
	var panel_00 = ss0.panel();
	var panel_01 = ss0.panel();
	var panel_02 = ss0.panel();
	var panel_03 = ss0.panel();

	
	
	//dot matrix to first panel
	var dm0 = dot_matrix(panel_00.node, 5);

	dm0.title(['In the U.S. [OR SELECT JURISDICTION], there are xxx,xxx people between the ages of 25–64  //  <b>1 dot (<span class="divdot"></span>) = xx people</b>'])

	//scroll show 1
	var ss1 = scroll_show(document.getElementById("view1-wrap"));
	var panel_10 = ss1.panel();
	var dm1 = dot_matrix(panel_10.node, 5);

	dm1.title(['In 137 large U.S. jurisdictions, there are xxx,xxx people between the ages of 25–64 who are "out of work"  //  <b>1 dot (<span class="divdot"></span>) = xx people</b>'])

	
	//colors
	var scc = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6'];

	//base view
	var view0 = dm0.dim().responsive().view();
		view0.group("Total pop aged 25-64", "tot", 100)
			 .title("Total pop descriptive stats: Need to think about what stats to present. Or do we just want to have text?")
				 .next()
				 .group("Unemployed, 25-64", "unemp", 5, "red", "tot")
				 .group("Not in the labor force, 25-64", "nilf", 23, "#666666", "tot")
				 .group("Employed, 25-64", "emp", 72, "#666666", "tot")
				 .title("Unemployed pop descriptive stats: It doesn't really make sense to have the same stats for each view. E.g. the unemployed are looking for work by definition.")
					 .next()
					 .group("Unemployed, 25-64", "unemp", 5, "red", "unemp")
					 .group("Not in the labor force, 25-64", "nilf", 23, "pink", "nilf")
					 .group("Employed, 25-64", "emp", 72, "#666666", "emp")
					 .title("Not in the labor force descriptive stats")
						 .next()
						 .group("Out of work, 18-64", "oow", 4.5, "red", "unemp")
						 .group("Out of work, 18-64", "oow", 9.2, "red", "nilf")
						 .group("Other", "other", 0.5, "#666666", "unemp")
						 .group("Other", "other", 13.8, "#666666", "nilf")
						 .group("Other", "other", 72, "#666666", "emp")
			
	var view1 = dm1.dim().responsive().view();		 	
		view1.group("Median age: 30, Low education", "oow1", 10, "#666666", "oow")
			.group("Median age: 44, Low education", "oow2", 37, "#666666", "oow")
			.group("Median age: 58, Low education", "oow3", 7, "#666666", "oow")
			.group("Median age: 33, Moderate education", "oow4", 14, "#666666", "oow")
			.group("Median age: 55, Moderate education", "oow5", 12, "#666666", "oow")
			.group("Median age: 34, High education", "oow6", 9, "#666666", "oow")
			.group("Median age: 56, High education", "oow7", 11, "#666666", "oow")
			.title("Young, low educational attainment")
			.next()

			.group("Median age: 30, Low education", "oow1", 10, scc[0], "oow1")
			.group("Median age: 44, Low education", "oow2", 37, "#666666", "oow2")
			.group("Median age: 58, Low education", "oow3", 7, "#666666", "oow3")
			.group("Median age: 33, Moderate education", "oow4", 14, "#666666", "oow4")
			.group("Median age: 55, Moderate education", "oow5", 12, "#666666", "oow5")
			.group("Median age: 34, High education", "oow6", 9, "#666666", "oow6")
			.group("Median age: 56, High education", "oow7", 11, "#666666", "oow7")
			.title("Young, low educational attainment")
			.next()

			.group("Median age: 30, Low education", "oow1", 10, scc[0], "oow")
			.group("Median age: 44, Low education", "oow2", 37, scc[1], "oow")
			.group("Median age: 58, Low education", "oow3", 7, scc[2], "oow")
			.group("Median age: 33, Moderate education", "oow4", 14, scc[3], "oow")
			.group("Median age: 55, Moderate education", "oow5", 12, scc[4], "oow")
			.group("Median age: 34, High education", "oow6", 9, scc[5], "oow")
			.group("Median age: 56, High education", "oow7", 11, scc[6], "oow")
			.title("Young, low educational attainment")
			.next()

			.group("Median age: 30, Low education", "oow1", 10, scc[0], "oow")
			.group("Median age: 44, Low education", "oow2", 37, scc[1], "oow")
			.group("Median age: 58, Low education", "oow3", 7, scc[2], "oow")
			.group("Median age: 33, Moderate education", "oow4", 14, scc[3], "oow")
			.group("Median age: 55, Moderate education", "oow5", 12, scc[4], "oow")
			.group("Median age: 34, High education", "oow6", 9, scc[5], "oow")
			.group("Median age: 56, High education", "oow7", 11, scc[6], "oow")
			.title("Young, low educational attainment")
			.next()

		 	;

	//add a single group to the view, as well as three subgroups
	panel_00.activate(function(){
		view0.next(0).bind(); //draw level 0	
	})
				 
	//next view is bound to panel_01
	panel_01.activate(function(){
		view0.next(1).bind(); //draw level 1		
	})

	//next view is bound to panel_02
	panel_02.activate(function(){
		view0.next(2).bind(); //draw level 2	
	});

	//next view is bound to panel_02
	panel_03.activate(function(){
		view0.next(3).bind(); //draw level 3	
	});

	//next view is bound to panel_10
	panel_10.activate(function(){
		view1.next(0).bind(); //draw level 2	
	});


	//group(name, id, num, color, merge_id)

	return null;

	//add a single group to the view, as well as three subgroups
	var view2 = dm2.dim().view();
	var v2g1 = view2.group("Total pop 18-64", "tot", 100)

					 .init()
					 ;

	//add a single group to the view, as well as three subgroups
	var view3 = dm3.dim().view();
	var v3g1 = view3.group("Employed, 18-64", "emp", 72, "#a6cee3")
					.subgroup("Out of work", "oow", 0, "#0d73d6")
					.subgroup("Not out of work", "noow", 72, "#999999")
	var v3g2 = view3.group("Unemployed, 18-64", "unemp", 5, "#1f78b4")
					.subgroup("Out of work", "oow", 4, "#0d73d6")
					.subgroup("Not out of work", "noow", 1, "#999999")
	var v3g3 = view3.group("Not in the labor force", "nilf", 23, "#b2df8a")
					.subgroup("Out of work", "oow", 10, "#0d73d6")
					.subgroup("Not out of work", "noow", 13, "#999999")
	
	view3.init();

	view3.drawGroups(0);

	//add a single group to the view, as well as three subgroups
	var scc = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6'];
	var view4 = dm4.view();
	var v4g1 = view4.group("Out of work, 18-64", "emp", 72, "666666")
					.subgroup("Out of work", "oow1", 10, scc[0])
					.subgroup("Out of work", "oow2", 20, scc[1])
					.subgroup("Out of work", "oow3", 18, scc[2])
					.subgroup("Out of work", "oow4", 22, scc[3])
					.subgroup("Out of work", "oow5", 40, scc[4])
					.subgroup("Out of work", "oow6", 12, scc[5])
					.subgroup("Out of work", "oow7", 3, scc[6])
					.subgroup("Out of work", "oow8", 1, scc[7])
					.subgroup("Out of work", "oow9", 10, scc[8])
					;
		v4g1.subgroups.sum();


	
	view4.init();

	waypoint(dm2.node()).activate(function(){
		view2.drawSubgroups(2000);
	}).buffer(0.2);

	waypoint(dm3.node()).activate(function(){
		view3.drawSubgroups(3000);
	}).buffer(0.2);

	waypoint(dm4.node()).activate(function(){
		view4.drawSubgroups(3000);
	}).buffer(0.2);

	//console.log(total.subgroups.sum());

	//console.log(total);


	var dmtimer;
	window.addEventListener("resize", function(){
		clearTimeout(dmtimer);
		dmtimer = setTimeout(function(){
			view1.init();
			view2.init();
			view3.init();
			view4.init();
		}, 250);
	})

} //close main()

document.addEventListener("DOMContentLoaded", main);
