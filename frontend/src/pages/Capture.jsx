import React, { useState } from 'react';
import { aiService } from '../services/api';
import { useToast } from '../components/Toast';
import { FiCpu, FiLoader, FiMic, FiCheckCircle, FiFileText } from 'react-icons/fi';
import VoiceInput from '../components/VoiceInput';

const Capture = () => {
  const { showToast } = useToast();
  const [captureText, setCaptureText] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [capturedResult, setCapturedResult] = useState(null);

  const handleCaptureSubmit = async (e) => {
    e.preventDefault();
    if (!captureText.trim()) return;

    try {
      setCapturing(true);
      setCapturedResult(null);
      
      const res = await aiService.capture(captureText);
      
      if (res.success) {
        const { tasks: newTasks, notes: newNotes } = res.data;
        const totalItems = (newTasks?.length || 0) + (newNotes?.length || 0);
        
        showToast(`AI Processing Complete. Captured ${totalItems} items.`, 'success');
        setCapturedResult(res.data);
        setCaptureText('');
      } else {
        showToast(res.message || 'AI capture parsing failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Gemini processing failed. Check settings.', 'error');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-4xl mx-auto w-full flex flex-col justify-center font-sans">
      
      {/* Page Header */}
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/25 text-brand-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <FiCpu className="h-3 w-3" />
          AI NLP Capture Engine
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight leading-none">
          What do you need to accomplish today?
        </h1>
        <p className="text-gray-500 text-xs max-w-md mx-auto leading-relaxed">
          Type or dictate in plain english. Gemini will automatically extract tasks, priorities, categories, and tags.
        </p>
      </div>

      {/* Main Console card */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden border border-dark-border shadow-2xl bg-[#181818]">
        {/* Glow backdrop decorator */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleCaptureSubmit} className="space-y-4">
          <VoiceInput
            captureText={captureText}
            setCaptureText={setCaptureText}
            disabled={capturing}
            placeholder="e.g., 'Draft AWS deployment plan by Friday category Work tag aws cloud, and note down meeting takeaways: Vikas agreed to review dependencies.'"
            rows="5"
          />
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={capturing || !captureText.trim()}
              className="btn-primary w-full sm:w-auto px-8 py-3 bg-brand-500 hover:bg-brand-600 font-bold flex items-center justify-center gap-2 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-brand-500/10 focus:outline-none"
            >
              {capturing ? (
                <>
                  <FiLoader className="h-4.5 w-4.5 animate-spin" />
                  AI is processing...
                </>
              ) : (
                <>
                  <FiCpu className="h-4.5 w-4.5" />
                  Process Capture
                </>
              )}
            </button>
          </div>
        </form>

        {/* Captured Items Results Preview */}
        {capturedResult && (
          <div className="mt-8 border-t border-dark-border pt-6 space-y-4 animate-fade-in">
            <h3 className="text-xs font-bold tracking-wider uppercase text-emerald-400">
              ✦ Captured Productivity Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Captured Tasks */}
              {capturedResult.tasks && capturedResult.tasks.length > 0 && (
                <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <FiCheckCircle className="h-4 w-4" />
                    Tasks ({capturedResult.tasks.length})
                  </div>
                  <ul className="space-y-2 text-xs">
                    {capturedResult.tasks.map((t, idx) => (
                      <li key={idx} className="text-gray-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <div className="flex-1">
                          <span className="font-bold text-gray-200">{t.title}</span>
                          {t.category && <span className="text-[9px] bg-white/5 border border-dark-border text-gray-400 rounded px-1 ml-1.5 font-bold uppercase tracking-wider">{t.category}</span>}
                          {t.due_date && <span className="text-[10px] text-brand-400 ml-1.5 font-bold">Due: {t.due_date}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Captured Notes */}
              {capturedResult.notes && capturedResult.notes.length > 0 && (
                <div className="bg-purple-950/10 border border-purple-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                    <FiFileText className="h-4 w-4" />
                    Notes ({capturedResult.notes.length})
                  </div>
                  <ul className="space-y-2 text-xs">
                    {capturedResult.notes.map((n, idx) => (
                      <li key={idx} className="text-gray-300 flex items-start gap-1.5">
                        <span className="text-purple-400 font-bold">•</span>
                        <div className="flex-1">
                          <span className="font-bold text-gray-200">{n.title}</span>
                          {n.content && <p className="text-[11px] text-gray-500 mt-0.5 truncate">{n.content}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Capture;
