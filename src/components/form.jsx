// import React, { useState, useEffect } from 'react';
// import { X, Link, Edit3, Upload } from 'lucide-react';
// import { INGREDIENT_CATEGORIES, COOKING_METHODS } from '../lib/recipeTypes';

// const ingredientCategories = INGREDIENT_CATEGORIES;
// const cookingMethods = COOKING_METHODS;

// const RecipeForm = ({ recipe, onSave, onCancel }) => {
//   const isEditing = !!recipe;
//   const [isManual, setIsManual] = useState(recipe?.is_manual || false);
//   const [formData, setFormData] = useState({
//     title: recipe?.title || '',
//     original_url: recipe?.original_url || '',
//     description: recipe?.description || '',
//     ingredients: recipe?.ingredients || '',
//     cooking_steps: recipe?.cooking_steps || '',
//     personal_notes: recipe?.personal_notes || '',
//     ingredient_category: recipe?.ingredient_category || '',
//     cooking_method: recipe?.cooking_method || '',
//     thumbnail_url: recipe?.thumbnail_url || ''
//   });

//   // Update isManual when original_url changes
 
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!formData.title.trim()) {
//       alert('Judul resep wajib diisi');
//       return;
//     }

//     // For manual recipes, validate ingredients and steps
//     if (isManual) {
//       if (!formData.ingredients.trim()) {
//         alert('Bahan-bahan wajib diisi untuk resep manual');
//         return;
//       }
//       if (!formData.cooking_steps.trim()) {
//         alert('Cara membuat wajib diisi untuk resep manual');
//         return;
//       }
//     }

//     // For link recipes, validate URL
//     if (!isManual && formData.original_url) {
//       try {
//         new URL(formData.original_url);
//       } catch {
//         alert('URL tidak valid');
//         return;
//       }
//     }

//     onSave({
//       ...formData,
//       is_manual: isManual
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-xl font-semibold">
//             {isEditing ? 'Edit Resep' : 'Tambah Resep Baru'}
//           </h2>
//           <button
//             onClick={onCancel}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 space-y-4">

//           {/* Mode Toggle */}
//          <div className="flex items-center justify-end w-full">
//           <div className="flex items-center gap-2 border rounded-lg p-1 bg-gray-50">
//             <button
//               type="button"
//               onClick={() => setIsManual(false)}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
//                 !isManual
//                   ? "bg-[#FFCF50] text-[#626F47] shadow-sm"   // aktif: warna terang
//                   : "bg-gray-200 text-gray-600 hover:bg-gray-300" // tidak aktif: abu-abu
//               }`}
//             >
//               <Link className="w-4 h-4" />
//               <span className="leading-none">Mode Link</span>
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setIsManual(true);
//                 handleInputChange("original_url", "");
//               }}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
//                 isManual
//                   ? "bg-[#FFCF50] text-[#626F47] shadow-sm"   // aktif: warna terang
//                   : "bg-gray-200 text-gray-600 hover:bg-gray-300" // tidak aktif: abu-abu
//               }`}
//             >
//               <Edit3 className="w-4 h-4" />
//               <span className="leading-none">Mode Manual</span>
//             </button>
//           </div>
//         </div>



//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Judul Resep *
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => handleInputChange('title', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//               placeholder="Masukkan judul resep"
//               required
//             />
//           </div>

//           {/* URL Input (for link mode) */}
//           {!isManual && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 URL Sumber
//               </label>
//               <input
//                 type="url"
//                 value={formData.original_url}
//                 onChange={(e) => handleInputChange('original_url', e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//                 placeholder="https://example.com/resep"
//               />
//             </div>
//           )}

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Deskripsi
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//               rows="3"
//               placeholder="Deskripsi singkat tentang resep ini"
//             />
//           </div>

//           {/* Manual Recipe Fields */}
//           {isManual && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Bahan-bahan *
//                 </label>
//                 <textarea
//                   value={formData.ingredients}
//                   onChange={(e) => handleInputChange('ingredients', e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//                   rows="4"
//                   placeholder="Masukkan bahan-bahan, satu per baris&#10;Contoh:&#10;• 500g ayam potong&#10;• 3 siung bawang putih&#10;• 2 sdm kecap manis"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Cara Membuat *
//                 </label>
//                 <textarea
//                   value={formData.cooking_steps}
//                   onChange={(e) => handleInputChange('cooking_steps', e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//                   rows="6"
//                   placeholder="Masukkan langkah-langkah membuat resep&#10;Contoh:&#10;1. Cuci ayam hingga bersih&#10;2. Tumis bawang putih hingga harum&#10;3. Masukkan ayam, masak hingga matang"
//                 />
//               </div>
//             </>
//           )}

//           {/* Category and Method */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Kategori Bahan
//               </label>
//               <select
//                 value={formData.ingredient_category}
//                 onChange={(e) => handleInputChange('ingredient_category', e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//               >
//                 <option value="">Pilih kategori bahan</option>
//                 {ingredientCategories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Cara Masak
//               </label>
//               <select
//                 value={formData.cooking_method}
//                 onChange={(e) => handleInputChange('cooking_method', e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//               >
//                 <option value="">Pilih cara masak</option>
//                 {cookingMethods.map(method => (
//                   <option key={method} value={method}>{method}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Thumbnail URL */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               URL Thumbnail
//             </label>
//             <input
//               type="url"
//               value={formData.thumbnail_url}
//               onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//               placeholder="https://example.com/thumbnail.jpg"
//             />
//           </div>

//           {/* Personal Notes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Catatan Pribadi
//             </label>
//             <textarea
//               value={formData.personal_notes}
//               onChange={(e) => handleInputChange('personal_notes', e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
//               rows="3"
//               placeholder="Catatan pribadi tentang resep ini"
//             />
//           </div>

//           {/* Form Actions */}
//           <div className="flex justify-end gap-2 pt-4 border-t">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-[#626F47] text-white rounded-md hover:bg-[#4d5938] flex items-center gap-2"
//             >
//               <Upload className="w-4 h-4" />
//               {isEditing ? 'Update' : 'Simpan'} Resep
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RecipeForm;
import React, { useState, useEffect } from 'react';
import { X, Link, Edit3, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { INGREDIENT_CATEGORIES, COOKING_METHODS } from '../lib/recipeTypes';

const ingredientCategories = INGREDIENT_CATEGORIES;
const cookingMethods = COOKING_METHODS;

// Gambar default untuk resep manual
const DEFAULT_MANUAL_IMAGE = '/images/recipe-placeholder.jpg';
// ScreenshotAPI token (optional, ada free plan 100 screenshots/bulan)
const SCREENSHOT_API_TOKEN = import.meta.env.VITE_SCREENSHOT_API_TOKEN;

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const isEditing = !!recipe;
  const [isManual, setIsManual] = useState(recipe?.is_manual || false);
  const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailMethod, setThumbnailMethod] = useState('');
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

  // Function utama untuk mengambil thumbnail
  const fetchThumbnail = async (url) => {
    setIsFetchingThumbnail(true);
    setThumbnailError(false);
    setThumbnailMethod('');
    
    try {
      new URL(url); // Validasi URL
      
      console.log('Memulai fetch thumbnail untuk:', url);
      
      // Coba metode 1: Microlink (gratis, tidak perlu API key)
      let microlinkResult = await tryMicrolink(url);
      if (microlinkResult) {
        setThumbnailMethod('Microlink (Open Graph/Twitter image)');
        return microlinkResult;
      }
      
      // Coba metode 2: ScreenshotAPI (jika ada token)
      if (SCREENSHOT_API_TOKEN) {
        let screenshotResult = await tryScreenshotAPI(url);
        if (screenshotResult) {
          setThumbnailMethod('ScreenshotAPI');
          return screenshotResult;
        }
      }
      
      // Coba metode 3: Scrape Open Graph langsung
      let ogResult = await tryOpenGraphScrape(url);
      if (ogResult) {
        setThumbnailMethod('Open Graph scraping');
        return ogResult;
      }
      
      // Fallback ke favicon
      setThumbnailMethod('Favicon fallback');
      return getFavicon(url);
      
    } catch (error) {
      console.error('Fetch thumbnail error:', error);
      setThumbnailError(true);
      return getFavicon(url); // Fallback ke favicon
    } finally {
      setIsFetchingThumbnail(false);
    }
  };

  // Metode 1: Microlink (FREE, tidak perlu API key)
  const tryMicrolink = async (url) => {
    try {
      const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=false&meta=true`;
      
      console.log('Mencoba Microlink API...');
      
      const response = await fetch(microlinkUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.log('Microlink API error status:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      // Debug: lihat data yang diterima
      console.log('Microlink response:', {
        hasImage: !!data.data?.image?.url,
        hasLogo: !!data.data?.logo?.url,
        imageUrl: data.data?.image?.url,
        logoUrl: data.data?.logo?.url
      });
      
      // Prioritaskan og:image, lalu twitter:image, lalu logo
      if (data.data?.image?.url) {
        console.log('Microlink found image:', data.data.image.url);
        return data.data.image.url;
      }
      
      if (data.data?.logo?.url) {
        console.log('Microlink found logo:', data.data.logo.url);
        return data.data.logo.url;
      }
      
      console.log('Microlink tidak menemukan thumbnail');
      return null;
      
    } catch (error) {
      console.error('Microlink error:', error);
      return null;
    }
  };

  // Metode 2: ScreenshotAPI (optional, jika ada token)
  const tryScreenshotAPI = async (url) => {
    if (!SCREENSHOT_API_TOKEN) return null;
    
    try {
      console.log('Mencoba ScreenshotAPI...');
      
      const screenshotUrl = `https://shot.screenshotapi.net/screenshot?token=${SCREENSHOT_API_TOKEN}&url=${encodeURIComponent(url)}&output=json&file_type=jpg&width=400&height=300`;
      
      const response = await fetch(screenshotUrl, {
        method: 'GET',
        redirect: 'follow'
      });
      
      if (!response.ok) {
        console.log('ScreenshotAPI error status:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.screenshot) {
        console.log('ScreenshotAPI berhasil:', data.screenshot);
        return data.screenshot;
      }
      
      return null;
    } catch (error) {
      console.error('ScreenshotAPI error:', error);
      return null;
    }
  };

  // Metode 3: Scrape Open Graph langsung
  const tryOpenGraphScrape = async (url) => {
    try {
      console.log('Mencoba Open Graph scrape...');
      
      // Gunakan CORS proxy untuk menghindari CORS error
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!data.contents) return null;
      
      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Cari og:image
      const ogImage = doc.querySelector('meta[property="og:image"]');
      if (ogImage && ogImage.content) {
        console.log('Found og:image:', ogImage.content);
        // Convert relative URL to absolute
        const absoluteUrl = new URL(ogImage.content, url).href;
        return absoluteUrl;
      }
      
      // Cari twitter:image
      const twitterImage = doc.querySelector('meta[name="twitter:image"]');
      if (twitterImage && twitterImage.content) {
        console.log('Found twitter:image:', twitterImage.content);
        const absoluteUrl = new URL(twitterImage.content, url).href;
        return absoluteUrl;
      }
      
      // Cari image dengan keyword tertentu
      const images = doc.querySelectorAll('img');
      for (const img of images) {
        const src = img.src;
        const alt = img.alt?.toLowerCase() || '';
        
        // Heuristik: cari gambar yang kemungkinan thumbnail
        if (
          src.includes('thumbnail') ||
          src.includes('featured') ||
          src.includes('hero') ||
          src.includes('cover') ||
          alt.includes('recipe') ||
          alt.includes('food') ||
          alt.includes('dish')
        ) {
          console.log('Found potential thumbnail:', src);
          const absoluteUrl = new URL(src, url).href;
          return absoluteUrl;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Open Graph scrape error:', error);
      return null;
    }
  };

  // Fallback: Favicon
  const getFavicon = (url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    } catch {
      return DEFAULT_MANUAL_IMAGE;
    }
  };

  // Auto-fetch thumbnail saat URL berubah
  useEffect(() => {
    let isMounted = true;
    
    const autoFetchThumbnail = async () => {
      if (isManual || !formData.original_url?.trim()) {
        if (isManual && isMounted) {
          setFormData(prev => ({
            ...prev,
            thumbnail_url: DEFAULT_MANUAL_IMAGE
          }));
        }
        return;
      }
      
      try {
        const url = formData.original_url.trim();
        new URL(url); // Validasi
        
        // Debounce 1.5 detik
        const timeoutId = setTimeout(async () => {
          if (!isMounted) return;
          
          const thumbnail = await fetchThumbnail(url);
          if (isMounted && thumbnail) {
            setFormData(prev => ({
              ...prev,
              thumbnail_url: thumbnail
            }));
          }
        }, 1500);
        
        return () => clearTimeout(timeoutId);
        
      } catch (error) {
        console.log('URL tidak valid untuk auto-fetch');
      }
    };
    
    autoFetchThumbnail();
    
    return () => {
      isMounted = false;
    };
  }, [formData.original_url, isManual]);

  // Manual fetch thumbnail (button click)
  const handleManualFetchThumbnail = async () => {
    if (!formData.original_url || isManual) return;
    
    const thumbnail = await fetchThumbnail(formData.original_url);
    if (thumbnail) {
      setFormData(prev => ({
        ...prev,
        thumbnail_url: thumbnail
      }));
    }
  };

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
      
      // Ensure manual recipes use default image
      if (!formData.thumbnail_url) {
        setFormData(prev => ({
          ...prev,
          thumbnail_url: DEFAULT_MANUAL_IMAGE
        }));
      }
    }

    // For link recipes, validate URL if provided
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
      is_manual: isManual,
      thumbnail_url: formData.thumbnail_url || (isManual ? DEFAULT_MANUAL_IMAGE : '')
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
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-2 border rounded-lg p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsManual(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  !isManual
                    ? "bg-[#FFCF50] text-[#626F47] shadow-sm"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <Link className="w-4 h-4" />
                <span className="leading-none">Mode Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsManual(true);
                  handleInputChange("original_url", "");
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isManual
                    ? "bg-[#FFCF50] text-[#626F47] shadow-sm"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="leading-none">Mode Manual</span>
              </button>
            </div>
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
              URL Sumber Resep *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={formData.original_url}
                onChange={(e) => handleInputChange('original_url', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
                placeholder="https://cookpad.com/resep/..."
                required={!isManual}
              />
              <button
                type="button"
                onClick={handleFetchThumbnail}
                disabled={!formData.original_url || isFetchingThumbnail}
                className="px-4 py-2 bg-[#626F47] text-white rounded-md hover:bg-[#4d5938] disabled:opacity-50 flex items-center gap-2"
              >
                {isFetchingThumbnail ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                {isFetchingThumbnail ? 'Mencari...' : 'Cari Thumbnail'}
              </button>
            </div>
            
            {/* Thumbnail Status */}
            <div className="mb-4">
              {isFetchingThumbnail ? (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm text-blue-700">{thumbnailStatus}</span>
                </div>
              ) : thumbnailSource ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md">
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    {thumbnailSource}
                  </span>
                </div>
              ) : formData.original_url ? (
                <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Masukkan URL dan klik "Cari Thumbnail"
                  </span>
                </div>
              ) : null}
            </div>
            
            {/* Thumbnail Preview */}
            {formData.thumbnail_url && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Thumbnail
                </label>
                <div className="relative group">
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = DEFAULT_MANUAL_IMAGE;
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {thumbnailSource || 'Thumbnail'}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 truncate">
                    {formData.thumbnail_url}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleInputChange('thumbnail_url', '')}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      

          {/* Thumbnail Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview Thumbnail
            </label>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] bg-gray-50">
              {formData.thumbnail_url ? (
                <div className="flex flex-col items-center w-full">
                  <div className="relative">
                    <img 
                      src={formData.thumbnail_url} 
                      alt="Thumbnail preview" 
                      className="w-40 h-40 object-cover rounded-lg shadow-md mb-2"
                      onError={(e) => {
                        console.log('Gambar gagal dimuat, menggunakan default');
                        e.target.src = DEFAULT_MANUAL_IMAGE;
                        setThumbnailError(true);
                      }}
                    />
                    
                    {/* Indikator type */}
                    {formData.thumbnail_url.includes('favicon') && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                        Favicon
                      </div>
                    )}
                    
                    {formData.thumbnail_url === DEFAULT_MANUAL_IMAGE && (
                      <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 text-center max-w-xs truncate">
                    {formData.thumbnail_url.includes('favicon') 
                      ? 'Menggunakan favicon website' 
                      : formData.thumbnail_url === DEFAULT_MANUAL_IMAGE
                      ? 'Menggunakan gambar default resep'
                      : 'Thumbnail berhasil diambil'}
                  </p>
                  
                  {formData.thumbnail_url !== DEFAULT_MANUAL_IMAGE && !formData.thumbnail_url.includes('favicon') && (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={handleManualFetchThumbnail}
                        disabled={isFetchingThumbnail}
                        className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        Coba ambil lagi
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        type="button"
                        onClick={() => handleInputChange('thumbnail_url', '')}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Belum ada thumbnail</p>
                  {!isManual && formData.original_url && (
                    <p className="text-xs mt-1">Thumbnail akan muncul setelah URL dimasukkan</p>
                  )}
                  {isManual && (
                    <p className="text-xs mt-1">Resep manual menggunakan gambar default</p>
                  )}
                </div>
              )}
            </div>
          </div>

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
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Info:</span> Resep manual akan menggunakan gambar default yang sudah disediakan.
                </p>
              </div>
              
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