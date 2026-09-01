/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Upload, Briefcase, Database, FileText } from 'lucide-react';
import UploadView from './components/UploadView';
import JobsView from './components/JobsView';
import MatrixView from './components/MatrixView';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [matrixData, setMatrixData] = useState<any>(null);

  const fetchMatrix = async () => {
    try {
      const res = await fetch('/api/matrix');
      const data = await res.json();
      setMatrixData(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden">
      {/* Top Nav */}
      <nav className="h-20 shrink-0 flex items-center justify-between px-10 border-b border-white/10">
        <div className="text-2xl font-black tracking-tighter">CV.OPT<span className="text-blue-500">UK</span></div>
        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest opacity-70">
          <button
            onClick={() => setActiveTab('upload')}
            className={`hover:opacity-100 transition-opacity ${activeTab === 'upload' ? 'text-blue-400 opacity-100' : ''}`}
          >
            Ingest CV
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`hover:opacity-100 transition-opacity ${activeTab === 'matrix' ? 'text-blue-400 opacity-100' : ''}`}
          >
            Master Matrix
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`hover:opacity-100 transition-opacity ${activeTab === 'jobs' ? 'text-blue-400 opacity-100' : ''}`}
          >
            Job Finder & Tailor
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">JD</div>
          <div className="text-xs font-bold uppercase tracking-wider hidden sm:block">James Dalton</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'upload' && <UploadView onUploadComplete={fetchMatrix} />}
        {activeTab === 'matrix' && <MatrixView data={matrixData} />}
        {activeTab === 'jobs' && <JobsView />}
      </main>
    </div>
  );
}

