import { useState } from 'react';
import { api } from '../lib/api';
import { Building, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function CompanyProfile() {
  const [formData, setFormData] = useState({ name: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    try {
      await api.post('/company', formData);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Company Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">Manage your company's public information.</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {status === 'success' && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Profile Initialized</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your company profile has been successfully created/updated.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Failed to update company profile. The name might be taken or you might already have one linked.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Company Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="company-name"
                id="company-name"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="Acme Corp"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                name="website"
                id="website"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                loading && "opacity-75 cursor-wait"
              )}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
