import React, { useState, useEffect } from 'react';
import {
  BottomReversalData,
  fetchBottomReversal,
  fetchPriceVolume1Y,
  PriceVolumePoint,
} from '../services/stockApi';
import StockPriceVolumeChart from './StockPriceVolumeChart';
import './BottomReversal.css';

const BottomReversal: React.FC = () => {
  const [stocks, setStocks] = useState<BottomReversalData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTsCode, setSelectedTsCode] = useState<string | null>(null);
  const [selectedStockName, setSelectedStockName] = useState<string>('');
  const [chartData, setChartData] = useState<PriceVolumePoint[] | null>(null);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);

  const loadStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBottomReversal();
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
  }, []);

  const handleRefresh = () => {
    loadStockData();
  };

  const handleSelectStock = async (stock: BottomReversalData) => {
    setSelectedTsCode(stock.ts_code);
    setSelectedStockName(stock.名称);
    setChartLoading(true);
    setChartError(null);
    setChartData(null);
    setIsChartModalOpen(true);

    try {
      const data = await fetchPriceVolume1Y(stock.ts_code);
      setChartData(data);
    } catch (err) {
      setChartError(err instanceof Error ? err.message : '获取价格/成交量数据失败');
    } finally {
      setChartLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsChartModalOpen(false);
  };

  const formatPercent = (val: number) => {
    const prefix = val >= 0 ? '+' : '';
    return `${prefix}${val.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bottom-reversal loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>正在获取底部反转数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bottom-reversal error">
        <div className="error-message">
          <h3>⚠️ 数据获取失败</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-reversal">
      <div className="stocks-header">
        <h2>底部反转</h2>
        <div className="header-info">
          <span className="stock-count">共找到 {stocks.length} 只股票</span>
          <button onClick={handleRefresh} className="refresh-button">
            🔄 刷新数据
          </button>
        </div>
      </div>

      <div className="filter-info">
        <span>筛选条件: 股价经历连续下跌后出现周线反转迹象，伴随成交量放大，可能处于底部启动区域</span>
      </div>

      <div className="stocks-table-container">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>股票代码</th>
              <th>股票名称</th>
              <th>现价</th>
              <th>市值(亿)</th>
              <th>本周涨幅%</th>
              <th>放量倍数</th>
              <th>连续下跌周数</th>
              <th>最近周线日期</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={stock.ts_code}
                className={`stock-row ${
                  selectedTsCode === stock.ts_code ? 'selected' : ''
                }`}
                onClick={() => handleSelectStock(stock)}
              >
                <td className="rank">{index + 1}</td>
                <td className="stock-code">{stock.ts_code}</td>
                <td className="stock-name">{stock.名称}</td>
                <td className="current-price">¥{stock.现价.toFixed(2)}</td>
                <td className="market-value">{stock["市值(亿)"].toFixed(2)}</td>
                <td className={`price-change ${stock["本周涨幅%"] >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercent(stock["本周涨幅%"])}
                </td>
                <td className="volume-multiplier">{stock.放量倍数.toFixed(2)}</td>
                <td className="down-weeks">
                  <span className="down-count">{stock.连续下跌周数}周</span>
                </td>
                <td className="date">{stock.最近周线日期}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isChartModalOpen && selectedTsCode && (
        <div
          className="stock-chart-modal-backdrop"
          onClick={handleCloseModal}
        >
          <div
            className="stock-chart-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="stock-chart-modal-header">
              <div>
                <h3>
                  {selectedStockName}（{selectedTsCode}）
                </h3>
                <p className="stock-chart-modal-subtitle">
                  近一年价格走势（红线为收盘价）与成交量（蓝色柱状）
                </p>
              </div>
              <button
                type="button"
                className="stock-chart-modal-close"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            <div className="stock-chart-modal-body">
              {chartLoading && (
                <div className="stock-chart-loading">
                  <div className="spinner" />
                  <p>正在加载股票走势图...</p>
                </div>
              )}

              {!chartLoading && chartError && (
                <div className="stock-chart-error">
                  <p>获取股票走势图失败：{chartError}</p>
                </div>
              )}

              {!chartLoading && !chartError && chartData && (
                <StockPriceVolumeChart
                  data={chartData}
                  stockName={selectedStockName}
                  tsCode={selectedTsCode}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {stocks.length === 0 && !loading && !error && (
        <div className="no-data">
          <p>暂无符合条件的股票数据</p>
        </div>
      )}
    </div>
  );
};

export default BottomReversal;

