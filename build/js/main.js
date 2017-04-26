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

	dot_matrix();

} //close main()

document.addEventListener("DOMContentLoaded", main);
