import React from 'react';
import { Stock } from '../types/stock';
import './StockItem.css';

interface StockItemProps {
  stock: Stock;
}

const StockItem: React.FC<StockItemProps> = ({ stock }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getChangeClass = (change: number) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className="stock-item">
      <div className="stock-info">
        <div className="stock-main">
          <span className="stock-name">{stock.name}</span>
          <span className="stock-code">({stock.code})</span>
        </div>
        <div className="stock-metrics">
          <span className="stock-volume">成交量: {formatNumber(stock.volume)}</span>
          <span className="stock-market-cap">市值: ¥{formatNumber(stock.marketCap)}</span>
        </div>
      </div>
      
      <div className="stock-price">
        <div className="price-main">
          <span className="current-price">¥{stock.price.toFixed(2)}</span>
        </div>
        <div className={`price-change ${getChangeClass(stock.change)}`}>
          <span className="change-value">
            {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
          </span>
          <span className="change-percent">
            ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockItem;
