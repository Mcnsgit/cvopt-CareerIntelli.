import { useState } from 'react';
import { FileText, Loader2, Target, CheckCircle2 } from 'lucide-react';
import Markdown from 'react-markdown';

export default function JobsView() {
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [tailoredDoc, setTailoredDoc] = useState<any>(null);
  const [tailoring, setTailoring] = useState(false);

  const handleAnalyze = async () => {
    if (!jdText) return;
    setLoading(true);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText })
      });
      const data = await res.json();
      setMatchData(data.match);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    setTailoring(true);
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText })
      });
      const data = await res.json();
      setTailoredDoc(data.document);
    } catch (e) {
      console.error(e);
    } finally {
      setTailoring(false);
    }
  };

  const printDocument = () => {
    window.print();
  };

  if (tailoredDoc) {
    return (
      <div className="p-10 max-w-4xl mx-auto print:p-0 print:max-w-none">
        <div className="mb-8 flex justify-between items-center print:hidden text-white">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Tailored Resume</h2>
          <div className="space-x-4">
            <button onClick={() => setTailoredDoc(null)} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white border border-white/20 hover:border-white transition-colors">Back</button>
            <button onClick={printDocument} className="px-6 py-2 text-xs font-bold uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 transition-colors">Print to PDF</button>
          </div>
        </div>
        
        {/* ATS HTML Resume View */}
        <div className="bg-white p-12 shadow-sm print:shadow-none print:border-none print:p-0 text-black font-sans max-w-[800px] mx-auto min-h-[1056px]">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-center mb-2">Resume</h1>
            
            <div className="text-center mb-6">
              <p className="text-sm font-medium">Professional Tailored Profile</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase tracking-wide">Summary</h2>
              <p className="text-sm leading-relaxed">{tailoredDoc.summary}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase tracking-wide">Skills</h2>
              <p className="text-sm leading-relaxed">{tailoredDoc.skills?.join(', ')}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-4 uppercase tracking-wide">Experience</h2>
              <div className="space-y-6">
                {tailoredDoc.experiences?.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-base font-bold">{exp.title}</h3>
                      <span className="text-sm font-medium">{exp.start_date} – {exp.end_date}</span>
                    </div>
                    <div className="text-sm font-medium italic text-gray-700 mb-2">{exp.company}</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {exp.bullets?.map((b: string, j: number) => (
                        <li key={j} className="text-sm leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden h-full">
      <section className="col-span-5 border-r border-white/10 p-10 flex flex-col justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-6">ATS Analysis Engine</div>
          
          <label className="text-sm font-bold uppercase tracking-widest block mb-4">Target Job Description</label>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste raw JD text here..."
            className="w-full h-48 p-4 border border-white/10 rounded-lg bg-white/5 text-sm focus:border-blue-500 outline-none resize-none mb-6 placeholder:opacity-40"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !jdText}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 w-full font-black uppercase tracking-widest text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Analyze JD Fit</span>
          </button>
        </div>

        {matchData && (
          <div className="mt-10">
            <h1 className="text-[80px] font-black leading-[0.85] tracking-tighter mb-8">
              YOUR IMPACT <br />
              <span className="text-outline opacity-20" style={{ WebkitTextStroke: '1px white', color: 'transparent' }}>REFINED.</span>
            </h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-[100px] font-black leading-none text-blue-500">{matchData.fit_score}</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold">ATS SCORE</span>
                <span className="text-xs uppercase tracking-widest opacity-50 font-bold text-green-400">Optimized for UK Market</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase opacity-60">Keyword Match</span>
                  <span className="text-xs font-bold">{matchData.fit_score}%</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full">
                  <div className="bg-blue-500 h-full" style={{ width: `${matchData.fit_score}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="col-span-7 bg-[#0a0a0a] flex flex-col overflow-hidden">
        {matchData ? (
          <>
            <div className="p-10 border-b border-white/10 flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Match Analysis</h2>
                <p className="text-sm opacity-50 max-w-sm">Review identified skill gaps and answer Q&A to generate a verified, tailored resume.</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-10 space-y-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-4">Identified Skill Gaps</h4>
                {matchData.missing_skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchData.missing_skills.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs font-bold tracking-widest uppercase">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-green-400 uppercase tracking-widest">No major gaps identified.</p>
                )}
              </div>

              {matchData.gap_questions?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-4">Gap-Filling Q&A</h4>
                  <div className="space-y-4">
                    {matchData.gap_questions.map((q: string, i: number) => (
                      <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <p className="text-sm font-bold mb-4 opacity-80">{q}</p>
                        <input type="text" placeholder="Your answer (will be verified & saved)" className="w-full bg-[#050505] border border-white/10 rounded p-3 text-sm focus:outline-none focus:border-blue-500 placeholder:opacity-30" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-white/10 bg-white/5">
              <button
                onClick={handleTailor}
                disabled={tailoring}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-colors disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                {tailoring ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                <span>{tailoring ? 'Generating Verified ATS PDF...' : 'Generate Tailored Resume'}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-10 opacity-50">
            <Target className="w-16 h-16 mb-4 text-white/30" />
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Awaiting JD Analysis</h2>
            <p className="text-sm font-bold tracking-widest uppercase">Paste a job description on the left to begin.</p>
          </div>
        )}
      </section>
    </div>
  );
}
