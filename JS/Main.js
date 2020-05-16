var Number_Of_Hidden_Layers = 1;
var Number_Of_Nodes_Per_Layer = 1;
var Learning_Rate = 0.01;
var Epochs = 50;
var Activation_Function = "tanh";
var nncloned;


let data = [];
var color = Chart.helpers.color;
var scatterChartData = {
    datasets: [{
        label: 'training data',
        borderColor: 'rgb(220,53,69)',
        backgroundColor: 'rgb(220,53,69)',
        data: []
    }, {

        label: 'testing data',
        borderColor: ('rgb(40, 167, 69'),
        backgroundColor: 'rgb(40, 167, 69',
        data: [],
        type: 'line'
    }]
};

window.onload = function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myScatter = Chart.Scatter(ctx, {
        data: scatterChartData,
        options: {
            responsive: true,
        }
    });
};
var w;
function startWorker() {
    document.getElementById('ennnn').innerHTML = 0;
    if (typeof (Worker) !== "undefined") {
        if (typeof (w) == "undefined") {
            w = new Worker("JS/Training_Thread.js");
        }
        w.postMessage(
            {
                d: data,
                NOHL: Number_Of_Hidden_Layers,
                NONPL: Number_Of_Nodes_Per_Layer,
                LR: Learning_Rate,
                E: Epochs,
                AF: Activation_Function,
                ALR: document.getElementById('exampleCheck1').checked
            });


            
        w.onmessage = function (event) {
            window.scatterChartData.datasets[0].data = event.data.d;
            window.scatterChartData.datasets[1].data = event.data.p;
            window.myScatter.update(500)
            document.getElementById('ennnn').innerHTML = Number(document.getElementById('ennnn').innerHTML) + 1;
            document.getElementById('MSE').innerHTML = event.data.e;
            console.log(event.data);
            nncloned=new NeuralNetwork(1,1,1,1);
            nncloned.clone(event.data.n)
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
    }
}

function stopWorker() {
    w.terminate();
    w = undefined;
}


function datagenerate(x) {
  if (x == "sin") {
    data = [];
    var k = 0;
    for (var i = 0; i < 21; i++) {
      data.push({
        x: k,
        y: Math.sin(7*k)
      });
      k += 0.05  ;
    }
    updataselections(2, 6, 0.01, 4000, "tanh");
    document.getElementById("exampleCheck1").checked = false;
  }

  if (x == "cos") {
    data = [];
    var k = 0;
    for (var i = 0; i < 21; i++) {
      data.push({
        x: k,
        y: Math.cos(9*k) 
      });
      k += 0.05;
    }

    updataselections(2, 100, 0.01, 206, "tanh");
    document.getElementById("exampleCheck1").checked = true;
  }

  if (x == "x") {
    data = [];
    var k =0;
    for (var i = 0; i < 21; i++) {
      data.push({
        x: k,
        y: k +Math.random()/7
      });
      k += 0.05 ;
    }
    
    console.log(JSON.stringify(data ))

    updataselections(1, 3, 0.1, 20, "relu");
    document.getElementById("exampleCheck1").checked = true;
  }

  if (x == "none") {
    data = [];
  }

  if (x == "x^2") {
    data = [];
    var k = 0;
    for (var i = 0; i < 21; i++) {
      data.push({
        x: k,
        y: Math.pow(k-0.5,2)+Math.random()/30, 
      });
      k += 0.05;
    }
    updataselections(1, 3, 0.1, 5000, "tanh");
    document.getElementById("exampleCheck1").checked = false;
  }

  if (x == "abs") {
    data = [];
    var k = 0;
    for (var i = 0; i < 21; i++) {
      data.push({
        x: k,
        y: Math.abs(k-0.5)
      });
      k += 0.05;
    }
    updataselections(1, 3, 0.1, 4000, "relu");
  }

  if (x == "sqrt") {
    data = [];
    var k = 0;
    for (var i = 0; i < 21; i++) {
      data.push({
        x: k,
        y: Math.sqrt(k)
      });
      k += 0.05;
    }
    updataselections(1, 30, 0.1, 40, "sigmoid");
  }
 // Scaler();
  window.scatterChartData.datasets[0].data = data;
  window.myScatter.update(500);
}

function updataselections(h1, h2, h3, h4, h5) {
  document.getElementById("h11").value = h1;
  document.getElementById("hid_n").innerHTML = h1;
  document.getElementById("h12").value = h2;
  document.getElementById("hid_nn").innerHTML = h2;
  document.getElementById("h13").value = h3;
  document.getElementById("hid_nnlr").innerHTML = h3;
  document.getElementById("h14").value = h4;
  document.getElementById("hid_nnep").innerHTML = h4;
  document.getElementById("h15").value = h5;
  Number_Of_Hidden_Layers = h1;
  Number_Of_Nodes_Per_Layer = h2;
  Learning_Rate = h3;
  Epochs = h4;
  Activation_Function = h5;
}

var xmax = -99999,
    ymax = -99999,
    xmin =  99999,
    ymin =  99999;

function Scaler() {

  for (let i = 0; i < data.length; i++) {
    if (data[i].x < xmin) {
      xmin = data[i].x;
    }
    if (data[i].y < ymin) {
      ymin = data[i].y;
    }
    if (data[i].x > xmax) {
      xmax = data[i].x;
    }
    if (data[i].y > ymax) {
      ymax = data[i].y;
    }
  }

  for (let i = 0; i < data.length; i++) {
    data[i].x = (data[i].x - xmin) / (xmax - xmin);
    data[i].y = (data[i].y - ymin) / (ymax - ymin);
  }
}