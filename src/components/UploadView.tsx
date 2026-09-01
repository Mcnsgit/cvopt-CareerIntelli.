import { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';

export default function UploadView({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        onUploadComplete();
        setFile(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden h-full">
      <section className="col-span-5 border-r border-white/10 p-10 flex flex-col justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-6">Data Ingestion</div>
          <h1 className="text-[80px] font-black leading-[0.85] tracking-tighter mb-8">
            YOUR IMPACT <br />
            <span className="text-outline opacity-20" style={{ WebkitTextStroke: '1px white', color: 'transparent' }}>REFINED.</span>
          </h1>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase opacity-60">System Ready</span>
                <span className="text-xs font-bold text-green-400">Online</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full">
                <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="col-span-7 bg-[#0a0a0a] flex flex-col overflow-hidden">
        <div className="p-10 border-b border-white/10 flex justify-between items-end">
          <div>
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Upload CV</h2>
            <p className="text-sm opacity-50 max-w-sm">Upload a PDF or TXT version of your CV to extract entities and build your Master Experience Matrix.</p>
          </div>
        </div>
        
        <div className="flex-1 p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-lg border border-white/20 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center bg-white/5 hover:border-blue-500 transition-colors">
            <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Click to upload or drag and drop</h3>
            <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6">PDF, TXT, or DOCX (max. 10MB)</p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 font-black uppercase tracking-widest text-xs transition-colors"
            >
              Select File
            </label>
          </div>

          {file && (
            <div className="mt-8 w-full max-w-lg flex items-center justify-between bg-white/10 p-6 border border-white/10 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6 text-blue-400" />
                <span className="text-sm font-bold truncate max-w-[200px]">{file.name}</span>
              </div>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200 px-6 py-2 text-xs font-black uppercase tracking-widest disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Extract & Ingest'}
              </button>
            </div>
          )}

          {success && (
            <div className="mt-6 w-full max-w-lg p-6 bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-4">
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-widest">CV successfully ingested into Master Matrix!</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Ensure FileText icon is imported
import { FileText } from 'lucide-react';
