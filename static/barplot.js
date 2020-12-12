var constructBar = function(data, container, first)   {

    // width, height, padding comes from plot position
    var points = [];
    for(let i = 0 ; i < data.length; i++) {
        coordinates = {}
        coordinates.x = data[i][0];
        coordinates.y = data[i][1];
        points.push(coordinates);
    }
    data = points;
    console.log(data);

    var getX = function(d) { return d.x;}
    var getY = function(d) { return d.y;}

    var xScale = d3.scale.linear().range([30, 190]);
    var yScale = d3.scale.linear().range([170, 10]);

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

    var getColor = d3.scale.category10();

    var svg = d3.select(container)
        .append("svg")
        .attr({
            'xmlns:svg': "http://www.w3.org/2000/svg",
            'xmlns': "http://www.w3.org/2000/svg",
            'width': "100%",
            'height': "100%",
            "viewBox": "0 0 200 200",
            "preserveAspectRatio": "none",
        })
        .append("g")

    var tooltip = d3.select("#dashboard")
        .append('div')
        .style('position','absolute');

    xScale.domain([Math.min(d3.min(data, getX), 0) - 1, d3.max(data, getX) + 1]).nice();
    yScale.domain([Math.min(d3.min(data, getY), 0) - 1, d3.max(data, getY) + 1]).nice();
    console.log(170 - yScale(259));

    svg.append("g")
        .attr({
            "class": "axis_x",
            "transform": "translate(0, 170)",
        })
        .call(xAxis)
        .append("text")
        .attr({
            "class": "label",
            "y": "18",
            "x": "180",
            "font-size": "5",
        })
        .style("text-anchor", "end")
        .text(first); //x- axis label

    svg.append("g")
        .attr({
            "class": "axis_y",
            "transform": "translate(30,0)"
        })
        .call(yAxis)
        .append("text")
        .attr({
            "class": "label",
            "y": "5",
            "font-size": "5",
        })
        .text("Count") //y -axis label
        .style("text-anchor", "end");

    var tooltip = d3.select(container).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var tipMouseover = function(d) {
        var color = getColor(d.manufacturer);
        var html  = "<span style='color:" + color + ";'>" + d.y + "</span>";

        tooltip.html(html)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .transition()
            .duration(200)
            .style("opacity", .9)

    };

    var tipMouseout = function(d) {
        tooltip.transition()
            .duration(300)
            .style("opacity", 0);
    };

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr({
            "class": "bar",
            "x": function(d) {return xScale(d.x)},
            "y": function(d) {return yScale(d.y)},
            "width": 2,
            "height": function(d) {return 170 - yScale(d.y)}
        })
        .style("fill", "#69b3a2")
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout);

    svg.selectAll(".axis_x .tick line")
        .attr({
            "y2" : 6,
        });
    svg.selectAll(".axis_y .tick line")
        .attr({
            "x2" : -6,
        });
    svg.selectAll(".axis_x .tick text")
        .attr({
            "y": 8,
        });
    svg.selectAll(".axis_y .tick text")
        .attr({
            "x": -8,
        });
}