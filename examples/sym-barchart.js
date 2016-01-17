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
    		    Columns: ['Label', 'Value', 'Minimum', 'Maximum', 'Units'],
                Height: 500,
                Width: 500,
                BarColor: 'steelblue',
                TextColor: 'grey'
            };
    	},
    	init: init
    };

    function init(scope, elem) {

        scope.scale = 1;

        var svgElem = elem.find('#barContainer > svg')[0];
        var id = "bar_" + Math.random().toString(36).substr(2, 16);
        svgElem.id = id;

        var margin, width, height, x, y, xAxis, yAxis, svg;

        function initChart(startWidth, startHeight) {
            margin = { top: 20, right: 20, bottom: 30, left: 40 },
                width = startWidth - margin.left - margin.right,
                height = startHeight- margin.top - margin.bottom;

            x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            y = d3.scale.linear()
                .range([height, 0]);

            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10);

            svg = d3.select("#" + id)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "barchart x axis")
                .attr("transform", "translate(0," + height + ")")
                .attr('stroke', scope.config.TextColor)
                .call(xAxis);

            svg.append("g")
                .attr("class", "barchart y axis")
                .attr('stroke', scope.config.TextColor)
                .call(yAxis);
        }

        initChart(scope.config.width, scope.config.Height);
        var labels = [];
        function dataUpdate(csData) {
            if (csData) {

                // remap the labels in
                if (csData.Rows[0].Label) {
                    labels = csData.Rows.map(function (row) { return row.Label; });
                }

                var data = [];
                labels.forEach(function (label, index) {
                    data.push(
                        {
                            'label': label,
                            'value': csData.Rows[index].Value,
                            'max': csData.Rows[index].Summary ? csData.Rows[index].Summary.Maximum : csData.Rows[index].Value,
                            'min': csData.Rows[index].Summary ? csData.Rows[index].Summary.Minimum : 0
                        });
                });

                // measure the domain (for x, unique labels) (for y [0,maxValue])
                // now the scales are finished and usable
                x.domain(data.map(function (d) { return d.label; }));
                y.domain([d3.min(data, function(d) { return d.min; }), d3.max(data, function (d) { return d.max; })]);

                // another g element, this time to move the origin to the bottom of the svg element
                // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
                //   for everything in the selection\
                // the end result is g populated with text and lines!
                svg.select('.x.axis').transition().duration(300).call(xAxis);

                // same for yAxis but with more transform and a title
                svg.select(".y.axis").transition().duration(300).call(yAxis);

                // THIS IS THE ACTUAL WORK!
                var bars = svg.selectAll(".bar").data(data, function (d) { return d.label; }) // (data) is an array/iterable thing, second argument is an ID generator function

                bars.exit()
                  .transition()
                    .duration(300)
                  .attr("y", y(0))
                  .attr("height", height - y(0))
                  .style('fill-opacity', 1e-6)
                  .remove();

                // data that needs DOM = enter() (a set/selection, not an event!)
                bars.enter().append("rect")
                  .attr("fill", scope.config.BarColor)
                  .attr("y", y(0))
                  .attr("height", height - y(0));

                // the "UPDATE" set:
                bars.transition().duration(300).attr("x", function (d) { return x(d.label); }) // (d) is one item from the data array, x is the scale object from above
                  .attr("width", x.rangeBand()) // constant, so no callback function(d) here
                  .attr("y", function (d) { return y(d.value); })
                  .attr("height", function (d) { return height - y(d.value); }); // flip the height, because y's domain is bottom up, but SVG renders top down
            }
    	}

        function resize(width, height) {
            scope.scale = Math.min(width / 500, height / 500);
            d3.select("#" + id).selectAll("*").remove();
            initChart(width, height);
        }

    	return { dataUpdate: dataUpdate, resize: resize };
    }

    CS.symbolCatalog.register(def);

})(window.Coresight);
