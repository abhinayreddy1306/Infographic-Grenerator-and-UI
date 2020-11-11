var values = ["Inform", "Compare", "Change", "Organize", "Relationship"]
var icoreList = [['donut', 'picto'], ['bar', 'pie', 'bubble','treemap'], ['line','chloro'], ['mindmap','bar','bubble'], ['scatter','multiseries']];
var icoreMap = {};
var validChartSet = new Set(['bar','line','scatter','donut']);
var doubleColumn = new Set(['scatter']);
var columns = [];
var count = 0;
var svgSet = new Set();
values.forEach((val1, index) => {
    icoreMap[val1] = icoreList[index];
});

$(function() {
    $(".svgwrapper").draggable({
    handle: 'rect'
    }).resizable()
});

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML = this.responseText;
            if (this.responseText == "Success") {
                var toRem = document.getElementById("uploadData");
                toRem.innerHTML = "";
                toRem.remove();
                datasetSubmitted();
            }
        }
    };
    var myFile = document.getElementById('dataset');
    var files = myFile.files;
    var formData = new FormData();
    var file = files[0];
    formData.append('dataset', file);

    xhttp.open("POST", "uploadFile", true);
    xhttp.send(formData);
}

function datasetSubmitted() {
    document.getElementById('chartType').innerHTML = "";
    document.getElementById('columns').innerHTML = "";
    if (document.getElementById('operation')) {
        return;
    }
    var container = document.getElementById('operType');
    var oper = document.createElement("select");
    oper.id = "operation";
    for (const val of values) {
        var option = document.createElement("option");
        option.label = val;
        option.value = val;
        oper.add(option);
    }
    oper.selectedIndex = -1;
    oper.onchange = operationChanged;
    var comment = document.createElement("p");
    comment.innerText = "Choose the type of operation preferred.";
    container.appendChild(comment);
    container.appendChild(oper);

    // Get columns of the dataset.
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            columns = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", "/getColumns", true);
    xhttp.send();
}

function operationChanged() {
    var container = document.getElementById('chartType');
    var oper = document.getElementById('operation');
    var operType = oper.options[oper.selectedIndex].value;
    var chartSelect = document.getElementById('chartSelect');
    var columnContainer = document.getElementById('columns');
    columnContainer.innerHTML = "";

    container.innerHTML = "";
    var comment = document.createElement("p");
    comment.innerText = "Choose the type of chart to plot.";
    chartSelect = document.createElement('select');
    for (const val of icoreMap[operType]) {
        var option = document.createElement("option");
        option.label = val;
        option.value = val;
        chartSelect.add(option);
    }
    chartSelect.selectedIndex = -1;
    chartSelect.id = 'chartSelect';
    chartSelect.onchange = chartChanged;
    container.appendChild(comment);
    container.appendChild(chartSelect);
}

function chartChanged() {
    var chartSelect = document.getElementById('chartSelect');
    if (!validChartSet.has(chartSelect.options[chartSelect.selectedIndex].value)) {
        return;
    }
    var container = document.getElementById('columns');
    var comment = document.getElementById("columnsComment");
    var plotChart = document.getElementById("plotChart");
    if (plotChart) {
        plotChart.remove();
    }
    if (!comment) {
        var comment = document.createElement("p");
        comment.id = "columnsComment"
        comment.innerText = "Choose attribute/attributes.";
        container.appendChild(comment);
    }
    var firstColumn = document.getElementById('firstColumn');
    var secondColumn = document.getElementById('secondColumn');
    if (firstColumn) {
        var children = firstColumn.children;
        while (children.length != 0) {
            firstColumn.removeChild(children[0]);
        }
    } else {
        firstColumn = document.createElement('select');
        firstColumn.onchange = firstColumnChanged;
        firstColumn.id = 'firstColumn';
    }
    for (const val of columns) {
        var option = document.createElement('option');
        option.label = val;
        option.value = val;
        firstColumn.add(option);
    }
    firstColumn.selectedIndex = -1;
    container.appendChild(firstColumn);

    // Depending if 2 column or one column, add or remove select option for 2nd column.
    if (doubleColumn.has(chartSelect.options[chartSelect.selectedIndex].value)) {
        if (secondColumn) {
            var children = secondColumn.children;
            while (children.length != 0) {
                secondColumn.removeChild(children[0]);
            }
        } else {
            secondColumn = document.createElement('select');
            secondColumn.onchange = secondColumnChanged;
            secondColumn.id = 'secondColumn';
        }
        container.appendChild(secondColumn);
    } else {
        if(secondColumn) {
            var children = secondColumn.children;
            while (children.length != 0) {
                chartSelect.removeChild(children[0]);
            }
            secondColumn.remove();
        }
    }
}

function firstColumnChanged() {
    var container = document.getElementById('columns');
    var chartSelect = document.getElementById('chartSelect');
    var firstColumn = document.getElementById('firstColumn');
    var secondColumn = document.getElementById('secondColumn');
    if (doubleColumn.has(chartSelect.options[chartSelect.selectedIndex].value)) {
        var children = secondColumn.children;
        while (children.length != 0) {
            secondColumn.removeChild(children[0]);
        }
        for (const val of columns) {
            if (val != firstColumn.options[firstColumn.selectedIndex].value) {
                var option = document.createElement('option');
                option.label = val;
                option.value = val;
                secondColumn.add(option);
            }
        }
        secondColumn.selectedIndex = -1;
    } else {
        var uploadBtn = document.getElementById('plotChart');
        if (!uploadBtn) {
            uploadBtn = document.createElement('input');
            container.appendChild(uploadBtn);
        }
        uploadBtn.id = "plotChart"
        uploadBtn.type = "submit";
        uploadBtn.value = "Plot Chart";
        uploadBtn.onclick = plotChart;
    }
}

function secondColumnChanged() {
    var container = document.getElementById("columns");
    var uploadBtn = document.getElementById('plotChart');
    if (!uploadBtn) {
        uploadBtn = document.createElement('input');
        container.appendChild(uploadBtn);
    }
    uploadBtn.id = "plotChart"
    uploadBtn.type = "submit";
    uploadBtn.value = "Plot Chart";
    uploadBtn.onclick = plotChart;
}

function plotChart() {
    var chartType = document.getElementById("chartSelect");
    var firstColumn = document.getElementById("firstColumn");
    var secondColumn = document.getElementById("secondColumn");
    var chartTypeName = chartType.options[chartType.selectedIndex].value;
    if (!doubleColumn.has(chartTypeName)) {
        var firstColumnName = firstColumn.options[firstColumn.selectedIndex].value;
        console.log(firstColumnName);
    } else {
        var firstColumnName = firstColumn.options[firstColumn.selectedIndex].value;
        var secondColumnName = secondColumn.options[secondColumn.selectedIndex].value;
        console.log(firstColumnName);
        console.log(secondColumnName);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var rightWrapper = document.getElementById("rightwrapper");
                var svgContainer = document.createElement('div');
                svgContainer.className = "svgwrapper";
                var i = 0;
                while (true) {
                    if (!svgSet.has(i)) {
                        break;
                    }
                    i++;
                }
                svgSet.add(i);
                svgContainer.id = "svg" + i;
                rightWrapper.appendChild(svgContainer);
                $(function() {
                    $("#" + svgContainer.id).draggable({
                        // handle: 'rect'
                    }).resizable()
                });
                constructScatter(JSON.parse(this.responseText), "#" + svgContainer.id, firstColumnName, secondColumnName);
            }
        };
        var formData = new FormData();
        formData.append('first', firstColumnName);
        formData.append('second', secondColumnName);
        xhttp.open("POST", chartTypeName + "Plot", true);
        xhttp.send(formData);
    }
}