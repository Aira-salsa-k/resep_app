import React from 'react';
import { CookingPot, Clock, User, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../lib/authContext';

const RecipeCard = ({ recipe, onEdit, onDelete, viewMode = 'grid' }) => {
  const { user } = useAuth();
  
  // Check if the current user owns this recipe
  const isOwner = user && user.id === recipe.user_id;

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(recipe);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(recipe);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Render recipe content based on type (manual or link)
  const renderRecipeContent = () => {
    if (recipe.is_manual || !recipe.original_url) {
      // Manual recipe - show ingredients and steps
      return (
        <div className="space-y-2">
          {recipe.ingredients && (
            <div>
              <h4 className="font-semibold text-[#626F47] flex items-center gap-1">
                <CookingPot className="w-4 h-4" /> Bahan-bahan:
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">
                {recipe.ingredients}
              </p>
            </div>
          )}
          {recipe.cooking_steps && (
            <div>
              <h4 className="font-semibold text-[#626F47]">Cara Membuat:</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">
                {recipe.cooking_steps}
              </p>
            </div>
          )}
        </div>
      );
    } else {
      // Link recipe - show source link
      return (
        <div className="flex flex-col h-full">
        {/* konten lain di atas */}

        <div className="mt-auto flex justify-end py-4">
          <a
            href={recipe.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#626F47] hover:text-[#A4B465] font-medium"
          >
            
            Lihat Resep
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      );
    }
  };

  // Determine thumbnail URL
  const thumbnailUrl = recipe.thumbnail_url || '/placeholder-recipe.jpg';

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow flex">
        <div className="w-24 h-24 flex-shrink-0 mr-4">
          <img
            src={thumbnailUrl}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/placeholder-recipe.jpg';
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
            {isOwner && (
              <div className="flex gap-1 ml-2">
                <button
                  onClick={handleEdit}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {recipe.description && (
            <p className="text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.ingredient_category && (
              <span className="bg-[#A4B465] text-white px-2 py-1 rounded-full text-xs">
                {recipe.ingredient_category}
              </span>
            )}
            {recipe.cooking_method && (
              <span className="bg-[#FFCF50] text-[#626F47] px-2 py-1 rounded-full text-xs">
                {recipe.cooking_method}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(recipe.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Anda
            </span>
          </div>
          
          {renderRecipeContent()}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={recipe.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-recipe.jpg';
          }}
        />
        {isOwner && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={handleEdit}
              className="p-1.5 bg-white bg-opacity-80 text-blue-600 rounded-full hover:bg-opacity-100"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 bg-white bg-opacity-80 text-red-600 rounded-full hover:bg-opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
          {recipe.ingredient_category && (
            <span className="bg-[#A4B465] text-white px-2 py-1 rounded-full text-xs">
              {recipe.ingredient_category}
            </span>
          )}
          {recipe.cooking_method && (
            <span className="bg-[#FFCF50] text-[#626F47] px-2 py-1 rounded-full text-xs">
              {recipe.cooking_method}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{recipe.title}</h3>
        
        
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        )}
        
      
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(recipe.created_at)}
          </span>
        </div>
        
        <div className="mt-auto">
          {renderRecipeContent()}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;