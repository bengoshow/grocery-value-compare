
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ComparisonForm from '@/components/ComparisonForm';
import ResultCard from '@/components/ResultCard';
import { Item, calculateBestValue, ComparisonResult } from '@/utils/calculateBestValue';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Mark first render complete after mount
    setIsFirstRender(false);
    
    // Example items for first-time users
    if (window.location.search === '?demo') {
      const exampleItems: Item[] = [
        {
          id: 'example-1',
          name: '6-pack of 12oz beers',
          price: 12.99,
          quantity: 6,
          size: 12,
          unit: 'oz'
        },
        {
          id: 'example-2',
          name: '4-pack of 16oz beers',
          price: 10.99,
          quantity: 4,
          size: 16,
          unit: 'oz'
        }
      ];
      setItems(exampleItems);
      const result = calculateBestValue(exampleItems);
      setComparisonResult(result);
      setShowResults(true);
    }
  }, []);

  const handleAddItem = (item: Item) => {
    setItems(prevItems => [...prevItems, item]);
    setShowResults(false);
    
    toast({
      title: "Item added",
      description: `${item.name} has been added to the comparison.`,
      duration: 3000,
    });
  };

  const handleClearItems = () => {
    setItems([]);
    setComparisonResult(null);
    setShowResults(false);
    
    toast({
      title: "Cleared",
      description: "All items have been removed.",
      duration: 3000,
    });
  };

  const handleCompare = () => {
    if (items.length < 2) {
      toast({
        title: "Not enough items",
        description: "Please add at least 2 items to compare.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const result = calculateBestValue(items);
    setComparisonResult(result);
    setShowResults(true);
    
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Common unit label based on most used unit
  const getCommonUnitLabel = () => {
    if (!items.length) return 'oz';
    
    const unitCounts: { [key: string]: number } = {};
    items.forEach(item => {
      unitCounts[item.unit] = (unitCounts[item.unit] || 0) + 1;
    });
    
    // Find the most common unit
    let mostCommonUnit = 'oz';
    let highestCount = 0;
    
    Object.entries(unitCounts).forEach(([unit, count]) => {
      if (count > highestCount) {
        mostCommonUnit = unit;
        highestCount = count;
      }
    });
    
    return mostCommonUnit;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="max-w-5xl mx-auto pb-20">
        <div className={`pt-8 pb-6 px-4 sm:px-6 text-center ${!isFirstRender ? 'animate-fade-in' : ''}`}>
          <h2 className="text-sm uppercase font-medium text-blue-600 tracking-wider mb-2">
            Grocery Price Comparison
          </h2>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Find the Best Value
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compare prices, sizes, and quantities of different grocery items to find which one gives you the best value for your money.
          </p>
        </div>
        
        <ComparisonForm 
          onAddItem={handleAddItem}
          onClearItems={handleClearItems}
          onCompare={handleCompare}
          itemCount={items.length}
        />
        
        {items.length > 0 && !showResults && (
          <div className="px-4 py-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center text-blue-700 border border-blue-100 max-w-lg mx-auto animate-pulse">
              <p>You have {items.length} item{items.length > 1 ? 's' : ''} ready to compare</p>
              {items.length >= 2 && (
                <button 
                  onClick={handleCompare}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm"
                >
                  Compare Now
                </button>
              )}
            </div>
          </div>
        )}
        
        {showResults && comparisonResult && (
          <section id="results-section" className="px-4 py-8 animate-fade-in">
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-medium text-gray-900 mb-1">
                Comparison Results
              </h2>
              <p className="text-gray-600 mb-4">
                Comparing {items.length} items to find the best value
              </p>
              
              <div className="grid grid-cols-1 gap-6 mt-6">
                {comparisonResult.items.map((item, index) => (
                  <ResultCard
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    size={item.size}
                    unit={item.unit}
                    totalSize={item.totalSize}
                    pricePerUnit={item.pricePerUnit}
                    isBetterValue={item.isBetterValue}
                    savingsPercent={item.savingsPercent}
                    unitLabel={getCommonUnitLabel()}
                    index={index}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setShowResults(false)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Back to Form
              </button>
            </div>
          </section>
        )}
        
        {!items.length && !isFirstRender && (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center animate-fade-in">
            <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 10L15 10M9 14L12 14M12 7V7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Items to Compare
            </h3>
            <p className="text-gray-600 max-w-md mb-6">
              Add at least two items using the form above to see which one offers the better value.
            </p>
            <button
              onClick={() => window.location.href = '?demo'}
              className="px-4 py-2 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
            >
              Load Example Comparison
            </button>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-gray-500 text-sm">
        <div className="max-w-5xl mx-auto px-4">
          ValueCompare — Find the best deals effortlessly
        </div>
      </footer>
    </div>
  );
};

export default Index;
