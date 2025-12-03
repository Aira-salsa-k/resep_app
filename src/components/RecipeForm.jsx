import React, { useState, useEffect } from 'react';
import { X, Link, Edit3, Upload } from 'lucide-react';
import { INGREDIENT_CATEGORIES, COOKING_METHODS } from '../lib/recipeTypes';

const ingredientCategories = INGREDIENT_CATEGORIES;
const cookingMethods = COOKING_METHODS;

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const isEditing = !!recipe;
  const [isManual, setIsManual] = useState(recipe?.is_manual || false);
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    original_url: recipe?.original_url || '',
    description: recipe?.description || '',
    ingredients: recipe?.ingredients || '',
    cooking_steps: recipe?.cooking_steps || '',
    personal_notes: recipe?.personal_notes || '',
    ingredient_category: recipe?.ingredient_category || '',
    cooking_method: recipe?.cooking_method || '',
    thumbnail_url: recipe?.thumbnail_url || ''
  });

  // Update isManual when original_url changes
 
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Judul resep wajib diisi');
      return;
    }

    // For manual recipes, validate ingredients and steps
    if (isManual) {
      if (!formData.ingredients.trim()) {
        alert('Bahan-bahan wajib diisi untuk resep manual');
        return;
      }
      if (!formData.cooking_steps.trim()) {
        alert('Cara membuat wajib diisi untuk resep manual');
        return;
      }
    }

    // For link recipes, validate URL
    if (!isManual && formData.original_url) {
      try {
        new URL(formData.original_url);
      } catch {
        alert('URL tidak valid');
        return;
      }
    }

    onSave({
      ...formData,
      is_manual: isManual
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Resep' : 'Tambah Resep Baru'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Mode Toggle */}
          <div className="flex border rounded-lg p-1 bg-gray-50">
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                !isManual 
                  ? 'bg-white shadow-sm text-[#626F47]' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setIsManual(false);
               
              }}
            >
              <Link className="w-4 h-4" />
              Mode Link
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                isManual 
                  ? 'bg-white shadow-sm text-[#626F47]' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setIsManual(true);
                handleInputChange('original_url', '');
              }}
            >
              <Edit3 className="w-4 h-4" />
              Mode Manual
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Resep *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
              placeholder="Masukkan judul resep"
              required
            />
          </div>

          {/* URL Input (for link mode) */}
          {!isManual && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Sumber
              </label>
              <input
                type="url"
                value={formData.original_url}
                onChange={(e) => handleInputChange('original_url', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
                placeholder="https://example.com/resep"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
              rows="3"
              placeholder="Deskripsi singkat tentang resep ini"
            />
          </div>

          {/* Manual Recipe Fields */}
          {isManual && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bahan-bahan *
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange('ingredients', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
                  rows="4"
                  placeholder="Masukkan bahan-bahan, satu per baris&#10;Contoh:&#10;• 500g ayam potong&#10;• 3 siung bawang putih&#10;• 2 sdm kecap manis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cara Membuat *
                </label>
                <textarea
                  value={formData.cooking_steps}
                  onChange={(e) => handleInputChange('cooking_steps', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
                  rows="6"
                  placeholder="Masukkan langkah-langkah membuat resep&#10;Contoh:&#10;1. Cuci ayam hingga bersih&#10;2. Tumis bawang putih hingga harum&#10;3. Masukkan ayam, masak hingga matang"
                />
              </div>
            </>
          )}

          {/* Category and Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Bahan
              </label>
              <select
                value={formData.ingredient_category}
                onChange={(e) => handleInputChange('ingredient_category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
              >
                <option value="">Pilih kategori bahan</option>
                {ingredientCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cara Masak
              </label>
              <select
                value={formData.cooking_method}
                onChange={(e) => handleInputChange('cooking_method', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
              >
                <option value="">Pilih cara masak</option>
                {cookingMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Thumbnail
            </label>
            <input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan Pribadi
            </label>
            <textarea
              value={formData.personal_notes}
              onChange={(e) => handleInputChange('personal_notes', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
              rows="3"
              placeholder="Catatan pribadi tentang resep ini"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#626F47] text-white rounded-md hover:bg-[#4d5938] flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isEditing ? 'Update' : 'Simpan'} Resep
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;