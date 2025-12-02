import React from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  CartesianGrid,
  LineChart,
  BarChart,
} from 'recharts';
import { PriceVolumePoint } from '../services/stockApi';

interface StockPriceVolumeChartProps {
  data: PriceVolumePoint[];
  stockName: string;
  tsCode: string;
}

const formatAmountToYi = (amountInThousand: number): string => {
  // 接口返回为“千元”，1 亿 = 1e8 元 = 1e5 * 1000 元
  const amountYi = amountInThousand / 100000;
  return amountYi.toFixed(2);
};

const StockPriceVolumeChart: React.FC<StockPriceVolumeChartProps> = ({
  data,
  stockName,
  tsCode,
}) => {
  // 数据按日期从小到大排序，防止后端返回顺序混乱
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime()
  );

  // 根据一年内价格范围动态收紧纵坐标
  let priceDomain: [number, number] | undefined;
  if (sortedData.length > 0) {
    const closes = sortedData.map(point => point.close);
    const minClose = Math.min(...closes);
    const maxClose = Math.max(...closes);
    const diff = maxClose - minClose || Math.max(maxClose * 0.01, 0.5); // 避免完全平盘导致 diff 为 0
    const padding = diff * 0.05; // 只留 5% 的上下边距
    priceDomain = [minClose - padding, maxClose + padding];
  }

  return (
    <div className="stock-chart-container">
      <div className="stock-chart-header">
        <h3>
          {stockName}（{tsCode}）近一年价格 & 成交量
        </h3>
      </div>

      <div className="stock-chart-content">
        {/* 价格走势图（上方） */}
        <div className="stock-chart-row stock-chart-row-price">
          <ResponsiveContainer width="100%" height={210}>
            <LineChart
              data={sortedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              syncId="price-volume-sync"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="trade_date"
                tickFormatter={(value: string) => value.slice(5)}
                minTickGap={20}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={priceDomain}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                name="收盘价"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 成交量柱状图（下方） */}
        <div className="stock-chart-row stock-chart-row-volume">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart
              data={sortedData}
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              syncId="price-volume-sync"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="trade_date"
                tickFormatter={(value: string) => value.slice(5)}
                minTickGap={20}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string, info: any) => {
                  if (name === '成交量') {
                    const amountYi = formatAmountToYi(
                      info?.payload?.amount ?? 0
                    );
                    return [
                      value,
                      `成交量（成交额：${amountYi}亿）`,
                    ];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                dataKey="vol"
                name="成交量"
                fill="#60a5fa"
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StockPriceVolumeChart;


