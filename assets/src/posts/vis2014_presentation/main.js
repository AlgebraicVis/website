//////////////////////////////////////////////////////////////////////////////
// scrolling detection and handling

var padRegions = [];
var tripwires = [];

function makePad(sel, height, color, bottom)
{
    var pad = d3.select(sel).append("svg");
    if (bottom) {
        d3.select(sel)
            .style("left", -$(sel).offset().left + "px")
            .style("position", "relative")
            .style("z-index", "-1");
    } else {
        d3.select(sel)
            .style("left", "0px");
    }
    pad.attr("width", $(window).width())
        .attr("height", height)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", $(window).width())
        .attr("height", height)
        .attr("fill", color);
}

function watchRegions(selBegin, sel, selEnd, height)
{
    makePad(selBegin, height, "#ddd");
    makePad(selEnd, height, "#ddd", true);
    var region = {
        beginElement: $(selBegin),
        endElement: $(selEnd),
        activeElement: $(sel),
        status: "off",
        height: height
    };
    padRegions.push(region);
    region.beginElement.css("height", region.height);
}

function checkRegion(region) {
    var screenBottom = $(window).scrollTop() + $(window).height();
    if (region.status === "off") {
        region.beginBottom = region.beginElement.offset().top + region.beginElement.height();
        region.endBottom = region.endElement.offset().top + region.endElement.height();
        if (screenBottom <= beginBottom)
            newStatus = "above";
        else if (screenBottom > endBottom)
            newStatus = "below";
        else
            newStatus = "inside";
        region.status = newStatus;
        return;
    }


    var beginBottom = region.beginBottom;
    var endBottom = region.endBottom;
    var newStatus;
    if (screenBottom <= beginBottom)
        newStatus = "above";
    else if (screenBottom > endBottom)
        newStatus = "below";
    else
        newStatus = "inside";
    if (region.status === newStatus)
        return;
    if (newStatus === "inside") {
        region.activeElement.css("position", "");
        region.activeElement.css("top", "");
        region.activeElement.addClass("frozenScroll");
        region.beginElement.css("position", "");
        region.beginElement.css("display", "");
        region.beginElement.addClass("frozenScroll");
    } else if (newStatus === "above") {
        region.activeElement.removeClass("frozenScroll");
        region.activeElement.css("position", "absolute");
        region.activeElement.css("top", "");
        region.beginElement.removeClass("frozenScroll");
        region.beginElement.css("display", "");
        region.beginElement.css("position", "absolute");
    } else if (newStatus === "below") {
        region.activeElement.removeClass("frozenScroll");
        region.activeElement.css("position", "absolute");
        region.activeElement.css("top", region.endElement.offset().top);
        region.beginElement.removeClass("frozenScroll");
        region.beginElement.css("display", "none");
    }
    region.status = newStatus;
}

function watchTripwire(sel, gauge, onUp, onDown)
{
    tripwires.push({
        element: $(sel),
        gauge: $(gauge),
        onUp: onUp,
        onDown: onDown,
        status: "off",
        selection: sel
    });
}

function checkTripwire(tripwire)
{
    var gauge = tripwire.gauge.offset().top;
    var newStatus;
    if (tripwire.status === "off") {
        tripwire.top = tripwire.element.offset().top;
        tripwire.status = newStatus;
    }
    
    if (gauge >= tripwire.top) {
        newStatus = "above";
    } else {
        newStatus = "below";
    }

    if (newStatus !== tripwire.status) {
        console.log("tripping", tripwire.selection, newStatus);
        if (newStatus === "above") {
            (tripwire.onUp || function() {})(newStatus);
        } else {
            (tripwire.onDown || function() {})(newStatus);
        }
        tripwire.status = newStatus;
    }
    return;
}

//////////////////////////////////////////////////////////////////////////////
// d3 miscellanea

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

$(function ()
{
    d3.select(document.body)
        .append("div")
        .attr("id", "window_bottom_tripwire")
        .style("position", "fixed")
        .style("bottom", "0");

    d3.select(document.body)
        .append("div")
        .attr("id", "window_top_tripwire")
        .style("position", "fixed")
        .style("top", "0");

    watchRegions(
        "#election_results_pad_begin",
        "#election_results",
        "#election_results_pad_end", 300);

    watchTripwire(
        "#election_results_rb_to_rpb",
        "#election_results",
        function() { Elections.selectScales("none", "purple5", "none", "stretch", true); },
        function() { Elections.selectScales("none", "gray", "none", "categorical", true); });

    watchTripwire(
        "#election_results_rpb_to_rgb",
        "#election_results",
        function() { Elections.selectScales("none", "gray", "none", "stretch", true); },
        function() { Elections.selectScales("none", "purple5", "none", "stretch", true); });

    watchTripwire(
        "#election_results_rgb_to_rb",
        "#election_results",
        function() { Elections.selectScales("none", "gray", "none", "categorical", true); },
        function() { Elections.selectScales("none", "gray", "none", "stretch", true); });

    watchTripwire(
        "#election_results_show_scatterplot",
        "#election_results",
        function() { 
            Elections.splot && Elections.splot.transition().duration(750).attr("opacity", 1); 
        },
        function() { 
            Elections.splot && Elections.splot.transition().duration(750).attr("opacity", 0); 
        });

    watchTripwire(
        "#election_results_show_closer",
        "#election_results",
        function() { 
            Elections.selectData('Close', true);
        },
        function() { 
            Elections.selectData('Original', true);
        });

    watchTripwire(
        "#election_results_show_purple_wide",
        "#election_results",
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Original', true);
        },
        function() { 
            Elections.selectScales("none", "gray", "none", "categorical", false, true);
            Elections.selectData('Close', true);
        });

    watchTripwire(
        "#election_results_show_purple_close",
        "#election_results",
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Close', true);
        },
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Original', true);
        });

    watchTripwire(
        "#election_results_show_redblue_2",
        "#election_results",
        function() { 
            Elections.selectScales("none", "gray", "none", "categorical", false, true);
            Elections.selectData('Original', true);
        },
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Close', true);
        });

    watchTripwire(
        "#election_results_show_redblue_inverted",
        "#election_results",
        function() { 
            Elections.selectScales("none", "gray", "none", "categorical", false, true);
            Elections.selectData('Inverted', true);
        },
        function() { 
            Elections.selectScales("none", "gray", "none", "categorical", false, true);
            Elections.selectData('Original', true);
        });

    watchTripwire(
        "#election_results_show_purple_wide_2",
        "#election_results",
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Original', true);
        },
        function() { 
            Elections.selectScales("none", "gray", "none", "categorical", false, true);
            Elections.selectData('Inverted', true);
        });

    watchTripwire(
        "#election_results_show_purple_inverted",
        "#election_results",
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Inverted', true);
        },
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Original', true);
        });

    watchTripwire(
        "#election_results_show_rgb_2",
        "#election_results",
        function() { 
            Elections.selectScales("none", "gray", "none", "none", false, true);
            Elections.selectData('Original', true);
        },
        function() { 
            Elections.selectScales("none", "purple5", "none", "none", false, true);
            Elections.selectData('Inverted', true);
        });

    watchTripwire(
        "#election_results_show_rgb_inverted",
        "#election_results",
        function() { 
            Elections.selectScales("none", "gray", "none", "none", false, true);
            Elections.selectData('Inverted', true);
        },
        function() { 
            Elections.selectScales("none", "gray", "none", "none", false, true);
            Elections.selectData('Original', true);
        });

    watchTripwire(
        "#election_results_show_rgb_inverted_closer",
        "#election_results",
        function() { 
            Elections.selectScales("none", "gray", "none", "none", false, true);
            Elections.selectData('CloseInverted', true);
        },
        function() { 
            Elections.selectScales("none", "gray", "none", "none", false, true);
            Elections.selectData('Inverted', true);
        });


    watchTripwire(
        "#the-basic-question",
        "#window_bottom_tripwire",
        function() { 
            Elections.loadData();
        });

    var election_init = false;
    watchTripwire(
        "#election_results",
        "#window_bottom_tripwire",
        function() { 
            if (!election_init) {
                Elections.initDiv("#election_results");
                election_init = true;
            }
        });

    padRegions.forEach(checkRegion); 
    tripwires.forEach(checkTripwire);
});


window.onscroll = function (e) {  

    padRegions.forEach(checkRegion); 
    tripwires.forEach(checkTripwire);
    // console.log(top, el, bot);
    // called when the window is scrolled.
};
