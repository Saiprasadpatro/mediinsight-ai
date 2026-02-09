
import React from 'react';
import { Users, Plus, Shield, User as UserIcon } from 'lucide-react';
import { db } from '../utils/storage';
import { User } from '../types';

interface FamilyShareProps {
  currentUser: User;
}

const FamilyShare: React.FC<FamilyShareProps> = ({ currentUser }) => {
  const [members, setMembers] = React.useState<any[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    setMembers(db.getFamilyMembers(currentUser.id));
  }, [currentUser]);

  const handleAdd = () => {
    if (!name) return;
    const newMember = { name, relation: 'Family Member', id: Math.random().toString() };
    db.addFamilyMember(currentUser.id, newMember);
    setMembers([...members, newMember]);
    setName('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Family Profiles</h1>
        <p className="text-slate-500">Manage medical history for your loved ones securely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border-2 border-blue-600 shadow-lg relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Primary</div>
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">{currentUser.name}</h3>
          <p className="text-sm text-slate-500">Self</p>
        </div>

        {members.map(member => (
          <div key={member.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              <UserIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
            <p className="text-sm text-slate-500">{member.relation}</p>
          </div>
        ))}

        <button 
          onClick={() => setShowForm(true)}
          className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
        >
          <Plus className="w-10 h-10" />
          <span className="font-bold">Add Member</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Add Family Member</h3>
            <div className="space-y-4">
              <input 
                autoFocus
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-medium"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200">Add Member</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <Shield className="w-10 h-10 text-blue-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold mb-2">Private & Isolated Profiles</h4>
          <p className="text-slate-400 leading-relaxed">Each family profile is stored with unique encryption keys. Medical data is never shared between profiles unless explicitly permitted by the account owner.</p>
        </div>
      </div>
    </div>
  );
};

export default FamilyShare;
