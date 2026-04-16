import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { CheckCircle2, Loader2, FileSearch, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ScanResult {
  scan_id: string;
  filename: string;
  primary_diagnosis: string;
  confidence_score: number;
  severity: string;
  processing_time: number;
  model_version: string;
  predictions: any[];
  recommendations: string[];
  report_summary: string;
  conditions_screened: number;
}

interface XRayUploadProps {
  onScanComplete?: (result: ScanResult) => void;
}

export const XRayUpload = ({ onScanComplete }: XRayUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState('Initializing neural engine...');

  const progressMessages = [
    'Initializing neural engine...',
    'Loading PulseCore CNN model...',
    'Preprocessing image layers...',
    'Running convolutional inference...',
    'Analyzing feature maps...',
    'Cross-referencing 1.4M data points...',
    'Generating diagnostic report...',
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    setIsUploading(true);
    setError(null);
    setScanResult(null);

    // Cycle through progress messages
    let msgIndex = 0;
    const progressInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % progressMessages.length;
      setUploadProgress(progressMessages[msgIndex]);
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('file', droppedFile);

      const response = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const result: ScanResult = await response.json();

      clearInterval(progressInterval);
      setIsUploading(false);
      setIsDone(true);
      setScanResult(result);

      const severityEmoji = result.severity === 'normal' ? '✅' : result.severity === 'warning' ? '⚠️' : '🔴';
      toast.success("Neural Analysis Complete", {
        description: `${severityEmoji} ${result.primary_diagnosis} — ${result.confidence_score}% confidence (${result.processing_time}s)`,
        duration: 6000,
      });
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(err.message || 'Analysis failed. Make sure the backend server is running.');
      toast.error("Analysis Failed", {
        description: err.message || 'Could not connect to PulseCore backend.',
        duration: 5000,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.dcm', '.webp', '.bmp', '.tiff'] },
    multiple: false,
  });

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setIsUploading(false);
    setIsDone(false);
    setScanResult(null);
    setError(null);
  };

  const viewReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scanResult && onScanComplete) {
      onScanComplete(scanResult);
    }
  };

  return (
    <section className="py-32 relative bg-white dark:bg-[#02010a] overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/8 blur-[120px] rounded-full" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
              <span className="w-6 h-px bg-cyan-500" />
              Interactive Diagnostic
              <span className="w-6 h-px bg-cyan-500" />
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold text-zinc-900 dark:text-white tracking-tighter mb-6">
              Neural Scanning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Terminal</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-xl mx-auto">
              Upload high-resolution medical imagery for real-time CNN analysis and diagnostic report generation. Powered by PulseCore v4.2 neural engine.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div
            {...getRootProps()}
            className={`relative min-h-[400px] p-12 bg-zinc-50 dark:bg-white/[0.01] backdrop-blur-3xl border-2 border-dashed rounded-[48px] flex flex-col items-center justify-center transition-all duration-700 cursor-pointer group overflow-hidden
              ${isDragActive ? 'border-cyan-400 bg-cyan-400/5 scale-[1.01] shadow-[0_0_80px_rgba(34,211,238,0.15)]' : 'border-zinc-200 dark:border-white/10 hover:border-cyan-500/40 hover:bg-zinc-100/50 dark:hover:bg-white/[0.02]'}
              ${isDone && !error ? 'border-emerald-500/40 bg-emerald-500/5' : ''}
              ${error ? 'border-red-500/40 bg-red-500/5' : ''}
            `}
          >
            <input {...getInputProps()} />

            {/* Animated Corner Brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl group-hover:border-cyan-500/60 transition-colors" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-xl group-hover:border-cyan-500/60 transition-colors" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-xl group-hover:border-cyan-500/60 transition-colors" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl group-hover:border-cyan-500/60 transition-colors" />

            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:30px_30px]" />

            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mb-8 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] transition-all duration-500 border border-cyan-500/10"
                  >
                    <FileSearch className="w-10 h-10 text-cyan-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Initialize Scanner</h3>
                  <p className="text-zinc-500 dark:text-zinc-500 text-sm font-light max-w-[280px] text-center">
                    Drag clinical files here or click to browse secure local storage.
                  </p>

                  <div className="mt-10 flex items-center gap-3 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold tracking-[0.2em] uppercase">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    CNN Backend Connected
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
                    <XCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Analysis Failed</h3>
                  <p className="text-red-500/80 text-sm mb-2 text-center max-w-[400px]">{error}</p>
                  <p className="text-zinc-500 dark:text-zinc-500 text-xs mb-8 text-center">
                    Ensure the backend is running: <code className="text-cyan-500">python backend/main.py</code>
                  </p>
                  <button
                    onClick={reset}
                    className="px-8 py-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div className="relative mb-8">
                    <Loader2 className="w-20 h-20 text-cyan-500 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-cyan-400/30 rounded-full" />
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-widest uppercase">Analyzing Layers</h3>
                    <div className="w-48 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden mx-auto">
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <motion.p
                      key={uploadProgress}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-cyan-600 dark:text-cyan-500/60 text-[10px] tracking-[0.3em] font-bold uppercase"
                    >
                      {uploadProgress}
                    </motion.p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border ${scanResult?.severity === 'normal'
                      ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
                      : scanResult?.severity === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.15)]'
                        : 'bg-red-500/10 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
                    }`}>
                    {scanResult?.severity === 'normal' ? (
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    ) : (
                      <AlertTriangle className={`w-12 h-12 ${scanResult?.severity === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />
                    )}
                  </div>

                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">Neural Report Ready</h3>

                  {scanResult && (
                    <div className="text-center mb-2">
                      <p className={`text-lg font-bold ${scanResult.severity === 'normal' ? 'text-emerald-500' :
                          scanResult.severity === 'warning' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                        {scanResult.primary_diagnosis} — {scanResult.confidence_score}%
                      </p>
                    </div>
                  )}

                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2 text-center">
                    File: <span className="text-zinc-900 dark:text-white font-medium">{file.name}</span>
                  </p>
                  {scanResult && (
                    <p className="text-zinc-500 dark:text-zinc-500 text-xs mb-8">
                      Processed in {scanResult.processing_time}s • {scanResult.model_version}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={viewReport}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                    >
                      View Full Report
                    </button>
                    <button
                      onClick={reset}
                      className="px-8 py-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
                    >
                      New Scan
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanning Laser Line */}
            {isUploading && (
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-20 pointer-events-none"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
