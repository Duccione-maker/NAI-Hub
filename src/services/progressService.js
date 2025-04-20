// src/services/progressService.js
/**
 * Service per gestire il progresso degli studenti per l'accesso alla sezione Letteratura
 */

// Definizione degli stati possibili
const STATO_SIGILLO = {
    INTATTO: 'intatto',
    INCRINATO: 'incrinato',
    ROTTO: 'rotto'
  };
  
  /**
   * Calcola lo stato dei sigilli per un utente
   * @param {Object} userProfile - Il profilo dell'utente
   * @returns {Object} - Lo stato di ogni sigillo con relativi progressi
   */
  export const calcolaStatoSigilli = (userProfile) => {
    if (!userProfile) return {};
    
    // Definizione dei sigilli e dei requisiti
    const sigilliConfig = [
      {
        id: 'parola',
        requisitoValoreTarget: 3,
        categoria: 'lettura',
      },
      {
        id: 'penna',
        requisitoValoreTarget: 3,
        categoria: 'scrittura',
      },
      {
        id: 'segni',
        requisitoValoreTarget: 2,
        categoria: 'punteggiatura',
      },
      {
        id: 'voci',
        requisitoValoreTarget: 3,
        categoria: 'registri',
      },
      {
        id: 'torneo',
        requisitoValoreTarget: 1,
        categoria: 'torneo',
      },
      {
        id: 'conoscenza',
        requisitoValoreTarget: 2,
        categoria: 'dojo',
      },
      {
        id: 'maestro',
        requisitoValoreTarget: 'arancione',
        categoria: 'livello',
      }
    ];
    
    const statoSigilli = {};
    
    // Ottieni lo stato salvato dei sigilli (se esiste)
    const sigilliSalvati = userProfile.sigilliLetteratura || {};
    
    sigilliConfig.forEach(sigillo => {
      // Se lo stato è già salvato, usalo
      if (sigilliSalvati[sigillo.id]) {
        statoSigilli[sigillo.id] = sigilliSalvati[sigillo.id];
        return;
      }
      
      // Altrimenti calcola lo stato in base ai progressi dell'utente
      const progressoAttuale = calcolaProgressoSigillo(sigillo, userProfile);
      const percentualeCompletamento = sigillo.categoria === 'livello' 
        ? (progressoAttuale ? 100 : 0) 
        : (progressoAttuale / sigillo.requisitoValoreTarget) * 100;
      
      if (percentualeCompletamento >= 100) {
        statoSigilli[sigillo.id] = { stato: STATO_SIGILLO.ROTTO, progresso: 100 };
      } else if (percentualeCompletamento >= 50) {
        statoSigilli[sigillo.id] = { stato: STATO_SIGILLO.INCRINATO, progresso: percentualeCompletamento };
      } else {
        statoSigilli[sigillo.id] = { stato: STATO_SIGILLO.INTATTO, progresso: percentualeCompletamento };
      }
    });
    
    return statoSigilli;
  };
  
  /**
   * Calcola il progresso per un sigillo specifico
   * @param {Object} sigillo - Il sigillo da valutare
   * @param {Object} profilo - Il profilo dell'utente
   * @returns {number} - Il valore del progresso attuale
   */
  export const calcolaProgressoSigillo = (sigillo, profilo) => {
    if (!profilo) return 0;
    
    switch (sigillo.categoria) {
      case 'lettura':
        return profilo.letturaEserciziCompletati?.filter(e => e.punteggio > 80)?.length || 0;
      case 'scrittura':
        return profilo.scritturaEserciziCompletati?.filter(e => e.valutazionePositiva)?.length || 0;
      case 'punteggiatura':
        return profilo.punteggiaturaEserciziAvanzatiCompletati?.length || 0;
      case 'registri':
        return profilo.registriUsatiCorrettamente?.length || 0;
      case 'torneo':
        return profilo.torneiCompletati?.length || 0;
      case 'dojo':
        return profilo.studentiAiutati?.length || 0;
      case 'livello':
        // Mappa le cinture a valori numerici
        const livelloCinture = {
          'bianca': 1,
          'gialla': 2,
          'arancione': 3,
          'verde': 4,
          'blu': 5,
          'marrone': 6,
          'nera': 7
        };
        const livelloAttualeValore = livelloCinture[profilo.livello] || 0;
        const livelloRichiestoValore = livelloCinture['arancione'];
        return livelloAttualeValore >= livelloRichiestoValore ? 1 : 0;
      default:
        return 0;
    }
  };
  
  /**
   * Verifica se un utente ha completato tutti i requisiti per accedere alla sezione letteratura
   * @param {Object} userProfile - Il profilo dell'utente
   * @returns {boolean} - true se l'accesso è sbloccato, false altrimenti
   */
  export const verificaAccessoLetteratura = (userProfile) => {
    if (!userProfile) return false;
    
    // Se l'accesso è già stato completato, restituiamo true
    if (userProfile.accessoLetteraturaCompletato) {
      return true;
    }
    
    // Calcola lo stato di tutti i sigilli
    const statoSigilli = calcolaStatoSigilli(userProfile);
    
    // Verifica se tutti i sigilli sono rotti
    return Object.values(statoSigilli).every(
      sigillo => sigillo.stato === STATO_SIGILLO.ROTTO
    );
  };
  
  /**
   * Aggiorna lo stato dei sigilli nel profilo utente
   * @param {Object} userProfile - Il profilo dell'utente da aggiornare
   * @param {Object} nuovoStatoSigilli - Il nuovo stato dei sigilli
   * @returns {Object} - Il profilo aggiornato
   */
  export const aggiornaSigilliProfilo = async (userProfile, nuovoStatoSigilli) => {
    if (!userProfile) return null;
    
    const profiloAggiornato = {
      ...userProfile,
      sigilliLetteratura: {
        ...userProfile.sigilliLetteratura,
        ...nuovoStatoSigilli
      }
    };
    
    // Qui dovresti implementare la logica per salvare il profilo aggiornato
    // ad esempio con una chiamata API o salvando nel localStorage
    
    // Esempio con localStorage (per test)
    localStorage.setItem('userProfile', JSON.stringify(profiloAggiornato));
    
    // Esempio con API
    // await api.updateUserProfile(profiloAggiornato);
    
    return profiloAggiornato;
  };
  
  /**
   * Completa l'accesso alla sezione letteratura per un utente
   * @param {Object} userProfile - Il profilo dell'utente
   * @returns {Object} - Il profilo aggiornato
   */
  export const completaAccessoLetteratura = async (userProfile) => {
    if (!userProfile) return null;
    
    const profiloAggiornato = {
      ...userProfile,
      accessoLetteraturaCompletato: true,
      dataAccessoLetteratura: new Date().toISOString()
    };
    
    // Salva il profilo aggiornato
    // Esempio con localStorage (per test)
    localStorage.setItem('userProfile', JSON.stringify(profiloAggiornato));
    
    // Esempio con API
    // await api.updateUserProfile(profiloAggiornato);
    
    return profiloAggiornato;
  };
  
  /**
   * Ottiene suggerimenti per completare i sigilli mancanti
   * @param {Object} userProfile - Il profilo dell'utente
   * @returns {Array} - Lista di suggerimenti per completare i sigilli
   */
  export const getSuggerimentiSigilli = (userProfile) => {
    if (!userProfile) return [];
    
    const statoSigilli = calcolaStatoSigilli(userProfile);
    const suggerimenti = [];
    
    // Verifica i sigilli non completi e genera suggerimenti
    Object.entries(statoSigilli).forEach(([id, stato]) => {
      if (stato.stato !== STATO_SIGILLO.ROTTO) {
        switch (id) {
          case 'parola':
            suggerimenti.push({
              sigillo: 'Sigillo della Parola',
              messaggio: 'Completa esercizi di lettura con un punteggio superiore all\'80%',
              progresso: `${Math.round(stato.progresso)}%`
            });
            break;
          case 'penna':
            suggerimenti.push({
              sigillo: 'Sigillo della Penna',
              messaggio: 'Scrivi e ottieni valutazioni positive nei tuoi esercizi di scrittura',
              progresso: `${Math.round(stato.progresso)}%`
            });
            break;
          case 'segni':
            suggerimenti.push({
              sigillo: 'Sigillo dei Segni',
              messaggio: 'Completa esercizi avanzati sulla punteggiatura',
              progresso: `${Math.round(stato.progresso)}%`
            });
            break;
          case 'voci':
            suggerimenti.push({
              sigillo: 'Sigillo delle Voci',
              messaggio: 'Usa correttamente diversi registri linguistici negli esercizi',
              progresso: `${Math.round(stato.progresso)}%`
            });
            break;
          case 'torneo':
            suggerimenti.push({
              sigillo: 'Sigillo del Torneo',
              messaggio: 'Partecipa a un torneo completo',
              progresso: `${Math.round(stato.progresso)}%`
            });
            break;
          case 'conoscenza':
            suggerimenti.push({
              sigillo: 'Sigillo della Conoscenza',
              messaggio: 'Aiuta i tuoi compagni nel Dojo della Conoscenza',
              progresso: `${Math.round(stato.progresso)}%`
            });
            break;
          case 'maestro':
            suggerimenti.push({
              sigillo: 'Sigillo del Maestro',
              messaggio: 'Raggiungi almeno la cintura arancione',
              progresso: `${Math.round(stato.progresso)}%`
            });
            break;
        }
      }
    });
    
    return suggerimenti;
  };
  
  /**
   * Concede l'accesso alla sezione letteratura per uno studente specifico
   * @param {string} studenteId - L'ID dello studente
   * @returns {Promise<boolean>} - true se l'operazione è riuscita
   */
  export const concediAccessoLetteratura = async (studenteId) => {
    if (!studenteId) return false;
    
    try {
      // In un'implementazione reale, faresti una chiamata API
      // per ottenere il profilo dello studente e poi aggiornarlo
      
      // Esempio con API (da implementare)
      // const studenteProfile = await api.getUserProfile(studenteId);
      // const profiloAggiornato = {
      //   ...studenteProfile,
      //   accessoLetteraturaCompletato: true,
      //   dataAccessoLetteratura: new Date().toISOString()
      // };
      // await api.updateUserProfile(profiloAggiornato);
      
      // Esempio con localStorage (per test)
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      if (profiles[studenteId]) {
        profiles[studenteId].accessoLetteraturaCompletato = true;
        profiles[studenteId].dataAccessoLetteratura = new Date().toISOString();
        localStorage.setItem('userProfiles', JSON.stringify(profiles));
      }
      
      return true;
    } catch (error) {
      console.error('Errore nella concessione dell\'accesso:', error);
      return false;
    }
  };
  
  export default {
    calcolaStatoSigilli,
    calcolaProgressoSigillo,
    verificaAccessoLetteratura,
    aggiornaSigilliProfilo,
    completaAccessoLetteratura,
    getSuggerimentiSigilli,
    concediAccessoLetteratura
  };