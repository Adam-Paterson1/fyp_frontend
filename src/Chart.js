import React, { useMemo, useRef, useEffect } from 'react';
import Chart from 'chart.js'

const colours = ["#000000", "#00ff00", "#ff0000", "#0000ff"]

function ChartComponent(props) {
  const { labels, limits, registerInterest, deregisterInterest } = props
  const id = useMemo(() => labels.join(''), [labels]);
  const chartRef = useRef(null)
  useEffect(() => {
    let datasets = labels.map((label, index) => {
      return {
        label: label,
        data: [],
        borderColor: colours[index],
        backgroundColor: colours[index],
      }
    })
    let yaxes = [{}];
    if (limits) {
      yaxes = [{
        ticks: {
          max: limits[1],
          min: limits[0]
        }
      }]
    }
    chartRef.current = new Chart(id, {
      type: 'line',
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        responsive:true,
        maintainAspectRatio: false,
        showLines: false,
        scales: {
          xAxes: [{
            display: false,
          }],
          yAxes: yaxes
        },
        animation: {
          duration: 0,
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      }
    })
    function updateChart(newData) {
      chartRef.current.data.labels.push(new Date());
      let newList = Object.keys(newData);
      newList.forEach((key, index) => {
        chartRef.current.data.datasets[index].data.push(newData[key])
      })
      if (chartRef.current.data.datasets[0].data.length > 80) {
        chartRef.current.data.labels.shift()
        chartRef.current.data.datasets.forEach((set) => {set.data.shift()})
      }
      chartRef.current.update()
    }
    registerInterest(updateChart, labels)
    return function cleanup() {
      deregisterInterest(labels)
    }
  }, [id, labels, limits, registerInterest, deregisterInterest])

  return (
    <div className="BoxInner">
      <canvas id={id}> </canvas>
    </div>
  )
}

export default ChartComponent;
