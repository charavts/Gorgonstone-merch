import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Edit2, Trash2, Save, X, Upload, Loader, XCircle, Eye, EyeOff } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Product } from '../context/CartContext';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, accessToken } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  
  // Site settings state
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        navigate('/login');
      } else {
        loadProducts();
        loadSiteSettings();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/admin/products`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fetchedProducts = data.products || [];
        
        // If no products exist, initialize them
        if (fetchedProducts.length === 0) {
          console.log('No products found, initializing...');
          await initializeProducts();
        } else {
          setProducts(fetchedProducts);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeProducts = async () => {
    try {
      console.log('Initializing products from backend...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/init-products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Init products response status:', response.status);
      const responseText = await response.text();
      console.log('Init products response:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('Products initialized successfully:', data);
        setProducts(data.products || []);
      } else {
        console.error('Failed to initialize products. Status:', response.status, 'Response:', responseText);
        alert(language === 'el' 
          ? `Σφάλμα αρχικοποίησης προϊόντων: ${responseText}` 
          : `Failed to initialize products: ${responseText}`
        );
      }
    } catch (error) {
      console.error('Error initializing products:', error);
      alert(language === 'el' 
        ? `Σφάλμα αρχικοποίησης προϊόντων: ${error}` 
        : `Error initializing products: ${error}`
      );
    }
  };

  const saveProducts = async (updatedProducts: Product[]) => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/admin/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ products: updatedProducts }),
        }
      );

      if (response.ok) {
        setProducts(updatedProducts);
        setEditingProduct(null);
        setShowAddForm(false);
        alert(language === 'el' ? 'Αποθηκεύτηκε επιτυχώς!' : 'Saved successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving products:', error);
      alert('Error saving products');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      image: '',
      stripeUrl: '',
    };
    setEditingProduct(newProduct);
    setShowAddForm(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;

    if (!editingProduct.name || !editingProduct.price) {
      alert(language === 'el' ? 'Συμπληρώστε όλα τα υποχρεωτικά πεδία (Όνομα και Τιμή)' : 'Fill all required fields (Name and Price)');
      return;
    }

    let updatedProducts;
    if (showAddForm) {
      updatedProducts = [...products, editingProduct];
    } else {
      updatedProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    }

    saveProducts(updatedProducts);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm(language === 'el' ? 'Είστε σίγουροι;' : 'Are you sure?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
    }
  };

  const handleToggleHideProduct = (id: string) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, hidden: !p.hidden } : p
    );
    saveProducts(updatedProducts);
  };

  // Upload image function
  const uploadImage = async (file: File, imageKey: string): Promise<string | null> => {
    try {
      setUploadingImages(prev => ({ ...prev, [imageKey]: true }));

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/upload-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data.url);
        return data.url;
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
      return null;
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, 'main');
    if (url) {
      setEditingProduct(prev => prev ? { ...prev, image: url } : null);
    }
  };

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, color: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file, color);
    if (url) {
      setEditingProduct(prev => prev ? {
        ...prev,
        imageVariants: { ...(prev.imageVariants || {}), [color]: url }
      } : null);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📤 Uploading logo file:', file.name);
    const url = await uploadImage(file, 'logo');
    if (url) {
      console.log('✅ Logo uploaded successfully:', url);
      setSiteSettings({ ...siteSettings, logoUrl: url });
    } else {
      console.error('❌ Logo upload failed');
    }
  };

  const loadSiteSettings = async () => {
    setLoadingSettings(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/admin/site-settings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data.settings || {});
      }
    } catch (error) {
      console.error('Error loading site settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSiteSettings = async (updatedSettings: any) => {
    setSaving(true);
    try {
      console.log('💾 Saving site settings:', updatedSettings);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/admin/site-settings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ settings: updatedSettings }),
        }
      );

      console.log('Save response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Save successful:', responseData);
        
        setSiteSettings(updatedSettings);
        alert(
          language === 'el' 
            ? '✅ Αποθη��εύτηκε επιτυχώς!\n\nΣημείωση: Κάντε refresh τη σελίδα Cart για να δείτε τις αλλαγές.' 
            : '✅ Saved successfully!\n\nNote: Refresh the Cart page to see changes.'
        );
      } else {
        const error = await response.json();
        console.error('❌ Save failed:', error);
        alert(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('❌ Error saving site settings:', error);
      alert('Error saving site settings');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="pt-24 pb-40 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white text-xl">
            {language === 'el' ? 'Φόρτωση...' : 'Loading...'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-40 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-3xl mb-2">
              {language === 'el' ? 'Διαχείριση Admin' : 'Admin Dashboard'}
            </h1>
            <p className="text-white/70">
              {language === 'el' ? `Κασήρθες, ${user?.name}!` : `Welcome, ${user?.name}!`}
            </p>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              {language === 'el' ? 'Νέο Προϊόν' : 'New Product'}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/20">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'text-white border-b-2 border-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {language === 'el' ? 'Προϊόντα' : 'Products'}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'text-white border-b-2 border-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {language === 'el' ? 'Ρυθμίσεις Site' : 'Site Settings'}
          </button>
        </div>

        {/* Edit Form - Modal only */}
        {editingProduct && !showAddForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5">
            <div className="bg-[#56514f] rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl">
                  {language === 'el' ? 'Επεξεργασία Προϊόντος' : 'Edit Product'}
                </h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddForm(false);
                  }}
                  className="text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white mb-2 block">
                    {language === 'el' ? 'Όνομα Προϊόντος' : 'Product Name'} *
                  </label>
                  <input
                    type="text"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-white mb-2 block">
                    {language === 'el' ? 'Τιμή (€)' : 'Price (€)'} *
                  </label>
                  <input
                    type="number"
                    value={editingProduct?.price || 0}
                    onChange={(e) => setEditingProduct(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-white mb-2 block">
                    Stripe URL
                  </label>
                  <input
                    type="text"
                    value={editingProduct?.stripeUrl || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {...prev, stripeUrl: e.target.value} : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                  />
                </div>

                {/* Main Product Image */}
                <div>
                  <label className="text-white mb-3 block">
                    {language === 'el' ? 'Κύρια Εικόνα Προϊόντος' : 'Main Product Image'} <span className="text-white/50 text-sm">(optional)</span>
                  </label>
                  
                  {/* File Upload Button */}
                  <div className="flex gap-3 mb-3">
                    <label className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-4 py-3 rounded-lg transition-colors cursor-pointer">
                      {uploadingImages['main'] ? (
                        <><Loader className="w-4 h-4 animate-spin" /> {language === 'el' ? 'Ανέβασμα...' : 'Uploading...'}</>
                      ) : (
                        <><Upload className="w-4 h-4" /> {language === 'el' ? 'Ανέβασε Εικόνα' : 'Upload Image'}</>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                        disabled={uploadingImages['main']}
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    value={editingProduct?.image || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {...prev, image: e.target.value} : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    placeholder={language === 'el' ? 'ή βάλε URL εικόνας' : 'or paste image URL'}
                  />
                  
                  {editingProduct?.image && (
                    <div className="mt-4 p-4 bg-[#444] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">
                          {language === 'el' ? 'Προεπισκόπηση:' : 'Preview:'}
                        </p>
                        <button
                          onClick={() => setEditingProduct(prev => prev ? {...prev, image: ''} : null)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors"
                          title={language === 'el' ? 'Αφαίρεση εικόνας' : 'Remove image'}
                        >
                          <XCircle size={16} />
                          {language === 'el' ? 'Αφαίρεση' : 'Remove'}
                        </button>
                      </div>
                      <img 
                        src={editingProduct.image} 
                        alt="Product preview"
                        className="h-32 object-contain bg-white/10 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Colors Multi-Select */}
                <div>
                  <label className="text-white mb-3 block">
                    {language === 'el' ? 'Επιλογή Χρωμάτων' : 'Select Colors'}
                  </label>
                  
                  <div className="relative">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-3 bg-[#444] rounded-lg border border-white/20">
                      {[
                        'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
                        'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Navy',
                        'Turquoise', 'Lime', 'Maroon', 'Olive', 'Teal', 'Aqua',
                        'Silver', 'Gold', 'Beige', 'Cream', 'Mint', 'Coral',
                        'Lavender', 'Peach', 'Sky Blue', 'Forest Green', 'Burgundy', 'Charcoal'
                      ].map((color) => {
                        const isSelected = editingProduct?.colors?.includes(color) || false;
                        
                        return (
                          <label 
                            key={color}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-[#56514f] text-white/80 hover:bg-[#666]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentColors = editingProduct?.colors || [];
                                let newColors;
                                
                                if (e.target.checked) {
                                  newColors = [...currentColors, color];
                                } else {
                                  newColors = currentColors.filter(c => c !== color);
                                  // Remove the image variant when unchecking
                                  const newVariants = {...(editingProduct?.imageVariants || {})};
                                  delete newVariants[color];
                                  setEditingProduct(prev => prev ? {
                                    ...prev, 
                                    colors: newColors.length > 0 ? newColors : undefined,
                                    imageVariants: Object.keys(newVariants).length > 0 ? newVariants : undefined
                                  } : null);
                                  return;
                                }
                                
                                setEditingProduct(prev => prev ? {
                                  ...prev, 
                                  colors: newColors.length > 0 ? newColors : undefined
                                } : null);
                              }}
                              className="w-4 h-4 rounded cursor-pointer"
                            />
                            <span className="text-sm">{color}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  
                  {editingProduct?.colors && editingProduct.colors.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-white/70 text-sm">
                        {language === 'el' ? 'Επιλεγμένα:' : 'Selected:'}
                      </span>
                      {editingProduct.colors.map(color => (
                        <span 
                          key={color}
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-white/50 text-sm mt-2">
                    {language === 'el' 
                      ? 'Επίλεξε τα διαθέσιμα ��ρώματα για αυτό το προϊόν' 
                      : 'Select available colors for this product'
                    }
                  </p>
                </div>

                {/* Color-specific Images */}
                {editingProduct?.colors && editingProduct.colors.length > 0 && (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <h3 className="text-white">
                      {language === 'el' 
                        ? 'Εικόνες ανά Χρώμα' 
                        : 'Images per Color'
                      }
                    </h3>
                    
                    {editingProduct.colors.map((color) => {
                      const colorStyles: Record<string, { bg: string; text: string; preview: string }> = {
                        'Black': { bg: 'bg-gray-800 hover:bg-gray-900', text: 'text-white', preview: 'bg-black' },
                        'White': { bg: 'bg-gray-200 hover:bg-gray-300', text: 'text-black', preview: 'bg-white' },
                        'Red': { bg: 'bg-red-600 hover:bg-red-700', text: 'text-white', preview: 'bg-red-600' },
                        'Blue': { bg: 'bg-blue-600 hover:bg-blue-700', text: 'text-white', preview: 'bg-blue-600' },
                        'Green': { bg: 'bg-green-600 hover:bg-green-700', text: 'text-white', preview: 'bg-green-600' },
                        'Yellow': { bg: 'bg-yellow-400 hover:bg-yellow-500', text: 'text-black', preview: 'bg-yellow-400' },
                        'Orange': { bg: 'bg-orange-600 hover:bg-orange-700', text: 'text-white', preview: 'bg-orange-600' },
                        'Purple': { bg: 'bg-purple-600 hover:bg-purple-700', text: 'text-white', preview: 'bg-purple-600' },
                        'Pink': { bg: 'bg-pink-500 hover:bg-pink-600', text: 'text-white', preview: 'bg-pink-500' },
                        'Brown': { bg: 'bg-amber-800 hover:bg-amber-900', text: 'text-white', preview: 'bg-amber-800' },
                        'Gray': { bg: 'bg-gray-500 hover:bg-gray-600', text: 'text-white', preview: 'bg-gray-500' },
                        'Navy': { bg: 'bg-blue-900 hover:bg-blue-950', text: 'text-white', preview: 'bg-blue-900' },
                        'Turquoise': { bg: 'bg-cyan-500 hover:bg-cyan-600', text: 'text-white', preview: 'bg-cyan-500' },
                        'Lime': { bg: 'bg-lime-500 hover:bg-lime-600', text: 'text-black', preview: 'bg-lime-500' },
                        'Maroon': { bg: 'bg-red-900 hover:bg-red-950', text: 'text-white', preview: 'bg-red-900' },
                        'Olive': { bg: 'bg-green-700 hover:bg-green-800', text: 'text-white', preview: 'bg-green-700' },
                        'Teal': { bg: 'bg-teal-600 hover:bg-teal-700', text: 'text-white', preview: 'bg-teal-600' },
                        'Aqua': { bg: 'bg-cyan-400 hover:bg-cyan-500', text: 'text-black', preview: 'bg-cyan-400' },
                        'Silver': { bg: 'bg-gray-400 hover:bg-gray-500', text: 'text-black', preview: 'bg-gray-400' },
                        'Gold': { bg: 'bg-yellow-600 hover:bg-yellow-700', text: 'text-black', preview: 'bg-yellow-600' },
                        'Beige': { bg: 'bg-amber-200 hover:bg-amber-300', text: 'text-black', preview: 'bg-amber-200' },
                        'Cream': { bg: 'bg-amber-50 hover:bg-amber-100', text: 'text-black', preview: 'bg-amber-50' },
                        'Mint': { bg: 'bg-emerald-300 hover:bg-emerald-400', text: 'text-black', preview: 'bg-emerald-300' },
                        'Coral': { bg: 'bg-orange-400 hover:bg-orange-500', text: 'text-white', preview: 'bg-orange-400' },
                        'Lavender': { bg: 'bg-purple-300 hover:bg-purple-400', text: 'text-black', preview: 'bg-purple-300' },
                        'Peach': { bg: 'bg-orange-300 hover:bg-orange-400', text: 'text-black', preview: 'bg-orange-300' },
                        'Sky Blue': { bg: 'bg-sky-400 hover:bg-sky-500', text: 'text-white', preview: 'bg-sky-400' },
                        'Forest Green': { bg: 'bg-green-800 hover:bg-green-900', text: 'text-white', preview: 'bg-green-800' },
                        'Burgundy': { bg: 'bg-red-800 hover:bg-red-900', text: 'text-white', preview: 'bg-red-800' },
                        'Charcoal': { bg: 'bg-gray-700 hover:bg-gray-800', text: 'text-white', preview: 'bg-gray-700' }
                      };
                      
                      const style = colorStyles[color] || { bg: 'bg-gray-600 hover:bg-gray-700', text: 'text-white', preview: 'bg-gray-600' };
                      
                      return (
                        <div key={color} className="border border-white/10 rounded-lg p-4">
                          <label className="text-white mb-2 block">
                            {language === 'el' ? `Εικόνα ${color}` : `${color} Image`}
                          </label>
                          
                          {/* File Upload Button */}
                          <div className="flex gap-3 mb-3">
                            <label className={`flex items-center gap-2 ${style.bg} ${style.text} px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm`}>
                              {uploadingImages[color] ? (
                                <><Loader className="w-4 h-4 animate-spin" /> {language === 'el' ? 'Ανέβασμα...' : 'Uploading...'}</>
                              ) : (
                                <><Upload className="w-4 h-4" /> {language === 'el' ? 'Ανέβασε' : 'Upload'}</>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleColorImageUpload(e, color)}
                                className="hidden"
                                disabled={uploadingImages[color]}
                              />
                            </label>
                          </div>

                          <input
                            type="text"
                            value={editingProduct?.imageVariants?.[color] || ''}
                            onChange={(e) => setEditingProduct(prev => prev ? {
                              ...prev, 
                              imageVariants: {...(prev.imageVariants || {}), [color]: e.target.value}
                            } : null)}
                            className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                            placeholder={language === 'el' 
                              ? 'ή βάλε URL εικόνας' 
                              : 'or paste image URL'
                            }
                          />
                          
                          {editingProduct?.imageVariants?.[color] && (
                            <div className="mt-3 p-3 bg-[#56514f] rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-white/70 text-xs">
                                  {language === 'el' ? 'Προεπισκόπηση:' : 'Preview:'}
                                </p>
                                <button
                                  onClick={() => {
                                    const newVariants = {...(editingProduct?.imageVariants || {})};
                                    delete newVariants[color];
                                    setEditingProduct(prev => prev ? {
                                      ...prev,
                                      imageVariants: Object.keys(newVariants).length > 0 ? newVariants : undefined
                                    } : null);
                                  }}
                                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                                  title={language === 'el' ? 'Αφαίρεση εικόνας' : 'Remove image'}
                                >
                                  <XCircle size={14} />
                                  {language === 'el' ? 'Αφαίρεση' : 'Remove'}
                                </button>
                              </div>
                              <img 
                                src={editingProduct.imageVariants[color]} 
                                alt={`${color} variant preview`}
                                className={`w-24 h-24 object-contain ${style.preview} rounded-lg border border-white/20`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <p className="text-white/50 text-sm">
                      {language === 'el' 
                        ? '💡 Προσθέστε ξεχωριστή εικόνα για κάθε χρώμα.  εικόνα θα αλλάζει αυτόματα ��ταν ο πελάτης επιλέγει χρώμα.' 
                        : '💡 Add a separate image for each color. The image will change automatically when customer selects a color.'
                      }
                    </p>
                  </div>
                )}

                {/* Material - English */}
                <div>
                  <label className="text-white mb-2 block">
                    Material (English)
                  </label>
                  <input
                    type="text"
                    value={editingProduct?.material?.en || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev, 
                      material: {...(prev.material || {en: '', el: ''}), en: e.target.value}
                    } : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    placeholder="100% Premium Cotton"
                  />
                </div>

                {/* Material - Greek */}
                <div>
                  <label className="text-white mb-2 block">
                    Υλικό (Ελληνικά)
                  </label>
                  <input
                    type="text"
                    value={editingProduct?.material?.el || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev, 
                      material: {...(prev.material || {en: '', el: ''}), el: e.target.value}
                    } : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    placeholder="100% Εκλεκτό Βαμβάκι"
                  />
                </div>

                {/* Description - English */}
                <div>
                  <label className="text-white mb-2 block">
                    Description (English)
                  </label>
                  <textarea
                    value={editingProduct?.description?.en || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev, 
                      description: {...(prev.description || {en: '', el: ''}), en: e.target.value}
                    } : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="A striking design featuring..."
                  />
                </div>

                {/* Description - Greek */}
                <div>
                  <label className="text-white mb-2 block">
                    Περιγραφή (Ελληνικά)
                  </label>
                  <textarea
                    value={editingProduct?.description?.el || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? {
                      ...prev, 
                      description: {...(prev.description || {en: '', el: ''}), el: e.target.value}
                    } : null)}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    rows={3}
                    placeholder="Εντυπωσιακός σχεδιασ��ός..."
                  />
                </div>

                {/* Features - English */}
                <div>
                  <label className="text-white mb-2 block">
                    Features (English, one per line)
                  </label>
                  <textarea
                    value={editingProduct?.features?.en?.join('\n') || ''}
                    onChange={(e) => {
                      const features = e.target.value.split('\n').filter(f => f.trim());
                      setEditingProduct(prev => prev ? {
                        ...prev, 
                        features: {...(prev.features || {en: [], el: []}), en: features}
                      } : null);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="Soft and breathable fabric&#10;Durable print quality&#10;Comfortable regular fit"
                  />
                </div>

                {/* Features - Greek */}
                <div>
                  <label className="text-white mb-2 block">
                    Χαρακτηριστικά (Ελληνικά, ένα ανά γραμμή)
                  </label>
                  <textarea
                    value={editingProduct?.features?.el?.join('\n') || ''}
                    onChange={(e) => {
                      const features = e.target.value.split('\n').filter(f => f.trim());
                      setEditingProduct(prev => prev ? {
                        ...prev, 
                        features: {...(prev.features || {en: [], el: []}), el: features}
                      } : null);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="Απαλό και αναπνέον ύφαμα&#10;Ανθεκτική ποιότητα εκτύωσης&#10;Άνετη κανονική εφαρμογή"
                  />
                </div>

                {/* Care Instructions - English */}
                <div>
                  <label className="text-white mb-2 block">
                    Care Instructions (English, one per line)
                  </label>
                  <textarea
                    value={editingProduct?.care?.en?.join('\n') || ''}
                    onChange={(e) => {
                      const care = e.target.value.split('\n').filter(c => c.trim());
                      setEditingProduct(prev => prev ? {
                        ...prev, 
                        care: {...(prev.care || {en: [], el: []}), en: care}
                      } : null);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="Machine wash cold&#10;Tumble dry low&#10;Do not iron on design"
                  />
                </div>

                {/* Care Instructions - Greek */}
                <div>
                  <label className="text-white mb-2 block">
                    Οδηγίες Φροντίδας (Ελληνικά, μία ανά γραμμή)
                  </label>
                  <textarea
                    value={editingProduct?.care?.el?.join('\n') || ''}
                    onChange={(e) => {
                      const care = e.target.value.split('\n').filter(c => c.trim());
                      setEditingProduct(prev => prev ? {
                        ...prev, 
                        care: {...(prev.care || {en: [], el: []}), el: care}
                      } : null);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    rows={4}
                    placeholder="Πλύσιμο σε κρύο νερό&#10;Στέγνωμα σε χαμηλή θερμοκ��ασία&#10;Μην σιδερώνετε το σχέδιο"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProduct}
                    disabled={saving}
                    className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving 
                      ? (language === 'el' ? 'Αποθήκευση...' : 'Saving...') 
                      : (language === 'el' ? 'Αποθήκευ��η' : 'Save')
                    }
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddForm(false);
                    }}
                    className="px-6 py-3 rounded-lg bg-[#444] hover:bg-[#555] text-white transition-colors cursor-pointer"
                  >
                    {language === 'el' ? 'Ακύρωση' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        {activeTab === 'products' && (
          <div className="grid gap-6">
            {/* Reset Products Button */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 mb-1">
                    {language === 'el' 
                      ? '⚠️ Παλιές εικόνες GitHub URLs' 
                      : '⚠️ Old GitHub URLs Images'
                    }
                  </p>
                  <p className="text-blue-200/70 text-sm">
                    {language === 'el' 
                      ? 'Κάντε reset τα προϊόντα για να χρησιμοποιήσετε τις νέες placeholder εικόνες. Στη συνέχεια upload τις δικές σας εικόνες.'
                      : 'Reset products to use new placeholder images. Then upload your own images.'
                    }
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (confirm(language === 'el' 
                      ? 'Θα διαγραφούν όλα τα προϊόντα και θα δημιουργηθούν νέα με placeholder εικόνες. Συνέχεια;'
                      : 'This will delete all products and create new ones with placeholder images. Continue?'
                    )) {
                      await initializeProducts();
                    }
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  {language === 'el' ? '🔄 Reset Products' : '🔄 Reset Products'}
                </button>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center text-white/70 py-12">
                {language === 'el' ? 'Δεν υπάρχουν προϊόντα' : 'No products yet'}
              </div>
            ) : (
              products.map((product) => (
                <div 
                  key={product.id} 
                  className={`bg-[#56514f] rounded-lg p-6 flex items-center gap-6 relative ${
                    product.hidden ? 'opacity-60 border-2 border-yellow-500/50' : ''
                  }`}
                >
                  {product.hidden && (
                    <div className="absolute top-3 right-3 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-semibold">
                      {language === 'el' ? 'ΚΡΥΦΟ' : 'HIDDEN'}
                    </div>
                  )}
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-24 h-24 object-contain bg-[#444] rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-white text-xl mb-2">{product.name}</h3>
                    <p className="text-white/80 mb-1">{product.price}€</p>
                    {product.colors && (
                      <p className="text-white/60 text-sm">
                        {language === 'el' ? 'Χρώματα: ' : 'Colors: '}
                        {product.colors.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleToggleHideProduct(product.id)}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${
                        product.hidden 
                          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300' 
                          : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300'
                      }`}
                      title={product.hidden 
                        ? (language === 'el' ? 'Εμφάνιση προϊόντος' : 'Show product')
                        : (language === 'el' ? 'Απόκρυψη προϊόντος' : 'Hide product')
                      }
                    >
                      {product.hidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-3 bg-[#444] hover:bg-[#555] rounded-lg text-white transition-colors cursor-pointer"
                      title={language === 'el' ? 'Επεξεργασία' : 'Edit'}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors cursor-pointer"
                      title={language === 'el' ? 'Διαγραφή' : 'Delete'}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Add Product Form - Inline below products */}
            {showAddForm && (
              <div className="bg-[#56514f] rounded-lg p-8 mt-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-2xl">
                    {language === 'el' ? 'Προσθήκη Προϊόντος' : 'Add Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddForm(false);
                    }}
                    className="text-white/70 hover:text-white cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-white mb-2 block">
                      {language === 'el' ? 'Όνομα Προϊόντος' : 'Product Name'} *
                    </label>
                    <input
                      type="text"
                      value={editingProduct?.name || ''}
                      onChange={(e) => setEditingProduct(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-white mb-2 block">
                      {language === 'el' ? 'Τιμή (€)' : 'Price (€)'} *
                    </label>
                    <input
                      type="number"
                      value={editingProduct?.price || 0}
                      onChange={(e) => setEditingProduct(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                      className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="text-white mb-2 block">Stripe URL</label>
                    <input
                      type="text"
                      value={editingProduct?.stripeUrl || ''}
                      onChange={(e) => setEditingProduct(prev => prev ? {...prev, stripeUrl: e.target.value} : null)}
                      className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  {/* Main Product Image */}
                  <div>
                    <label className="text-white mb-3 block">
                      {language === 'el' ? 'Κύρια Εικόνα Προϊόντος' : 'Main Product Image'} <span className="text-white/50 text-sm">(optional)</span>
                    </label>
                    <div className="flex gap-3 mb-3">
                      <label className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-4 py-3 rounded-lg transition-colors cursor-pointer">
                        {uploadingImages['main'] ? (
                          <><Loader className="w-4 h-4 animate-spin" /> {language === 'el' ? 'Ανέβασμα...' : 'Uploading...'}</>
                        ) : (
                          <><Upload className="w-4 h-4" /> {language === 'el' ? 'Ανέβασε Εικόνα' : 'Upload Image'}</>
                        )}
                        <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" disabled={uploadingImages['main']} />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={editingProduct?.image || ''}
                      onChange={(e) => setEditingProduct(prev => prev ? {...prev, image: e.target.value} : null)}
                      className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                      placeholder={language === 'el' ? 'ή βάλε URL εικόνας' : 'or paste image URL'}
                    />
                    {editingProduct?.image && (
                      <div className="mt-4 p-4 bg-[#444] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white/70 text-sm">{language === 'el' ? 'Προεπισκόπηση:' : 'Preview:'}</p>
                          <button onClick={() => setEditingProduct(prev => prev ? {...prev, image: ''} : null)} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors">
                            <XCircle size={16} /> {language === 'el' ? 'Αφαίρεση' : 'Remove'}
                          </button>
                        </div>
                        <img src={editingProduct.image} alt="Product preview" className="h-32 object-contain bg-white/10 rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProduct}
                      disabled={saving}
                      className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {saving
                        ? (language === 'el' ? 'Αποθήκευση...' : 'Saving...')
                        : (language === 'el' ? 'Αποθήκευση' : 'Save')
                      }
                    </button>
                    <button
                      onClick={() => { setEditingProduct(null); setShowAddForm(false); }}
                      className="px-6 py-3 rounded-lg bg-[#444] hover:bg-[#555] text-white transition-colors cursor-pointer"
                    >
                      {language === 'el' ? 'Ακύρωση' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {loadingSettings ? (
              <div className="text-center text-white py-12">
                {language === 'el' ? 'Φόρτωση...' : 'Loading...'}
              </div>
            ) : siteSettings ? (
              <>
                {/* Shipping Settings */}
                <div className="bg-[#56514f] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-2xl">
                      {language === 'el' ? 'Κόστη Αποστολής' : 'Shipping Costs'}
                    </h2>
                    <button
                      onClick={() => {
                        const countryCode = prompt(language === 'el' ? 'Κωδικός Χώρας (π.χ. IT):' : 'Country Code (e.g. IT):');
                        if (!countryCode) return;
                        
                        const countryName = prompt(language === 'el' ? 'Όνομα Χώρας (Ελληνικά):' : 'Country Name (Greek):');
                        if (!countryName) return;
                        
                        const countryNameEn = prompt(language === 'el' ? 'Όνομα Χώρας (English):' : 'Country Name (English):');
                        if (!countryNameEn) return;
                        
                        const cost = prompt(language === 'el' ? 'Κόστος Αποστολής (€):' : 'Shipping Cost (€):');
                        if (!cost) return;
                        
                        const updatedSettings = {
                          ...siteSettings,
                          shippingCosts: {
                            ...(siteSettings.shippingCosts || {}),
                            [countryCode.toUpperCase()]: {
                              name: countryName,
                              nameEn: countryNameEn,
                              cost: parseFloat(cost)
                            }
                          }
                        };
                        saveSiteSettings(updatedSettings);
                      }}
                      className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {language === 'el' ? 'Νέα Χώρα' : 'Add Country'}
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {siteSettings.shippingCosts && Object.entries(siteSettings.shippingCosts).map(([code, data]: [string, any]) => (
                      <div key={code} className="bg-[#444] rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-white mb-1">
                            {code} - {language === 'el' ? data.name : data.nameEn}
                          </div>
                          <div className="text-white/60 text-sm">
                            {language === 'el' ? 'Κόστος: ' : 'Cost: '}{data.cost}€
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newCost = prompt(
                                language === 'el' 
                                  ? `Νέο κόστος για ${data.name} (€):` 
                                  : `New cost for ${data.nameEn} (€):`,
                                data.cost.toString()
                              );
                              if (newCost) {
                                const updatedSettings = {
                                  ...siteSettings,
                                  shippingCosts: {
                                    ...siteSettings.shippingCosts,
                                    [code]: {
                                      ...data,
                                      cost: parseFloat(newCost)
                                    }
                                  }
                                };
                                saveSiteSettings(updatedSettings);
                              }
                            }}
                            className="p-2 bg-[#555] hover:bg-[#666] rounded text-white transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(language === 'el' ? 'Είστε σίγουροι;' : 'Are you sure?')) {
                                const { [code]: removed, ...remaining } = siteSettings.shippingCosts;
                                const updatedSettings = {
                                  ...siteSettings,
                                  shippingCosts: remaining
                                };
                                saveSiteSettings(updatedSettings);
                              }
                            }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logo Settings */}
                <div className="bg-[#56514f] rounded-lg p-6">
                  <h2 className="text-white text-2xl mb-6">
                    {language === 'el' ? 'Ρυθμίσεις Logo' : 'Logo Settings'}
                  </h2>

                  {/* Info Banner */}
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
                    <p className="text-blue-200 text-sm">
                      {language === 'el' 
                        ? '💡 Για καλύτερα αποτελέσματα, κάντε upload το logo σας χρησιμοποιώντας το κουμπί "Ανέβασε Logo". Το GitHub raw URLs ίσως να μην λειτουργούν λόγω CORS restrictions.'
                        : '💡 For best results, upload your logo using the "Upload Logo" button. GitHub raw URLs may not work due to CORS restrictions.'
                      }
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white mb-3 block">
                        {language === 'el' ? 'Logo Εικόνα' : 'Logo Image'}
                      </label>
                      
                      {/* File Upload Button */}
                      <div className="flex gap-3 mb-3">
                        <label className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-4 py-3 rounded-lg transition-colors cursor-pointer">
                          {uploadingImages['logo'] ? (
                            <><Loader className="w-4 h-4 animate-spin" /> {language === 'el' ? 'Ανέβασμα...' : 'Uploading...'}</>
                          ) : (
                            <><Upload className="w-4 h-4" /> {language === 'el' ? 'Ανέβασε Logo' : 'Upload Logo'}</>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            disabled={uploadingImages['logo']}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={siteSettings.logoUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, logoUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                        placeholder={language === 'el' ? 'ή βάλε URL logo' : 'or paste logo URL'}
                      />
                      
                      {siteSettings.logoUrl && (
                        <div className="mt-4 p-4 bg-[#444] rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-white/70 text-sm">
                              {language === 'el' ? 'Προεπισκόπηση:' : 'Preview:'}
                            </p>
                            <button
                              onClick={() => setSiteSettings({ ...siteSettings, logoUrl: '' })}
                              className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors"
                              title={language === 'el' ? 'Αφαίρεση logo' : 'Remove logo'}
                            >
                              <XCircle size={16} />
                              {language === 'el' ? 'Αφαίρεση' : 'Remove'}
                            </button>
                          </div>
                          <img 
                            src={siteSettings.logoUrl} 
                            alt="Logo preview"
                            className="h-16 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => saveSiteSettings(siteSettings)}
                      disabled={saving}
                      className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {saving 
                        ? (language === 'el' ? 'Αποθήκευση...' : 'Saving...') 
                        : (language === 'el' ? 'Αποθήκευση' : 'Save Changes')
                      }
                    </button>

                    {/* Debug Button */}
                    <button
                      onClick={async () => {
                        console.log('🔍 DEBUG: Current siteSettings in state:', siteSettings);
                        
                        // Fetch from backend to see what's actually stored
                        const response = await fetch(
                          `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/site-settings`,
                          {
                            headers: {
                              'Authorization': `Bearer ${publicAnonKey}`,
                            },
                          }
                        );
                        
                        if (response.ok) {
                          const data = await response.json();
                          console.log('🔍 DEBUG: Settings from backend:', data.settings);
                          console.log('🔍 DEBUG: Logo URL from backend:', data.settings?.logoUrl);
                          alert(`Logo URL: ${data.settings?.logoUrl || 'NOT SET'}`);
                        }
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm"
                    >
                      {language === 'el' ? '🔍 Debug Info' : '🔍 Debug Info'}
                    </button>
                  </div>
                </div>

                {/* Contact Settings */}
                <div className="bg-[#56514f] rounded-lg p-6">
                  <h2 className="text-white text-2xl mb-6">
                    {language === 'el' ? 'Ρυθμίσεις Επικοινωνίας' : 'Contact Settings'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white mb-2 block">
                        {language === 'el' ? 'Email Επικοινωνίας' : 'Contact Email'}
                      </label>
                      <input
                        type="email"
                        value={siteSettings.contactEmail || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-white mb-2 block">
                        {language === 'el' ? 'Χρόνος Απάντησης (Ελληνικά)' : 'Response Time (Greek)'}
                      </label>
                      <input
                        type="text"
                        value={siteSettings.responseTime?.el || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          responseTime: { ...siteSettings.responseTime, el: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                        placeholder="Συνήθως απαντάμε εντός 24-48 ωρών"
                      />
                    </div>

                    <div>
                      <label className="text-white mb-2 block">
                        Response Time (English)
                      </label>
                      <input
                        type="text"
                        value={siteSettings.responseTime?.en || ''}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          responseTime: { ...siteSettings.responseTime, en: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg bg-[#444] text-white border border-white/20 focus:border-white/40 focus:outline-none"
                        placeholder="We typically respond in 24-48 hours"
                      />
                    </div>

                    <button
                      onClick={() => saveSiteSettings(siteSettings)}
                      disabled={saving}
                      className="flex items-center gap-2 bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {saving 
                        ? (language === 'el' ? 'Αποθήκευση...' : 'Saving...') 
                        : (language === 'el' ? 'Αποθήκευση' : 'Save Changes')
                      }
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-white/70 py-12">
                {language === 'el' ? 'Σφάλμα φόρτωσης ρυθμίσεων' : 'Error loading settings'}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}