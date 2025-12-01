import React, { useState, useEffect } from 'react';
import { 
  ProcessedStockData, 
  fetchLargCapBelowAvgPrice, 
  formatMarketValue, 
  formatPriceDiff, 
  formatPercentage 
} from '../services/stockApi';
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
              <tr key={stock.ts_code} className="stock-row">
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

      {stocks.length === 0 && !loading && !error && (
        <div className="no-data">
          <p>暂无符合条件的股票数据</p>
        </div>
      )}
    </div>
  );
};

export default UndervaluedStocks;
