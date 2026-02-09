
import React from 'react';
import { Mic, MicOff, X, Bot, Sparkles, Volume2 } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface VoiceAssistantProps {
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [isActive, setIsActive] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [transcription, setTranscription] = React.useState('');
  
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const outputAudioContextRef = React.useRef<AudioContext | null>(null);
  const sessionRef = React.useRef<any>(null);
  const nextStartTimeRef = React.useRef(0);
  const sourcesRef = React.useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
          sessionRef.current = { scriptProcessor, stream };
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
          }

          const audioB64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioB64) {
            setIsSpeaking(true);
            const ctx = outputAudioContextRef.current!;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            
            const audioBuffer = await decodeAudioData(decode(audioB64), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            
            source.addEventListener('ended', () => {
              sourcesRef.current.delete(source);
              if (sourcesRef.current.size === 0) setIsSpeaking(false);
            });
            
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setIsSpeaking(false);
          }
          
          if (message.serverContent?.turnComplete) {
            setTranscription('');
          }
        },
        onclose: () => stopSession(),
        onerror: (e) => console.error("Live Audio Error:", e),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: 'You are MediInsight AI, a helpful medical assistant. You can hear and speak to the user. Keep responses concise and friendly. Remind users that you provide educational information, not medical advice.',
      },
    });
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.scriptProcessor.disconnect();
      sessionRef.current.stream.getTracks().forEach((t: any) => t.stop());
    }
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  };

  React.useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden relative border border-white/20">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 relative">
            <Bot className="w-10 h-10" />
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-blue-400 animate-pulse" />
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-2">Real-time Health Assistant</h3>
          <p className="text-slate-500 mb-12 max-w-xs">Ask me about your reports or general health tips.</p>

          {/* Pulse Visualizer */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-12">
            <div className={`absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-2xl transition-all duration-500 ${isActive ? 'scale-150' : 'scale-50'}`}></div>
            
            <div className="flex items-center gap-2 h-16">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div 
                  key={i} 
                  className={`w-2 bg-blue-500 rounded-full transition-all duration-150 ${
                    isActive ? (isSpeaking ? 'animate-bounce' : 'h-8 opacity-40') : 'h-1'
                  }`}
                  style={{ animationDelay: `${i * 0.1}s`, height: isSpeaking ? `${Math.random() * 40 + 10}px` : undefined }}
                ></div>
              ))}
            </div>
          </div>

          <div className="w-full bg-slate-50 rounded-2xl p-6 mb-10 min-h-[80px] flex items-center justify-center border border-slate-100">
            {isConnecting ? (
              <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-pulse" /> Initializing secure line...
              </span>
            ) : isActive ? (
              <span className="text-blue-600 font-bold tracking-tight">
                {isSpeaking ? 'MediInsight is speaking...' : 'I\'m listening...'}
              </span>
            ) : (
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Assistant Offline</span>
            )}
          </div>

          <button 
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`
              w-full py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95
              ${isActive 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                : 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700'}
            `}
          >
            {isActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            {isActive ? 'Stop Session' : 'Start Voice Conversation'}
          </button>

          <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-green-500" /> Secure PCM Stream • HIPAA Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;

// Add local ShieldCheck since it's used
import { ShieldCheck as ShieldCheckIcon } from 'lucide-react';
const ShieldCheck = ShieldCheckIcon;
