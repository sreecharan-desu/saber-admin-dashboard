import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Building, Globe, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompanyProfile() {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
      try {
          const res = await api.get('/recruiters/company');
          const company = res.data.company;
          if (company) {
              setFormData({
                  name: company.name || '',
                  website: company.website || ''
              });
          }
      } catch (err) {
          console.error("Failed to fetch company", err);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    try {
      await api.post('/recruiters/company', formData);
      await refreshUser();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-bold tracking-tighter text-white">Company Profile</h2>
            <p className="text-sm text-gray-500 mt-1 font-normal">Manage the technical identity of your engineering organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} 
                className="card-base p-10 space-y-8 bg-[#050505]"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Organization Name</label>
                        <div className="relative">
                            <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="text"
                                className="input-base pl-10"
                                placeholder="Acme Engineering"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Web Domain</label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="url"
                                className="input-base pl-10"
                                placeholder="https://acme.org"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {status === 'success' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2 text-green-500"
                            >
                                <CheckCircle size={16} />
                                <span className="text-[12px] font-medium">Changes synchronized</span>
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2 text-red-500"
                            >
                                <AlertCircle size={16} />
                                <span className="text-[12px] font-medium">Update failed</span>
                            </motion.div>
                        )}
                        {status === 'idle' && <div />}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary px-8 h-11 text-[13px] font-bold tracking-tight min-w-[140px]"
                    >
                        {loading ? 'Processing...' : 'Save Configuration'}
                    </button>
                </div>
            </motion.form>
        </div>

        <div className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">About Workspaces</h3>
                <div className="card-base p-6 space-y-4 bg-black">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-900 rounded-lg border border-gray-800">
                            <Sparkles size={18} className="text-vercel-blue" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">AI Context</h4>
                            <p className="text-xs text-gray-500 font-normal leading-relaxed">
                                Your organization details help our AI refine candidate matches based on your technical culture.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-base p-6 bg-[#0a0a0a] border-dashed border-gray-800">
                <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
                    Need to link multiple workspaces? <br/>
                    <span className="text-white cursor-pointer hover:underline">Contact enterprise support</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
