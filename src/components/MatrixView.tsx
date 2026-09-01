export default function MatrixView({ data }: { data: any }) {
  if (!data) return <div className="p-10 text-gray-500">Loading matrix...</div>;

  return (
    <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden h-full">
      <section className="col-span-4 border-r border-white/10 p-10 flex flex-col overflow-y-auto">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-6">Candidate Profile</div>
        <div className="space-y-4 text-sm mb-10">
          <p className="flex justify-between border-b border-white/10 pb-2">
            <span className="font-bold opacity-60 uppercase tracking-widest text-xs">Name</span>
            <span className="font-black">{data.candidate_info?.name || 'N/A'}</span>
          </p>
          <p className="flex justify-between border-b border-white/10 pb-2">
            <span className="font-bold opacity-60 uppercase tracking-widest text-xs">Email</span>
            <span className="font-black">{data.candidate_info?.email || 'N/A'}</span>
          </p>
          <p className="flex justify-between border-b border-white/10 pb-2">
            <span className="font-bold opacity-60 uppercase tracking-widest text-xs">Phone</span>
            <span className="font-black">{data.candidate_info?.phone || 'N/A'}</span>
          </p>
        </div>

        <div className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-6">Extracted Skills</div>
        <div className="flex flex-wrap gap-2">
          {data.candidate_info?.skills?.map((skill: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded text-xs font-bold tracking-widest uppercase">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="col-span-8 bg-[#0a0a0a] flex flex-col overflow-hidden">
        <div className="p-10 border-b border-white/10">
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Master Matrix</h2>
          <p className="text-sm opacity-50 max-w-md">Unified experience repository extracted from all ingested resumes.</p>
        </div>
        
        <div className="flex-1 overflow-auto p-10 space-y-6">
          {data.master_experiences?.length === 0 ? (
            <div className="text-center p-10 border border-white/10 border-dashed rounded-xl opacity-50">
              <p className="text-sm font-bold uppercase tracking-widest">No experiences found. Ingest a CV.</p>
            </div>
          ) : (
            data.master_experiences?.map((exp: any) => (
              <div key={exp.experience_id} className="bg-white/5 p-8 border border-white/10 rounded-xl hover:border-blue-500 transition-colors group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight">{exp.role_titles[0]}</h4>
                    <p className="text-sm text-blue-400 font-bold tracking-widest uppercase mt-1">{exp.company_canonical}</p>
                  </div>
                  <span className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded uppercase tracking-widest border border-white/10">
                    {exp.start_date} - {exp.end_date}
                  </span>
                </div>
                
                <ul className="space-y-4">
                  {data.master_bullets
                    .filter((b: any) => b.experience_id === exp.experience_id)
                    .map((b: any) => (
                      <li key={b.bullet_id} className="text-sm opacity-80 flex items-start gap-4">
                        <span className="text-blue-500 font-black mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                        <span className="leading-relaxed">{b.raw_text}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
