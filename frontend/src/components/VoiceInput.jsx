import React, { useState, useEffect, useRef } from 'react';
import { FiMic, FiMicOff, FiAlertCircle } from 'react-icons/fi';
import { useToast } from './Toast';

const VoiceInput = ({ captureText, setCaptureText, disabled, placeholder, rows }) => {
  const { showToast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const baseTextRef = useRef('');
  const speechCapturedRef = useRef(false);

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setError(null);
      speechCapturedRef.current = false;
      resetSilenceTimeout();
    };

    rec.onresult = (event) => {
      resetSilenceTimeout();
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const sessionText = (finalTranscript + interimTranscript).trim();
      const base = baseTextRef.current.trim();
      
      if (sessionText) {
        speechCapturedRef.current = true;
        setCaptureText(base ? `${base} ${sessionText}` : sessionText);
      }
    };

    rec.onerror = (event) => {
      clearSilenceTimeout();
      console.error('Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          setError('Microphone permission denied. Please allow microphone access in your browser settings.');
          showToast('Microphone permission denied.', 'error');
          break;
        case 'no-speech':
          setError('No speech detected. Please try speaking again.');
          showToast('No speech was detected.', 'error');
          break;
        case 'audio-capture':
          setError('No microphone found. Please connect a microphone and try again.');
          showToast('No microphone found.', 'error');
          break;
        case 'network':
          setError('Network error. Please check your internet connection and try again.');
          showToast('Speech network error.', 'error');
          break;
        case 'aborted':
          // Stopped manually or custom timeout, don't show generic error
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
          showToast(`Speech recognition error: ${event.error}`, 'error');
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      clearSilenceTimeout();
      if (speechCapturedRef.current) {
        showToast('Speech recognized successfully!', 'success');
        speechCapturedRef.current = false;
      }
    };

    recognitionRef.current = rec;

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      clearSilenceTimeout();
    };
  }, [setCaptureText, showToast]);

  const resetSilenceTimeout = () => {
    clearSilenceTimeout();
    silenceTimeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, 8000); // 8 seconds silence timeout
  };

  const clearSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const handleTimeout = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setError('Speech recognition timed out due to inactivity.');
      showToast('Speech recognition timed out.', 'error');
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!browserSupported) {
      showToast('Speech recognition is not supported in this browser.', 'error');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      clearSilenceTimeout();
    } else {
      baseTextRef.current = captureText || '';
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
        setError('Failed to start speech recognition.');
        showToast('Failed to start speech recognition.', 'error');
      }
    }
  };

  return (
    <div className="space-y-3 w-full font-sans">
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={captureText}
          onChange={(e) => setCaptureText(e.target.value)}
          disabled={disabled || isListening}
          rows={rows || "3"}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
        />
        
        {/* Microphone Button */}
        <div className="absolute right-4 bottom-4">
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            title={
              !browserSupported 
                ? 'Speech recognition not supported' 
                : isListening 
                  ? 'Stop listening' 
                  : 'Start voice capture'
            }
            className={`flex items-center justify-center p-2.5 rounded-xl border transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
              !browserSupported
                ? 'bg-amber-950/20 text-amber-500/60 border-amber-500/20 cursor-not-allowed'
                : isListening
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-lg shadow-rose-500/10 animate-pulse'
                  : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:bg-white/10'
            }`}
          >
            {!browserSupported ? (
              <FiMicOff className="h-5 w-5" />
            ) : isListening ? (
              <FiMic className="h-5 w-5 text-rose-400 animate-pulse" />
            ) : (
              <FiMic className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Listening Indicator with wave animation */}
      {isListening && (
        <div className="flex items-center justify-between bg-brand-500/5 border border-brand-500/10 rounded-xl px-4 py-2.5 animate-slide-in">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-semibold text-brand-300 animate-pulse">Listening... Speak clearly to capture tasks.</span>
          </div>
          
          {/* Sound wave animation */}
          <div className="flex items-end gap-1.5 h-4 px-1">
            <span className="w-1 bg-brand-400 rounded-full animate-wave-1 h-1.5" />
            <span className="w-1 bg-brand-400 rounded-full animate-wave-2 h-3" />
            <span className="w-1 bg-brand-400 rounded-full animate-wave-3 h-1" />
            <span className="w-1 bg-brand-400 rounded-full animate-wave-4 h-2" />
          </div>
        </div>
      )}

      {/* Browser Not Supported Warning */}
      {!browserSupported && (
        <div className="flex items-center gap-2.5 bg-amber-950/20 border border-amber-500/20 text-amber-300 rounded-xl px-4 py-2.5 text-xs animate-slide-in">
          <FiAlertCircle className="h-4.5 w-4.5 text-amber-400 shrink-0" />
          <span className="font-medium">
            Voice Capture is not supported in this browser. Please try using Google Chrome, Microsoft Edge, or Apple Safari.
          </span>
        </div>
      )}

      {/* Error message inline banner */}
      {error && (
        <div className="flex items-center gap-2.5 bg-rose-950/20 border border-rose-500/20 text-rose-300 rounded-xl px-4 py-2.5 text-xs animate-slide-in">
          <FiAlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
          <span className="font-medium flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400/60 hover:text-rose-400 transition-colors font-bold text-sm ml-2 focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
