// import React from 'react';
// import { CookingPot, Clock, User, Edit3, Trash2, ExternalLink } from 'lucide-react';
// import { useAuth } from '../lib/authContext';

// const RecipeCard = ({ recipe, onEdit, onDelete, viewMode = 'grid' }) => {
//   const { user } = useAuth();
  
//   // Check if the current user owns this recipe
//   const isOwner = user && user.id === recipe.user_id;

//   const handleEdit = (e) => {
//     e.stopPropagation();
//     if (onEdit) onEdit(recipe);
//   };

//   const handleDelete = (e) => {
//     e.stopPropagation();
//     if (onDelete) onDelete(recipe);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('id-ID', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // Render recipe content based on type (manual or link)
//   const renderRecipeContent = () => {
//     if (recipe.is_manual || !recipe.original_url) {
//       // Manual recipe - show ingredients and steps
//       return (
//         <div className="space-y-2">
//           {recipe.ingredients && (
//             <div>
//               <h4 className="font-semibold text-[#626F47] flex items-center gap-1">
//                 <CookingPot className="w-4 h-4" /> Bahan-bahan:
//               </h4>
//               <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">
//                 {recipe.ingredients}
//               </p>
//             </div>
//           )}
//           {recipe.cooking_steps && (
//             <div>
//               <h4 className="font-semibold text-[#626F47]">Cara Membuat:</h4>
//               <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">
//                 {recipe.cooking_steps}
//               </p>
//             </div>
//           )}
//         </div>
//       );
//     } else {
//       // Link recipe - show source link
//       return (
//         <div className="flex flex-col h-full">
//         {/* konten lain di atas */}

//         <div className="mt-auto flex justify-end py-4">
//           <a
//             href={recipe.original_url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-2 text-[#626F47] hover:text-[#A4B465] font-medium"
//           >
            
//             Lihat Resep
//             <ExternalLink className="w-4 h-4" />
//           </a>
//         </div>
//       </div>

//       );
//     }
//   };

//   // Determine thumbnail URL
//   const thumbnailUrl = recipe.thumbnail_url || '/placeholder-recipe.jpg';

//   if (viewMode === 'list') {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow flex">
//         <div className="w-24 h-24 flex-shrink-0 mr-4">
//           <img
//             src={thumbnailUrl}
//             alt={recipe.title}
//             className="w-full h-full object-cover rounded-lg"
//             onError={(e) => {
//               e.target.src = '/placeholder-recipe.jpg';
//             }}
//           />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-start mb-2">
//             <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
//             {isOwner && (
//               <div className="flex gap-1 ml-2">
//                 <button
//                   onClick={handleEdit}
//                   className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                 >
//                   <Edit3 className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="p-1 text-red-600 hover:bg-red-100 rounded"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </div>
          
//           {recipe.description && (
//             <p className="text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>
//           )}
          
//           <div className="flex flex-wrap gap-2 mb-2">
//             {recipe.ingredient_category && (
//               <span className="bg-[#A4B465] text-white px-2 py-1 rounded-full text-xs">
//                 {recipe.ingredient_category}
//               </span>
//             )}
//             {recipe.cooking_method && (
//               <span className="bg-[#FFCF50] text-[#626F47] px-2 py-1 rounded-full text-xs">
//                 {recipe.cooking_method}
//               </span>
//             )}
//           </div>
          
//           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//             <span className="flex items-center gap-1">
//               <Clock className="w-4 h-4" />
//               {formatDate(recipe.created_at)}
//             </span>
//             <span className="flex items-center gap-1">
//               <User className="w-4 h-4" />
//               Anda
//             </span>
//           </div>
          
//           {renderRecipeContent()}
//         </div>
//       </div>
//     );
//   }

//   // Grid view
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
//       <div className="relative">
//         <img
//           src={thumbnailUrl}
//           alt={recipe.title}
//           className="w-full h-48 object-cover"
//           onError={(e) => {
//             e.target.src = '/placeholder-recipe.jpg';
//           }}
//         />
//         {isOwner && (
//           <div className="absolute top-2 right-2 flex gap-1">
//             <button
//               onClick={handleEdit}
//               className="p-1.5 bg-white bg-opacity-80 text-blue-600 rounded-full hover:bg-opacity-100"
//             >
//               <Edit3 className="w-4 h-4" />
//             </button>
//             <button
//               onClick={handleDelete}
//               className="p-1.5 bg-white bg-opacity-80 text-red-600 rounded-full hover:bg-opacity-100"
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         )}
//       </div>
      
//       <div className="p-4 flex flex-col flex-1">
//           <div className="flex flex-wrap gap-2 mb-3">
//           {recipe.ingredient_category && (
//             <span className="bg-[#A4B465] text-white px-2 py-1 rounded-full text-xs">
//               {recipe.ingredient_category}
//             </span>
//           )}
//           {recipe.cooking_method && (
//             <span className="bg-[#FFCF50] text-[#626F47] px-2 py-1 rounded-full text-xs">
//               {recipe.cooking_method}
//             </span>
//           )}
//         </div>
//         <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{recipe.title}</h3>
        
        
//         {recipe.description && (
//           <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
//         )}
        
      
        
//         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
//           <span className="flex items-center gap-1">
//             <Clock className="w-4 h-4" />
//             {formatDate(recipe.created_at)}
//           </span>
//         </div>
        
//         <div className="mt-auto">
//           {renderRecipeContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecipeCard;

import React, { useState } from 'react';
import { Clock, User, Edit3, Trash2, ExternalLink, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../lib/authContext';

const RecipeCard = ({ recipe, onEdit, onDelete, viewMode = 'grid' }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
  const isOwner = user && user.id === recipe.user_id;

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(recipe);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(recipe);
  };

  const openModal = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation();
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Determine thumbnail URL
  const thumbnailUrl = recipe.thumbnail_url || '/placeholder-recipe.jpg';

  // Modal for detailed view
  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
        <div 
          className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Thumbnail */}
            <div className="aspect-video mb-6">
              <img
                src={thumbnailUrl}
                alt={recipe.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-recipe.jpg';
                }}
              />
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDate(recipe.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>Anda</span>
              </div>
              {recipe.ingredient_category && (
                <span className="bg-[#A4B465] text-white px-3 py-1 rounded-full text-sm">
                  {recipe.ingredient_category}
                </span>
              )}
              {recipe.cooking_method && (
                <span className="bg-[#FFCF50] text-[#626F47] px-3 py-1 rounded-full text-sm">
                  {recipe.cooking_method}
                </span>
              )}
            </div>
            
            {/* Description */}
            {recipe.description && (
              <div className="mb-6">
                <h4 className="font-semibold text-[#626F47] mb-2">Deskripsi:</h4>
                <p className="text-gray-700 whitespace-pre-line">{recipe.description}</p>
              </div>
            )}
            
            {/* Ingredients (only for manual recipes) */}
            {recipe.is_manual && recipe.ingredients && (
              <div className="mb-6">
                <h4 className="font-semibold text-[#626F47] mb-2">Bahan-bahan:</h4>
                <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                  {recipe.ingredients}
                </div>
              </div>
            )}
            
            {/* Cooking Steps (only for manual recipes) */}
            {recipe.is_manual && recipe.cooking_steps && (
              <div className="mb-6">
                <h4 className="font-semibold text-[#626F47] mb-2">Cara Membuat:</h4>
                <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                  {recipe.cooking_steps}
                </div>
              </div>
            )}
            
            {/* Personal Notes */}
            {recipe.personal_notes && (
              <div className="mb-6">
                <h4 className="font-semibold text-[#626F47] mb-2">Catatan Pribadi:</h4>
                <p className="text-gray-700 whitespace-pre-line bg-blue-50 p-4 rounded-lg">{recipe.personal_notes}</p>
              </div>
            )}
            
            {/* External Link for link recipes */}
            {!recipe.is_manual && recipe.original_url && (
              <div className="mt-6 pt-6 border-t">
                <a
                  href={recipe.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#626F47] text-white rounded-md hover:bg-[#4d5938]"
                >
                  Kunjungi Sumber Resep
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-4">
            <div className="flex">
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
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(recipe.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Anda
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={openModal}
                    className="flex items-center gap-1 text-sm text-[#626F47] hover:text-[#A4B465]"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Baca Selengkapnya
                  </button>
                  
                  {!recipe.is_manual && recipe.original_url && (
                    <a
                      href={recipe.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Lihat Sumber
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {renderModal()}
      </>
    );
  }

  // Grid view
  return (
    <>
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
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(recipe.created_at)}
            </span>
          </div>
          
         <div className="mt-auto flex items-center justify-between gap-2">

            {/* Tombol kiri (besar) */}
            <button
              onClick={openModal}
              className="flex-1 py-2 text-[#626F47] hover:text-[#A4B465] font-medium flex items-center justify-center gap-1 border border-[#A4B465] rounded-md hover:bg-[#A4B465]/10"
            >
              <ChevronDown className="w-4 h-4" />
              Baca Selengkapnya
            </button>

            {/* Tombol kanan kecil */}
            {!recipe.is_manual && recipe.original_url && (
              <a
                href={recipe.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#626F47] text-white rounded-md hover:bg-[#4d5938] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

        </div>
      </div>
      
      {renderModal()}
    </>
  );
};

export default RecipeCard;