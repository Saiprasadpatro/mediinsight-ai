
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_TRENDS } from '../utils/mockData';
import { TrendingDown, TrendingUp, Info } from 'lucide-react';

const TrendAnalysis: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Health Trends</h1>
        <p className="text-slate-500">Visualizing your long-term health progression.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-slate-800">LDL Cholesterol Progression</h3>
                <p className="text-sm text-slate-500">mg/dL over the last 6 months</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-semibold">
                <TrendingDown className="w-4 h-4" />
                -7% from baseline
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TRENDS}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8'}} 
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{color: '#3b82f6', fontWeight: 'bold'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Blood Glucose Stability</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { date: 'Oct', value: 95 },
                  { date: 'Nov', value: 92 },
                  { date: 'Dec', value: 98 },
                  { date: 'Jan', value: 94 },
                  { date: 'Feb', value: 91 },
                  { date: 'Mar', value: 93 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}}
                    activeDot={{r: 8}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-200" />
              <h4 className="font-bold">AI Insight</h4>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed mb-4">
              "Your LDL cholesterol has shown a steady 7% decrease over the last 6 months. This correlates with the start of your medication and dietary changes. Keep maintaining this pace!"
            </p>
            <button className="text-xs font-bold uppercase tracking-wider text-white bg-blue-500/50 hover:bg-blue-500 py-2 px-4 rounded-lg transition-colors">
              Read Detailed Analysis
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Key Metrics Summary</h4>
            <div className="space-y-4">
              {[
                { label: 'Weight', value: '78kg', trend: 'down', color: 'text-green-600' },
                { label: 'Blood Pressure', value: '118/75', trend: 'steady', color: 'text-blue-600' },
                { label: 'Resting Heart Rate', value: '64 bpm', trend: 'up', color: 'text-orange-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;
