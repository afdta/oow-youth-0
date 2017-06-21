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

	var defs = d3.select("#svg-filter").style("height","5px").append("svg").append("defs");
	var filter = defs.append("filter").attr("id","feBlur").attr("width","150%").attr("height","150%");
		filter.append("feOffset").attr("result","offsetout").attr("in","SourceGraphic").attr("dx","2").attr("dy","2");
		filter.append("feColorMatrix").attr("result","matrixout").attr("in","offsetout").attr("type","matrix").attr("values","0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.25 0 0 0 0 0 1 0");
		filter.append("feGaussianBlur").attr("result","blurout").attr("in","matrixout").attr("stdDeviation","2");
		filter.append("feBlend").attr("in","SourceGraphic").attr("in2","blurout").attr("mode","normal");

		/*filter.html(
					'<feOffset result="offsetout" in="SourceGraphic" dx="2" dy="2" />' + 
					'<feColorMatrix result="matrixout" in="offsetout" type="matrix" values="0.25 0 0 0 0 0 0.25 0 0 0 0 0 0.25 0 0 0 0 0 1 0" />' +
      				'<feGaussianBlur result="blurout" in="matrixout" stdDeviation="2" />' +
      				'<feBlend in="SourceGraphic" in2="blurout" mode="normal" />'
      				)
					;*/

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
