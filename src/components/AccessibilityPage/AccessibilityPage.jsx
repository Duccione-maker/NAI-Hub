import React from 'react';
import './AccessibilityPage.css';

const AccessibilityPage = () => {
  return (
    <div className="accessibility-page">
      <h2>Opzioni di Accessibilità</h2>
      
      <p className="accessibility-intro">
        Questa piattaforma è progettata per essere accessibile a tutti gli utenti, indipendentemente dalle loro capacità.
        Qui trovi tutte le funzionalità di accessibilità disponibili e come utilizzarle.
      </p>
      
      <div className="accessibility-section">
        <h3>Dimensione del testo</h3>
        <p>
          Puoi modificare la dimensione del testo utilizzando la barra degli strumenti di accessibilità visibile sul lato destro dello schermo.
          Sono disponibili quattro dimensioni: piccolo, medio, grande e extra grande.
        </p>
      </div>
      
      <div className="accessibility-section">
        <h3>Contrasto</h3>
        <p>
          Per gli utenti con difficoltà visive, è possibile aumentare il contrasto o attivare la modalità scura.
          Queste opzioni rendono il testo più leggibile e riducono l'affaticamento degli occhi.
        </p>
      </div>
      
      <div className="accessibility-section">
        <h3>Riduzione delle animazioni</h3>
        <p>
          Se preferisci un'interfaccia con meno movimento, puoi ridurre o disattivare le animazioni.
          Questo è particolarmente utile per utenti con disturbi vestibolari o sensibilità al movimento.
        </p>
      </div>
      
      <div className="accessibility-section">
        <h3>Font per dislessia</h3>
        <p>
          La piattaforma offre un font speciale progettato per utenti con dislessia,
          che facilita la lettura rendendo i caratteri più distinguibili tra loro.
        </p>
      </div>
      
      <div className="accessibility-section">
        <h3>Lettura ad alta voce</h3>
        <p>
          Attivando questa opzione, i contenuti testuali possono essere letti ad alta voce.
          Questa funzionalità utilizza la tecnologia di sintesi vocale del tuo browser.
        </p>
      </div>
      
      <div className="accessibility-section">
        <h3>Navigazione da tastiera</h3>
        <p>
          Per gli utenti che non utilizzano il mouse, la piattaforma supporta la navigazione completa tramite tastiera.
          Usa il tasto Tab per spostarti tra gli elementi e Invio per selezionarli.
        </p>
      </div>
      
      <div className="accessibility-help">
        <h3>Hai bisogno di assistenza?</h3>
        <p>
          Se hai difficoltà ad accedere ai contenuti o a utilizzare la piattaforma,
          contatta il nostro team di supporto all'indirizzo <a href="mailto:supporto@linguakai.it">supporto@linguakai.it</a>.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityPage;