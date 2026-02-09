
import React from 'react';
import { Activity, ShieldCheck, Clock, ArrowRight, Pill, Sparkles, Loader2 } from 'lucide-react';
import { MedicalReport, Medication, HealthStatus } from '../types';
import HealthIndicators from './HealthIndicators';
import { getHealthInsights } from '../services/gemini';

interface DashboardProps {
  reports: MedicalReport[];
  medications: Medication[];
  onNavigate: (tab: string) => void;
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, medications, onNavigate, userName }) => {
  const [insight, setInsight] = React.useState<string>('');
  const [loadingInsight, setLoadingInsight] = React.useState(false);

  React.useEffect(() => {
    if (reports.length > 0) {
      setLoadingInsight(true);
      getHealthInsights(reports).then(res => {
        setInsight(res || '');
        setLoadingInsight(false);
      });
    }
  }, [reports]);

  const recentReport = reports[0];
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {userName}!</h1>
          <p className="text-slate-500">Your secure health vault is up to date.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <div className="text-xs">
            <p className="text-slate-400 uppercase font-bold tracking-tight">Status</p>
            <p className="text-slate-800 font-semibold">Active Encryption</p>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[32px] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-white/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-200" />
            <h4 className="font-bold tracking-tight uppercase text-xs text-blue-100">AI Health Summary</h4>
          </div>
          {loadingInsight ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-blue-100 italic">Synthesizing your medical history...</p>
            </div>
          ) : (
            <p className="text-lg font-medium leading-relaxed max-w-2xl">
              {insight || "Upload your first medical report to see long-term health patterns and personalized insights."}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('reports')}>
          <p className="text-sm text-slate-500 mb-1">Reports Analyzed</p>
          <p className="text-3xl font-black text-slate-800">{reports.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('medications')}>
          <p className="text-sm text-slate-500 mb-1">Active Medications</p>
          <p className="text-3xl font-black text-slate-800">{medications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <p className="text-sm text-slate-500 mb-1">Health Score</p>
          <p className="text-3xl font-black text-blue-600">{reports.length > 0 ? 'Good' : '--'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Latest Upload</h2>
          </div>
          {recentReport ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full">{recentReport.type}</span>
                  <span className="text-xs text-slate-400">{recentReport.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{recentReport.title}</h3>
                <p className="text-slate-600 text-sm mb-6">{recentReport.summary}</p>
                <div className="space-y-2">
                  {recentReport.indicators.slice(0, 2).map((ind, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-semibold text-slate-700">{ind.label}</span>
                      <HealthIndicators status={ind.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <p className="text-slate-400 mb-4">No reports yet.</p>
              <button onClick={() => onNavigate('reports')} className="text-sm font-bold text-blue-600">Start Uploading →</button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Next Doses</h2>
          <div className="space-y-3">
            {medications.length > 0 ? medications.map(med => (
              <div key={med.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Pill className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">{med.name}</h4>
                    <p className="text-xs text-slate-500">{med.frequency}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-400">No active medications tracked.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
