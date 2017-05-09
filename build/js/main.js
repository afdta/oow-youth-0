//"out of work" population project, june 2017
//add browser compat message: test for svg, array.filter and map

//shared js-modules
import dir from '../../../js-modules/rackspace.js';

//unused
import card from '../../../js-modules/card-api.js';
import nameshort from '../../../js-modules/nameshort.js';
import met_map from '../../../js-modules/met-map.js';
import format from '../../../js-modules/formats.js';
import waypoint from '../../../js-modules/on-scroll2.js';

//out of work modules
import dot_matrix from './dot-matrix.js';

dir.local("./").add("data")
//dir.add("data", "outof-work/data");

//main out of work function to run on load
function main(){

	var dm1 = dot_matrix(document.getElementById("dot-matrix1"), 6);
	var dm2 = dot_matrix(document.getElementById("dot-matrix2"), 6);
	var dm3 = dot_matrix(document.getElementById("dot-matrix3"), 6);
	var dm4 = dot_matrix(document.getElementById("dot-matrix4"), 6);

	//add a view
	var view1 = dm1.view()
	var v1g1 = view1.group("Total pop aged 18-64", "tot", 100).init();

	//add a single group to the view, as well as three subgroups
	var view2 = dm2.view();
	var v2g1 = view2.group("Total pop 18-64", "tot", 100)
					 .subgroup("Employed, 18-64", "emp", 72, "#a6cee3")
					 .subgroup("Unemployed, 18-64", "unemp", 5, "#1f78b4")
					 .subgroup("Not in the labor force", "nilf", 23, "#b2df8a")
					 .init()
					 ;

	//add a single group to the view, as well as three subgroups
	var view3 = dm3.view();
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
					.subgroup("Out of work", "oow", 10, scc[0])
					.subgroup("Out of work", "oow", 20, scc[1])
					.subgroup("Out of work", "oow", 18, scc[2])
					.subgroup("Out of work", "oow", 22, scc[3])
					.subgroup("Out of work", "oow", 40, scc[4])
					.subgroup("Out of work", "oow", 12, scc[5])
					.subgroup("Out of work", "oow", 3, scc[6])
					.subgroup("Out of work", "oow", 1, scc[7])
					.subgroup("Out of work", "oow", 10, scc[8])
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
