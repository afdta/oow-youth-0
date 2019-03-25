import avatar_imgs from './avatars.js';

export default function avatar_grid(container){
    var wrap = d3.select(container);

    var grid = wrap.append("div").classed("avatar-grid",true);

    var groups = {"a":[], "b":[], "c":[], "d":[], "e":[]}

    avatar_imgs.forEach(function(d){
        var i = d.avatar;
        var g = null;
        if(i <= 3){g = "a"}
        else if(i <= 6){g = "b"}
        else if(i == 11 || i==12){g = "c"}
        else if(i == 7 || i==8){g = "d"}
        else if(i == 9 || i==10){g = "e"}

        if(g !== null){
            groups[g].push(d);
        }

    });

    var grid0 = grid.selectAll("div.avatar-group").data(["a", "b", "c", "d", "e"]).enter().append("div")
        .attr("class",function(d){return "avatar-group avatar-group-" + d});

    //group title
    grid0.append("p").text(function(d){return "Group " + d}).classed("avatar-group-title",true);

    var individuals_ = grid0.selectAll("div.avatar-individual-wrap").data(function(d){return groups[d]});
    individuals_.exit().remove();
    var individuals = individuals_.enter().append("div").classed("avatar-individual-wrap c-fix",true).merge(individuals_);

    var imgs = individuals.selectAll("div.avatar-individual").data(function(d){
        return [d];
    });
    imgs.exit().remove();
    imgs.enter().append("div").classed("avatar-individual",true).merge(imgs)
        .style("background-image", function(d){
            return 'url("' + 'data:image/svg+xml;base64,' + d.b64 + '")';
        });

    var txts = individuals.selectAll("div.avatar-individual-text").data(function(d){
        return [d];
    });
    txts.exit().remove();
    txts.enter().append("div").classed("avatar-individual-text condensed-line-height",true).merge(txts)
        .html('<p><span style="font-weight:bold">Name</span><br /><span style="font-style:italic">Age XX</span></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies feugiat tincidunt.</p>');

    grid0
    .on("mouseenter", function(d){
        grid0.classed("highlighted-group", function(dd){return d === dd});
    })
    .on("mousedown", function(d){
        grid0.classed("highlighted-group", function(dd){return d === dd}); 
    });

    grid0.on("mouseleave", function(d){
        d3.select(this).classed("highlighted-group",false);
    })

    //var covers = grid0.selectAll("div.avatar-group-cover").data(function(d){return [d]}).enter().append("div")
    //    .attr("class",function(d){return "avatar-group-cover avatar-group-" + d})
    



}