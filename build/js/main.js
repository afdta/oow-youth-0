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
import dot_matrix from './dot-matrix.js';

dir.local("./").add("data")
//dir.add("data", "outof-work/data");

//main out of work function to run on load
function main(){

	var dm = dot_matrix(document.getElementById("dot-matrix"));

	//add a view
	var view1 = dm.view();

	//add a single group to the view, as well as three subgroups
	var total = view1.group("all", 100000)
					 .subgroup("employed", 75000)
					 .subgroup("unemployed", 10000)
					 .subgroup("not in the labor force", 15000)
					 ;
				view1.group("other",5000);

	view1.draw()

	//console.log(total.subgroups.sum());

	//console.log(total);


	var dmtimer;
	window.addEventListener("resize", function(){
		clearTimeout(dmtimer);
		dmtimer = setTimeout(function(){
			//dm.draw();
		}, 250);
	})

} //close main()

document.addEventListener("DOMContentLoaded", main);
