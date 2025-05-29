# NAI-Hub

NAI-Hub è una piattaforma di apprendimento dell'italiano che utilizza intelligenza artificiale per personalizzare l'esperienza educativa.

## Caratteristiche Principali

- **Test di livello adattivo**: Valuta il livello di conoscenza dell'italiano degli studenti
- **Lettura assistita**: Testi di vari livelli con supporto AI per la comprensione
- **Esercizi di scrittura**: Pratica di scrittura con feedback AI intelligente
- **Dashboard personalizzata**: Monitoraggio dei progressi e suggerimenti di apprendimento

## Struttura del Progetto

Il progetto è organizzato con una struttura modulare che separa chiaramente frontend e backend:

```
nai-hub/
├── client/                    # Frontend React
│   └── src/
│       ├── components/        # Componenti UI divisi per funzionalità
│       ├── hooks/             # Custom React hooks
│       ├── services/          # Servizi API modulari
│       └── contexts/          # Context API per stato globale
│
├── server/                    # Backend Express
│   ├── routes/                # Router Express organizzati per dominio
│   └── db.json                # Database JSON (solo per sviluppo)
```

## Requisiti

- Node.js 16.x o superiore
- NPM 7.x o superiore

## Installazione

1. Clona il repository:
   ```
   git clone https://github.com/Duccione-maker/NAI-Hub.git
   cd NAI-Hub
   ```

2. Installa le dipendenze:
   ```
   npm install
   ```

3. Avvia l'applicazione in modalità sviluppo:
   ```
   npm start
   ```

Questo avvierà sia il server API (porta 3001) che l'applicazione React (porta 3000).

## Script Disponibili

- `npm start` - Avvia l'applicazione completa (server + client)
- `npm run client` - Avvia solo il client React
- `npm run server` - Avvia solo il server Express
- `npm run build` - Crea la build di produzione del client
- `npm run lint` - Esegue ESLint sul codice
- `npm run lint:fix` - Corregge automaticamente i problemi di linting
- `npm run format` - Formatta il codice con Prettier
- `npm test` - Esegue i test

## Architettura

### Frontend
Il frontend è costruito con React e utilizza un approccio modulare:

- **Context API** per la gestione globale dello stato dell'applicazione
- **Custom Hooks** per la logica riutilizzabile
- **Servizi API** per l'incapsulamento delle chiamate al backend
- **Componenti organizzati per feature** per una migliore manutenibilità

### Backend
Il backend è un server Express che fornisce API per:

- Gestione utenti e profili
- Recupero e valutazione di testi di lettura
- Analisi delle risposte degli utenti con AI
- Suggerimenti personalizzati di apprendimento

Il database usa JSON-server per lo sviluppo, ma è predisposto per una facile migrazione a un database più robusto in produzione.

## Testing
I test sono implementati con Jest e React Testing Library. Per eseguire i test:

```
npm test
```

## Contribuire
Le contribuzioni sono benvenute! Per contribuire:

1. Fai una fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/amazing-feature`)
3. Commit dei tuoi cambiamenti (`git commit -m 'Aggiungi una feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Apri una Pull Request

## Roadmap

- [ ] Aggiunta di TypeScript per type safety
- [ ] Implementazione di un vero database
- [ ] Miglioramento del feedback AI per le esercitazioni di scrittura
- [ ] Aggiunta di esercizi di ascolto
- [ ] Implementazione di un sistema di autenticazione

## Licenza
Questo progetto è distribuito sotto licenza MIT.