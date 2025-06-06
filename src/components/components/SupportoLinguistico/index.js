// SupportoLinguistico/index.js - Export per sistema supporto linguistico originale

// Import componenti originali
import SupportoLinguistico, { SupportoLinguisticoProvider } from './SupportoLinguistico';

// Import CSS
import './SupportoLinguistico.css';

// Export default: componente principale
export default SupportoLinguistico;

// Export componenti individuali
export {
  // Componente widget principale
  SupportoLinguistico,
  
  // Provider globale
  SupportoLinguisticoProvider
};

// Export per backward compatibility
export const SupportoLinguisticoComponents = {
  Widget: SupportoLinguistico,
  Provider: SupportoLinguisticoProvider
};

// Utility per uso rapido del provider
export const withSupportoLinguistico = (WrappedComponent) => {
  const WithSupportoLinguistico = (props) => (
    <>
      <WrappedComponent {...props} />
      <SupportoLinguisticoProvider />
    </>
  );
  
  WithSupportoLinguistico.displayName = `withSupportoLinguistico(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithSupportoLinguistico;
};

// Database lingue disponibili (export per riuso)
export const SUPPORTED_LANGUAGES = [
  { code: 'al', name: 'Albanese' },
  { code: 'ko', name: 'Kosovaro' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabo' },
  { code: 'zh', name: 'Cinese' },
  { code: 'ro', name: 'Rumeno' },
  { code: 'es', name: 'Spagnolo' },
  { code: 'pt', name: 'Portoghese' },
  { code: 'uk', name: 'Ucraino' }
];

// Livelli supporto disponibili
export const SUPPORT_LEVELS = [
  { id: "completo", nome: "Completo", descrizione: "Tutte le funzionalità di supporto attive" },
  { id: "intermedio", nome: "Intermedio", descrizione: "Glossario e suggerimenti, senza traduzioni automatiche" },
  { id: "base", nome: "Base", descrizione: "Solo glossario essenziale" },
  { id: "disattivato", nome: "Disattivato", descrizione: "Nessun supporto" }
];

// Info versione
export const SUPPORTO_LINGUISTICO_INFO = {
  version: '1.0.0',
  description: 'Widget di supporto linguistico con glossario multilingue',
  supportedLanguages: SUPPORTED_LANGUAGES.length,
  features: [
    'Glossario multilingue',
    'Frasi utili',
    'Regole grammaticali',
    'Suggerimenti personalizzati',
    'Audio pronuncia (simulato)',
    'Errori comuni per sezione',
    'Livelli supporto configurabili'
  ]
};