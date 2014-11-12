(function() {

var basic_colormaps = {
    "gray": function(d) {
        var h = (d < 50) ? 250 : 30;
        var l = 60 - Math.abs(d-50) / 3;
        var c = Math.abs(d - 50) * 1.5;
        return d3.hcl(h, c, l);
    },
    "gray_dark": function(d) {
        var h = (d < 50) ? 250 : 30;
        var l = 60 - Math.abs(d-50);
        var c = Math.abs(d - 50) * 1.5;
        return d3.hcl(h, c, l);
    },
    "gray_dark_2": function(d) {
        var h = (d < 50) ? 250 : 30;
        var l = 30 - Math.abs(d-50)/5;
        var c = Math.abs(d - 50) * 1.5;
        return d3.hcl(h, c, l);
    },
    "purple": function(d) {
        var prop = d3.scale.linear()
            .domain([0, 50, 100])
            .range([d3.hcl(250, 50, 50),
                    d3.hcl(300, 50, 40),
                    d3.hcl(30, 50, 50)]);
        return prop(d);
    },
    "purple2": function(d) {
        var prop = d3.scale.linear()
            .domain([0, 100])
            .range([d3.hcl(250, 50, 50),
                    d3.hcl(30, 50, 50)]);
        return prop(d);
    },
    "purple3": function(d) {
        return d3.hcl(d3.scale.linear().domain([0,50,100]).range([250,300,390])(d),
                      50,
                      d3.scale.linear().domain([0,50,100]).range([50,40,50])(d));
    },
    "purple4": function(d) {
        return d3.hcl(d3.scale.linear().domain([0,50,100]).range([250,300,390])(d),
                      50,
                      d3.scale.linear().domain([0,50,100]).range([43,40,43])(d));
    },
    "purple5": function(d) {
        return d3.hcl(d3.scale.linear().domain([0,50,100]).range([250,300,390])(d),
                      60,
                      d3.scale.linear().domain([0,50,100]).range([50,40,50])(d));
    },
    "purple6": function(d) {
        return d3.hcl(d3.scale.linear().domain([0,50,100]).range([250,300,390])(d),
                      50,
                      d3.scale.linear().domain([0,50,100]).range([30,20,30])(d));
    },
    "purple7": function(d) {
        return d3.hcl(d3.scale.linear().domain([0,50,100]).range([250,300,390])(d),
                      d3.scale.linear().domain([0,50,100]).range([50,30,50])(d),
                      d3.scale.linear().domain([0,50,100]).range([30,20,30])(d));
    },
    "grurple": function(d) {
        var d_ = d, s = (d < 50) ? -1 : 1;
        d_ = Math.abs(d - 50) / 50;
        d_ = Math.pow(d_, 0.4);
        d_ = d_ * 50 * s + 50;
        return d3.hcl(d3.scale.linear().domain([0,50,100]).range([250,300,390])(d_),
                      d3.scale.linear().domain([0,50,100]).range([75,0,75])(d),
                      d3.scale.linear().domain([0,50,100]).range([43,60,43])(d));
    }
};


function dataRange()
{
    var mx = 0;
    var mn = 100;
    return [d3.min(Elections.data, function(v) { return v.properties.pct_d; }),
            d3.max(Elections.data, function(v) { return v.properties.pct_d; })];
}

function selectData(name, transition)
{
    if (Elections.data === undefined)
        return;

    Elections.data.forEach(function(d) {
        d.properties.pct_d = d.properties["pct_d" + name];
        d.properties.d = d.properties["d" + name];
        d.properties.r = d.properties["r" + name];
    });
    var _ = dataRange(), mn = _[0], mx = _[1];
    var mn_scale, mx_scale;
    if (mx - 50 > 50 - mn) {
        mn_scale = 100 - mx;
        mx_scale = mx;
    } else {
        mn_scale = mn;
        mx_scale = 100 - mn;
    }
    invariance_transformations["scale"].domain([mn_scale, mx_scale]);
    invariance_transformations["affine"].domain([mn, mx]);
    invariance_transformations["affineTwosided"].domain([mn, 50, mx]);

    applyScales(transition);
}

var invariance_transformations = {
    "none": d3.scale.linear(),
    "scale": d3.scale.linear().range([0, 100]),
    "affine": d3.scale.linear().range([0, 100]),
    "affineTwosided": d3.scale.linear().domain([0,50,100]).range([0, 50, 100])
};

function applyScales(transition)
{
    function t(o) {
        return transition ? o.transition().duration(750) : o;
    }
   
    t(map.selectAll("path")).attr("fill", function(d, i) {
        return full_colormap(d);
    });

    // t(stateLegends.selectAll("line"))
    //     .attr("x1", function(d) { return xScale(100-d.properties.pct_d); })
    //     .attr("x2", function(d) { return xScale(100-d.properties.pct_d); })
    // ;

    // t(stateLegends.selectAll("text"))
    //     .attr("x", function(d) { return xScale(d.pt); });

    // t(colorLegend.selectAll("rect"))
    //     .attr("fill", function(d) {
    //         // FIXME this is a bad back.
    //         // more importantly, what's the problem with the architecture that caused this?
    //         return almost_full_colormap(d,
    //             { properties: { area: 1, d: d, t: 1 } });
    //     });

    t(splot.selectAll("circle"))
        .attr("cx", function(d) {
            var result = splot_x(d.properties.d);
            if (isNaN(result))
                result = 0;
            return result;
        })
        .attr("cy", function(d) {
            var result = splot_y(d.properties.r);
            if (isNaN(result))
                result = 0;
            return result;
        });

}

var transformations = {
    "stretch": function(d) {
        d = d - 50;
        var sign = d < 0 ? -1 : 1;
        d = Math.abs(d/50);
        d = Math.pow(d, 0.4);
        d = d * 50 * sign + 50;
        return d;
    },
    "categorical": function(d) {
        if (d < 50) 
            return 0;
        else
            return 100;
    },
    "none": function(d) { return d; }
};

var bivariates = {
    "none": function(c) {
        return c;
    },
    "density": function(c, d) {
        var density = Number(d.properties.t) / Number(d.properties.area);
        var cs = d3.scale.linear()
            .domain([0, max_density])
            .range(["#ffffff", c]);
        return cs(density);
    },
    "density_sqrt": function(c, d) {
        var density = Number(d.properties.t) / Number(d.properties.area);
        var cs = d3.scale.linear()
            .domain([0, Math.pow(max_density, 0.2)])
            .range(["#fff", c]);
        return cs(Math.pow(density, 0.2));
    },
    "density_quantiles": function(c, d) {
        var density = Number(d.properties.t) / Number(d.properties.area);
        var lerp = d3.interpolateRgb("#fff", c);
        var range = density_quantiles.map(function(_, i) {
            return lerp(quantile_min + quantile_range * (i / density_quantiles.length));
        });
        var cs = d3.scale.linear()
            .domain(density_quantiles)
            .range(range);
        return cs(density);
    },
    "population": function(c, d) {
        var cs = d3.scale.linear()
            .domain([0, max_pop])
            .range(["#ffffff", c]);
        return cs(Number(d.properties.t));
    },
    "population_sqrt": function(c, d) {
        var cs = d3.scale.linear()
            .domain([0, Math.pow(100, 0.5)])
            .range(["#ffffff", c]);
        return cs(Math.pow(Number(d.properties.t), 0.5));
    }
};

var bivariate, basic_range, transformation, invariance_transformation = "none";
var map, colorLegend, stateLegends, xScale;
var splot_x, splot_y, splot;

function full_colormap(d) {
    var v = 100-d.properties.pct_d;
    v = invariance_transformations[invariance_transformation](v);
    return almost_full_colormap(v, d);
}

function almost_full_colormap(v, d) {
    v = transformations[transformation](v);
    var c = basic_colormaps[basic_range](v);
    return bivariates[bivariate](c, d);
}

var mn_area = 10000000, mx_area = -10000000;
var mn_population = 10000000, mx_population = -10000000;
var mn_density = 10000000, mx_density = -10000000;

Elections = {
    data: undefined,
    splot: undefined,
    selectData: selectData,
    loadData: function() {
        d3.json("/assets/data/va.json", function(error, json) {
            if (error) {
                console.error(error);
                return;
            }
            Elections.data = topojson.feature(json, json.objects.precincts).features;
            Elections.data.forEach(function(d) {
                var area = 0;
                if (d.geometry.type !== "MultiPolygon") {
                    console.error("Can't handle object of type " + d.geometry.type);
                    return;
                }
                d.geometry.coordinates.forEach(function(p) {
                    p.forEach(function(loop) {
                        for (var i=0; i<loop.length - 1; ++i) {
                            var d1 = loop[i], d2 = loop[i+1];
                            area += 0.5 * (d1[0] * d2[1] - d2[0] * d1[1]);
                        }
                    });
                });
                d.properties.area = area;
                d.properties.pct_d = 100 * (d.properties.d / d.properties.t);
                d.properties.pct_dOriginal = d.properties.pct_d;
                d.properties.pct_dClose = 50 - ((50 - d.properties.pct_d) / 5);
                d.properties.pct_dInverted = 100 - d.properties.pct_d;
                d.properties.pct_dCloseInverted = 100 - d.properties.pct_dClose;

                d.properties.dOriginal = d.properties.d;
                d.properties.dClose = d.properties.pct_dClose * d.properties.t / 100;
                d.properties.dInverted = d.properties.pct_dInverted * d.properties.t / 100;
                d.properties.dCloseInverted = d.properties.pct_dCloseInverted * d.properties.t / 100;

                d.properties.rOriginal = d.properties.r;
                d.properties.rClose = (100 - d.properties.pct_dClose) * d.properties.t / 100;
                d.properties.rInverted = (100 - d.properties.pct_dInverted) * d.properties.t / 100;
                d.properties.rCloseInverted = (100 - d.properties.pct_dCloseInverted) * d.properties.t / 100;

                mn_area = Math.min(mn_area, area);
                mx_area = Math.max(mx_area, area);
                var population = d.properties.t;
                var density = population / area;
                mn_population = Math.min(mn_population, population);
                mx_population = Math.max(mx_population, population);
                if (density < Infinity) {
                    mx_density = Math.max(mx_density, density);
                }
                if (density > 0) {
                    mn_density = Math.min(mn_density, density);
                }
            });
        });
    },
    initDiv: function(div) {
        var width = 740,
            height = 300;
        var svg = d3.select(div).append("svg")
            .attr("width", width)
            .attr("height", height)
        ;

        map = svg.append("g").attr("transform", "scale(0.6, 0.6)");

        splot = svg.append("g")
            .attr("transform", "translate(20, 20)")
            .attr("opacity", 0)
        ;
        Elections.splot = splot;

        //////////////////////////////////////////////////////////////////////////
        // create elements

        map.selectAll(".subunit")
            .data(Elections.data)
            .enter()
            .append("path")
            .attr("d", d3.geo.path().projection(null))
            .attr("stroke", null) // "#eeeeee")
        ;

        splot.append("text")
            .attr("x", 102)
            .attr("y", 100)
            .text("Dem");

        splot.append("text")
            .attr("x", 0)
            .attr("y", -2)
            .text("Rep");

        splot.append("rect")
            .attr("fill", "rgba(0,0,0,0.2)")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 100)
            .attr("height", 100);

        // max dem votes: 2012
        // max rep votes: 1431
        splot_x = d3.scale.linear().domain([0, 2100]).range([0, 100]);
        splot_y = d3.scale.linear().domain([0, 2100]).range([100, 0]);

        splot.selectAll("circle")
            .data(Elections.data)
            .enter()
            .append("circle")
            .attr("r", 2)
            .attr("fill-opacity", 0.2);

        // // now that we drew the polygons, we don't need topojson anymore
        // // so we bind the csv data to the polys
        // map.selectAll("path")
        //     .data(data);

        // colorLegend = svg.append("g").attr("transform", "translate(0,700)");

        xScale = function(d) {
            return d3.scale.linear()
                .domain([0, 100])
                .range([0, 500])(invariance_transformations[invariance_transformation](d));
        };

        // var x = [];
        // for (var i=0; i<200; ++i)
        //     x.push(i/2);

        // colorLegend.selectAll("rect")
        //     .data(x)
        //     .enter()
        //     .append("rect")
        //     .attr("width", 4)
        //     .attr("height", 10)
        //     .attr("x", function(d) { return xScale(d); })
        // ;

        // stateLegends = svg.append("g").attr("transform", "translate(0,688)");

        // stateLegends.selectAll("line")
        //     .data(Elections.data)
        //     .enter()
        //     .append("line")
        //     .attr("y1", 2)
        //     .attr("y2", 13)
        //     .attr("stroke", "black")
        //     .attr("stroke-opacity", 0.1)
        //     .attr("stroke-width", "1px")
        // ;

        //////////////////////////////////////////////////////////////////////////
        // apply scales to elements
        bivariate = "none";
        basic_range = "gray";
        invariance_transformation = "none";
        transformation = "categorical";

        selectData('Original', false);

    },
    selectScales: function(b, r, i, t, transition, quiet) {
        if (map === undefined)
            return;
        bivariate = b;
        basic_range = r;
        invariance_transformation = i;
        transformation = t;

        if (!quiet)
            applyScales(transition);
    }
};

})();
