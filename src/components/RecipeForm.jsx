import React, { useState, useEffect, useRef } from 'react';
import { X, Link, Edit3, Upload, Youtube, Instagram, Globe, Camera, RefreshCw } from 'lucide-react';
import { INGREDIENT_CATEGORIES, COOKING_METHODS } from '../lib/recipeTypes';

const ingredientCategories = INGREDIENT_CATEGORIES;
const cookingMethods = COOKING_METHODS;

// Gambar default
const DEFAULT_MANUAL_IMAGE = '/default.png';

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const isEditing = !!recipe;
  const [isManual, setIsManual] = useState(recipe?.is_manual || false);
  const [isFetchingThumbnail, setIsFetchingThumbnail] = useState(false);
  const [thumbnailSource, setThumbnailSource] = useState('');
  const [platform, setPlatform] = useState('');
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

  // Deteksi platform dari URL
  const detectPlatform = (url) => {
    if (!url) return '';
    
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
      return 'youtube';
    } else if (urlLower.includes('instagram.com') || urlLower.includes('instagr.am')) {
      return 'instagram';
    } else if (urlLower.includes('tiktok.com')) {
      return 'tiktok';
    } else if (urlLower.includes('pinterest.com') || urlLower.includes('pin.it')) {
      return 'pinterest';
    } else if (urlLower.includes('facebook.com') || urlLower.includes('fb.watch')) {
      return 'facebook';
    } else if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
      return 'twitter';
    } else if (urlLower.includes('cookpad.com')) {
      return 'cookpad';
    } else if (urlLower.includes('resepkoki.co')) {
      return 'resepkoki';
    } else if (urlLower.includes('yummy.co.id')) {
      return 'yummy';
    } else if (urlLower.includes('food.detik.com')) {
      return 'detikfood';
    }
    
    return 'website';
  };

  // Extract ID dari URL
  const extractVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      
      if (url.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch {
      return null;
    }
  };

  // Extract Instagram shortcode
  const extractInstagramShortcode = (url) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const match = path.match(/\/p\/([^\/]+)/) || path.match(/\/reel\/([^\/]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // Extract TikTok video ID
  const extractTikTokId = (url) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const match = path.match(/\/video\/(\d+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // Fetch thumbnail berdasarkan platform
  const fetchThumbnailByPlatform = async (url, platformType) => {
    setIsFetchingThumbnail(true);
    
    try {
      let thumbnailUrl = '';
      let source = '';
      
      switch (platformType) {
        case 'youtube':
          const videoId = extractVideoId(url);
          if (videoId) {
            // YouTube thumbnail formats
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            source = 'YouTube Thumbnail';
            
            // Cek apakah thumbnail tersedia
            const checkResponse = await fetch(thumbnailUrl);
            if (!checkResponse.ok) {
              thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
          }
          break;
          
        case 'instagram':
          // Instagram tidak mudah di-scrape, gunakan service
          const instaShortcode = extractInstagramShortcode(url);
          if (instaShortcode) {
            thumbnailUrl = `https://www.instagram.com/p/${instaShortcode}/media/?size=l`;
            source = 'Instagram';
          }
          break;
          
        case 'tiktok':
          // TikTok juga sulit, gunakan oEmbed
          try {
            const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
            const response = await fetch(oembedUrl);
            const data = await response.json();
            if (data.thumbnail_url) {
              thumbnailUrl = data.thumbnail_url;
              source = 'TikTok';
            }
          } catch (error) {
            console.log('TikTok oEmbed failed:', error);
          }
          break;
          
        case 'pinterest':
          // Pinterest oEmbed
          try {
            const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(url)}`;
            const response = await fetch(oembedUrl);
            const data = await response.json();
            if (data.thumbnail_url) {
              thumbnailUrl = data.thumbnail_url;
              source = 'Pinterest';
            }
          } catch (error) {
            console.log('Pinterest oEmbed failed:', error);
          }
          break;
          
        default:
          // Untuk website biasa, gunakan iframely atau oEmbed
          thumbnailUrl = await fetchWebsiteThumbnail(url);
          source = 'Website';
      }
      
      if (thumbnailUrl) {
        setThumbnailSource(source);
        return thumbnailUrl;
      }
      
      throw new Error('Thumbnail tidak ditemukan');
      
    } catch (error) {
      console.error('Fetch thumbnail error:', error);
      setThumbnailSource('Gagal mengambil thumbnail');
      return getFavicon(url);
    } finally {
      setIsFetchingThumbnail(false);
    }
  };

  // Fetch thumbnail untuk website biasa
  const fetchWebsiteThumbnail = async (url) => {
    try {
      // Coba iframely API (lebih baik untuk website resep)
      const iframelyUrl = `https://iframe.ly/api/oembed?url=${encodeURIComponent(url)}&api_key=YOUR_IFRAMELY_KEY&omit_script=1`;
      
      const response = await fetch(iframelyUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail_url) {
          return data.thumbnail_url;
        }
      }
      
      // Fallback ke Open Graph
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const htmlResponse = await fetch(proxyUrl);
      const html = await htmlResponse.text();
      
      // Cari Open Graph image
      const ogMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
      if (ogMatch && ogMatch[1]) {
        return ogMatch[1];
      }
      
      // Cari Twitter image
      const twitterMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i);
      if (twitterMatch && twitterMatch[1]) {
        return twitterMatch[1];
      }
      
      return null;
    } catch (error) {
      console.error('Website thumbnail error:', error);
      return null;
    }
  };

  // Fallback ke favicon
  const getFavicon = (url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    } catch {
      return DEFAULT_MANUAL_IMAGE;
    }
  };

  // Auto-detect platform dan fetch thumbnail saat URL berubah
  useEffect(() => {
    let isMounted = true;
    
    const autoFetch = async () => {
      if (isManual || !formData.original_url?.trim()) {
        if (isManual && isMounted) {
          setFormData(prev => ({ ...prev, thumbnail_url: DEFAULT_MANUAL_IMAGE }));
        }
        return;
      }
      
      try {
        const url = formData.original_url.trim();
        new URL(url);
        
        const detectedPlatform = detectPlatform(url);
        setPlatform(detectedPlatform);
        
        // Debounce
        const timeoutId = setTimeout(async () => {
          if (!isMounted) return;
          
          const thumbnail = await fetchThumbnailByPlatform(url, detectedPlatform);
          if (isMounted && thumbnail) {
            setFormData(prev => ({ ...prev, thumbnail_url: thumbnail }));
          }
        }, 1000);
        
        return () => clearTimeout(timeoutId);
        
      } catch (error) {
        console.log('Invalid URL for thumbnail fetch');
      }
    };
    
    autoFetch();
    
    return () => {
      isMounted = false;
    };
  }, [formData.original_url, isManual]);

  // Manual fetch thumbnail
  const handleFetchThumbnail = async () => {
    if (!formData.original_url || isManual) return;
    
    const detectedPlatform = detectPlatform(formData.original_url);
    const thumbnail = await fetchThumbnailByPlatform(formData.original_url, detectedPlatform);
    if (thumbnail) {
      setFormData(prev => ({ ...prev, thumbnail_url: thumbnail }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset platform detection saat URL diubah
    if (field === 'original_url') {
      setPlatform('');
      setThumbnailSource('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Judul resep wajib diisi');
      return;
    }

    if (isManual) {
      if (!formData.ingredients.trim() || !formData.cooking_steps.trim()) {
        alert('Bahan-bahan dan cara membuat wajib diisi untuk resep manual');
        return;
      }
    }

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

  // Icon berdasarkan platform
  const getPlatformIcon = () => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'tiktok':
        return <span className="text-black font-bold text-sm">TK</span>;
      case 'pinterest':
        return <span className="text-red-600 font-bold text-sm">P</span>;
      default:
        return <Globe className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'youtube': return 'YouTube';
      case 'instagram': return 'Instagram';
      case 'tiktok': return 'TikTok';
      case 'pinterest': return 'Pinterest';
      case 'facebook': return 'Facebook';
      case 'twitter': return 'Twitter/X';
      case 'cookpad': return 'Cookpad';
      case 'resepkoki': return 'ResepKoki';
      case 'yummy': return 'Yummy';
      case 'detikfood': return 'Detik Food';
      default: return 'Website';
    }
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
                  setPlatform('');
                  setThumbnailSource('');
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
                  placeholder="https://youtube.com/watch?v=... atau https://instagram.com/p/..."
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
                  {isFetchingThumbnail ? '...' : 'Ambil'}
                </button>
              </div>
              
              {/* Platform Detection */}
              {platform && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-md">
                  {getPlatformIcon()}
                  <span className="text-sm font-medium">
                    Terdeteksi: {getPlatformName()}
                  </span>
                </div>
              )}
              
              {/* Status Info */}
              {thumbnailSource && (
                <div className={`p-2 rounded-md mb-2 ${
                  thumbnailSource.includes('Gagal') 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  <p className="text-sm">{thumbnailSource}</p>
                </div>
              )}
            </div>
          )}

          {/* Thumbnail Preview */}
          {(!isManual || formData.thumbnail_url) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Thumbnail
              </label>
              <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] bg-gray-50">
                {formData.thumbnail_url ? (
                  <div className="flex flex-col items-center w-full">
                    <div className="relative group">
                      <img 
                        src={formData.thumbnail_url} 
                        alt="Thumbnail preview" 
                        className="w-48 h-48 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          console.log('Gambar gagal dimuat, menggunakan default');
                          e.target.src = DEFAULT_MANUAL_IMAGE;
                        }}
                      />
                      {platform && (
                        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          {getPlatformIcon()}
                          <span>{getPlatformName()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={handleFetchThumbnail}
                        disabled={isFetchingThumbnail}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('thumbnail_url', '')}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Belum ada thumbnail</p>
                    {!isManual && formData.original_url && (
                      <p className="text-xs mt-1">
                        Klik "Ambil" untuk mengambil thumbnail
                      </p>
                    )}
                  </div>
                )}
              </div>
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