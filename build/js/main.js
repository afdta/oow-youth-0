//"out of work" june 2017

//shared js-modules
import dir from '../../../js-modules/rackspace.js';

//out of work modules
import funnel from './funnel.js';
import scroll_show from './scroll-show.js';
import supercluster_profiles from './supercluster_profiles.js';
import jurisdiction_profiles from './jurisdiction_profiles.js';
import header from './header.js';
import interventions from './interventions.js';

//main out of work function to run on load
function main(){

	dir.local("./");
	dir.add("avatars", "data/avatars");
	dir.add("maps", "data/maps");

	//production data
	//dir.add("avatars", "out-of-work/data/avatars");
	//dir.add("maps", "outof-work/data/maps");

	funnel(document.getElementById("view0-wrap"));
	supercluster_profiles(document.getElementById("view2-wrap"));
	jurisdiction_profiles(document.getElementById("jurisdiction-profile"));
	interventions().grid(document.getElementById("interventions-grid"));

} //close main()

document.addEventListener("DOMContentLoaded", main);
