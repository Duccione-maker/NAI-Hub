import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useUserProfile from '../../../hooks/useUserProfile';
import textService from '../../../services/textService';
import aiService from '../../../services/aiService';

/**
 * Dashboard principale dell'applicazione
 */
const Dashboard = () => {
  const { userProfile, loading: profileLoading } = useUserProfile();
  const [suggestedTexts, setSuggestedTexts] = useState([]);
  const [learningTips, setLearningTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica i dati per la dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!userProfile || !userProfile.level) return;

      setLoading(true);
      setError(null);

      try {
        // Carica i testi suggeriti per il livello dell'utente
        const texts = await textService.getTexts(userProfile.level);
        setSuggestedTexts(texts.slice(0, 3)); // Prendi solo i primi 3

        // Ottieni suggerimenti personalizzati
        const suggestions = await aiService.getSuggestions(userProfile.level);
        setLearningTips(suggestions.suggestions || []);
      } catch (err) {
        console.error('Errore nel caricamento della dashboard:', err);
        setError('Si è verificato un errore. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userProfile]);

  if (profileLoading || loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Mostra errori se presenti */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Benvenuto e livello corrente */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Benvenuto, {userProfile?.name || 'Studente'}!
        </h2>
        <p className="mb-2">
          Il tuo livello attuale è <strong>{userProfile?.level}</strong>
        </p>
        <p className="text-blue-700">
          Continua con le attività suggerite per migliorare il tuo italiano.
        </p>
      </div>

      {/* Letture suggerite */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Letture consigliate</h2>
        {suggestedTexts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedTexts.map((text) => (
              <div key={text.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-medium mb-2">{text.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{text.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                    Livello {text.level}
                  </span>
                  <Link
                    to={`/lettura/${text.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Leggi ora →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Nessun testo disponibile al momento. Riprova più tardi.
          </p>
        )}
      </section>

      {/* Consigli per l'apprendimento */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Consigli per migliorare</h2>
        {learningTips.length > 0 ? (
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <ul className="space-y-3">
              {learningTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <div>
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">
            Nessun consiglio disponibile al momento. Riprova più tardi.
          </p>
        )}
      </section>

      {/* Pulsanti di azione rapida */}
      <section className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/lettura"
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-center hover:bg-blue-700 transition"
        >
          Esplora Letture
        </Link>
        <Link
          to="/scrittura"
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg text-center hover:bg-green-700 transition"
        >
          Esercitati con la Scrittura
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;