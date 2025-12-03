// import { supabase } from './supabaseClient';
// import { Recipe, RecipeFormData } from './recipeTypes';

// // Get all recipes for the current user
// export const getRecipes = async (): Promise<{ data: Recipe[] | null; error: any }> => {
//   const { data, error } = await supabase
//     .from('recipes')
//     .select('*')
//     .order('created_at', { ascending: false });

//   return { data, error };
// };

// // Search recipes by title, description, or ingredients
// export const searchRecipes = async (searchTerm: string): Promise<{ data: Recipe[] | null; error: any }> => {
//   if (!searchTerm) {
//     return getRecipes();
//   }

//   const { data, error } = await supabase
//     .from('recipes')
//     .select('*')
//     .or(
//       `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ingredients.ilike.%${searchTerm}%`
//     )
//     .order('created_at', { ascending: false });

//   return { data, error };
// };

// // Get a single recipe by ID
// export const getRecipeById = async (id: string): Promise<{ data: Recipe | null; error: any }> => {
//   const { data, error } = await supabase
//     .from('recipes')
//     .select('*')
//     .eq('id', id)
//     .single();

//   return { data, error };
// };

// // Create a new recipe
// export const createRecipe = async (recipeData: RecipeFormData): Promise<{ data: Recipe | null; error: any }> => {
//   // Determine if this is a manual recipe based on whether original_url is provided
//   const isManual = !recipeData.original_url || recipeData.original_url.trim() === '';
  
//   const { data, error } = await supabase
//     .from('recipes')
//     .insert([
//       {
//         ...recipeData,
//         is_manual: isManual,
//         user_id: (await supabase.auth.getUser()).data.user?.id
//       }
//     ])
//     .select()
//     .single();

//   return { data, error };
// };

// // Update an existing recipe
// export const updateRecipe = async (id: string, recipeData: Partial<RecipeFormData>): Promise<{ data: Recipe | null; error: any }> => {
//   const isManual = !recipeData.original_url || recipeData.original_url.trim() === '';
  
//   const { data, error } = await supabase
//     .from('recipes')
//     .update({
//       ...recipeData,
//       is_manual: isManual,
//       updated_at: new Date().toISOString()
//     })
//     .eq('id', id)
//     .select()
//     .single();

//   return { data, error };
// };

// // Delete a recipe
// export const deleteRecipe = async (id: string): Promise<{ error: any }> => {
//   const { error } = await supabase
//     .from('recipes')
//     .delete()
//     .eq('id', id);

//   return { error };
// };

// // Get unique ingredient categories for the current user
// export const getIngredientCategories = async (): Promise<{ data: string[] | null; error: any }> => {
//   const { data, error } = await supabase
//     .from('recipes')
//     .select('ingredient_category')
//     .not('ingredient_category', 'is', null)
//     .order('ingredient_category');

//   if (error) {
//     return { data: null, error };
//   }

//   // Extract unique categories
//   const categories = Array.from(
//     new Set(data?.map(item => item.ingredient_category).filter(Boolean) as string[])
//   );

//   return { data: categories, error: null };
// };

// // Get unique cooking methods for the current user
// export const getCookingMethods = async (): Promise<{ data: string[] | null; error: any }> => {
//   const { data, error } = await supabase
//     .from('recipes')
//     .select('cooking_method')
//     .not('cooking_method', 'is', null)
//     .order('cooking_method');

//   if (error) {
//     return { data: null, error };
//   }

//   // Extract unique methods
//   const methods = Array.from(
//     new Set(data?.map(item => item.cooking_method).filter(Boolean) as string[])
//   );

//   return { data: methods, error: null };
// };

//////////////////////

import { supabase } from './supabaseClient';

// Get all recipes for the current user
export const getRecipes = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Search recipes by title, description, or ingredients
export const searchRecipes = async (searchTerm) => {
  if (!searchTerm) return getRecipes();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ingredients.ilike.%${searchTerm}%`
    )
    .order('created_at', { ascending: false });

  return { data, error };
};

// Get a single recipe by ID
export const getRecipeById = async (id) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

// Create a new recipe
export const createRecipe = async (recipeData) => {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    return { data: null, error: "User not logged in" };
  }

  // Add default thumbnail if no thumbnail is provided
  const recipeDataWithDefaultThumbnail = {
    ...recipeData,
    thumbnail_url: recipeData.thumbnail_url || '/images/default-recipe.jpg' // Default thumbnail path
  };

  const isManual = !recipeData.original_url || recipeData.original_url.trim() === '';

  const { data, error } = await supabase
    .from('recipes')
    .insert([
      {
        ...recipeDataWithDefaultThumbnail,
        is_manual: isManual,
        user_id: user.id,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  return { data, error };
};


// Update an existing recipe
export const updateRecipe = async (id, recipeData) => {
  // Add default thumbnail if no thumbnail is provided during update
  const recipeDataWithDefaultThumbnail = {
    ...recipeData,
    thumbnail_url: recipeData.thumbnail_url || '/images/default-recipe.jpg' // Default thumbnail path
  };

  const isManual = !recipeData.original_url || recipeData.original_url.trim() === '';

  const { data, error } = await supabase
    .from('recipes')
    .update({
      ...recipeDataWithDefaultThumbnail,
      is_manual: isManual,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  return { error };
};

// Ingredient categories (unique)
export const getIngredientCategories = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('ingredient_category')
    .not('ingredient_category', 'is', null)
    .order('ingredient_category');

  if (error) return { data: null, error };

  const categories = Array.from(
    new Set(data?.map(item => item.ingredient_category).filter(Boolean))
  );

  return { data: categories, error: null };
};

// Cooking methods (unique)
export const getCookingMethods = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('cooking_method')
    .not('cooking_method', 'is', null)
    .order('cooking_method');

  if (error) return { data: null, error };

  const methods = Array.from(
    new Set(data?.map(item => item.cooking_method).filter(Boolean))
  );

  return { data: methods, error: null };
};

// Filter recipes by processed ingredients
export const filterRecipesByIngredients = async (ingredientList) => {
  if (!ingredientList || ingredientList.length === 0) {
    return getRecipes();
  }

  // Create a filter string for each ingredient
  const filters = ingredientList.map(ingredient => 
    `ingredients.ilike.%${ingredient}%`
  ).join(',');

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .or(filters)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Filter recipes by cooking method
export const filterRecipesByCookingMethod = async (cookingMethod) => {
  if (!cookingMethod) {
    return getRecipes();
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .ilike('cooking_method', cookingMethod)
    .order('created_at', { ascending: false });

  return { data, error };
};
