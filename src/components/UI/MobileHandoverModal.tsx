import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Smartphone,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { POIItem, TimeOfDayMode } from '../../types/map';

interface MobileHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPoi: POIItem | null;
  timeOfDay: TimeOfDayMode;
  onToggleMobilePreview: () => void;
  isMobilePreviewActive: boolean;
}

export const MobileHandoverModal: React.FC<MobileHandoverModalProps> = ({
  isOpen,
  onClose,
  selectedPoi,
  timeOfDay,
  onToggleMobilePreview,
  isMobilePreviewActive,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate shareable URL with current attraction and time-of-day query parameters
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?poi=${selectedPoi ? selectedPoi.id : 'all'}&time=${timeOfDay}`
    : '';

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(shareUrl || 'https://gardensbythebay.com.sg', {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-handover-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-auto"
    >
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 id="mobile-handover-title" className="text-base font-bold text-white">
                Mobile Handover Pass
              </h2>
              <p className="text-[11px] text-slate-400">
                Continue your exhibition exploration on your smartphone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-purple-500/30">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Mobile Pass QR Code" className="w-48 h-48 rounded-lg" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-500">
                Generating QR...
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-white">
              Scan with your phone camera
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Opens the synchronized 3D interactive map
              {selectedPoi ? ` centered on ${selectedPoi.name}` : ''}.
            </p>
          </div>

          {/* Context Tag */}
          {selectedPoi && (
            <div className="bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs text-purple-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Context synced: <strong>{selectedPoi.name}</strong></span>
            </div>
          )}

          {/* Copyable link */}
          <div className="w-full flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 truncate flex-1 font-mono text-[11px] px-1">
              {shareUrl}
            </span>
            <button
              onClick={handleCopy}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer shadow shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer with Mobile Preview Simulator Toggle */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-left">
            <div className="text-xs font-semibold text-white">Kiosk Simulator Mode</div>
            <div className="text-[10px] text-slate-400">Preview phone viewport directly on screen</div>
          </div>
          <button
            onClick={() => {
              onToggleMobilePreview();
              onClose();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isMobilePreviewActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isMobilePreviewActive ? 'Exit Phone View' : 'Preview Phone View'}
          </button>
        </div>
      </div>
    </div>
  );
};
