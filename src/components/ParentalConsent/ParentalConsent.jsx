import React, { useState } from 'react';
import './ParentalConsent.css';

const ParentalConsent = ({ studentId, setVerified }) => {
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [consentStatus, setConsentStatus] = useState('pending'); // pending, sent, confirmed, error
  const [consentAccepted, setConsentAccepted] = useState(false);

  const sendConsentRequest = async () => {
    // Simula l'invio di una richiesta di consenso
    try {
      // In un'implementazione reale, qui ci sarebbe una chiamata API
      setConsentStatus('sent');
      
      // In ambiente di sviluppo, simuliamo la conferma per test
      setTimeout(() => {
        setConsentStatus('confirmed');
        if (setVerified) setVerified(true);
        localStorage.setItem('parental-consent', 'true');
      }, 3000);
    } catch (error) {
      console.error('Error sending consent request:', error);
      setConsentStatus('error');
    }
  };

  return (
    <div className="parental-consent">
      <div className="consent-header">
        <h2>Consenso Genitoriale</h2>
        <p>Richiesto per studenti minori di 14 anni</p>
      </div>
      
      <div className="consent-icon">👨‍👩‍👧‍👦</div>
      
      <div className="consent-explanation">
        <h3>Perché è necessario il consenso?</h3>
        <p>
          In conformità con la normativa sulla protezione dei dati personali e le linee guida 
          del Ministero dell'Istruzione, per gli studenti di età inferiore ai 14 anni è richiesto 
          il consenso di un genitore o tutore legale per l'utilizzo della piattaforma.
        </p>
        <p>
          Questo ci consente di garantire che l'utilizzo dei dati personali avvenga in modo 
          conforme alla legge e con l'approvazione di chi esercita la responsabilità genitoriale.
        </p>
        <p>
          Puoi consultare la nostra <a href="/privacy" className="policy-link">Informativa sulla Privacy</a> per 
          maggiori dettagli su come vengono trattati i dati.
        </p>
      </div>
      
      {consentStatus === 'confirmed' ? (
        <div className="consent-confirmed">
          <div className="confirmed-icon">✓</div>
          <div className="confirmed-message">Consenso genitoriale confermato!</div>
          <div className="confirmed-details">
            Ora puoi accedere a tutte le funzionalità della piattaforma.
          </div>
          <a href="/dashboard" className="continue-btn">Vai alla dashboard</a>
        </div>
      ) : (
        <div className="consent-form">
          <div className="form-group">
            <label htmlFor="parent-name">Nome del genitore/tutore</label>
            <input 
              type="text"
              id="parent-name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Inserisci il nome completo"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="parent-email">Email del genitore/tutore</label>
            <input 
              type="email"
              id="parent-email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="esempio@email.com"
            />
          </div>
          
          <div className="consent-checkbox">
            <input 
              type="checkbox"
              id="consent-checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
            />
            <label htmlFor="consent-checkbox">
              Dichiaro di essere il genitore/tutore legale dello studente e di acconsentire all'utilizzo 
              della piattaforma educativa in conformità con i termini e le condizioni 
              e l'informativa sulla privacy.
            </label>
          </div>
          
          {consentStatus === 'sent' && (
            <div className="consent-status status-sent">
              Email di conferma inviata! Controlla la casella di posta elettronica.
            </div>
          )}
          
          {consentStatus === 'error' && (
            <div className="consent-status status-error">
              Si è verificato un errore nell'invio della richiesta. Riprova più tardi.
            </div>
          )}
          
          <div className="form-actions">
            <button 
              className="send-request-btn"
              onClick={sendConsentRequest}
              disabled={!parentEmail || !parentName || !consentAccepted || consentStatus === 'sent'}
            >
              Invia richiesta di consenso
            </button>
          </div>
        </div>
      )}
      
      <div className="consent-footer">
        Per assistenza, contatta il <a href="/supporto" className="support-link">supporto tecnico</a>.
      </div>
    </div>
  );
};

export default ParentalConsent;