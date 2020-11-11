var constructScatter = function(data, container, first, second)   {

    // width, height, padding comes from plot position
    var points = [];
    for(let i = 0 ; i < data.length; i++) {
        coordinates = {}
        coordinates.x = data[i][0];
        coordinates.y = data[i][1];
        points.push(coordinates);
    }
    data = points;

    var getX = function(d) { return d.x;}
    var getY = function(d) { return d.y;}

    var xScale = d3.scale.linear().range([30, 190]);
    // var xScale = d3.scaleLinear().range([0, width])
    var yScale = d3.scale.linear().range([170, 10]);
    // var yScale = d3.scaleLinear().range([height, 0])

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").outerTickSize(0)
    var yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0)
    // var xAxis = d3.axisBottom(xScale)
    // var yAxis = d3.axisLeft(yScale)

    // var getClusterID = function(d) {return d.cluster_id;}

    var getColor = d3.scale.category10();
    // var getColor = d3.scaleOrdinal(d3.schemeCategory10)

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

    var tooltip = d3.select(container)
        .append('div')
        .style('position','absolute');

    xScale.domain([Math.min(d3.min(data, getX), 0), d3.max(data, getX)]).nice();
    yScale.domain([Math.min(d3.min(data, getY), 0), d3.max(data, getY)]).nice();

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
        .text(second) //y -axis label
        .style("text-anchor", "end");

    var tooltip = d3.select(container).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var tipMouseover = function(d) {
        var color = getColor(d.manufacturer);
        var html  = "<span style='color:" + color + ";'>" + d.x + "," +d.y + "</span>";

        tooltip.html(html)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .transition()
            .duration(200)
            .style("opacity", 1)

    };

    var tipMouseout = function(d) {
        tooltip.transition()
            .duration(300)
            .style("opacity", 0);
    };

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr({
            "class": "dot",
            "cx": function(d) {return xScale(d.x)},
            "cy": function(d) {return yScale(d.y)},
            "r": "0.5%"
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