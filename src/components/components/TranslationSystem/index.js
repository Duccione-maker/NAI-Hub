// TranslationSystem/index.js - Export semplificato e funzionante

// Import componente principale
import EnhancedSupportoLinguistico from './EnhancedSupportoLinguistico';

// Export default: componente completo pronto all'uso
export default EnhancedSupportoLinguistico;

// Export semplificato
export {
  EnhancedSupportoLinguistico
};

// Info versione
export const TRANSLATION_SYSTEM_INFO = {
  version: '1.0.0-simplified',
  description: 'Sistema di traduzione semplificato con hover e selection',
  features: [
    'Hover translation',
    'Selection translation', 
    'Smart activation',
    'Personal dictionary',
    'Audio pronunciation',
    'Smart disable mode'
  ]
};