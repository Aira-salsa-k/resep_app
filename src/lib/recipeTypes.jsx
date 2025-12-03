// types/recipeTypes.jsx - Type definitions for JavaScript
// These are just for reference since JavaScript doesn't have interfaces

// Recipe type definition
export const RecipeShape = {
  id: 'string',
  user_id: 'string',
  title: 'string',
  original_url: 'string or null',
  description: 'string or null',
  ingredients: 'string or null',
  cooking_steps: 'string or null',
  personal_notes: 'string or null',
  ingredient_category: 'string or null',
  cooking_method: 'string or null',
  thumbnail_url: 'string or null',
  is_manual: 'boolean',
  created_at: 'string',
  updated_at: 'string',
};

// Available categories and methods
export const INGREDIENT_CATEGORIES = [
  'Ayam', 'Ikan', 'Sayur', 'Daging', 'Tahu', 'Tempe', 'Sambal', 'Snack/Dessert', 'Lainnya'
];

export const COOKING_METHODS = [
  'Kukus', 'Rebus', 'Goreng', 'Tumis', 'Bakar', 'Panggang', 'Lainnya'
];