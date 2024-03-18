function runAlgorithm() {
    var traceInput = document.getElementById("traceInput").value;
    var initialInput = document.getElementById("initialInput").value;
    
    // Split the trace input into an array
    var traceArray = traceInput.split(" ").map(Number);
    
    // Call the FCFS algorithm function with the provided inputs
    fcfs(traceArray, parseInt(initialInput));
}


function fcfs(inp, ini) {
    var x1 = [];
    var y1 = [];
    var seek = 0;
    x1.push(ini);
    y1.push(0);
    for (var a1 = 1; a1 <= inp.length; ++a1) {
        x1.push(inp[a1 - 1]);
        y1.push(-1 * a1);
        if (a1 == 1) {
            seek += Math.abs(ini - inp[a1 - 1]);
        } else {
            seek += Math.abs(inp[a1 - 2] - inp[a1 - 1]);
        }
    }
    var layout = {
        xaxis: {
            autorange: true,
            showgrid: true,
            zeroline: false,
            showline: true,
            autotick: true,
            ticks: '',
            showticklabels: true,
            title: 'Cylinder Number'
        },
        yaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        }
    };
    var trace1 = {
        x: x1,
        y: y1,
        type: 'scatter'
    };
    var data = [trace1];
    Plotly.newPlot('graph_area', data, layout);
    document.getElementById("alg_seek").innerHTML = "Seek: " + seek; 
}

