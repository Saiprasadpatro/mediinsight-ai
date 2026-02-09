
import React from 'react';
import { Bell, Lock, Shield, Database, User as UserIcon, Mail, Linkedin, LifeBuoy } from 'lucide-react';
import { User } from '../types';

const Settings: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-slate-500">Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" /> Personal Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Display Name</label>
                <input type="text" defaultValue={user.name} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                <input type="email" defaultValue={user.email} disabled className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed" />
              </div>
            </div>
            <button className="mt-8 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Save Changes</button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" /> Notifications
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Medication Reminders', desc: 'Get alerts when it\'s time for your doses.' },
                { label: 'New Report Alerts', desc: 'Notify when AI completes a report analysis.' },
                { label: 'Security Alerts', desc: 'Get notified about new logins to your vault.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-bold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-blue-600" /> Support & Contact
            </h3>
            <p className="text-sm text-slate-500 mb-6">Need help or have feedback? Reach out to the developer directly.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="mailto:saiprasadpatro389@gmail.com"
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Email Us</p>
                    <p className="text-xs text-slate-400">Get direct support</p>
                  </div>
                </div>
              </a>
              <a 
                href="https://www.linkedin.com/in/sai-prasad-patro-5654c83/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">LinkedIn</p>
                    <p className="text-xs text-slate-400">Professional profile</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800">Storage Usage</h4>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-500 w-1/4"></div>
            </div>
            <p className="text-xs text-slate-500 font-medium">125MB of 2GB Premium Storage used</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> Security
            </h3>
            <div className="space-y-6">
              <button className="w-full py-4 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all">Enable Two-Factor (2FA)</button>
              <button className="w-full py-4 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all">Download Audit Log</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
