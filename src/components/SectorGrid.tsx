import React from 'react';
import { Sector } from '../types/stock';
import SectorCard from './SectorCard';
import './SectorGrid.css';

interface SectorGridProps {
  sectors: Sector[];
}

const SectorGrid: React.FC<SectorGridProps> = ({ sectors }) => {
  return (
    <div className="sector-grid">
      {sectors.map((sector) => (
        <SectorCard key={sector.id} sector={sector} />
      ))}
    </div>
  );
};

export default SectorGrid;
