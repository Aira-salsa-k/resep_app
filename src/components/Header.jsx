import React from 'react';
import { Search, Plus, Grid, List, User, LogOut } from 'lucide-react';
import { useAuth } from '../lib/authContext';

const Header = ({ 
  onAddNew, 
  onViewToggle, 
  currentView, 
  searchTerm, 
  onSearchChange,
  showViewToggle, 
  showSearch = true,
  showAddButton = true
}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-[#f8f8f8] text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">

              {/* === LOGO BULAT === */}
        <img 
          src="/logo_hat.png"   // ganti dengan path gambarmu
          alt="logo"
          className="w-10 h-10 rounded-full object-cover"
        />

            <div className="flex flex-col">
            <h1 className="text-xl text-black font-bold">Cook Notes</h1>
            <h3 className="text-sm text-black -mt-1">
              your recipe collection
            </h3>
          </div>
            {/* <h1 className="text-xl font-bold">Cook Notes</h1> */}
            {/* {user && (
              <span className="text-sm bg-[#A4B465] px-2 py-1 rounded-full">
                {user.email}
              </span>
            )} */}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {showSearch && (
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari resep..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#A4B465] text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFCF50]"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              {showAddButton && (
                <button
                  onClick={onAddNew}
                  className="flex items-center gap-1 bg-[#fb953d] text-[#181818] px-3 py-2 rounded-lg hover:bg-[#feebc8] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah Resep</span>
                </button>
              )}
              
             {showViewToggle && (
                <button
                  onClick={onViewToggle}
                  className="bg-[#A4B465] text-white p-2 rounded-lg hover:bg-[#8da252] transition-colors"
                >
                  {currentView === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </button>
              )}

              {/* {!user && (
                <button  onClick={() => window.location.href = "/login"}
                className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-amber-700 transition-all">
                  Login
                </button>
              )} */}

              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-red-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;