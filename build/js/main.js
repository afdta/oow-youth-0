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
import add_hand_icons from './add_hand_icons.js';

//main out of work function to run on load
function main(){

	//dir.local("./");
	//dir.add("avatars", "data/avatars");
	//dir.add("maps", "data/maps");

	//production data
	dir.add("avatars", "out-of-work/data/avatars");
	dir.add("maps", "out-of-work/data/maps");

	//browser capability
	if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || 
		!Array.prototype.filter || !Array.prototype.map){
		document.getElementById("out-of-work").innerHTML = '<p style="font-style:italic;text-align:center;margin:30px 0px 30px 0px;">This interactive feature requires a modern browser such as Chrome, Firefox, IE9+, or Safari.</p>';
		return null;
	}
	else{	
		funnel(document.getElementById("view0-wrap"));
		supercluster_profiles(document.getElementById("view2-wrap"));
		jurisdiction_profiles(document.getElementById("view3-wrap"));
		interventions().grid(document.getElementById("interventions-grid"));
		add_hand_icons();
	}

} //close main()

document.addEventListener("DOMContentLoaded", main);
