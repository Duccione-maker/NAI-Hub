// src/data/letteraturaDatabase.js

const letteraturaDatabase = {
  prosa: [
    {
      id: "manzoni_promessi",
      autore: "Alessandro Manzoni",
      titolo: "I Promessi Sposi",
      periodo: "Ottocento - Romanticismo",
      anno: 1840,
      livelloDifficolta: 1, // 1-base, 2-intermedio, 3-avanzato
      estratto: "Quel ramo del lago di Como, che volge a mezzogiorno, tra due catene non interrotte di monti, tutto a seni e a golfi...",
      testoCompleto: "Quel ramo del lago di Como, che volge a mezzogiorno, tra due catene non interrotte di monti, tutto a seni e a golfi, a seconda dello sporgere e del rientrare di quelli, vien, quasi a un tratto, a ristringersi, e a prender corso e figura di fiume, tra un promontorio a destra, e un'ampia costiera dall'altra parte; e il ponte, che ivi congiunge le due rive, par che renda ancor più sensibile all'occhio questa trasformazione, e segni il punto in cui il lago cessa, e l'Adda rincomincia, per ripigliar poi nome di lago dove le rive, allontanandosi di nuovo, lascian l'acqua distendersi e rallentarsi in nuovi golfi e in nuovi seni.",
      analisi: "L'incipit dei Promessi Sposi presenta un'accurata descrizione geografica che introduce il lettore nell'ambiente lombardo in cui si svolgerà la vicenda...",
      paroleChiave: ["romanzo storico", "lombardia", "seicento"],
      temiPrincipali: ["provvidenza", "giustizia", "oppressione"]
    },
    {
      id: "verga_malavoglia",
      autore: "Giovanni Verga",
      titolo: "I Malavoglia",
      periodo: "Ottocento - Verismo",
      anno: 1881,
      livelloDifficolta: 2,
      estratto: "Un tempo i Malavoglia erano stati numerosi come i sassi della strada vecchia di Trezza...",
      testoCompleto: "Un tempo i Malavoglia erano stati numerosi come i sassi della strada vecchia di Trezza; ce n'erano persino ad Ognina, e ad Aci Castello, tutti buona e brava gente di mare, proprio all'opposto di quel che sembrava dal nomignolo, come dev'essere...",
      analisi: "L'inizio de I Malavoglia presenta la famiglia protagonista attraverso un contrasto ironico tra il loro soprannome e la loro vera natura...",
      paroleChiave: ["verismo", "sicilia", "famiglia"],
      temiPrincipali: ["tradizione", "progresso", "lotta per la sopravvivenza"]
    }
  ],
  
  poesia: [
    {
      id: "leopardi_infinito",
      autore: "Giacomo Leopardi",
      titolo: "L'infinito",
      periodo: "Ottocento - Romanticismo",
      anno: 1819,
      livelloDifficolta: 2,
      estratto: "Sempre caro mi fu quest'ermo colle, e questa siepe, che da tanta parte dell'ultimo orizzonte il guardo esclude...",
      testoCompleto: "Sempre caro mi fu quest'ermo colle,\ne questa siepe, che da tanta parte\ndell'ultimo orizzonte il guardo esclude.\nMa sedendo e mirando, interminati\nspazi di là da quella, e sovrumani\nsilenzi, e profondissima quiete\nio nel pensier mi fingo; ove per poco\nil cor non si spaura. E come il vento\nodo stormir tra queste piante, io quello\ninfinito silenzio a questa voce\nvo comparando: e mi sovvien l'eterno,\ne le morte stagioni, e la presente\ne viva, e il suon di lei. Così tra questa\nimmensità s'annega il pensier mio:\ne il naufragar m'è dolce in questo mare.",
      analisi: "L'Infinito è un idillio in cui Leopardi esplora la tensione tra finito e infinito, realtà e immaginazione...",
      figureRetoriche: [
        { 
          tipo: "ossimoro", 
          esempio: "infinito silenzio", 
          spiegazione: "Accostamento di termini contraddittori",
          difficolta: 2,
          punti: 10
        },
        { 
          tipo: "enjambement", 
          esempio: "interminati\nspazi", 
          spiegazione: "Spezzatura di un verso con prosecuzione nella riga successiva",
          difficolta: 1,
          punti: 5
        },
        { 
          tipo: "sinestesia", 
          esempio: "infinito silenzio a questa voce", 
          spiegazione: "Associazione di sensazioni appartenenti a sfere sensoriali diverse",
          difficolta: 3,
          punti: 15
        },
        { 
          tipo: "metafora", 
          esempio: "il naufragar m'è dolce in questo mare", 
          spiegazione: "Sostituzione di un termine con un altro basata su una relazione di somiglianza",
          difficolta: 2,
          punti: 10
        }
      ],
      figureRetoriche_posizioni: [
        { inizio: 76, fine: 85, tipo: "ossimoro" },
        { inizio: 38, fine: 49, tipo: "enjambement" },
        { inizio: 132, fine: 157, tipo: "sinestesia" },
        { inizio: 233, fine: 264, tipo: "metafora" }
      ],
      figureRetoriche_confronto: [
        {
          figura: "metafora",
          autore: "Eugenio Montale",
          opera: "Ossi di seppia",
          esempio: "il male di vivere ho incontrato",
          spiegazione: "La vita difficile viene metaforicamente presentata come una malattia"
        },
        {
          figura: "ossimoro",
          autore: "Ugo Foscolo",
          opera: "Sonetti",
          esempio: "e un dolor stanco",
          spiegazione: "Un dolore non può essere stanco, attributo tipicamente umano"
        }
      ],
      paroleChiave: ["infinito", "immaginazione", "natura"],
      temiPrincipali: ["limite", "infinito", "immaginazione"]
    },
    {
      id: "ungaretti_mattina",
      autore: "Giuseppe Ungaretti",
      titolo: "Mattina",
      periodo: "Novecento - Ermetismo",
      anno: 1917,
      livelloDifficolta: 1,
      estratto: "M'illumino d'immenso",
      testoCompleto: "M'illumino\nd'immenso",
      analisi: "Una delle più brevi e celebri poesie di Ungaretti, 'Mattina' esprime in sole tre parole un'esperienza di rivelazione cosmica...",
      figureRetoriche: [
        { 
          tipo: "metafora", 
          esempio: "M'illumino d'immenso", 
          spiegazione: "L'illuminarsi rappresenta metaforicamente un'improvvisa comprensione o rivelazione",
          difficolta: 1,
          punti: 5
        },
        { 
          tipo: "sinestesia", 
          esempio: "M'illumino d'immenso", 
          spiegazione: "Combinazione della sensazione visiva (illuminarsi) con l'idea astratta di immensità",
          difficolta: 2,
          punti: 10
        }
      ],
      figureRetoriche_posizioni: [
        { inizio: 0, fine: 18, tipo: "metafora" },
        { inizio: 0, fine: 18, tipo: "sinestesia" }
      ],
      figureRetoriche_confronto: [
        {
          figura: "metafora",
          autore: "Salvatore Quasimodo",
          opera: "Ed è subito sera",
          esempio: "Ognuno sta solo sul cuor della terra",
          spiegazione: "La terra è metaforicamente rappresentata come un cuore pulsante"
        }
      ],
      paroleChiave: ["brevità", "luce", "rivelazione"],
      temiPrincipali: ["vita", "illuminazione", "guerra"]
    }
  ]
};

// Funzione per ottenere testi per livello
export const getTestiPerLivello = (livello) => {
  const prosaFiltrata = letteraturaDatabase.prosa.filter(
    testo => testo.livelloDifficolta <= livello
  );
  
  const poesiaFiltrata = letteraturaDatabase.poesia.filter(
    testo => testo.livelloDifficolta <= livello
  );
  
  return {
    prosa: prosaFiltrata,
    poesia: poesiaFiltrata
  };
};

// Funzione per ottenere un testo specifico
export const getTestoById = (id) => {
  const testi = [...letteraturaDatabase.prosa, ...letteraturaDatabase.poesia];
  return testi.find(testo => testo.id === id);
};

export default letteraturaDatabase;