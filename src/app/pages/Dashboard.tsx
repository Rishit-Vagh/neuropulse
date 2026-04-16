import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import {
  Activity, Brain, Heart, Zap, FileText, AlertCircle, CheckCircle2,
  Clock, TrendingUp, Upload, Download, Eye, LogOut, User, Search,
  Shield, Loader2, FileSearch, XCircle, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onScanComplete?: (result: any) => void;
}

interface ScanSummary {
  scan_id: string;
  filename: string;
  primary_diagnosis: string;
  confidence_score: number;
  severity: string;
  processing_time: number;
  model_version: string;
  timestamp: string;
  patient_id: string;
}

const severityConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType }> = {
  normal: { color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', icon: CheckCircle2 },
  warning: { color: 'text-amber-500', bgColor: 'bg-amber-500/10', icon: AlertCircle },
  critical: { color: 'text-red-500', bgColor: 'bg-red-500/10', icon: AlertTriangle },
};

export const Dashboard = ({ user, onNavigate, onLogout, onScanComplete }: DashboardProps) => {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [selectedScanDetail, setSelectedScanDetail] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const progressMessages = [
    'Initializing neural engine...',
    'Preprocessing image layers...',
    'Running convolutional inference...',
    'Analyzing feature maps...',
    'Generating diagnostic report...',
  ];

  // Fetch scan history
  const fetchScans = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scans');
      if (response.ok) {
        const data = await response.json();
        setScans(data);
      }
    } catch (err) {
      console.error('Failed to fetch scans:', err);
    } finally {
      setIsLoadingScans(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  // Upload file handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0];
    if (!droppedFile) return;

    setIsUploading(true);
    setUploadProgress(progressMessages[0]);

    let msgIndex = 0;
    const progressInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % progressMessages.length;
      setUploadProgress(progressMessages[msgIndex]);
    }, 1000);

    try {
      const formData = new FormData();
      formData.append('file', droppedFile);

      const response = await fetch('http://localhost:8000/api/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const result = await response.json();
      clearInterval(progressInterval);
      setIsUploading(false);
      setShowUploadModal(false);

      const severityEmoji = result.severity === 'normal' ? '✅' : result.severity === 'warning' ? '⚠️' : '🔴';
      toast.success("Neural Analysis Complete", {
        description: `${severityEmoji} ${result.primary_diagnosis} — ${result.confidence_score}% confidence`,
        duration: 5000,
      });

      // Refresh scan list
      fetchScans();
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      toast.error("Scan Failed", {
        description: err.message || 'Could not process the image.',
        duration: 5000,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.dcm', '.webp', '.bmp', '.tiff'] },
    multiple: false,
  });

  // Load scan detail
  const loadScanDetail = async (scanId: string) => {
    if (selectedScan === scanId) {
      setSelectedScan(null);
      setSelectedScanDetail(null);
      return;
    }
    setSelectedScan(scanId);
    try {
      const response = await fetch(`http://localhost:8000/api/report/${scanId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedScanDetail(data);
      }
    } catch (err) {
      console.error('Failed to load scan detail:', err);
    }
  };

  // Download PDF
  const downloadPdf = async (scanId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:8000/api/report/${scanId}/pdf`);
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PulseCore_Report_${scanId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF Downloaded", { description: `Report ${scanId} saved.`, duration: 3000 });
    } catch (err) {
      toast.error("PDF Download Failed");
    }
  };

  // View full report
  const viewFullReport = (scanId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Fetch scan data and navigate to report page
    fetch(`http://localhost:8000/api/report/${scanId}`)
      .then(r => r.json())
      .then(data => {
        if (onScanComplete) onScanComplete(data);
      })
      .catch(() => toast.error("Failed to load report"));
  };

  const stats = [
    { icon: Activity, label: 'Total Scans', value: String(scans.length), color: 'cyan' },
    { icon: CheckCircle2, label: 'Normal', value: String(scans.filter(s => s.severity === 'normal').length), color: 'green' },
    { icon: AlertCircle, label: 'Flagged', value: String(scans.filter(s => s.severity !== 'normal').length), color: 'amber' },
    { icon: Clock, label: 'Avg Time', value: scans.length > 0 ? `${(scans.reduce((acc, s) => acc + s.processing_time, 0) / scans.length).toFixed(1)}s` : '—', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#02010a] pt-24 pb-20 transition-colors duration-500">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-cyan-500/3 dark:bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-blue-500/3 dark:bg-blue-600/5 blur-[130px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-3">
                <span className="w-6 h-px bg-cyan-500" />
                Clinical Dashboard
                <span className="w-6 h-px bg-cyan-500" />
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">{user?.name || 'Doctor'}</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-light">
                {user?.role || 'Radiologist'} • {user?.department || 'Radiology'} • Real-time AI diagnostic platform
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center gap-2 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20"
              >
                <Upload className="w-4 h-4" />
                New Scan
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-500">🔒 DISHA Compliant • Data Not Stored • PulseCore v4.2</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-${stat.color}-500/10`}>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Upload Area (always visible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div
            {...getRootProps()}
            className={`relative p-8 rounded-[32px] border-2 border-dashed cursor-pointer transition-all duration-500 group overflow-hidden
              ${isDragActive ? 'border-cyan-400 bg-cyan-400/5 scale-[1.005] shadow-[0_0_60px_rgba(34,211,238,0.1)]' : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.01] hover:border-cyan-500/40'}
              ${isUploading ? 'pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} />

            {isUploading ? (
              <div className="flex items-center justify-center gap-6 py-4">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <div>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white tracking-wide uppercase">{uploadProgress}</p>
                  <div className="w-48 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center border border-cyan-500/10 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all">
                    <FileSearch className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Quick Scan Upload</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">Drag & drop medical imagery or click to browse</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold tracking-[0.2em] uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  CNN Ready
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Scan History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              Scan History
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {scans.length} scan{scans.length !== 1 ? 's' : ''} total
            </span>
          </div>

          {isLoadingScans ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
          ) : scans.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/5">
              <Brain className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Scans Yet</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Upload your first medical image to begin analysis.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-cyan-500 text-white font-bold text-xs tracking-widest uppercase rounded-full hover:bg-cyan-600 transition-all"
              >
                Upload First Scan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map((scan, index) => {
                const sev = severityConfig[scan.severity] || severityConfig.normal;
                const SevIcon = sev.icon;
                const isExpanded = selectedScan === scan.scan_id;

                return (
                  <motion.div
                    key={scan.scan_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <div
                      onClick={() => loadScanDetail(scan.scan_id)}
                      className={`group cursor-pointer p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border backdrop-blur-xl transition-all
                        ${isExpanded ? 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.05)]' : 'border-zinc-200 dark:border-white/5 hover:border-cyan-500/20'}
                      `}
                    >
                      <div className="flex items-center gap-5">
                        {/* Severity Icon */}
                        <div className={`p-3 rounded-xl ${sev.bgColor} flex-shrink-0`}>
                          <SevIcon className={`w-5 h-5 ${sev.color}`} />
                        </div>

                        {/* Scan Info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-white">{scan.primary_diagnosis}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${sev.bgColor} ${sev.color}`}>
                              {scan.severity}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="font-mono">{scan.patient_id}</span>
                            <span>•</span>
                            <span className="truncate">{scan.filename}</span>
                          </div>
                        </div>

                        {/* Confidence & Time */}
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                              {scan.confidence_score}%
                            </div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Confidence</div>
                          </div>
                          <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-zinc-900 dark:text-white">{scan.processing_time}s</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Time</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => downloadPdf(scan.scan_id, e)}
                              className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-cyan-500 hover:border-cyan-500/30 transition-all"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => viewFullReport(scan.scan_id, e)}
                              className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-cyan-500 hover:border-cyan-500/30 transition-all"
                              title="View Full Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && selectedScanDetail && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-5 pt-5 border-t border-zinc-200 dark:border-white/10"
                          >
                            {/* Prediction Bars */}
                            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Condition Breakdown</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                              {selectedScanDetail.predictions?.map((pred: any) => (
                                <div key={pred.condition} className="flex items-center gap-3">
                                  <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium w-24 flex-shrink-0">{pred.condition}</span>
                                  <div className="flex-grow h-2 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pred.probability}%` }}
                                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                      className={`h-full rounded-full ${pred.severity === 'normal' ? 'bg-emerald-500' :
                                          pred.severity === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                                        }`}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-zinc-900 dark:text-white w-14 text-right">{pred.probability}%</span>
                                </div>
                              ))}
                            </div>

                            {/* Recommendations Preview */}
                            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Key Recommendations</h4>
                            <div className="space-y-1.5">
                              {selectedScanDetail.recommendations?.slice(0, 3).map((rec: string, i: number) => (
                                <p key={i} className="text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                                  <span className="text-cyan-500 flex-shrink-0">•</span>
                                  {rec}
                                </p>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={(e) => viewFullReport(scan.scan_id, e)}
                                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
                              >
                                View Full Report
                              </button>
                              <button
                                onClick={(e) => downloadPdf(scan.scan_id, e)}
                                className="px-5 py-2 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-[10px] font-bold tracking-widest uppercase rounded-lg hover:bg-zinc-200 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                              >
                                <Download className="w-3 h-3" />
                                PDF Report
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-8 rounded-[32px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Ready for Next Analysis</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Upload medical imaging for instant AI-powered diagnostics powered by PulseCore v4.2</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase rounded-2xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Go to Scanner
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
