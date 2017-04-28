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
import dot_matrix2 from './dot-matrix2.js';
import dot_matrix3 from './dot-matrix3.js';
import dot_matrix4 from './dot-matrix4.js';

dir.local("./").add("data")
//dir.add("data", "outof-work/data");

//main out of work function to run on load
function main(){

	var dm = dot_matrix(document.getElementById("dot-matrix"));
	var dm2 = dot_matrix2(document.getElementById("dot-matrix2"));
	var dm3 = dot_matrix3(document.getElementById("dot-matrix3"));
	var dm4 = dot_matrix3(document.getElementById("dot-matrix4"));

	//draw method is asynchronous
	dm.proportions([0.75,0.05,0.2]).draw();
	dm2.proportions([0.75,0.05,0.2]).split().draw();
	dm3.proportions([0.2,0.05,0.3,0.45]).split().draw();
	dm4.proportions([0.1,0.05,0.2,0.3,0.01,.03,.3,0.1,0.3]).split().draw();

	var dmtimer;
	window.addEventListener("resize", function(){
		clearTimeout(dmtimer);
		dmtimer = setTimeout(function(){
			dm.draw();
			dm2.draw();
			dm3.draw();
			dm4.draw();
		}, 250);
	})

} //close main()

document.addEventListener("DOMContentLoaded", main);
