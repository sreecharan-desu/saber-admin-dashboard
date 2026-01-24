import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Building, Globe, CheckCircle, AlertCircle, Sparkles, Camera, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
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

    const { data: company, isLoading: fetching, refetch } = useQuery({
        queryKey: ['company'],
        queryFn: async () => {
            const res = await api.get('/recruiters/company');
            return res.data.company;
        },
        staleTime: 1000 * 60 * 60,
    });

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

    const saveMutation = useMutation({
        mutationFn: async () => {
            await api.post('/recruiters/company', formData);

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
        <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-outfit">
                        Organization
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium max-w-md leading-relaxed">
                        Specify your organization's public identity and visual branding parameters.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={fetching}
                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-gray-200 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                    title="Sync from engine"
                >
                    <RefreshCw size={18} strokeWidth={2.5} className={fetching ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8">
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-12"
                    >
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.15em] ml-1">Identity Name</label>
                                    <div className="relative group">
                                        <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-6 text-[14px] font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-black transition-all shadow-sm"
                                            placeholder="e.g. Saber Technologies"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.15em] ml-1">Web Domain</label>
                                    <div className="relative group">
                                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="url"
                                            className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-6 text-[14px] font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-black transition-all shadow-sm"
                                            placeholder="https://saber.ai"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-50">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.15em] ml-1 mb-1">Visual Assets</label>
                                        <p className="text-[11px] text-gray-400 font-medium">Standardize your appearance across the radar.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Logo Upload */}
                                    <div className="space-y-4">
                                        <div
                                            className="h-48 w-full rounded-[32px] border-2 border-dashed border-gray-100 hover:border-black hover:bg-gray-50/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-50/30 group relative"
                                            onClick={() => document.getElementById('logo-upload')?.click()}
                                        >
                                            {logoPreview ? (
                                                <div className="relative w-full h-full flex items-center justify-center p-8">
                                                    <img src={logoPreview} className="max-w-full max-h-full object-contain relative z-10 drop-shadow-sm" alt="Logo preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                                        <Camera className="text-white" size={24} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Camera size={20} className="text-gray-400 group-hover:text-black" />
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Upload Mark</span>
                                                </div>
                                            )}
                                        </div>
                                        <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                        <p className="text-[10px] text-gray-400 font-medium text-center italic">Supported: PNG, SVG, WebP (Square preferred)</p>
                                    </div>

                                    {/* Cover Upload */}
                                    <div className="space-y-4">
                                        <div
                                            className="h-48 w-full rounded-[32px] border-2 border-dashed border-gray-100 hover:border-black hover:bg-gray-50/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-50/30 group relative"
                                            onClick={() => document.getElementById('cover-upload')?.click()}
                                        >
                                            {coverPreview ? (
                                                <div className="relative w-full h-full">
                                                    <img src={coverPreview} className="w-full h-full object-cover" alt="Cover preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Camera className="text-white" size={24} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Layers size={20} className="text-gray-400 group-hover:text-black" />
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Upload Cover</span>
                                                </div>
                                            )}
                                        </div>
                                        <input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                                        <p className="text-[10px] text-gray-400 font-medium text-center italic">Standard: 1200x400 (Landscape preferred)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {status === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex items-center gap-2.5 text-black px-4 py-2 rounded-full border border-black/10 bg-gray-50"
                                        >
                                            <CheckCircle size={14} strokeWidth={3} />
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider">Sync Successful</span>
                                        </motion.div>
                                    )}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex items-center gap-2.5 text-red-600 px-4 py-2 rounded-full border border-red-100 bg-red-50"
                                        >
                                            <AlertCircle size={14} strokeWidth={3} />
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider">Update Rejected</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-14 px-10 rounded-2xl bg-black text-white text-[13px] font-extrabold flex items-center gap-3 transition-all hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={18} strokeWidth={2.5} />}
                                {loading ? 'Processing...' : 'Deploy Changes'}
                            </button>
                        </div>
                    </motion.form>
                </div>

                <div className="xl:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.2em] ml-2">Public Canvas</h3>
                        <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.03)] group">
                            <div className="h-32 bg-gray-50 relative overflow-hidden">
                                {coverPreview ? (
                                    <img src={coverPreview} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cover preview" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Layers size={24} className="text-gray-100" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute -bottom-8 left-8">
                                    <div className="w-20 h-20 bg-white rounded-3xl border border-gray-100 p-2 shadow-xl">
                                        {logoPreview ? (
                                            <img src={logoPreview} className="w-full h-full object-contain rounded-2xl" alt="Logo preview" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                                                <Building size={24} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-8 px-8">
                                <h3 className="font-extrabold text-xl text-gray-900 font-outfit leading-tight mb-1">{formData.name || 'Organization Name'}</h3>
                                <p className="text-[13px] text-gray-500 font-bold tracking-tight">{formData.website ? formData.website.replace(/^https?:\/\//, '') : 'domain.sh'}</p>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center">
                                            <Sparkles size={12} className="text-black" />
                                        </div>
                                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Active Radar</span>
                                    </div>
                                    <div className="text-[10px] font-extrabold text-black">Live Preview</div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
