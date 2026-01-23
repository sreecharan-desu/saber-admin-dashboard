import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Building, Globe, CheckCircle, AlertCircle, Sparkles, Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function CompanyProfile() {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // Query to fetch company data (Cached for 5 mins by default)
  const { data: company, isLoading: fetching, refetch } = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
        const res = await api.get('/recruiters/company');
        return res.data.company;
    },
    staleTime: 1000 * 60 * 60, // 1 hour aggressively cached as requested "must refresh"
  });

  // Sync data to form when fetched
  useEffect(() => {
    if (company) {
        setFormData({
            name: company.name || '',
            website: company.website || ''
        });
        if (company.logo_url) setLogoPreview(company.logo_url);
        if (company.cover_image_url) setCoverPreview(company.cover_image_url);
    }
  }, [company]);

  // Mutation for saving
  const saveMutation = useMutation({
    mutationFn: async () => {
        // 1. Save text data
        await api.post('/recruiters/company', formData);

        // 2. Upload images if changed
        if (logo || coverImage) {
            const imageData = new FormData();
            if (logo) imageData.append('logo', logo);
            if (coverImage) imageData.append('cover_image', coverImage);
            
            await api.put('/recruiters/company/images', imageData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
    },
    onSuccess: async () => {
        await refreshUser();
        // Invalidate query to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ['company'] });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
    },
    onError: (err) => {
        console.error(err);
        setStatus('error');
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
      const file = e.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      if (type === 'logo') {
          setLogo(file);
          setLogoPreview(previewUrl);
      } else {
          setCoverImage(file);
          setCoverPreview(previewUrl);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    saveMutation.mutate();
  };

  const loading = saveMutation.isPending;

  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold tracking-tighter text-foreground">Company Profile</h2>
            <p className="text-sm text-secondary-foreground mt-1 font-normal">Manage the identity of your organization.</p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={fetching}
          className="btn-secondary h-11 w-11 p-0 flex items-center justify-center border-gray-200 disabled:opacity-50 hover:border-black transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={16} className={fetching ? 'animate-spin' : 'text-gray-500'} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} 
                className="card-base p-10 space-y-8 bg-white"
            >
                {/* Form fields same as before, simplified for brevity in instruction but included fully below */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-bold text-secondary-foreground uppercase tracking-widest mb-3">Organization Name</label>
                        <div className="relative group">
                            <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                className="input-base pl-10 transition-all focus:ring-1 focus:ring-black focus:border-black"
                                placeholder="Acme Engineering"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-secondary-foreground uppercase tracking-widest mb-3">Web Domain</label>
                        <div className="relative group">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="url"
                                className="input-base pl-10 transition-all focus:ring-1 focus:ring-black focus:border-black"
                                placeholder="https://acme.org"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Brand Assets */}
                    <div className="pt-8 border-t border-gray-100">
                        <label className="block text-[11px] font-bold text-secondary-foreground uppercase tracking-widest mb-6">Brand Assets</label>
                        
                        {/* Live Preview Card */}
                        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="text-xs font-medium text-gray-500 mb-4">Candidate Feed Preview</h4>
                            <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                <div className="h-32 bg-gray-100 relative">
                                    {coverPreview ? (
                                        <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <span className="text-xs">No Cover Image</span>
                                        </div>
                                    )}
                                    <div className="absolute -bottom-8 left-6">
                                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 p-1 shadow-sm">
                                            {logoPreview ? (
                                                <img src={logoPreview} className="w-full h-full object-contain rounded-md" alt="Logo" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center text-gray-300">
                                                    <Building size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-10 pb-4 px-6">
                                    <h3 className="font-bold text-lg text-gray-900">{formData.name || 'Company Name'}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{formData.website || 'website.com'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Upload Logo</label>
                                <div 
                                    className="h-32 w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-black transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-50 relative group"
                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                >
                                    {logoPreview ? (
                                        <img src={logoPreview} className="w-full h-full object-contain p-4 opacity-50 group-hover:opacity-100 transition-opacity" alt="Logo preview" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Camera size={18} className="text-gray-400 group-hover:text-black" />
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-medium">Click to upload</span>
                                        </div>
                                    )}
                                </div>
                                <input 
                                    id="logo-upload" 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'logo')}
                                />
                            </div>

                            {/* Cover Image Upload */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Upload Cover Image</label>
                                <div 
                                    className="h-32 w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-black transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-50 relative group"
                                    onClick={() => document.getElementById('cover-upload')?.click()}
                                >
                                    {coverPreview ? (
                                        <img src={coverPreview} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="Cover preview" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Camera size={18} className="text-gray-400 group-hover:text-black" />
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-medium">Click to upload</span>
                                        </div>
                                    )}
                                </div>
                                <input 
                                    id="cover-upload" 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'cover')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {status === 'success' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full"
                            >
                                <CheckCircle size={14} />
                                <span className="text-[11px] font-bold tracking-tight">Saved successfully</span>
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-full"
                            >
                                <AlertCircle size={14} />
                                <span className="text-[11px] font-bold tracking-tight">Update failed</span>
                            </motion.div>
                        )}
                        {status === 'idle' && <div />}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-8 h-11 text-[13px] font-bold tracking-tight min-w-[140px] flex items-center justify-center gap-2"
                    >
                        {loading && <RefreshCw size={14} className="animate-spin" />}
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </motion.form>
        </div>

        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">About Profile</h3>
                <div className="card-base p-6 space-y-4 bg-white">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <Sparkles size={18} className="text-black" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground mb-1">Company Details</h4>
                            <p className="text-xs text-secondary-foreground font-normal leading-relaxed">
                                Your organization details help candidates find you and understand your culture.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-base p-6 border-dashed bg-gray-50/50">
                <p className="text-[11px] text-secondary-foreground font-normal leading-relaxed">
                    Need to link multiple workspaces? <br/>
                    <span className="text-foreground font-medium cursor-pointer hover:underline">Contact enterprise support</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
