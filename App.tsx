
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TrendAnalysis from './components/TrendAnalysis';
import AIChat from './components/AIChat';
import VoiceAssistant from './components/VoiceAssistant';
import Auth from './components/Auth';
import FamilyShare from './components/FamilyShare';
import Settings from './components/Settings';
import HealthIndicators from './components/HealthIndicators';
import { db } from './utils/storage';
import { MedicalReport, Medication, User } from './types';
import { analyzeMedicalReport } from './services/gemini';
import { 
  FileUp, 
  X, 
  Loader2, 
  Sparkles, 
  Download, 
  Eye, 
  MessageSquare,
  Bot,
  Mic,
  Plus
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [reports, setReports] = React.useState<MedicalReport[]>([]);
  const [medications, setMedications] = React.useState<Medication[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isMedModalOpen, setIsMedModalOpen] = React.useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = React.useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState<MedicalReport | null>(null);

  // New Medication State
  const [newMed, setNewMed] = React.useState({ name: '', dosage: '', frequency: '', purpose: '' });

  React.useEffect(() => {
    if (user) {
      setReports(db.getReports(user.id));
      setMedications(db.getMedications(user.id));
    }
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    setIsProcessing(true);
    
    const reader = new FileReader();
    
    reader.onerror = () => {
      setIsProcessing(false);
      alert("Error reading file.");
    };

    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      if (!base64) {
        setIsProcessing(false);
        return;
      }

      try {
        const analyzed = await analyzeMedicalReport(base64, file.name);
        
        const final: MedicalReport = {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split('T')[0],
          title: analyzed.title || 'Extracted Report',
          type: (analyzed.type as any) || 'Blood Test',
          summary: analyzed.summary || 'Summary generation failed.',
          explanation: analyzed.explanation || 'Detailed explanation unavailable.',
          indicators: analyzed.indicators || [],
        };
        
        db.saveReport(user.id, final);
        setReports(prev => [final, ...prev]);
        setIsUploadModalOpen(false);
        setActiveTab('reports');
      } catch (err) {
        console.error("Upload process error:", err);
        alert(err instanceof Error ? err.message : "The AI was unable to parse this document. Please ensure the image is clear and try again.");
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleAddMed = () => {
    if (!user || !newMed.name) return;
    const med: Medication = {
      ...newMed,
      id: Math.random().toString(),
      startDate: new Date().toISOString(),
      remainingDoses: 30
    };
    db.saveMedication(user.id, med);
    setMedications(prev => [med, ...prev]);
    setIsMedModalOpen(false);
    setNewMed({ name: '', dosage: '', frequency: '', purpose: '' });
  };

  if (!user) return <Auth onLogin={setUser} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard reports={reports} medications={medications} onNavigate={setActiveTab} userName={user.name} />;
      case 'reports':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-slate-800">Your Reports</h1>
            <div className="grid grid-cols-1 gap-4">
              {reports.length > 0 ? reports.map((report) => (
                <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:border-blue-300 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full">{report.type}</span>
                      <span className="text-xs text-slate-400">{report.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{report.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{report.summary}</p>
                  </div>
                  <button onClick={() => setSelectedReport(report)} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold">View Analysis</button>
                </div>
              )) : (
                <div className="text-center p-20 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                   <p className="text-slate-400">No reports found. Upload one to start.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'medications':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Medications</h1>
                <button onClick={() => setIsMedModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
                  <Plus className="w-5 h-5" /> Add Medication
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medications.length > 0 ? medications.map(med => (
                  <div key={med.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800">{med.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{med.purpose}</p>
                    <div className="flex gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Dosage</p>
                        <p className="text-sm font-bold">{med.dosage}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Frequency</p>
                        <p className="text-sm font-bold">{med.frequency}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="md:col-span-2 text-center p-20 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                    <p className="text-slate-400">Track your prescriptions by adding them above.</p>
                  </div>
                )}
              </div>
          </div>
        );
      case 'trends':
        return <TrendAnalysis />;
      case 'family':
        return <FamilyShare currentUser={user} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onUploadClick={() => setIsUploadModalOpen(true)} onVoiceClick={() => setIsVoiceAssistantOpen(true)} userName={user.name}>
      {renderContent()}

      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        <button onClick={() => setIsVoiceAssistantOpen(true)} className="w-16 h-16 bg-white text-blue-600 border border-slate-200 rounded-full shadow-2xl flex items-center justify-center hover:bg-slate-50 transition-all hover:scale-110"><Mic className="w-7 h-7" /></button>
        <button onClick={() => setIsAIChatOpen(true)} className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110"><MessageSquare className="w-7 h-7" /></button>
      </div>

      {isAIChatOpen && <AIChat onClose={() => setIsAIChatOpen(false)} />}
      {isVoiceAssistantOpen && <VoiceAssistant onClose={() => setIsVoiceAssistantOpen(false)} />}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Upload Report</h3>
              <button onClick={() => setIsUploadModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-8">
              {isProcessing ? (
                <div className="flex flex-col items-center py-10">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  <p className="font-bold">AI Analyzing...</p>
                  <p className="text-xs text-slate-500 mt-2">Transcribing handwriting and analyzing data</p>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center cursor-pointer block hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  <FileUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <p className="font-bold">Choose a file or drag here</p>
                  <p className="text-xs text-slate-400 mt-2">Upload a photo of your prescription or report</p>
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Medication Modal */}
      {isMedModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Add Medication</h3>
            <div className="space-y-4">
              <input placeholder="Name (e.g. Lipitor)" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
              <input placeholder="Dosage (e.g. 10mg)" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
              <input placeholder="Frequency (e.g. Once daily)" value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
              <input placeholder="Purpose" value={newMed.purpose} onChange={e => setNewMed({...newMed, purpose: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsMedModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                <button onClick={handleAddMed} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">{selectedReport.title}</h3>
              <button onClick={() => setSelectedReport(null)} className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Patient Friendly Explanation</h4>
                <p className="text-lg font-medium text-slate-800 leading-relaxed italic">"{selectedReport.explanation}"</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedReport.indicators.map((ind, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                       <span className="font-bold text-slate-700">{ind.label}</span>
                       <HealthIndicators status={ind.status} showLabel />
                    </div>
                    <div className="flex items-end justify-between">
                       <span className="text-3xl font-black">{ind.value}</span>
                       <span className="text-xs text-slate-400 font-bold uppercase">Range: {ind.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
