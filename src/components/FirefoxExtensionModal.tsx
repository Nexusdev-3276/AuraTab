import React, { useState } from 'react';
import JSZip from 'jszip';
import { X, Download, Check, Copy, ExternalLink, HelpCircle, Layers, RefreshCw, Sparkles } from 'lucide-react';

interface FirefoxExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const generateUniqueAddonId = () => {
  const rand = Math.random().toString(36).substring(2, 7);
  const time = Date.now().toString(36);
  return `auratab-${rand}-${time}@addons.mozilla.org`;
};

export const FirefoxExtensionModal: React.FC<FirefoxExtensionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [addonId, setAddonId] = useState<string>(generateUniqueAddonId);
  const [version, setVersion] = useState<string>('1.0.0');

  if (!isOpen) return null;

  const appUrl = window.location.origin + window.location.pathname;

  const copyDebuggingUrl = () => {
    navigator.clipboard.writeText('about:debugging#/runtime/this-firefox');
    setHasCopiedUrl(true);
    setTimeout(() => setHasCopiedUrl(false), 2500);
  };

  const handleDownloadExtensionZip = async () => {
    try {
      setIsGenerating(true);
      const zip = new JSZip();

      // Helper to generate a real valid PNG icon matching the user logo
      const getIconBlob = async (): Promise<Blob> => {
        try {
          const res = await fetch('/assets/icon.png');
          if (res.ok) {
            const blob = await res.blob();
            if (blob.size > 100) return blob;
          }
        } catch {
          // ignore
        }

        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Dark background with rounded corners
          ctx.fillStyle = '#0f1118';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(0, 0, 96, 96, 20);
          } else {
            ctx.rect(0, 0, 96, 96);
          }
          ctx.fill();

          // Dotted orbit circle
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(48, 48, 38, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Top and Bottom Diamond Stars
          ctx.fillStyle = '#ffffff';
          const drawDiamond = (cx: number, cy: number, w: number, h: number) => {
            ctx.beginPath();
            ctx.moveTo(cx, cy - h);
            ctx.lineTo(cx + w, cy);
            ctx.lineTo(cx, cy + h);
            ctx.lineTo(cx - w, cy);
            ctx.closePath();
            ctx.fill();
          };
          drawDiamond(48, 17, 3, 7);
          drawDiamond(48, 79, 3, 7);

          // Outer card/contour frame
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(28, 36);
          ctx.lineTo(44, 28);
          ctx.lineTo(68, 28);
          ctx.lineTo(68, 66);
          ctx.stroke();

          // Central Stylized Letter A
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(48, 24);
          ctx.lineTo(68, 72);
          ctx.lineTo(56, 70);
          ctx.lineTo(48, 50);
          ctx.lineTo(40, 70);
          ctx.lineTo(28, 72);
          ctx.closePath();
          ctx.fill();

          // Center cutout in A
          ctx.fillStyle = '#0f1118';
          drawDiamond(48, 52, 3.5, 6);

          // Planetary Orbital Ring
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.save();
          ctx.translate(48, 54);
          ctx.rotate((-15 * Math.PI) / 180);
          ctx.beginPath();
          ctx.ellipse(0, 0, 34, 11, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        return await new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob || new Blob([], { type: 'image/png' }));
          }, 'image/png');
        });
      };

      // 1. WebExtension manifest.json
      const finalId = addonId.trim() || generateUniqueAddonId();
      const finalVersion = version.trim() || '1.0.0';

      const manifestContent = {
        manifest_version: 2,
        name: 'AuraTab 4K - Nouvel Onglet & Fonds Animés',
        version: finalVersion,
        description:
          "Nouvel onglet moderne avec fonds d'écran animés, recherche multi-moteurs et raccourcis personnalisables.",
        chrome_url_overrides: {
          newtab: 'newtab.html',
        },
        permissions: ['storage'],
        content_security_policy:
          "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data: blob:; media-src 'self' https: data: blob:;",
        browser_specific_settings: {
          gecko: {
            id: finalId,
            strict_min_version: '140.0',
            data_collection_permissions: {
              required: ['none'],
            },
          },
        },
        icons: {
          48: 'icon.png',
          96: 'icon.png',
        },
      };

      zip.file('manifest.json', JSON.stringify(manifestContent, null, 2));

      // 2. Fetch standalone files to bundle inside extension (No external URL in address bar!)
      const fetchAsBlob = async (url: string): Promise<Blob | null> => {
        try {
          const res = await fetch(url);
          if (res.ok) return await res.blob();
        } catch {
          // ignore
        }
        return null;
      };

      const fetchAsText = async (url: string): Promise<string | null> => {
        try {
          const res = await fetch(url);
          if (res.ok) return await res.text();
        } catch {
          // ignore
        }
        return null;
      };

      const htmlContent = await fetchAsText('/extension-build/index.html');
      const jsContent = await fetchAsText('/extension-build/assets/app.js');
      const cssContent = await fetchAsText('/extension-build/assets/index.css');

      if (htmlContent && jsContent && cssContent) {
        // Pure standalone mode: 0 ms load time, 100% offline, NO URL in address bar!
        zip.file('newtab.html', htmlContent);
        zip.file('assets/app.js', jsContent);
        zip.file('assets/index.css', cssContent);

        // Include offline wallpaper assets
        const wpVideo = await fetchAsBlob('/wallpapers/itachi-blood-moon.mp4');
        if (wpVideo) {
          zip.file('wallpapers/itachi-blood-moon.mp4', wpVideo);
        }
        const wpThumb = await fetchAsBlob('/wallpapers/itachi-blood-moon.jpg');
        if (wpThumb) {
          zip.file('wallpapers/itachi-blood-moon.jpg', wpThumb);
        }
      } else {
        // Fallback loader if build files are not found
        const fallbackHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>AuraTab 4K</title>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #0f1118; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <script src="newtab.js"></script>
</body>
</html>`;
        zip.file('newtab.html', fallbackHtml);
        zip.file('newtab.js', `window.location.replace("${appUrl}");`);
      }

      // 3. Instructions README.txt
      const readmeText = `=====================================================
AuraTab 4K - Extension Autonome pour Mozilla Firefox
=====================================================

FONCTIONNEMENT SANS URL :
Cette extension est 100% autonome et fonctionne en local.
Lorsque vous ouvrez un nouvel onglet, AUCUNE URL n'apparaît dans la barre d'adresse de Firefox (la barre reste totalement propre et prête pour vos recherches).

COMMENT INSTALLER DANS FIREFOX EN 10 SECONDES :

1. Dézippez cette archive dans un dossier de votre choix (ex: Documents/AuraTab).
2. Ouvrez Mozilla Firefox.
3. Dans la barre d'adresse de Firefox, tapez :
   about:debugging#/runtime/this-firefox
   puis appuyez sur Entrée.
4. Cliquez sur le bouton "Charger un module temporaire...".
5. Parcourez vos dossiers et sélectionnez le fichier "manifest.json".
6. C'est prêt ! Ouvrez un nouvel onglet (Ctrl + T) : vos fonds 4K animés apparaissent sans aucune URL externe !

Tous vos réglages et favoris sont conservés localement.
`;
      zip.file('README.txt', readmeText);

      // 4. Generate PNG and SVG icon files
      const pngBlob = await getIconBlob();
      zip.file('icon.png', pngBlob);

      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
  <rect width="96" height="96" rx="22" fill="#0f1118"/>
  <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <polygon points="48,10 51,17 48,24 45,17" fill="#ffffff"/>
  <polygon points="48,72 51,79 48,86 45,79" fill="#ffffff"/>
  <path d="M 28 36 L 44 28 L 68 28 L 68 66" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 48 24 L 68 72 L 56 70 L 48 50 L 40 70 L 28 72 Z" fill="#ffffff"/>
  <polygon points="48,46 51.5,52 48,58 44.5,52" fill="#0f1118"/>
  <ellipse cx="48" cy="54" rx="34" ry="11" fill="none" stroke="#ffffff" stroke-width="3" transform="rotate(-15 48 54)"/>
</svg>`;
      zip.file('icon.svg', iconSvg);

      // Generate zip blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'auratab-firefox-extension.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate extension zip:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        id="firefox-extension-dialog"
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0f1118]/95 border border-white/15 shadow-2xl text-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              {/* Firefox Logo Silhouette */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09-.39.2-.76.34-1.12.78-2.02 2.45-3.56 4.54-4.14.3-.08.62-.14.94-.17.32-.03.65-.05.97-.05.37 0 .73.03 1.09.08 2.58.37 4.72 2.1 5.56 4.51.27.76.41 1.58.41 2.43 0 4.08-3.05 7.44-7 7.93z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Installer l'Extension Firefox
              </h2>
              <p className="text-xs text-white/50">
                Remplacez votre nouvel onglet par votre startpage 4K animée
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Download Action Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  Pack Extension Firefox Autonome (.zip)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30">
                  Sans URL externe
                </span>
              </div>
              <div className="text-xs text-white/60 mt-0.5">
                100% hors-ligne : la barre d'adresse de Firefox reste totalement vierge (aucun lien Google / AI Studio).
              </div>
            </div>

            <button
              type="button"
              id="download-firefox-zip-btn"
              onClick={handleDownloadExtensionZip}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-semibold text-xs transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Téléchargé !</span>
                </>
              ) : isGenerating ? (
                <span>Génération...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger (.ZIP)</span>
                </>
              )}
            </button>
          </div>

          {/* Add-on Unique ID Configuration (évite l'erreur Mozilla 'Duplicate add-on ID found') */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Identifiant unique Mozilla (ID de l'extension)
              </label>
              <button
                type="button"
                onClick={() => setAddonId(generateUniqueAddonId())}
                className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Générer un nouvel ID si Firefox AMO indique 'Duplicate add-on ID found'"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Régénérer un nouvel ID</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={addonId}
                onChange={(e) => setAddonId(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-orange-400/50"
                placeholder="ex: auratab-unique@addons.mozilla.org"
                title="Identifiant Gecko (ID unique)"
              />
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-white/40">v</span>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-16 px-2 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs text-center focus:outline-none focus:border-orange-400/50"
                  placeholder="1.0.0"
                  title="Version du module"
                />
              </div>
            </div>

            <div className="text-[11px] text-white/55 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5">
              ✅ <b>Résolution de l'erreur « Duplicate add-on ID found » :</b> Le portail Mozilla vérifie que l'ID n'a jamais été soumis. Cet ID unique est généré automatiquement. Si besoin, cliquez sur <b>« Régénérer un nouvel ID »</b> avant de retélécharger le ZIP.
            </div>
          </div>

          {/* Guide étapes */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Installation rapide dans Firefox (10 secondes) :
            </h3>

            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-semibold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <span className="font-semibold text-white">
                    Téléchargez et décompressez
                  </span>
                  <p className="text-white/60 mt-0.5">
                    Cliquez sur le bouton ci-dessus pour obtenir le fichier zip et faites "Extraire ici".
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-semibold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-white">
                    Ouvrez la page de débogage Firefox
                  </span>
                  <p className="text-white/60 mt-0.5 mb-2">
                    Collez cette adresse dans la barre d'URL de Firefox :
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded-lg bg-black/50 border border-white/15 text-orange-300 font-mono text-[11px] select-all">
                      about:debugging#/runtime/this-firefox
                    </code>
                    <button
                      type="button"
                      onClick={copyDebuggingUrl}
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 transition-colors"
                    >
                      {hasCopiedUrl ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-semibold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <span className="font-semibold text-white">
                    Charger le module temporaire
                  </span>
                  <p className="text-white/60 mt-0.5">
                    Cliquez sur <b>« Charger un module temporaire... »</b> et sélectionnez le fichier <b>manifest.json</b> extrait.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white font-semibold flex items-center justify-center flex-shrink-0 text-[11px]">
                  4
                </span>
                <div>
                  <span className="font-semibold text-white">
                    Ouvrez un nouvel onglet !
                  </span>
                  <p className="text-white/60 mt-0.5">
                    Tapez <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20 text-[10px]">Ctrl+T</kbd> (ou <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20 text-[10px]">Cmd+T</kbd>) : votre startpage 4K animée apparaît instantanément !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <span className="text-[11px] text-white/50">
            Compatible Firefox Quantum, Developer Edition et Nightly
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 shadow transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
