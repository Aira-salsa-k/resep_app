import React from 'react';
import { X, Filter, ChevronDown, Search} from 'lucide-react';
import { INGREDIENT_CATEGORIES, COOKING_METHODS } from '../lib/recipeTypes';




const FilterBar = ({ onFiltersChange, activeFilters, onClearFilters, searchTerm,
  onSearchChange }) => {
  const { selectedIngredient, selectedCookingMethod } = activeFilters;

  const handleIngredientChange = (e) => {
    onFiltersChange({
      selectedIngredient: e.target.value,
      selectedCookingMethod
    });
  };

  const handleCookingMethodChange = (e) => {
    onFiltersChange({
      selectedIngredient,
      selectedCookingMethod: e.target.value
    });
  };

  return (
    <div className="mb-6">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#626F47] flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </h2>
        {(selectedIngredient || selectedCookingMethod) && (
          <button 
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">

  {/* SEARCH */}
  <div className="md:col-span-2">
     <div className="h-5 mb-1"></div>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Cari resep…"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white"
      />
    </div>

    
  </div>

  {/* Ingredient Category */}
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Kategori Bahan
    </label>
    <div className="relative">
      <select
        value={selectedIngredient}
        onChange={handleIngredientChange}
        className="w-full p-2 pl-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#626F47] appearance-none"
      >
        <option value="">Semua Bahan</option>
        {INGREDIENT_CATEGORIES.map((ingredient) => (
          <option key={ingredient} value={ingredient}>
            {ingredient}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  </div>

  {/* Cooking Method */}
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Metode Masak
    </label>
    <div className="relative">
      <select
        value={selectedCookingMethod}
        onChange={handleCookingMethodChange}
        className="w-full p-2 pl-3 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#626F47] appearance-none"
      >
        <option value="">Semua Metode</option>
        {COOKING_METHODS.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  </div>
</div>


    </div>
  );
};

export default FilterBar;