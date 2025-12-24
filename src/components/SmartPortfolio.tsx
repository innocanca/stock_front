import React, { useState, useEffect } from 'react';
import {
  SmartPortfolioItem,
  SmartPortfolioResponse,
  fetchSmartPortfolio,
  fetchPriceVolume1Y,
  PriceVolumePoint,
} from '../services/stockApi';
import StockPriceVolumeChart from './StockPriceVolumeChart';
import './SmartPortfolio.css';

const SmartPortfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<SmartPortfolioResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(5);
  
  const [selectedTsCode, setSelectedTsCode] = useState<string | null>(null);
  const [selectedStockName, setSelectedStockName] = useState<string>('');
  const [chartData, setChartData] = useState<PriceVolumePoint[] | null>(null);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);

  const loadPortfolio = async (currentLimit: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSmartPortfolio(currentLimit);
      setPortfolio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取组合数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio(limit);
  }, []);

  const handleRefresh = () => {
    loadPortfolio(limit);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    loadPortfolio(newLimit);
  };

  const handleSelectStock = async (stock: SmartPortfolioItem) => {
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

  if (loading && !portfolio) {
    return (
      <div className="smart-portfolio loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>正在生成智能投资组合...</p>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="smart-portfolio error">
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
    <div className="smart-portfolio">
      <div className="portfolio-header">
        <div className="header-title">
          <h2>智能投资组合</h2>
          {portfolio && (
            <span className="diversification-tag">{portfolio.diversification}</span>
          )}
        </div>
        <div className="header-controls">
          <div className="limit-selector">
            <label htmlFor="limit-select">组合规模:</label>
            <select 
              id="limit-select" 
              value={limit} 
              onChange={handleLimitChange}
              disabled={loading}
            >
              <option value={3}>3 只股票</option>
              <option value={5}>5 只股票 (默认)</option>
              <option value={8}>8 只股票</option>
              <option value={10}>10 只股票</option>
            </select>
          </div>
          <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
            {loading ? '🔄 加载中...' : '🔄 重新生成'}
          </button>
        </div>
      </div>

      <div className="portfolio-intro">
        <p>基于多因子量化模型，为您精选当前最具投资价值的股票组合。点击行可查看详细 K 线分析。</p>
      </div>

      <div className="portfolio-grid">
        {portfolio?.data.map((item, index) => (
          <div 
            key={item.ts_code} 
            className="portfolio-card"
            onClick={() => handleSelectStock(item)}
          >
            <div className="card-rank">#{index + 1}</div>
            <div className="card-main">
              <div className="stock-info">
                <span className="stock-name">{item.名称}</span>
                <span className="stock-code">{item.ts_code}</span>
              </div>
              <div className="strategy-tag">{item.策略标签}</div>
            </div>
            <div className="card-details">
              <div className="detail-item">
                <span className="label">行业</span>
                <span className="value">{item.行业}</span>
              </div>
              <div className="detail-item">
                <span className="label">核心指标</span>
                <span className="value highlight">{item.核心指标}</span>
              </div>
            </div>
            <div className="card-footer">
              <div className="score-box">
                <span className="score-label">权重分数</span>
                <span className="score-value">{item.权重分数.toFixed(1)}</span>
              </div>
              <div className="score-bar-container">
                <div 
                  className="score-bar" 
                  style={{ width: `${Math.min(item.权重分数, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
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
                  <p>正在加载走势图...</p>
                </div>
              )}

              {!chartLoading && chartError && (
                <div className="stock-chart-error">
                  <p>获取走势图失败：{chartError}</p>
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

      {portfolio?.data.length === 0 && !loading && !error && (
        <div className="no-data">
          <p>暂无符合条件的投资组合</p>
        </div>
      )}
    </div>
  );
};

export default SmartPortfolio;

