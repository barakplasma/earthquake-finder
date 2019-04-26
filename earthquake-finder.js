// URL: https://observablehq.com/@barakplasma/earthquake-finder
// Title: Earthquake finder
// Author: Michael Salaverry (@barakplasma)
// Version: 374
// Runtime version: 1

const m0 = {
  id: "e760e6eafde4a5f7@374",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Earthquake finder
from [Alon Ziv's HW Assignment](http://www.tau.ac.il/~zivalon/seismology/Front/AndiExcercise.pdf)
`
)})
    },
    {
      name: "stations",
      value: (function(){return(
[
  {x: 9, y: 24, q1: 14.189, q2: 20.950},
  {x: 24, y: 13.2, q1: 13.679, q2: 21.718},
  {x: 33, y: 4.8, q1: 13.491, q2: 21.467},
  {x: 45, y: 10.8, q1: 14.406, q2: 21.713},
  {x: 39, y: 27, q1: 13.075, q2: 20.034},
  {x: 54, y: 30, q1: 15.234, q2: 20.153},
  {x: 15, y: 39, q1: 13.270, q2: 18.188},
  {x: 36, y: 42, q1: 12.239, q2: 16.008},
  {x: 27, y: 48, q1: 12.835, q2: 15.197},
  {x: 48, y: 48, q1: 14.574, q2: 16.280},
  {x: 15, y: 42, q1: 12.624, q2: 16.907},
  {x: 18, y: 15, q1: 13.496, q2: 21.312},
  {x: 30, y: 36, q1: 10.578, q2: 16.664},
]
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Stations plotted`
)})
    },
    {
      inputs: ["vegalite","_","stations"],
      value: (function(vegalite,_,stations){return(
vegalite({
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "width": 400,
  "height": 400,
  "data": {"values": _.cloneDeep([...stations, {x: 100, y: 100}]) },
  "mark": "point",
  "encoding": {
    "y": {"field": "y", "type": "quantitative" },
    "x": {"field": "x", "type": "quantitative" },
  },
})
)})
    },
    {
      name: "grid",
      value: (function(){return(
Array(100).fill(Array(100).fill(1))
)})
    },
    {
      name: "distance",
      value: (function(){return(
function (a, b) {
  var sum = 0
  var n
  for (n = 0; n < a.length; n++) {
    sum += Math.pow(a[n] - b[n], 2)
  }
  return Math.sqrt(sum)
}
)})
    },
    {
      inputs: ["distance"],
      value: (function(distance){return(
distance([0,0],[1,1])
)})
    },
    {
      name: "iterateOverGrid",
      inputs: ["grid","stations"],
      value: (function(grid,stations){return(
forEachStation => grid.map((row, rowIndex) => row.map((col, colIndex) => (stations.map(station=>forEachStation(station,rowIndex,colIndex)))))
)})
    },
    {
      name: "distanceMatrix",
      inputs: ["iterateOverGrid","distance","residuumI"],
      value: (function(iterateOverGrid,distance,residuumI){return(
iterateOverGrid(
  (station, rowIndex, colIndex) => {
  let x = rowIndex+1
  let y = colIndex+1
  let distanceToStation = distance ([rowIndex+1, colIndex+1], [station.x, station.y])
  let calculatedTime = distanceToStation / 6;
  let residuum = {q1: residuumI(station.q1, calculatedTime), q2: residuumI(station.q2, calculatedTime)}
  return ({
    x, y, 
    stationId: `${station.x}-${station.y}`, 
    distanceToStation,
    calculatedTime,
    residuum,
   })
  }
)
)})
    },
    {
      name: "iterateOverDistanceMatrix",
      inputs: ["distanceMatrix"],
      value: (function(distanceMatrix){return(
(fn) => distanceMatrix.map(x => x.map(fn) )
)})
    },
    {
      name: "residuums",
      inputs: ["distanceMatrix"],
      value: (function(distanceMatrix)
{
  let sumOfResiduums = [];
  for (let row of distanceMatrix) {
      for (let col of row) {
        let columnSumOfResiduumq1 = 0
        let columnSumOfResiduumq2 = 0
        for (let station of col){
          columnSumOfResiduumq1 += Math.abs(station.residuum.q1)
          columnSumOfResiduumq2 += Math.abs(station.residuum.q2)
        }
        sumOfResiduums.push({
          columnSumOfResiduumq1, 
          columnSumOfResiduumq2, 
          x: col[0].x, y: col[0].y
        })
      }
  }
  return sumOfResiduums;
 }
)
    },
    {
      name: "vegalite",
      inputs: ["require"],
      value: (function(require){return(
require("@observablehq/vega-lite")
)})
    },
    {
      name: "_",
      inputs: ["require"],
      value: (function(require){return(
require('lodash')
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Maybe location of earthquake 1`
)})
    },
    {
      inputs: ["vegalite","residuums"],
      value: (function(vegalite,residuums){return(
vegalite({
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "width": 400,
  "height": 400,
  "data": {"values": residuums},
  "mark": "rect",
  "encoding": {
    "y": {"field": "y", "type": "ordinal"},
    "x": {"field": "x", "type": "ordinal"},
    "color": {"field": "columnSumOfResiduumq1", "aggregate": "mean", "type": "quantitative"}
  },
})
)})
    },
    {
      name: "highestResiduumQ1",
      inputs: ["residuums"],
      value: (function(residuums){return(
Math.max.apply(null, residuums.map(r => r.columnSumOfResiduumq1))
)})
    },
    {
      name: "locationOfQ1",
      inputs: ["_","residuums","highestResiduumQ1"],
      value: (function(_,residuums,highestResiduumQ1){return(
_.pick(residuums.find(r => r.columnSumOfResiduumq1 === highestResiduumQ1), ['x', 'y'])
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Maybe location of earthquake 2`
)})
    },
    {
      inputs: ["vegalite","residuums"],
      value: (function(vegalite,residuums){return(
vegalite({
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "width": 400,
  "height": 400,
  "data": {"values": residuums},
  "mark": "rect",
  "encoding": {
    "y": {"field": "y", "type": "ordinal"},
    "x": {"field": "x", "type": "ordinal"},
    "color": {"field": "columnSumOfResiduumq2", "aggregate": "mean", "type": "quantitative"}
  },
})
)})
    },
    {
      name: "highestResiduumQ2",
      inputs: ["residuums"],
      value: (function(residuums){return(
Math.max.apply(null, residuums.map(r => r.columnSumOfResiduumq2))
)})
    },
    {
      name: "locationOfQ2",
      inputs: ["_","residuums","highestResiduumQ2"],
      value: (function(_,residuums,highestResiduumQ2){return(
_.pick(residuums.find(r => r.columnSumOfResiduumq2 === highestResiduumQ2), ['x', 'y'])
)})
    },
    {
      name: "station1Distances",
      inputs: ["distanceMatrix"],
      value: (function(distanceMatrix){return(
distanceMatrix.flat().map(x => x[0])
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Distance to Station 1`
)})
    },
    {
      inputs: ["vegalite","station1Distances"],
      value: (function(vegalite,station1Distances){return(
vegalite({
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "width": 400,
  "height": 400,
  "data": {"values": station1Distances},
  "mark": "rect",
  "encoding": {
    "y": {"field": "y", "type": "ordinal"},
    "x": {"field": "x", "type": "ordinal"},
    "color": {"field": "distanceToStation", "aggregate": "mean", "type": "quantitative"}
  },
})
)})
    },
    {
      name: "residuumI",
      value: (function(){return(
(tObserved, tCalculated) => tObserved - tCalculated
)})
    }
  ]
};

const notebook = {
  id: "e760e6eafde4a5f7@374",
  modules: [m0]
};

export default notebook;
