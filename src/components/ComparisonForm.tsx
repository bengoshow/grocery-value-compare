
import React, { useState } from 'react';
import { Item, Unit } from '@/utils/calculateBestValue';
import { cn } from '@/lib/utils';

interface ComparisonFormProps {
  onAddItem: (item: Item) => void;
  onClearItems: () => void;
  onCompare: () => void;
  itemCount: number;
}

const ComparisonForm: React.FC<ComparisonFormProps> = ({ 
  onAddItem, 
  onClearItems, 
  onCompare, 
  itemCount 
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [size, setSize] = useState('');
  const [unit, setUnit] = useState<Unit>('oz');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [formError, setFormError] = useState('');

  const units: { value: Unit; label: string }[] = [
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'count', label: 'Count/Items' },
  ];

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setSize('');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceValue = parseFloat(price);
    const quantityValue = parseInt(quantity, 10);
    const sizeValue = parseFloat(size);
    
    if (!name) {
      setFormError('Please enter a product name');
      return;
    }
    
    if (isNaN(priceValue) || priceValue <= 0) {
      setFormError('Please enter a valid price');
      return;
    }
    
    if (isNaN(quantityValue) || quantityValue <= 0) {
      setFormError('Please enter a valid quantity');
      return;
    }
    
    if (isNaN(sizeValue) || sizeValue <= 0) {
      setFormError('Please enter a valid size');
      return;
    }
    
    const newItem: Item = {
      id: `item-${Date.now()}`,
      name,
      price: priceValue,
      quantity: quantityValue,
      size: sizeValue,
      unit,
    };
    
    onAddItem(newItem);
    resetForm();
    
    // Auto-hide form after adding 2 or more items
    if (itemCount >= 1) {
      setIsFormVisible(false);
    }
  };

  const toggleForm = () => {
    setIsFormVisible(prev => !prev);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-900">Add Items to Compare</h2>
        <div className="flex space-x-2">
          {itemCount > 0 && (
            <>
              <button
                onClick={onClearItems}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Clear All
              </button>
              {itemCount >= 2 && (
                <button
                  onClick={onCompare}
                  className="px-4 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Compare
                </button>
              )}
            </>
          )}
          <button
            onClick={toggleForm}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors rounded-md w-8 h-8 flex items-center justify-center"
          >
            {isFormVisible ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="animate-scale-in">
          <div className="glass-morphism rounded-xl p-6 space-y-5">
            {formError && (
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm mb-4 animate-fade-in">
                {formError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="label-text">Product Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Brand X Beer"
                  className="input-field w-full"
                />
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="price" className="label-text">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="e.g., 12.99"
                  className="input-field w-full"
                />
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="quantity" className="label-text">Quantity (package count)</label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  placeholder="e.g., 6"
                  className="input-field w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="size" className="label-text">Size/Weight</label>
                  <input
                    id="size"
                    type="number"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    step="0.1"
                    min="0"
                    placeholder="e.g., 12"
                    className="input-field w-full"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="unit" className="label-text">Unit</label>
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    className="input-field w-full"
                  >
                    {units.map((unitOption) => (
                      <option key={unitOption.value} value={unitOption.value}>
                        {unitOption.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="btn-primary w-full md:w-auto"
              >
                Add Item
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ComparisonForm;
