import dir from '../../../js-modules/rackspace.js';

export default function add_hand_icons(container){
	if(arguments.length > 0){
		var spans = d3.select(container).selectAll('span.hand-icon');
	}
	else{
		var spans = d3.selectAll('span.hand-icon');
	}

	var url = dir.url("avatars", "hand_icon.png");

	var images = spans.selectAll("img").data([url]);
		images.exit().remove();
		images.enter().append("img").style("display","inline-block")
									.style("width","2em")
									.style("height","2em")
									.style("vertical-align","middle")
									.attr("src", url)
									.attr("alt","pointer icon");
}