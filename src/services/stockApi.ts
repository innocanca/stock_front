// 股票API服务
export interface StockData {
  ts_code: string;
  name: string;
  total_mv_10k: number;
  pe_ttm: number;
  current_close: number;
  weekly_last_close: number;
  avg_close_1y: number;
}

export interface StockApiResponse {
  count: number;
  data: StockData[];
}

export interface ProcessedStockData extends StockData {
  price_diff: number; // current_close - avg_close_1y
  price_diff_percent: number; // 价格差值百分比
}

// 价格 & 成交量数据类型
export interface PriceVolumePoint {
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
  amount: number;
}

export interface PriceVolumeResponse {
  ts_code: string;
  count: number;
  data: PriceVolumePoint[];
}

export interface WeeklyVolumeSurgeData {
  ts_code: string;
  名称: string;
  "市值(亿)": number;
  "PE(TTM)": number | null;
  现价: number;
  周放量倍数: number;
  是否刚启动: boolean;
  "最近周涨跌幅%": number;
  最近周线日期: string;
}

export interface WeeklyVolumeSurgeResponse {
  count: number;
  data: WeeklyVolumeSurgeData[];
}

const API_BASE_URL = 'http://8.138.97.142:8000';

/**
 * 获取低估市值股票数据
 */
export const fetchLargCapBelowAvgPrice = async (
  min_mv: number = 10000000,
  max_pe: number = 30.0
): Promise<ProcessedStockData[]> => {
  try {
    const url = `${API_BASE_URL}/large_cap_below_1y_avg_price?min_mv=${min_mv}&max_pe=${max_pe}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: StockApiResponse = await response.json();
    
    // 处理数据，计算价格差值并排序
    const processedData: ProcessedStockData[] = result.data.map(stock => {
      const price_diff = stock.current_close - stock.avg_close_1y;
      const price_diff_percent = (price_diff / stock.avg_close_1y) * 100;
      
      return {
        ...stock,
        price_diff,
        price_diff_percent
      };
    });
    
    // 按价格差值排序（差值越大越靠前，即最被低估的股票在前面）
    processedData.sort((a, b) => Math.abs(b.price_diff) - Math.abs(a.price_diff));
    
    return processedData;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    throw error;
  }
};

/**
 * 获取单只股票近一年价格 & 成交量数据
 */
export const fetchPriceVolume1Y = async (
  tsCode: string
): Promise<PriceVolumePoint[]> => {
  try {
    const url = `${API_BASE_URL}/price_volume_1y?ts_code=${encodeURIComponent(
      tsCode
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: PriceVolumeResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch price & volume data:', error);
    throw error;
  }
};

/**
 * 获取主板周线放量数据
 */
export const fetchWeeklyVolumeSurge = async (): Promise<WeeklyVolumeSurgeData[]> => {
  try {
    const url = `${API_BASE_URL}/low_pe_volume_surge`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: WeeklyVolumeSurgeResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch weekly volume surge data:', error);
    throw error;
  }
};

/**
 * 格式化市值显示（万元转换为亿元）
 */
export const formatMarketValue = (totalMv: number): string => {
  const billions = totalMv / 10000;
  return `${billions.toFixed(0)}亿`;
};

/**
 * 格式化价格差值
 */
export const formatPriceDiff = (diff: number): string => {
  const prefix = diff >= 0 ? '+' : '';
  return `${prefix}${diff.toFixed(2)}`;
};

/**
 * 格式化百分比
 */
export const formatPercentage = (percent: number): string => {
  const prefix = percent >= 0 ? '+' : '';
  return `${prefix}${percent.toFixed(2)}%`;
};
