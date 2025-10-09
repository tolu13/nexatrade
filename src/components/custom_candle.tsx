import { Layer, Line, Rectangle } from "recharts";

type CandlePayload = {
  open: number;
  close: number;
  high: number;
  low: number;
};

type CustomCandleProps = {
  x: number;
  y: number;
  payload: CandlePayload;
  yAxis: {
    scale: (value: number) => number;
  };
};

export const CustomCandle = ({ x, payload, yAxis }: CustomCandleProps) => {
  const candleWidth = 12;

  // Use the scale function to map data values to pixel values
  const openY = yAxis.scale(payload.open);
  const closeY = yAxis.scale(payload.close);
  const highY = yAxis.scale(payload.high);
  const lowY = yAxis.scale(payload.low);

  const candleX = x - candleWidth / 2;
  const candleBodyY = Math.min(openY, closeY);
  const candleBodyHeight = Math.abs(closeY - openY) || 1;

  const candleColor = payload.close >= payload.open ? "#4caf50" : "#f44336";

  return (
    <Layer>
      {/* Wick */}
      <Line
        x1={x}
        y1={highY}
        x2={x}
        y2={lowY}
        stroke={candleColor}
        strokeWidth={2}
      />
      {/* Candle Body */}
      <Rectangle
        x={candleX}
        y={candleBodyY}
        width={candleWidth}
        height={candleBodyHeight}
        fill={candleColor}
      />
    </Layer>
  );
};
