// adapted from http://bl.ocks.org/RandomEtc/cff3610e7dd47bef2d01

(function (CS) {
    'use strict';

    var def = {
    	typeName: 'barchart',
        displayName: 'Bar Chart',
    	datasourceBehavior: CS.DatasourceBehaviors.Multiple,
    	getDefaultConfig: function() {
    		return {
    		    DataShape: 'Table',
    		    Columns: ['Label', 'Value', 'Minimum', 'Maximum'],
                Height: 500,
                Width: 900
            };
    	},
    	init: init
    };

    function init(scope, elem) {

        var svgElem = elem.find('#barContainer > svg')[0];
        var id = "bar_" + Math.random().toString(36).substr(2, 16);
        svgElem.id = id;

        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = scope.config.Width - margin.left - margin.right,
            height = scope.config.Height - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select("#" + id)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var labels = [];
        function dataUpdate(csData) {
            if (csData) {

                if (csData.Rows[0].Label) {
                    labels = csData.Rows.map(function (row) { return row.Label; });
                }

                var data = [];
                labels.forEach(function (label, index) {
                    data.push(
                        {
                            'letter': label,
                            'frequency': csData.Rows[index].Value,
                            'max': csData.Rows[index].Summary ? csData.Rows[index].Summary.Maximum : csData.Rows[index].Value,
                            'min': csData.Rows[index].Summary ? csData.Rows[index].Summary.Minimum : 0
                        });
                });

                // measure the domain (for x, unique letters) (for y [0,maxFrequency])
                // now the scales are finished and usable
                x.domain(data.map(function (d) { return d.letter; }));
                y.domain([d3.min(data, function(d) { return d.min; }), d3.max(data, function (d) { return d.max; })]);

                // another g element, this time to move the origin to the bottom of the svg element
                // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
                //   for everything in the selection\
                // the end result is g populated with text and lines!
                svg.select('.x.axis').transition().duration(300).call(xAxis);

                // same for yAxis but with more transform and a title
                svg.select(".y.axis").transition().duration(300).call(yAxis)

                // THIS IS THE ACTUAL WORK!
                var bars = svg.selectAll(".bar").data(data, function (d) { return d.letter; }) // (data) is an array/iterable thing, second argument is an ID generator function

                bars.exit()
                  .transition()
                    .duration(300)
                  .attr("y", y(0))
                  .attr("height", height - y(0))
                  .style('fill-opacity', 1e-6)
                  .remove();

                // data that needs DOM = enter() (a set/selection, not an event!)
                bars.enter().append("rect")
                  .attr("class", "bar")
                  .attr("y", y(0))
                  .attr("height", height - y(0));

                // the "UPDATE" set:
                bars.transition().duration(300).attr("x", function (d) { return x(d.letter); }) // (d) is one item from the data array, x is the scale object from above
                  .attr("width", x.rangeBand()) // constant, so no callback function(d) here
                  .attr("y", function (d) { return y(d.frequency); })
                  .attr("height", function (d) { return height - y(d.frequency); }); // flip the height, because y's domain is bottom up, but SVG renders top down

            }

            function type(d) {
                d.frequency = +d.frequency;
                return d;
            }
    	}

    	return { dataUpdate: dataUpdate };
    }

    CS.symbolCatalog.register(def);

})(window.Coresight);
