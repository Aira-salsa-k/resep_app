Technical Documentation: Aplikasi Pencatatan Resep (Recipe Saver) - V21. Ringkasan ProyekAplikasi berbasis web untuk menyimpan dan mengelola resep masakan. Versi ini mendukung dua mode input:Mode Link: Menyimpan resep dari URL eksternal (YouTube, Blog).Mode Manual: Menulis resep sendiri (Bahan & Langkah-langkah).2. Tech Stack (Sama seperti V1)Frontend: React.js, Tailwind CSS, Lucide React.Backend: Supabase (PostgreSQL, Auth, Storage).3. Pemetaan Kebutuhan Fungsional (Diperbarui)IDFiturSolusi TeknisF1Tambah Link ResepInput field original_url. Opsional jika input manual.F2Tambah DeskripsiTextarea field description.F3Simpan ResepLogic kondisional: Simpan URL jika ada, atau simpan Bahan & Langkah jika manual.F4Kategori BahanDropdown select (Ayam, Daging, dll).F5Kategori Cara MasakDropdown select (Tumis, Rebus, dll).F6PencarianFull Text Search pada Title, Description, dan Ingredients.F7Catatan PribadiTextarea field personal_notes.F8Tampilan Grid/ListState Toggle UI.F9ThumbnailAuto-fetch dari URL (jika ada) atau Placeholder Image untuk resep manual.F10Edit & HapusCRUD Operation standar.F11Input Manual (BARU)Form input ingredients (Textarea/RichText) dan cooking_steps (Textarea/RichText).4. Desain Database (Schema Design)Tabel recipes dimodifikasi untuk mendukung input manual.Tabel: recipesKolomTipe DataDeskripsi & PerubahanidUUIDPrimary Keyuser_idUUIDForeign Key ke auth.userstitleTEXTJudul Resep (Wajib)original_urlTEXT(Diubah) Sekarang menjadi Nullable (Boleh kosong untuk resep manual)descriptionTEXTDeskripsi singkatingredientsTEXT(Baru) Daftar bahan. Disimpan sebagai teks panjang (dipisahkan baris baru) atau Markdown.cooking_stepsTEXT(Baru) Langkah pembuatan. Disimpan sebagai teks panjang.personal_notesTEXTCatatan pribadiingredient_categoryTEXTKategori Bahancooking_methodTEXTCara Masakthumbnail_urlTEXTURL Gambaris_manualBOOLEAN(Baru) Penanda apakah ini resep manual (True) atau link (False). Opsional, bisa dideteksi dari original_url.5. Logika Frontend (React)Mode Input (Switch/Tab)Pada halaman "Tambah Resep", sediakan Toggle/Tab:Tab "Simpan Link": Menampilkan input URL dan Deskripsi.Tab "Tulis Manual": Menampilkan input Bahan-bahan (Textarea) dan Cara Masak (Textarea).Tampilan Detail (RecipeDetail.jsx)Gunakan Conditional Rendering:{recipe.original_url ? (
   // Tampilkan Link Embed / Tombol ke Sumber
   <a href={recipe.original_url}>Buka Sumber Asli</a>
) : (
   // Tampilkan Bahan & Langkah
   <div>
      <h3>Bahan-bahan:</h3>
      <p className="whitespace-pre-line">{recipe.ingredients}</p>
      
      <h3>Cara Membuat:</h3>
      <p className="whitespace-pre-line">{recipe.cooking_steps}</p>
   </div>
)}
6. Keamanan (RLS)Tetap sama. User hanya boleh melihat dan memodifikasi resep dengan user_id mereka sendiri.

database sudah di buat
-- 1. Enable UUID extension (biasanya sudah aktif, tapi untuk memastikan)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Buat tipe ENUM untuk menjaga konsistensi data (Opsional, bisa pakai TEXT biasa dengan CHECK constraint)
-- Kita gunakan TEXT dengan CHECK constraint agar lebih fleksibel di kemudian hari tanpa migrasi tipe data yang ribet.

-- 3. Buat Tabel Recipes
CREATE TABLE public.recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    original_url TEXT NOT NULL,
    description TEXT,
    personal_notes TEXT,
    
    -- F4: Kategori Bahan
    ingredient_category TEXT CHECK (
        ingredient_category IN (
            'Ayam', 'Ikan', 'Sayur', 'Daging', 'Tahu', 
            'Tempe', 'Sambal', 'Snack/Dessert', 'Lainnya'
        )
    ),
    
    -- F5: Cara Masak
    cooking_method TEXT CHECK (
        cooking_method IN (
            'Kukus', 'Rebus', 'Goreng', 'Tumis', 
            'Bakar', 'Panggang', 'Lainnya'
        )
    ),
    
    thumbnail_url TEXT, -- Disimpan otomatis oleh frontend/edge function
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexing untuk performa pencarian cepat (F6)
CREATE INDEX recipes_user_id_idx ON public.recipes(user_id);
CREATE INDEX recipes_title_idx ON public.recipes USING gin(to_tsvector('indonesian', title));
CREATE INDEX recipes_category_idx ON public.recipes(ingredient_category);
CREATE INDEX recipes_method_idx ON public.recipes(cooking_method);

-- 5. Aktifkan Row Level Security (PENTING)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- 6. Buat Kebijakan Keamanan (Policies)

-- Policy: User hanya bisa melihat resep miliknya sendiri
CREATE POLICY "Users can view their own recipes" 
ON public.recipes FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: User bisa menambahkan resep (user_id otomatis diisi auth.uid di frontend/backend)
CREATE POLICY "Users can insert their own recipes" 
ON public.recipes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: User bisa mengupdate resep miliknya
CREATE POLICY "Users can update their own recipes" 
ON public.recipes FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: User bisa menghapus resep miliknya
CREATE POLICY "Users can delete their own recipes" 
ON public.recipes FOR DELETE 
USING (auth.uid() = user_id);

-- 7. (Opsional) Trigger untuk update kolom updated_at otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

const { data, error } = await supabase
  .from('recipes')
  .select('*')
  .order('created_at', { ascending: false });
    * Karena RLS sudah aktif, query di atas otomatis hanya akan mengembalikan resep milik user yang sedang login.
    Pencarian (F6):

Untuk pencarian sederhana (Partial match):

JavaScript

const { data } = await supabase
  .from('recipes')
  .select('*')
  .ilike('title', `%${searchTerm}%`); // Case insensitive search

  pallete warna
 #626F47
#A4B465
#FFCF50
#FEFAE0