import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeacherTraining.css';

const TeacherTraining = () => {
  const [trainingModules, setTrainingModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Qui ci sarebbe la chiamata API per caricare i moduli e lo stato di completamento
    // Simuliamo i dati per ora
    const fetchData = async () => {
      setTimeout(() => {
        setTrainingModules([
          {
            id: 'module-1',
            title: 'Fondamenti della DDI',
            description: 'Introduzione alla Didattica Digitale Integrata',
            duration: '2 ore',
            level: 'Base',
            topics: ['Normative', 'Metodologie', 'Strumenti base'],
            resources: ['video', 'quiz', 'materiali']
          },
          {
            id: 'module-2',
            title: 'Valutazione nell\'era digitale',
            description: 'Strategie e strumenti per la valutazione in contesti digitali',
            duration: '3 ore',
            level: 'Intermedio',
            topics: ['Rubriche', 'Feedback', 'Autovalutazione'],
            resources: ['video', 'esempi', 'template', 'quiz']
          },
          {
            id: 'module-3',
            title: 'Inclusione e tecnologie assistive',
            description: 'Utilizzo delle tecnologie per supportare l\'inclusione',
            duration: '2,5 ore',
            level: 'Avanzato',
            topics: ['Bisogni educativi speciali', 'Strumenti adattivi', 'Personalizzazione'],
            resources: ['video', 'casi studio', 'quiz']
          },
          {
            id: 'module-4',
            title: 'Sicurezza e privacy nella didattica digitale',
            description: 'Protezione dei dati e utilizzo sicuro delle piattaforme',
            duration: '1,5 ore',
            level: 'Base',
            topics: ['GDPR', 'Sicurezza', 'Best practices'],
            resources: ['video', 'checklist', 'quiz']
          },
          {
            id: 'module-5',
            title: 'Creazione di contenuti didattici digitali',
            description: 'Progettazione e sviluppo di materiali didattici efficaci',
            duration: '4 ore',
            level: 'Intermedio',
            topics: ['Design didattico', 'Multimedia', 'Interattività'],
            resources: ['video', 'workshop', 'template', 'quiz']
          }
        ]);
        
        setCompletedModules(['module-1', 'module-4']);
        
        setCertificates([
          {
            id: 'cert-1',
            title: 'Competenze digitali di base',
            date: '15/01/2025',
            validUntil: '15/01/2028',
            modules: ['module-1', 'module-4']
          }
        ]);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);
  
  const isModuleCompleted = (moduleId) => {
    return completedModules.includes(moduleId);
  };
  
  const getModuleProgress = (moduleId) => {
    // Qui ci sarebbe la logica per calcolare il progresso all'interno di un modulo
    // Per ora restituiamo un valore casuale per i moduli non completati
    if (isModuleCompleted(moduleId)) return 100;
    
    const randomProgress = Math.floor(Math.random() * 80); // 0-80%
    return randomProgress;
  };
  
  if (loading) {
    return <div className="loading">Caricamento dei contenuti formativi...</div>;
  }
  
  return (
    <div className="teacher-training">
      <header className="training-header">
        <h2>Formazione Docenti</h2>
        <p>Migliora le tue competenze digitali attraverso percorsi formativi certificati</p>
      </header>
      
      <section className="training-stats">
        <div className="stat-card">
          <h3>Moduli completati</h3>
          <div className="stat-value">{completedModules.length}/{trainingModules.length}</div>
        </div>
        <div className="stat-card">
          <h3>Certificati ottenuti</h3>
          <div className="stat-value">{certificates.length}</div>
        </div>
        <div className="stat-card">
          <h3>Ore di formazione</h3>
          <div className="stat-value">
            {trainingModules
              .filter(module => isModuleCompleted(module.id))
              .reduce((total, module) => total + parseFloat(module.duration), 0)}
          </div>
        </div>
      </section>
      
      <section className="certificates-section">
        <h3>I tuoi certificati</h3>
        {certificates.length > 0 ? (
          <div className="certificates-list">
            {certificates.map(cert => (
              <div key={cert.id} className="certificate-card">
                <div className="certificate-icon">🏆</div>
                <div className="certificate-info">
                  <h4>{cert.title}</h4>
                  <p>Rilasciato il: {cert.date}</p>
                  <p>Valido fino al: {cert.validUntil}</p>
                </div>
                <button className="download-certificate">Scarica PDF</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-certificates">
            Non hai ancora ottenuto certificati. Completa i percorsi formativi per ricevere certificazioni.
          </p>
        )}
      </section>
      
      <section className="training-modules">
        <h3>Percorsi formativi disponibili</h3>
        <div className="modules-list">
          {trainingModules.map(module => (
            <div key={module.id} className="module-card">
              <div className="module-header">
                <h4>{module.title}</h4>
                <span className={`module-level level-${module.level.toLowerCase()}`}>
                  {module.level}
                </span>
              </div>
              
              <p className="module-description">{module.description}</p>
              
              <div className="module-details">
                <span className="module-duration">⏱️ {module.duration}</span>
                <div className="module-topics">
                  {module.topics.map(topic => (
                    <span key={topic} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>
              
              <div className="module-resources">
                <h5>Risorse:</h5>
                <div className="resource-icons">
                  {module.resources.includes('video') && <span title="Video lezioni">🎬</span>}
                  {module.resources.includes('quiz') && <span title="Quiz interattivi">❓</span>}
                  {module.resources.includes('materiali') && <span title="Materiali didattici">📄</span>}
                  {module.resources.includes('esempi') && <span title="Esempi pratici">💡</span>}
                  {module.resources.includes('template') && <span title="Template riutilizzabili">📑</span>}
                  {module.resources.includes('workshop') && <span title="Workshop interattivi">👥</span>}
                  {module.resources.includes('casi studio') && <span title="Casi studio">🔍</span>}
                  {module.resources.includes('checklist') && <span title="Checklist">✅</span>}
                </div>
              </div>
              
              <div className="module-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${getModuleProgress(module.id)}%`}}
                  ></div>
                </div>
                <span className="progress-text">
                  {isModuleCompleted(module.id) ? 'Completato' : `${getModuleProgress(module.id)}% completato`}
                </span>
              </div>
              
              <Link to={`/formazione/${module.id}`} className="module-button">
                {isModuleCompleted(module.id) ? 'Rivedi modulo' : 'Continua modulo'}
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      <section className="training-community">
        <h3>Community docenti</h3>
        <p>
          Connettiti con altri docenti, condividi esperienze e materiali didattici, 
          partecipa a discussioni su tematiche educative.
        </p>
        <div className="community-buttons">
          <Link to="/community/forum" className="community-button">Forum di discussione</Link>
          <Link to="/community/resources" className="community-button">Materiali condivisi</Link>
          <Link to="/community/events" className="community-button">Eventi e webinar</Link>
        </div>
      </section>
    </div>
  );
};

export default TeacherTraining;