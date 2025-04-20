// src/components/PergamenaSigillata/PergamenaSigillata.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PergamenaSigillaStyle.css';

// Definizione dei sigilli e dei loro requisiti
const sigilliConfig = [
  {
    id: 'parola',
    nome: 'Sigillo della Parola',
    descrizione: 'Dimostra la tua capacità di lettura e comprensione',
    requisito: 'Completa almeno 3 esercizi di lettura con un punteggio > 80%',
    icon: '📖',
    requisitoValoreTarget: 3,
    categoria: 'lettura',
  },
  {
    id: 'penna',
    nome: 'Sigillo della Penna',
    descrizione: 'Padroneggia l\'arte della scrittura',
    requisito: 'Completa almeno 3 esercizi di scrittura valutati positivamente',
    icon: '✍️',
    requisitoValoreTarget: 3,
    categoria: 'scrittura',
  },
  {
    id: 'segni',
    nome: 'Sigillo dei Segni',
    descrizione: 'Impara il potere della punteggiatura',
    requisito: 'Completa con successo almeno 2 esercizi di punteggiatura avanzati',
    icon: '✒️',
    requisitoValoreTarget: 2,
    categoria: 'punteggiatura',
  },
  {
    id: 'voci',
    nome: 'Sigillo delle Voci',
    descrizione: 'Dimostra versatilità nei registri linguistici',
    requisito: 'Usa correttamente almeno 3 diversi registri linguistici',
    icon: '🗣️',
    requisitoValoreTarget: 3,
    categoria: 'registri',
  },
  {
    id: 'torneo',
    nome: 'Sigillo del Torneo',
    descrizione: 'Metti alla prova le tue abilità in competizione',
    requisito: 'Partecipa ad almeno 1 torneo completo',
    icon: '🏆',
    requisitoValoreTarget: 1,
    categoria: 'torneo',
  },
  {
    id: 'conoscenza',
    nome: 'Sigillo della Conoscenza',
    descrizione: 'Condividi il sapere con i tuoi compagni',
    requisito: 'Aiuta almeno 2 compagni nel Dojo della Conoscenza',
    icon: '🥋',
    requisitoValoreTarget: 2,
    categoria: 'dojo',
  },
  {
    id: 'maestro',
    nome: 'Sigillo del Maestro',
    descrizione: 'Raggiungi un livello adeguato di maestria',
    requisito: 'Raggiungi almeno la cintura arancione',
    icon: '👤',
    requisitoValoreTarget: 'arancione',
    categoria: 'livello',
  }
];

// Stati possibili di un sigillo
const STATO_SIGILLO = {
  INTATTO: 'intatto',
  INCRINATO: 'incrinato',
  ROTTO: 'rotto'
};

const PergamenaSigillata = ({ userProfile, onAccessoCompletato }) => {
  const [sigilliStato, setSigilliStato] = useState({});
  const [animazioneAttiva, setAnimazioneAttiva] = useState(false);
  const [sbloccoCompletato, setSbloccoCompletato] = useState(false);
  const [tooltipVisibile, setTooltipVisibile] = useState(null);
  const [messaggioIncoraggiamento, setMessaggioIncoraggiamento] = useState(null);
  const [pergamenaAperta, setPergamenaAperta] = useState(false);
  
  // Determina lo stato di ogni sigillo in base ai progressi dello studente
  useEffect(() => {
    if (!userProfile) return;
    
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
      const percentualeCompletamento = (progressoAttuale / sigillo.requisitoValoreTarget) * 100;
      
      if (percentualeCompletamento >= 100) {
        statoSigilli[sigillo.id] = { stato: STATO_SIGILLO.ROTTO, progresso: 100 };
      } else if (percentualeCompletamento >= 50) {
        statoSigilli[sigillo.id] = { stato: STATO_SIGILLO.INCRINATO, progresso: percentualeCompletamento };
      } else {
        statoSigilli[sigillo.id] = { stato: STATO_SIGILLO.INTATTO, progresso: percentualeCompletamento };
      }
    });
    
    setSigilliStato(statoSigilli);
    
    // Verifica se tutti i sigilli sono rotti
    const tuttiRotti = Object.values(statoSigilli).every(
      sigillo => sigillo.stato === STATO_SIGILLO.ROTTO
    );
    
    // Se l'accesso è già stato completato, impostiamo lo stato
    if (userProfile.accessoLetteraturaCompletato || tuttiRotti) {
      setSbloccoCompletato(true);
    }
  }, [userProfile]);
  
  // Calcola il progresso per un sigillo specifico
  const calcolaProgressoSigillo = (sigillo, profilo) => {
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
  
  // Avvia l'animazione di sblocco
  const avviaCerimoniaDisigillazione = () => {
    setAnimazioneAttiva(true);
    
    // Sequenza di animazione
    setTimeout(() => {
      setPergamenaAperta(true);
      
      // Dopo che la pergamena si è aperta, mostriamo l'effetto finale
      setTimeout(() => {
        setSbloccoCompletato(true);
        
        // Notifica il componente genitore che lo sblocco è stato completato
        if (onAccessoCompletato) {
          onAccessoCompletato();
        }
      }, 3000);
    }, 2000);
  };
  
  // Mostra il tooltip per un sigillo
  const mostraTooltip = (sigilloId) => {
    setTooltipVisibile(sigilloId);
  };
  
  // Nasconde il tooltip
  const nascondiTooltip = () => {
    setTooltipVisibile(null);
  };
  
  // Mostra un messaggio di incoraggiamento
  const mostraIncoraggiamento = (messaggio) => {
    setMessaggioIncoraggiamento(messaggio);
    
    // Nascondi dopo alcuni secondi
    setTimeout(() => {
      setMessaggioIncoraggiamento(null);
    }, 3000);
  };
  
  // Gestisce il click su un sigillo
  const handleSigilloClick = (sigillo) => {
    const statoSigillo = sigilliStato[sigillo.id];
    
    if (statoSigillo.stato === STATO_SIGILLO.INTATTO) {
      mostraIncoraggiamento(`Continua ad allenarti per rompere il ${sigillo.nome}!`);
    } else if (statoSigillo.stato === STATO_SIGILLO.INCRINATO) {
      mostraIncoraggiamento(`Sei vicino a rompere il ${sigillo.nome}! Manca poco!`);
    } else {
      mostraIncoraggiamento(`Hai già rotto il ${sigillo.nome}! Continua con gli altri sigilli.`);
    }
  };
  
  // Calcola quanti sigilli sono già rotti
  const calcolaSigilliRotti = () => {
    return Object.values(sigilliStato).filter(
      sigillo => sigillo.stato === STATO_SIGILLO.ROTTO
    ).length;
  };
  
  // Render condizionale in base allo stato di sblocco
  if (sbloccoCompletato) {
    return (
      <div className="pergamena-completata">
        <div className="pergamena-open">
          <h2>La Biblioteca dei Maestri è Aperta!</h2>
          <p className="messaggio-sblocco">
            Ben trovato, giovane studioso.<br/><br/>
            
            Hai dimostrato padronanza nelle arti fondamentali della lingua, rompendo i sette sigilli 
            che proteggevano questa conoscenza antica. La letteratura non è solo un insieme di testi 
            da studiare, ma l'eredità spirituale di chi ha dato forma ai pensieri più profondi 
            attraverso le parole.<br/><br/>
            
            In questa Biblioteca troverai le voci dei Grandi Maestri che hanno forgiato la nostra 
            lingua. Potrai non solo leggere le loro opere, ma anche scoprire i segreti della loro 
            arte, decifrare le figure retoriche e persino cimentarti nella creazione di tue opere 
            ispirate ai loro insegnamenti.<br/><br/>
            
            Il cammino del vero Maestro della Lingua non termina mai. Benvenuto nel prossimo 
            capitolo del tuo viaggio.
          </p>
          <Link to="/letteratura" className="button-accesso">
            Accedi alla Biblioteca
          </Link>
        </div>
      </div>
    );
  }
  
  // Durante l'animazione di sblocco
  if (animazioneAttiva) {
    return (
      <div className={`pergamena-disigillazione ${pergamenaAperta ? 'aperta' : ''}`}>
        <div className="pergamena-scroll">
          <div className="luceDorata"></div>
          <div className="testo-rivelazione">
            I segreti dell'arte letteraria si rivelano a te, studente meritevole.
          </div>
        </div>
      </div>
    );
  }
  
  // Visualizzazione normale della pergamena con i sigilli
  return (
    <div className="pergamena-container">
      <h2>La Pergamena Sigillata</h2>
      <p className="pergamena-descrizione">
        Questa antica pergamena custodisce i segreti della letteratura. 
        Per sbloccarla, devi rompere tutti e sette i sigilli dimostrando 
        la tua padronanza nelle diverse aree della lingua.
      </p>
      
      <div className="sigilli-progresso">
        <span className="sigilli-contatore">
          {calcolaSigilliRotti()} / 7 sigilli rotti
        </span>
        <div className="progresso-bar">
          <div 
            className="progresso-fill" 
            style={{ width: `${(calcolaSigilliRotti() / 7) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="pergamena-scroll">
        <div className="sigilli-container">
          {sigilliConfig.map((sigillo) => {
            const statoSigillo = sigilliStato[sigillo.id] || { stato: STATO_SIGILLO.INTATTO, progresso: 0 };
            
            return (
              <div 
                key={sigillo.id}
                className={`sigillo-item sigillo-${statoSigillo.stato}`}
                onClick={() => handleSigilloClick(sigillo)}
                onMouseEnter={() => mostraTooltip(sigillo.id)}
                onMouseLeave={nascondiTooltip}
              >
                <div className="sigillo-icon">{sigillo.icon}</div>
                <div className="sigillo-nome">{sigillo.nome}</div>
                <div className="sigillo-progresso">
                  <div 
                    className="sigillo-progresso-fill"
                    style={{ width: `${statoSigillo.progresso}%` }}
                  ></div>
                </div>
                
                {tooltipVisibile === sigillo.id && (
                  <div className="sigillo-tooltip">
                    <h4>{sigillo.nome}</h4>
                    <p>{sigillo.descrizione}</p>
                    <p className="requisito">
                      <strong>Requisito:</strong> {sigillo.requisito}
                    </p>
                    <div className="tooltip-progresso">
                      <span>Progresso: {Math.round(statoSigillo.progresso)}%</span>
                    </div>
                  </div>
                )}
                
                {statoSigillo.stato === STATO_SIGILLO.ROTTO && (
                  <div className="sigillo-completato">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {messaggioIncoraggiamento && (
        <div className="messaggio-incoraggiamento">
          {messaggioIncoraggiamento}
        </div>
      )}
      
      {calcolaSigilliRotti() === 7 && (
        <button 
          className="button-cerimonia" 
          onClick={avviaCerimoniaDisigillazione}
        >
          Apri la Pergamena
        </button>
      )}
    </div>
  );
};

export default PergamenaSigillata;