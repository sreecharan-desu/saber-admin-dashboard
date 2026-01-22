import { useState } from 'react';
import { api } from '../lib/api';
import type { AIKeyResponse } from '../types';
import { Key, RotateCcw, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [keyResponse, setKeyResponse] = useState<AIKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const rotateKey = async () => {
    if (!window.confirm("Are you sure you want to rotate the AI API Key? Any service using the old key will stop working immediately.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/ai/keys');
      setKeyResponse(res.data);
      setCopied(false);
    } catch (err) {
      console.error('Failed to rotate AI key', err);
      alert("Failed to rotate key. Please check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (keyResponse?.new_key) {
      navigator.clipboard.writeText(keyResponse.new_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 font-normal">Manage your system-wide security and configuration.</p>
      </div>

      <div className="card-base">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-900 bg-gray-50">
                <Key size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">AI / Internal API Keys</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-md font-normal leading-relaxed">
                  Used by background services and AI models for system-to-system authentication.
                </p>
              </div>
            </div>
            <button
              onClick={rotateKey}
              disabled={loading}
              className="btn-primary"
            >
              <RotateCcw size={14} className={clsx("mr-2", loading && "animate-spin")} />
              Rotate API Key
            </button>
          </div>

          {keyResponse && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm mb-3">
                  <AlertTriangle size={16} className="text-gray-900" />
                  One-Time Secret Visibility
                </div>
                <p className="text-sm text-gray-600 mb-6 font-normal">
                  This key is only displayed once. Securely copy it now for your environment configuration.
                </p>
                
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1 pl-4">
                  <code className="flex-1 text-xs font-mono text-gray-900 truncate tracking-tight">
                    {keyResponse.new_key}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className={clsx(
                      "btn-base h-8 px-4",
                      copied 
                        ? "bg-black text-white" 
                        : "btn-primary"
                    )}
                  >
                    {copied ? <CheckCircle size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                
                <p className="mt-4 text-[11px] text-gray-400 font-mono text-center uppercase tracking-widest">
                  SH-256 GENERATED AT {new Date(keyResponse.generated_at).toISOString().split('T')[0]}
                </p>
              </div>
            </div>
          )}

          {!keyResponse && (
            <div className="mt-8 border border-dashed border-gray-100 rounded-lg py-16 text-center text-gray-400">
              <Key size={40} className="mx-auto mb-3 opacity-20 grayscale" />
              <p className="text-xs uppercase tracking-widest font-mono">No Active Rotations Pending</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-8 py-3 border-t border-gray-200">
          <p className="text-[11px] text-gray-400 flex items-center gap-2 uppercase font-mono tracking-widest">
            <CheckCircle size={10} className="text-gray-900" />
            Audit Log updated
          </p>
        </div>
      </div>
    </div>
  );
}
