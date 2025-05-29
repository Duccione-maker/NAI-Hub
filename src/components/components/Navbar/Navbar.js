import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

// Definizione delle icone per le sezioni
const sectionIcons = {
  dashboard: "🏯", // Dojo
  test: "📜", // Pergamena
  lettura: "📖", // Libro
  scrittura: "✍️", // Scrittura
  punteggiatura: "✒️", // Penna
  registri: "🗣️", // Parlare
  torneo: "🏆", // Trofeo
  dojo: "🥋", // Gi (uniforme karate)
  letteratura: "📚", // Libri (per la sezione letteratura)
  admin: "👨‍🏫" // Insegnante (per la sezione docenti)
};

const Navbar = ({ userProfile }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Determina se mostrare link in base al livello utente e all'accesso letteratura
  const shouldShowLink = (requiredLevel, path) => {
    // Controllo speciale per Letteratura Italiana
    if (path === '/letteratura') {
      return userProfile && userProfile.accessoLetteraturaCompletato === true;
    }
    
    // L'Area Docenti è sempre visibile, l'autenticazione avverrà alla pagina di login
    if (path === '/admin' || path.startsWith('/admin/')) {
      return true; // Sempre visibile nella navbar
    }
    
    // Logica esistente per altri link
    if (!requiredLevel || !userProfile) return true;
    
    const levelMap = {
      'nai-basic': 1,
      'nai-intermediate': 2,
      'nai-advanced': 3,
      'beginner': 4,
      'intermediate': 5,
      'advanced': 6
    };
    
    const userLevelValue = levelMap[userProfile.level] || 0;
    const requiredLevelValue = levelMap[requiredLevel] || 999;
    
    return userLevelValue >= requiredLevelValue;
  };
  
  // Definizione dei link di navigazione
  const navLinks = [
    { path: '/test-ingresso', label: 'Test di Ingresso', icon: sectionIcons.test },
    { path: '/dashboard', label: 'Dashboard', icon: sectionIcons.dashboard },
    { path: '/lettura', label: 'Lettura Assistita', icon: sectionIcons.lettura },
    { path: '/scrittura', label: 'Esercizi di Scrittura', icon: sectionIcons.scrittura },
    { path: '/punteggiatura', label: 'Punteggiatura', icon: sectionIcons.punteggiatura },
    { path: '/registri', label: 'Registri Linguistici', icon: sectionIcons.registri, requiredLevel: 'intermediate' },
    { path: '/torneo', label: 'Torneo Lingua Kai', icon: sectionIcons.torneo, requiredLevel: 'beginner' },
    { path: '/dojo', label: 'Dojo della Conoscenza', icon: sectionIcons.dojo, requiredLevel: 'beginner' },
    { path: '/letteratura', label: 'Letteratura Italiana', icon: sectionIcons.letteratura, requiredLevel: 'beginner' },
  ];
  
  // Aggiungi link per supporto linguistico se l'utente è NAI
  const allLinks = userProfile && userProfile.isNAI 
    ? [...navLinks, { path: '/supporto', label: 'Supporto Linguistico', icon: '🌍' }]
    : navLinks;
  
  // Gestione dell'apertura/chiusura del menu su mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          <img src="/images/karate-logo.png" alt="Lingua Kai" />
          <span className="logo-text">Lingua Kai</span>
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Menu principale"
        >
          <span className="menu-icon">{menuOpen ? '✖' : '☰'}</span>
        </button>
      </div>
      
      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          {allLinks.map((link, index) => (
            shouldShowLink(link.requiredLevel, link.path) && (
              <li key={index}>
                <Link 
                  to={link.path} 
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-text">{link.label}</span>
                </Link>
              </li>
            )
          ))}
        </ul>
      </div>
      
      <div className="user-controls">
        {userProfile ? (
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{userProfile.name}</span>
              <span className="user-level">
                {userProfile.isTeacher ? 'Docente' : `Livello: ${userProfile.level}`}
              </span>
            </div>
            <div className="user-avatar">
              {userProfile.avatar || (userProfile.isTeacher ? '👨‍🏫' : '👤')}
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-button">
            Accedi
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;