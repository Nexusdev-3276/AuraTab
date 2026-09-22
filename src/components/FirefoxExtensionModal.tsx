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

      // Helper to generate a real valid PNG icon in addition to SVG
      const getIconBlob = async (): Promise<Blob> => {
        try {
          const response = await fetch('/assets/icon.png');
          if (response.ok) {
            return await response.blob();
          }
        } catch (e) {
          console.warn('Failed to load custom icon, falling back to generated icon');
        }
        
        // Fallback to generated if custom fails
        const canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f1118';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(0, 0, 96, 96, 20);
          } else {
            ctx.rect(0, 0, 96, 96);
          }
          ctx.fill();

          ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.beginPath();
          ctx.arc(48, 48, 28, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.moveTo(40, 32);
          ctx.lineTo(64, 48);
          ctx.lineTo(40, 64);
          ctx.closePath();
          ctx.fill();
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

      // 2. newtab.html
      const newTabHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>AuraTab 4K</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0f1118;
      color: rgba(255, 255, 255, 0.7);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px stroke rgba(255, 255, 255, 0.1);
      border-top: 3px solid #ff6a00;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <div style="font-size: 14px; font-weight: 500;">Connexion à AuraTab 4K...</div>
  </div>
  <script src="newtab.js"></script>
</body>
</html>`;
      zip.file('newtab.html', newTabHtml);

      // Create separate newtab.js file to comply with Firefox WebExtension strict CSP
      const newTabJs = `// Évite l'erreur X-Frame-Options/CSP en redirigeant le conteneur principal (top-level)
// au lieu d'intégrer le site dans une iframe.
window.location.replace("${appUrl}");`;
      zip.file('newtab.js', newTabJs);

      // 3. Instructions README.txt
      const readmeText = `=====================================================
AuraTab 4K - Extension pour Mozilla Firefox
=====================================================

COMMENT INSTALLER DANS FIREFOX EN 10 SECONDES :

1. Dézippez cette archive dans un dossier de votre choix (ex: Documents/AuraTab).
2. Ouvrez Mozilla Firefox.
3. Dans la barre d'adresse de Firefox, tapez :
   about:debugging#/runtime/this-firefox
   puis appuyez sur Entrée.
4. Cliquez sur le bouton "Charger un module temporaire...".
5. Parcourez vos dossiers et sélectionnez le fichier "manifest.json".
6. C'est prêt ! Ouvrez un nouvel onglet (Ctrl + T) et profitez de vos fonds 4K animés !

Pour toute modification, vos réglages sont automatiquement conservés.
`;
      zip.file('README.txt', readmeText);

      // 4. Generate PNG and SVG icon files
      const pngBlob = await getIconBlob();
      zip.file('icon.png', pngBlob);

      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="12" fill="#0f1118"/>
  <circle cx="24" cy="24" r="14" fill="#3b82f6" opacity="0.3"/>
  <polygon points="20,16 32,24 20,32" fill="#34d399"/>
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
              <div className="text-sm font-semibold text-white">
                Pack Extension Firefox (.zip)
              </div>
              <div className="text-xs text-white/60 mt-0.5">
                Prêt à charger dans Firefox en mode développement ou permanent.
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
