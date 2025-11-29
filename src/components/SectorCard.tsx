import React from 'react';
import { Sector } from '../types/stock';
import StockItem from './StockItem';
import './SectorCard.css';

interface SectorCardProps {
  sector: Sector;
}

const SectorCard: React.FC<SectorCardProps> = ({ sector }) => {
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

  return (
    <div className="sector-card">
      <div className="sector-header">
        <h3 className="sector-name">{sector.name}</h3>
        <p className="sector-description">{sector.description}</p>
        <div className="sector-stats">
          <div className="stat">
            <span className="stat-label">总成交量</span>
            <span className="stat-value">{formatNumber(sector.totalVolume)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">总市值</span>
            <span className="stat-value">¥{formatNumber(sector.totalMarketCap)}</span>
          </div>
        </div>
      </div>
      
      <div className="leading-stocks">
        <h4 className="stocks-title">龙头企业</h4>
        <div className="stocks-list">
          {sector.leadingStocks.map((stock) => (
            <StockItem key={stock.code} stock={stock} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorCard;
