import React, { useState, useEffect } from 'react';
import {
  EtfVolumeSurgeData,
  fetchEtfVolumeSurge,
  fetchPriceVolume1Y,
  PriceVolumePoint,
} from '../services/stockApi';
import StockPriceVolumeChart from './StockPriceVolumeChart';
import './EtfVolumeSurge.css';

const EtfVolumeSurge: React.FC = () => {
  const [etfs, setEtfs] = useState<EtfVolumeSurgeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTsCode, setSelectedTsCode] = useState<string | null>(null);
  const [selectedEtfName, setSelectedEtfName] = useState<string>('');
  const [chartData, setChartData] = useState<PriceVolumePoint[] | null>(null);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);

  // 筛选参数状态
  const [minRatio, setMinRatio] = useState<number>(1.5);
  const [lookbackWeeks, setLookbackWeeks] = useState<number>(3);
  const [minAmount, setMinAmount] = useState<number>(1.0);

  const loadEtfData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEtfVolumeSurge(minRatio, lookbackWeeks, minAmount);
      setEtfs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEtfData();
  }, []);

  const handleRefresh = () => {
    loadEtfData();
  };

  const handleSelectEtf = async (etf: EtfVolumeSurgeData) => {
    setSelectedTsCode(etf.ts_code);
    setSelectedEtfName(etf.名称);
    setChartLoading(true);
    setChartError(null);
    setChartData(null);
    setIsChartModalOpen(true);

    try {
      const data = await fetchPriceVolume1Y(etf.ts_code);
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

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="etf-volume-surge loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>正在获取 ETF 放量策略数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="etf-volume-surge error">
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
    <div className="etf-volume-surge">
      <div className="stocks-header">
        <h2>ETF 周线放量策略</h2>
        <div className="header-info">
          <span className="stock-count">共找到 {etfs.length} 只 ETF</span>
          <button onClick={handleRefresh} className="refresh-button">
            🔄 刷新数据
          </button>
        </div>
      </div>

      <div className="filter-info">
        <span>筛选条件: 周线放量倍数 ≥ {minRatio}, 回看周数: {lookbackWeeks}, 最近一周成交额 ≥ {minAmount} 亿元</span>
      </div>

      <div className="stocks-table-container">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>代码</th>
              <th>名称</th>
              <th>周放量倍数</th>
              <th>最近一周成交额(亿)</th>
              <th>最近一周成交量(手)</th>
              <th>过去{lookbackWeeks}周最大成交量(手)</th>
              <th>截止日期</th>
            </tr>
          </thead>
          <tbody>
            {etfs.map((etf, index) => (
              <tr
                key={etf.ts_code}
                className={`stock-row ${
                  selectedTsCode === etf.ts_code ? 'selected' : ''
                }`}
                onClick={() => handleSelectEtf(etf)}
              >
                <td className="rank">{index + 1}</td>
                <td className="stock-code">{etf.ts_code}</td>
                <td className="stock-name">{etf.名称}</td>
                <td className="volume-multiplier highlight">{etf.周放量倍数.toFixed(2)}</td>
                <td className="amount-yi">¥{etf["最近一周成交额(亿元)"].toFixed(2)}</td>
                <td className="volume-hands">{formatLargeNumber(etf["最近一周成交量(手)"])}</td>
                <td className="max-volume-hands">{formatLargeNumber(etf["过去3周最大周成交量(手)"])}</td>
                <td className="date">{etf.最近周线截止日}</td>
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
                  {selectedEtfName}（{selectedTsCode}）
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
                  <p>正在加载 ETF 走势图...</p>
                </div>
              )}

              {!chartLoading && chartError && (
                <div className="stock-chart-error">
                  <p>获取 ETF 走势图失败：{chartError}</p>
                </div>
              )}

              {!chartLoading && !chartError && chartData && (
                <StockPriceVolumeChart
                  data={chartData}
                  stockName={selectedEtfName}
                  tsCode={selectedTsCode}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {etfs.length === 0 && !loading && !error && (
        <div className="no-data">
          <p>暂无符合条件的 ETF 数据</p>
        </div>
      )}
    </div>
  );
};

export default EtfVolumeSurge;

