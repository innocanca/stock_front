import React, { useState, useEffect } from 'react';
import {
  ProcessedStockData,
  fetchLargCapBelowAvgPrice,
  formatMarketValue,
  formatPriceDiff,
  formatPercentage,
  fetchPriceVolume1Y,
  PriceVolumePoint,
} from '../services/stockApi';
import StockPriceVolumeChart from './StockPriceVolumeChart';
import './UndervaluedStocks.css';

interface UndervaluedStocksProps {
  minMv?: number;
  maxPe?: number;
}

const UndervaluedStocks: React.FC<UndervaluedStocksProps> = ({
  minMv = 10000000,
  maxPe = 30.0
}) => {
  const [stocks, setStocks] = useState<ProcessedStockData[]>([]);
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
      const data = await fetchLargCapBelowAvgPrice(minMv, maxPe);
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
  }, [minMv, maxPe]);

  const handleRefresh = () => {
    loadStockData();
  };

  const handleSelectStock = async (stock: ProcessedStockData) => {
    setSelectedTsCode(stock.ts_code);
    setSelectedStockName(stock.name);
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

  if (loading) {
    return (
      <div className="undervalued-stocks loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>正在获取股票数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="undervalued-stocks error">
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
    <div className="undervalued-stocks">
      <div className="stocks-header">
        <h2>低估值大市值股票</h2>
        <div className="header-info">
          <span className="stock-count">共找到 {stocks.length} 只股票</span>
          <button onClick={handleRefresh} className="refresh-button">
            🔄 刷新数据
          </button>
        </div>
      </div>

      <div className="filter-info">
        <span>筛选条件: 市值≥{formatMarketValue(minMv)}, PE≤{maxPe}, 现价低于1年均价</span>
      </div>

      <div className="stocks-table-container">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>股票代码</th>
              <th>股票名称</th>
              <th>现价</th>
              <th>1年均价</th>
              <th>价格差值</th>
              <th>差值百分比</th>
              <th>市值</th>
              <th>PE(TTM)</th>
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
                <td className="stock-name">{stock.name}</td>
                <td className="current-price">¥{stock.current_close.toFixed(2)}</td>
                <td className="avg-price">¥{stock.avg_close_1y.toFixed(2)}</td>
                <td className={`price-diff ${stock.price_diff < 0 ? 'negative' : 'positive'}`}>
                  {formatPriceDiff(stock.price_diff)}
                </td>
                <td className={`price-diff-percent ${stock.price_diff_percent < 0 ? 'negative' : 'positive'}`}>
                  {formatPercentage(stock.price_diff_percent)}
                </td>
                <td className="market-value">{formatMarketValue(stock.total_mv_10k)}</td>
                <td className="pe-ratio">{stock.pe_ttm.toFixed(2)}</td>
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

export default UndervaluedStocks;
