/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from "react";
import {
  Chart as chartjs,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import { Chart } from "chart.js";
import "chartjs-adapter-date-fns";

chartjs.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

export interface CandleDataPoint {
  x: number; // timestamp in ms
  o: number;
  h: number;
  l: number;
  c: number;
}

interface CandlestickChartProps {
  data: CandleDataPoint[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  // Initialize chart only once
  useEffect(() => {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  console.log("Initializing chart with data:", data);

  if (chartRef.current) chartRef.current.destroy();

  chartRef.current = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [
        {
          label: "Price",
          data: data,
          type: "candlestick",
          borderColor: {
            up: "#22c55e", // bright green
            down: "#ef4444", // red
            unchanged: "#999999",
          },
          color: {
            up: "#22c55e",
            down: "#ef4444",
            unchanged: "#999999",
          },
          borderWidth: 1,
          barThickness: 8,
          maxBarThickness: 12,
        } as any,
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            tooltipFormat: "MMM dd, yyyy HH:mm",
            unit: "minute",
            displayFormats: {
              minute: "HH:mm",
            },
          },
          title: { display: false },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: "Price" },
          grid: { color: "rgba(200,200,200,0.1)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
    },
  });

  return () => {
    chartRef.current?.destroy();
  };
}, [data]);


  // Update chart when data changes
  useEffect(() => {
  if (!chartRef.current) return;
  if (!data.length) return;

  // compute min/max dynamically for autoscaling
  const min = Math.min(...data.map((d) => d.l));
  const max = Math.max(...data.map((d) => d.h));

  const chart = chartRef.current;
  chart.data.datasets[0].data = data as any;

  // ✅ force Y-axis to rescale properly
  chart.options.scales!.y!.min = Math.floor(min - (max - min) * 0.1);
  chart.options.scales!.y!.max = Math.ceil(max + (max - min) * 0.1);

  chart.update();
}, [data]);

  return <canvas ref={canvasRef} style={{ height: "300px", width: "100%" }} />;
};

export default CandlestickChart;
