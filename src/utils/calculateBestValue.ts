
export type Unit = 'oz' | 'ml' | 'g' | 'lb' | 'kg' | 'count';

export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: number;
  unit: Unit;
}

export interface ComparisonResult {
  betterValueItemId: string | null;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: number;
    unit: Unit;
    totalSize: number;
    pricePerUnit: number;
    isBetterValue: boolean;
    savingsPercent: number | null;
  }[];
}

// Convert different units to a normalized value
const convertToBaseUnit = (size: number, unit: Unit): number => {
  switch (unit) {
    case 'oz': return size;
    case 'ml': return size / 29.5735; // ml to oz
    case 'g': return size / 28.3495; // g to oz
    case 'lb': return size * 16; // lb to oz
    case 'kg': return size * 35.274; // kg to oz
    case 'count': return size; 
    default: return size;
  }
};

export const calculateBestValue = (items: Item[]): ComparisonResult => {
  if (items.length === 0) {
    return { betterValueItemId: null, items: [] };
  }

  // Calculate total size and price per unit for each item
  const itemsWithCalculations = items.map(item => {
    const totalSize = convertToBaseUnit(item.size, item.unit) * item.quantity;
    const pricePerUnit = totalSize > 0 ? item.price / totalSize : Infinity;
    
    return {
      ...item,
      totalSize,
      pricePerUnit,
      isBetterValue: false,
      savingsPercent: null
    };
  });

  // Find the item with the lowest price per unit (best value)
  const lowestPricePerUnit = Math.min(...itemsWithCalculations.map(item => item.pricePerUnit));
  const betterValueItem = itemsWithCalculations.find(item => item.pricePerUnit === lowestPricePerUnit);
  const betterValueItemId = betterValueItem?.id || null;

  // Mark the best value item and calculate savings percentage for others
  const resultsWithComparison = itemsWithCalculations.map(item => {
    const isBetterValue = item.pricePerUnit === lowestPricePerUnit;
    const savingsPercent = isBetterValue 
      ? null 
      : ((item.pricePerUnit - lowestPricePerUnit) / item.pricePerUnit) * 100;
    
    return {
      ...item,
      isBetterValue,
      savingsPercent
    };
  });

  return {
    betterValueItemId,
    items: resultsWithComparison
  };
};
