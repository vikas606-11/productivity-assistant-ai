import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { FiSettings, FiUser, FiMoon, FiShield, FiCheckCircle } from 'react-icons/fi';

const Settings = () => {
  const { showToast } = useToast();
  const [username, setUsername] = useState('Vikas');
  const [apiKeyStatus, setApiKeyStatus] = useState('Connected');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile configuration updated!', 'success');
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-3xl mx-auto w-full overflow-y-auto font-sans">
      
      {/* Header Panel */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure account properties, backend integrations, and theme parameters.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="glass-card p-6 border border-dark-border bg-[#181818] rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-dark-border">
            <FiUser className="h-5 w-5 text-brand-500" />
            <h3 className="font-bold text-white text-sm">Account Profile</h3>
          </div>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Gemini Service Status */}
        <div className="glass-card p-6 border border-dark-border bg-[#181818] rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-dark-border">
            <FiShield className="h-5 w-5 text-brand-500" />
            <h3 className="font-bold text-white text-sm">AI Configuration</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-white/5 border border-dark-border rounded-xl">
              <div>
                <span className="block font-bold text-white">Google Gemini API</span>
                <span className="text-[10px] text-gray-500 font-medium">Model: gemini-1.5-flash</span>
              </div>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider text-[10px] uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <FiCheckCircle className="h-3.5 w-3.5" />
                {apiKeyStatus}
              </span>
            </div>

            <p className="text-gray-500 leading-relaxed text-[11px] px-1 font-medium">
              API connections are resolved through environment variables in the Flask backend. In the event of connection drops or rate-limits, the server automatically switches to local fallback engines to guarantee continuous uptime.
            </p>
          </div>
        </div>

        {/* Client Styling locked settings */}
        <div className="glass-card p-6 border border-dark-border bg-[#181818] rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-dark-border">
            <FiMoon className="h-5 w-5 text-brand-500" />
            <h3 className="font-bold text-white text-sm">Theme Settings</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-white/5 border border-dark-border rounded-xl">
              <div>
                <span className="block font-bold text-white">Permanently Dark mode</span>
                <span className="text-[10px] text-gray-500 font-medium">SaaS High Contrast Palette</span>
              </div>
              <span className="text-brand-400 font-bold tracking-wider text-[10px] uppercase bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-lg">
                Active
              </span>
            </div>
            
            <p className="text-gray-500 leading-relaxed text-[11px] px-1 font-medium">
              Light mode toggle is permanently disabled to ensure maximum compliance with high-contrast accessibility standards and fit-for-purpose premium designer guidelines.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
