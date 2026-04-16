import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Activity, Brain, Heart, Shield, AlertTriangle, CheckCircle2,
    Download, ArrowLeft, Loader2, FileText, TrendingUp, Zap,
    ChevronDown, ChevronUp
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Prediction {
    condition: string;
    probability: number;
    severity: string;
    description: string;
}

interface ScanResult {
    scan_id: string;
    filename: string;
    predictions: Prediction[];
    primary_diagnosis: string;
    confidence_score: number;
    severity: string;
    processing_time: number;
    report_summary: string;
    recommendations: string[];
    model_version: string;
    conditions_screened: number;
}

interface ScanReportProps {
    scanData: ScanResult | null;
    onNavigate: (page: string) => void;
}

const severityConfig: Record<string, { color: string; bgColor: string; borderColor: string; icon: React.ElementType; label: string }> = {
    normal: {
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        icon: CheckCircle2,
        label: 'NORMAL',
    },
    warning: {
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        icon: AlertTriangle,
        label: 'REVIEW RECOMMENDED',
    },
    critical: {
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        icon: AlertTriangle,
        label: 'CRITICAL — URGENT REVIEW',
    },
};

const conditionIcons: Record<string, React.ElementType> = {
    Normal: CheckCircle2,
    Pneumonia: Activity,
    Cardiomegaly: Heart,
    Effusion: Activity,
    Nodule: Brain,
    Mass: AlertTriangle,
};

export const ScanReport = ({ scanData, onNavigate }: ScanReportProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
    const [animatedConfidence, setAnimatedConfidence] = useState(0);

    useEffect(() => {
        if (scanData) {
            // Animate confidence counter
            const target = scanData.confidence_score;
            const duration = 1500;
            const startTime = Date.now();
            const timer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                setAnimatedConfidence(eased * target);
                if (progress >= 1) clearInterval(timer);
            }, 16);
            return () => clearInterval(timer);
        }
    }, [scanData]);

    const handleDownloadPdf = async () => {
        if (!scanData) return;
        setIsDownloading(true);
        try {
            const response = await fetch(`${API_URL}/api/report/${scanData.scan_id}/pdf`);
            if (!response.ok) throw new Error('PDF generation failed');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PulseCore_Report_${scanData.scan_id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('PDF download failed:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!scanData) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#02010a] pt-32 flex items-center justify-center transition-colors duration-500">
                <div className="text-center">
                    <Brain className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No Scan Data</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">Upload an image to generate a diagnostic report.</p>
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-8 py-3 bg-cyan-500 text-white font-bold text-xs tracking-widest uppercase rounded-full hover:bg-cyan-600 transition-all"
                    >
                        Go to Scanner
                    </button>
                </div>
            </div>
        );
    }

    const sev = severityConfig[scanData.severity] || severityConfig.normal;
    const SeverityIcon = sev.icon;

    return (
        <div className="min-h-screen bg-white dark:bg-[#02010a] pt-24 pb-20 transition-colors duration-500">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/8 blur-[150px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-blue-500/5 dark:bg-blue-600/8 blur-[130px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-cyan-500 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium uppercase tracking-wider">Back to Scanner</span>
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-start justify-between flex-wrap gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
                                <span className="w-6 h-px bg-cyan-500" />
                                Neural Diagnostic Report
                                <span className="w-6 h-px bg-cyan-500" />
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                                Scan Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Complete</span>
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 font-light">
                                Scan ID: <span className="font-mono text-cyan-500">{scanData.scan_id}</span> • File: <span className="font-mono text-zinc-900 dark:text-white">{scanData.filename}</span>
                            </p>
                        </div>

                        <button
                            onClick={handleDownloadPdf}
                            disabled={isDownloading}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-widest uppercase rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-60"
                        >
                            {isDownloading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            {isDownloading ? 'Generating...' : 'Download PDF'}
                        </button>
                    </div>

                    {/* Compliance Badge */}
                    <div className="mt-4 inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-500">
                            🔒 DISHA Compliant • Data Not Stored • {scanData.model_version}
                        </span>
                    </div>
                </motion.div>

                {/* Primary Diagnosis Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-8 rounded-[32px] ${sev.bgColor} border ${sev.borderColor} backdrop-blur-xl mb-8`}
                >
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className={`p-4 rounded-2xl ${sev.bgColor} border ${sev.borderColor}`}>
                            <SeverityIcon className={`w-10 h-10 ${sev.color}`} />
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{scanData.primary_diagnosis}</h2>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sev.bgColor} ${sev.color} border ${sev.borderColor}`}>
                                    {sev.label}
                                </span>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Primary diagnosis identified by PulseCore neural engine</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                                {animatedConfidence.toFixed(1)}%
                            </div>
                            <div className="text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">Confidence</div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { icon: Zap, label: 'Processing Time', value: `${scanData.processing_time}s`, color: 'cyan' },
                        { icon: Brain, label: 'Model', value: scanData.model_version, color: 'blue' },
                        { icon: Activity, label: 'Conditions Screened', value: String(scanData.conditions_screened), color: 'purple' },
                        { icon: Shield, label: 'Status', value: 'Complete', color: 'green' },
                    ].map((stat, i) => (
                        <div key={stat.label} className="p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 backdrop-blur-xl">
                            <stat.icon className={`w-5 h-5 text-${stat.color}-500 mb-3`} />
                            <div className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Prediction Breakdown — Left Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-3 space-y-4"
                    >
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan-500" />
                            Condition Analysis Breakdown
                        </h3>

                        {scanData.predictions.map((pred, index) => {
                            const ConditionIcon = conditionIcons[pred.condition] || Activity;
                            const isExpanded = expandedCondition === pred.condition;
                            const barColor = pred.severity === 'normal' ? 'from-emerald-500 to-green-400'
                                : pred.severity === 'warning' ? 'from-amber-500 to-yellow-400'
                                    : 'from-red-500 to-rose-400';

                            return (
                                <motion.div
                                    key={pred.condition}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.08 }}
                                    className="p-5 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 hover:border-cyan-500/20 backdrop-blur-xl transition-all cursor-pointer"
                                    onClick={() => setExpandedCondition(isExpanded ? null : pred.condition)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <ConditionIcon className={`w-5 h-5 ${pred.severity === 'normal' ? 'text-emerald-500' :
                                                    pred.severity === 'warning' ? 'text-amber-500' : 'text-red-500'
                                                }`} />
                                            <span className="font-bold text-zinc-900 dark:text-white">{pred.condition}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${pred.severity === 'normal' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    pred.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                                                        'bg-red-500/10 text-red-400'
                                                }`}>
                                                {pred.severity}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-zinc-900 dark:text-white">{pred.probability}%</span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                        </div>
                                    </div>

                                    {/* Probability Bar */}
                                    <div className="h-2 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pred.probability}%` }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                            className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                                        />
                                    </div>

                                    {/* Expanded Description */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/10"
                                            >
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{pred.description}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Recommendations — Right Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Clinical Recommendations
                        </h3>

                        <div className="space-y-3">
                            {scanData.recommendations.map((rec, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.08 }}
                                    className="p-4 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 backdrop-blur-xl"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-500">
                                            {index + 1}
                                        </span>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{rec}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Download Report Section */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wider">Full Report</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Download the complete diagnostic report as a formatted PDF document.</p>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="w-full px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs tracking-widest uppercase rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isDownloading ? 'Generating PDF...' : 'Download PDF Report'}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Full Report Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-12 p-8 rounded-[32px] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 backdrop-blur-xl"
                >
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-500" />
                        Detailed Neural Report
                    </h3>
                    <pre className="text-sm text-zinc-600 dark:text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed bg-zinc-100 dark:bg-black/30 p-6 rounded-2xl border border-zinc-200 dark:border-white/5">
                        {scanData.report_summary}
                    </pre>
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 text-center"
                >
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-medium tracking-wider uppercase">
                        ⚠️ This AI analysis is for screening purposes only • All findings must be reviewed by a qualified medical professional • {scanData.model_version}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
