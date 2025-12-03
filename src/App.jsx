import React, { useState, useEffect } from 'react';
import { useAuth } from './lib/authContext';
import { getRecipes, searchRecipes, deleteRecipe, createRecipe, getRecipeById, updateRecipe, getIngredientCategories, getCookingMethods, filterRecipesByIngredients, filterRecipesByCookingMethod } from './lib/recipeService';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import RecipeForm from './components/RecipeForm';
import FilterBar from './components/FilterBar';
import { AuthProvider } from './lib/authContext';
import Login from "./pages/login";

const AppContent = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [filters, setFilters] = useState({
    selectedIngredient: '',
    selectedCookingMethod: ''
  });
  const { user, loading: authLoading } = useAuth();

  // Fetch recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      let result;
      
      // Apply filters based on active filters
      if (filters.selectedIngredient && filters.selectedCookingMethod) {
        // If both filters are active, filter by both
        let baseResult;
        if (searchTerm) {
          baseResult = await searchRecipes(searchTerm);
        } else {
          baseResult = await getRecipes();
        }
        
        if (baseResult.error) {
          throw new Error(baseResult.error.message || 'Gagal mengambil data resep');
        }
        
        // Filter results by selected ingredient category
        let filteredRecipes = baseResult.data || [];
        if (filters.selectedIngredient) {
          filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.ingredient_category && 
            recipe.ingredient_category.toLowerCase().includes(filters.selectedIngredient.toLowerCase())
          );
        }
        
        // Then filter by cooking method
        if (filters.selectedCookingMethod) {
          filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.cooking_method && 
            recipe.cooking_method.toLowerCase().includes(filters.selectedCookingMethod.toLowerCase())
          );
        }
        
        result = { data: filteredRecipes, error: null };
      } else if (filters.selectedIngredient) {
        // Filter by ingredient category only
        if (searchTerm) {
          // First search, then filter by ingredient category
          const searchResult = await searchRecipes(searchTerm);
          if (searchResult.error) {
            throw new Error(searchResult.error.message || 'Gagal mengambil data resep');
          }
          
          const filteredRecipes = (searchResult.data || []).filter(recipe => 
            recipe.ingredient_category && 
            recipe.ingredient_category.toLowerCase().includes(filters.selectedIngredient.toLowerCase())
          );
          
          result = { data: filteredRecipes, error: null };
        } else {
          // Use the existing service function if available, otherwise filter in JS
          const allRecipesResult = await getRecipes();
          if (allRecipesResult.error) {
            throw new Error(allRecipesResult.error.message || 'Gagal mengambil data resep');
          }
          
          const filteredRecipes = (allRecipesResult.data || []).filter(recipe => 
            recipe.ingredient_category && 
            recipe.ingredient_category.toLowerCase().includes(filters.selectedIngredient.toLowerCase())
          );
          
          result = { data: filteredRecipes, error: null };
        }
      } else if (filters.selectedCookingMethod) {
        // Filter by cooking method only
        if (searchTerm) {
          // First search, then filter by cooking method
          const searchResult = await searchRecipes(searchTerm);
          if (searchResult.error) {
            throw new Error(searchResult.error.message || 'Gagal mengambil data resep');
          }
          
          const filteredRecipes = (searchResult.data || []).filter(recipe =>
            recipe.cooking_method && 
            recipe.cooking_method.toLowerCase().includes(filters.selectedCookingMethod.toLowerCase())
          );
          
          result = { data: filteredRecipes, error: null };
        } else {
          result = await filterRecipesByCookingMethod(filters.selectedCookingMethod);
        }
      } else {
        // No filters applied, normal search or get all
        if (searchTerm) {
          result = await searchRecipes(searchTerm);
        } else {
          result = await getRecipes();
        }
      }
      
      if (result.error) {
        throw new Error(result.error.message || 'Gagal mengambil data resep');
      }
      
      setRecipes(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipes when component mounts or when search term changes
  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user, searchTerm,filters]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle clearing filters
  const clearFilters = () => {
    setFilters({
      selectedIngredient: '',
      selectedCookingMethod: ''
    });
  };

  // Handle view toggle
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Handle adding new recipe
  const handleAddNew = () => {
    setEditingRecipe(null);
    setShowForm(true);
  };

  // Handle editing recipe
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  // Handle saving recipe (create or update)
  // const handleSave = async (recipeData) => {
  //   // For now, this will be handled by the parent component
  //   // In a real app, you would have an API call here
  //   setShowForm(false);
  //   setEditingRecipe(null);
  //   fetchRecipes(); // Refresh the list
  // };
  const handleSave = async (recipeData) => {
  try {
    let result;

    if (editingRecipe) {
      // UPDATE RESEP
      result = await updateRecipe(editingRecipe.id, recipeData);
    } else {
      // CREATE RESEP BARU
      result = await createRecipe(recipeData);
    }

    if (result.error) {
      throw new Error(result.error.message);
    }

    setShowForm(false);
    setEditingRecipe(null);
    fetchRecipes(); // Refresh the list
  } catch (err) {
    console.error("Error saving recipe:", err);
    alert("Gagal menyimpan resep: " + err.message);
  }
};


  // Handle deleting recipe
  const handleDelete = async (recipe) => {
    if (window.confirm(`Yakin ingin menghapus resep "${recipe.title}"?`)) {
      try {
        const result = await deleteRecipe(recipe.id);
        if (result.error) {
          throw new Error(result.error.message || 'Gagal menghapus resep');
        }
        fetchRecipes(); // Refresh the list
      } catch (err) {
        console.error('Error deleting recipe:', err);
        alert('Gagal menghapus resep: ' + err.message);
      }
    }
  };

  // Handle form close
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  // Show loading state while waiting for auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAE0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#626F47] mx-auto"></div>
          <p className="mt-4 text-[#626F47]">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-[#FEFAE0] flex items-center justify-center p-4">
  //       <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
  //         <h1 className="text-2xl font-bold text-[#626F47] mb-6">Recipe Saver</h1>
  //         <p className="text-gray-600 mb-6">Silakan login untuk mengelola resep Anda</p>
          
  //         <div className="space-y-4">
  //           <button
  //             onClick={() => window.location.reload()}
  //             className="w-full bg-[#626F47] text-white py-3 rounded-lg hover:bg-[#4d5938] transition-colors"
  //           >
  //             Refresh untuk Login
  //           </button>
  //           <p className="text-sm text-gray-500">
  //             Aplikasi ini menggunakan Supabase untuk autentikasi
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  if (!user) {
  return <Login />;
}

  return (
    <div className="min-h-screen bg-[#FEFAE0]">
      <Header
        onAddNew={handleAddNew}
        onViewToggle={toggleViewMode}
        currentView={viewMode}
        showSearch={false}  
      />

      <main className="container mx-auto px-4 py-6">
        <FilterBar 
          onFiltersChange={handleFiltersChange} 
          activeFilters={filters}
          onClearFilters={clearFilters}
           searchTerm={searchTerm}
          onSearchChange={handleSearch}
        />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#626F47]"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Belum ada resep</h2>
            <p className="text-gray-500 mb-6">Tambahkan resep pertama Anda untuk memulai</p>
            <button
              onClick={handleAddNew}
              className="bg-[#626F47] text-white px-6 py-3 rounded-lg hover:bg-[#4d5938] transition-colors"
            >
              Tambah Resep
            </button>
          </div>
        ) : (
          <>
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
              {recipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {showForm && (
        <RecipeForm
          recipe={editingRecipe}
          onSave={handleSave}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

function App() {
  return (
    
      <AppContent />
   
  );
}

export default App;