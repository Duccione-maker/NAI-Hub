import React from 'react';
import { Link } from 'react-router-dom';
import './NormativeCompliance.css';

const NormativeCompliance = () => {
  return (
    <div className="normative-compliance">
      <h2>Conformità alle Normative</h2>
      
      <div className="compliance-section">
        <h3>Didattica Digitale Integrata</h3>
        <p>Questa piattaforma è conforme alle Linee guida per la Didattica Digitale Integrata.</p>
        <Link to="/ddi-resources">Risorse DDI</Link>
      </div>
      
      <div className="compliance-section">
        <h3>Uso Positivo delle Tecnologie</h3>
        <p>Promuoviamo l'utilizzo consapevole e responsabile degli strumenti digitali.</p>
        <Link to="/digital-citizenship">Cittadinanza Digitale</Link>
      </div>
      
      <div className="compliance-section">
        <h3>Protezione dei Dati</h3>
        <p>Adottiamo misure avanzate per la protezione dei dati personali.</p>
        <Link to="/privacy-settings">Impostazioni Privacy</Link>
      </div>
      
      <div className="compliance-section">
        <h3>Accessibilità</h3>
        <p>La piattaforma è progettata per essere accessibile a tutti gli studenti.</p>
        <Link to="/accessibility-options">Opzioni di Accessibilità</Link>
      </div>
      
      <div className="compliance-section">
        <h3>Formazione Docenti</h3>
        <p>Offriamo risorse per la formazione continua del personale scolastico.</p>
        <Link to="/teacher-training">Area Formazione</Link>
      </div>
    </div>
  );
};

export default NormativeCompliance;