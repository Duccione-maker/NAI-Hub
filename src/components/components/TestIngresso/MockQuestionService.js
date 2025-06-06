// Mock Question Service per Test QCER
// Questo simula il database e l'AI Service

const mockQuestionBank = {
  demographic: [
    {
      id: 'years_italy',
      type: 'multiple_choice',
      question: 'Da quanti anni sei in Italia?',
      options: [
        { value: 'less1', text: 'Meno di 1 anno' },
        { value: '1to2', text: '1-2 anni' },
        { value: 'more2', text: 'Più di 2 anni' },
        { value: 'born', text: 'Sono nato/a in Italia' }
      ]
    }
  ],

  reading: [
    // Livello A1-A2
    {
      id: 'reading_1',
      type: 'reading_comprehension',
      level: 'A1',
      text: `Maria è una studentessa italiana. Ha 20 anni e studia medicina all'università di Roma. 
             Ogni mattina si alza alle 7:00 e fa colazione con caffè e cornetti. 
             Poi va all'università in autobus. Le piacciono molto gli studi e vuole diventare medico.`,
      subQuestions: [
        {
          id: 'reading_1_q1',
          question: 'Che cosa studia Maria?',
          options: [
            { value: 'correct', text: 'Medicina', isCorrect: true },
            { value: 'wrong1', text: 'Letteratura', isCorrect: false },
            { value: 'wrong2', text: 'Storia', isCorrect: false },
            { value: 'wrong3', text: 'Matematica', isCorrect: false }
          ]
        },
        {
          id: 'reading_1_q2',
          question: 'A che ora si alza Maria?',
          options: [
            { value: 'correct', text: 'Alle 7:00', isCorrect: true },
            { value: 'wrong1', text: 'Alle 8:00', isCorrect: false },
            { value: 'wrong2', text: 'Alle 6:00', isCorrect: false },
            { value: 'wrong3', text: 'Alle 9:00', isCorrect: false }
          ]
        }
      ]
    },

    // Livello B1-B2
    {
      id: 'reading_2',
      type: 'reading_comprehension',
      level: 'B1',
      text: `L'immigrazione in Italia ha trasformato significativamente il panorama sociale del paese 
             negli ultimi decenni. Molte persone provenienti da diverse parti del mondo hanno scelto 
             l'Italia come nuova casa, portando con sé tradizioni culturali, linguistiche e culinarie 
             che hanno arricchito la società italiana. Tuttavia, questo processo non è stato privo di 
             sfide: l'integrazione richiede tempo, comprensione reciproca e politiche adeguate che 
             favoriscano l'inclusione sociale ed economica.`,
      subQuestions: [
        {
          id: 'reading_2_q1',
          question: 'Secondo il testo, l\'immigrazione in Italia ha:',
          options: [
            { value: 'correct', text: 'Trasformato il panorama sociale', isCorrect: true },
            { value: 'wrong1', text: 'Causato solo problemi', isCorrect: false },
            { value: 'wrong2', text: 'Ridotto la diversità culturale', isCorrect: false },
            { value: 'wrong3', text: 'Interessato solo le grandi città', isCorrect: false }
          ]
        },
        {
          id: 'reading_2_q2',
          question: 'L\'integrazione richiede:',
          options: [
            { value: 'correct', text: 'Tempo e comprensione reciproca', isCorrect: true },
            { value: 'wrong1', text: 'Solo politiche governative', isCorrect: false },
            { value: 'wrong2', text: 'L\'abbandono delle tradizioni d\'origine', isCorrect: false },
            { value: 'wrong3', text: 'Cambiamenti solo da parte degli immigrati', isCorrect: false }
          ]
        }
      ]
    },

    // Livello C1-C2
    {
      id: 'reading_3',
      type: 'reading_comprehension',
      level: 'C1',
      text: `La questione del multilinguismo nelle società contemporanee solleva interrogativi complessi 
             che vanno ben oltre la mera pratica comunicativa. Nel contesto globalizzato odierno, 
             la capacità di padroneggiare più lingue non rappresenta soltanto un vantaggio competitivo 
             nel mercato del lavoro, ma costituisce un elemento fondamentale per la costruzione 
             dell'identità individuale e collettiva. La ricerca neurolinguistica ha dimostrato che 
             il cervello multilingue sviluppa capacità cognitive superiori, inclusa una maggiore 
             flessibilità mentale e una migliore capacità di problem-solving. Tuttavia, permane 
             il dibattito sui potenziali rischi di erosione delle lingue minoritarie in favore 
             di quelle dominanti a livello internazionale.`,
      subQuestions: [
        {
          id: 'reading_3_q1',
          question: 'Secondo il testo, il multilinguismo:',
          options: [
            { value: 'correct', text: 'Contribuisce alla costruzione dell\'identità', isCorrect: true },
            { value: 'wrong1', text: 'È utile solo per il lavoro', isCorrect: false },
            { value: 'wrong2', text: 'Causa confusione cognitiva', isCorrect: false },
            { value: 'wrong3', text: 'Non ha effetti sul cervello', isCorrect: false }
          ]
        },
        {
          id: 'reading_3_q2',
          question: 'Il dibattito sulle lingue minoritarie riguarda:',
          options: [
            { value: 'correct', text: 'Il rischio di erosione a favore di lingue dominanti', isCorrect: true },
            { value: 'wrong1', text: 'La loro maggiore difficoltà di apprendimento', isCorrect: false },
            { value: 'wrong2', text: 'L\'impossibilità di insegnarle', isCorrect: false },
            { value: 'wrong3', text: 'La loro inutilità nel mondo moderno', isCorrect: false }
          ]
        }
      ]
    }
  ],

  grammar: [
    // Livello A1
    {
      id: 'grammar_1',
      type: 'grammar',
      level: 'A1',
      question: 'Completa la frase: "Io _____ italiano."',
      options: [
        { value: 'correct', text: 'sono', isCorrect: true },
        { value: 'wrong1', text: 'sei', isCorrect: false },
        { value: 'wrong2', text: 'è', isCorrect: false },
        { value: 'wrong3', text: 'siamo', isCorrect: false }
      ]
    },
    {
      id: 'grammar_2',
      type: 'grammar',
      level: 'A1',
      question: 'Scegli l\'articolo corretto: "_____ casa è bella."',
      options: [
        { value: 'correct', text: 'La', isCorrect: true },
        { value: 'wrong1', text: 'Il', isCorrect: false },
        { value: 'wrong2', text: 'Lo', isCorrect: false },
        { value: 'wrong3', text: 'Le', isCorrect: false }
      ]
    },

    // Livello A2
    {
      id: 'grammar_3',
      type: 'grammar',
      level: 'A2',
      question: 'Ieri io _____ al cinema.',
      options: [
        { value: 'correct', text: 'sono andato/a', isCorrect: true },
        { value: 'wrong1', text: 'vado', isCorrect: false },
        { value: 'wrong2', text: 'andrò', isCorrect: false },
        { value: 'wrong3', text: 'andare', isCorrect: false }
      ]
    },
    {
      id: 'grammar_4',
      type: 'grammar',
      level: 'A2',
      question: 'Se _____ bel tempo, andiamo al mare.',
      options: [
        { value: 'correct', text: 'fa', isCorrect: true },
        { value: 'wrong1', text: 'farà', isCorrect: false },
        { value: 'wrong2', text: 'faceva', isCorrect: false },
        { value: 'wrong3', text: 'fare', isCorrect: false }
      ]
    },

    // Livello B1
    {
      id: 'grammar_5',
      type: 'grammar',
      level: 'B1',
      question: 'Benché _____ stanco, continuerò a lavorare.',
      options: [
        { value: 'correct', text: 'sia', isCorrect: true },
        { value: 'wrong1', text: 'sono', isCorrect: false },
        { value: 'wrong2', text: 'ero', isCorrect: false },
        { value: 'wrong3', text: 'sarò', isCorrect: false }
      ]
    },
    {
      id: 'grammar_6',
      type: 'grammar',
      level: 'B1',
      question: 'Il libro _____ ho letto è molto interessante.',
      options: [
        { value: 'correct', text: 'che', isCorrect: true },
        { value: 'wrong1', text: 'cui', isCorrect: false },
        { value: 'wrong2', text: 'quale', isCorrect: false },
        { value: 'wrong3', text: 'dove', isCorrect: false }
      ]
    },

    // Livello B2
    {
      id: 'grammar_7',
      type: 'grammar',
      level: 'B2',
      question: 'Non appena _____ a casa, ti telefonerò.',
      options: [
        { value: 'correct', text: 'sarò arrivato', isCorrect: true },
        { value: 'wrong1', text: 'arrivo', isCorrect: false },
        { value: 'wrong2', text: 'arrivavo', isCorrect: false },
        { value: 'wrong3', text: 'sono arrivato', isCorrect: false }
      ]
    },

    // Livello C1
    {
      id: 'grammar_8',
      type: 'grammar',
      level: 'C1',
      question: 'Qualora _____ problemi, non esitate a contattarmi.',
      options: [
        { value: 'correct', text: 'doveste avere', isCorrect: true },
        { value: 'wrong1', text: 'avete', isCorrect: false },
        { value: 'wrong2', text: 'avrete', isCorrect: false },
        { value: 'wrong3', text: 'avreste', isCorrect: false }
      ]
    }
  ],

  writing: [
    {
      id: 'writing_1',
      type: 'writing',
      level: 'A1',
      prompt: 'Presentati brevemente: scrivi il tuo nome, età, da dove vieni e cosa ti piace fare.',
      placeholder: 'Ciao, io sono...',
      minWords: 30,
      minRows: 3
    },
    {
      id: 'writing_2',
      type: 'writing',
      level: 'B1',
      prompt: 'Descrivi una giornata tipica nella tua vita, dalle 7:00 del mattino alle 22:00 di sera.',
      placeholder: 'La mia giornata inizia quando...',
      minWords: 80,
      minRows: 5
    },
    {
      id: 'writing_3',
      type: 'writing',
      level: 'C1',
      prompt: 'Esprimi la tua opinione sull\'importanza dell\'apprendimento delle lingue straniere nella società moderna, presentando argomenti a favore e possibili obiezioni.',
      placeholder: 'L\'apprendimento delle lingue straniere...',
      minWords: 150,
      minRows: 8
    }
  ],

  speaking: [
    {
      id: 'speaking_1',
      type: 'speaking',
      level: 'A1',
      prompt: 'Presentati: di\' il tuo nome, la tua età e di dove sei.',
      maxDuration: 30
    },
    {
      id: 'speaking_2',
      type: 'speaking',
      level: 'B1',
      prompt: 'Descrivi la tua città natale: com\'è, che cosa ti piace di più e cosa vorresti cambiare.',
      maxDuration: 60
    },
    {
      id: 'speaking_3',
      type: 'speaking',
      level: 'C1',
      prompt: 'Spiega quale pensi sia il ruolo delle nuove tecnologie nell\'educazione e come potrebbero cambiare l\'apprendimento in futuro.',
      maxDuration: 90
    }
  ]
};

// Sistema Avanzato di Valutazione Scrittura SUPER POTENZIATO
const AdvancedWritingEvaluator = {
  
  // Valutazione completa del testo
  evaluateWriting: async (text, targetLevel = 'B1') => {
    console.log('🔍 === ANALISI AVANZATA SCRITTURA SUPER POTENZIATA ===');
    console.log('📝 Testo:', text.substring(0, 100) + '...');
    
    const scores = {
      orthography: AdvancedWritingEvaluator.analyzeOrthography(text),
      morphology: AdvancedWritingEvaluator.analyzeMorphologyEnhanced(text),
      syntax: AdvancedWritingEvaluator.analyzeSyntaxEnhanced(text),
      lexicon: AdvancedWritingEvaluator.analyzeLexicon(text),
      coherence: AdvancedWritingEvaluator.analyzeCoherence(text)
    };

    // Pesi per livello QCER
    const weights = AdvancedWritingEvaluator.getWeightsByLevel(targetLevel);
    
    // Calcolo score finale
    const finalScore = Object.keys(scores).reduce((total, aspect) => {
      return total + (scores[aspect] * weights[aspect]);
    }, 0);

    console.log('📊 Breakdown valutazione scrittura SUPER POTENZIATA:');
    Object.keys(scores).forEach(aspect => {
      console.log(`  ${aspect}: ${(scores[aspect] * 100).toFixed(1)}%`);
    });
    console.log(`🎯 Score finale: ${(finalScore * 100).toFixed(1)}%`);
    console.log('================================================');

    return {
      score: Math.min(Math.max(finalScore, 0), 1),
      breakdown: scores,
      feedback: AdvancedWritingEvaluator.generateFeedback(scores, targetLevel),
      suggestedLevel: AdvancedWritingEvaluator.suggestLevel(finalScore)
    };
  },

  // 1. ANALISI ORTOGRAFICA (potenziata)
  analyzeOrthography: (text) => {
    const words = text.trim().split(/\s+/);
    let errors = 0;

    // Pattern ortografici comuni
    const orthographicErrors = [
      /\bperche\b/gi, /\bpuo\b/gi, /\bcioe\b/gi, /\bpiu\b/gi, /\bgia\b/gi, 
      /\bperö\b/gi, /\w*[kxwyjq]\w*/gi, /\bxke\b/gi, /\bnn\b/gi,
      /\bperkè\b/gi, /\bperke\b/gi, /\bx\b/gi
    ];

    words.forEach(word => {
      orthographicErrors.forEach(errorPattern => {
        if (errorPattern.test(word)) {
          errors++;
          console.log(`🔴 Errore ortografico: "${word}"`);
        }
      });
    });

    const errorRate = errors / Math.max(words.length, 1);
    const score = Math.max(0, 1 - (errorRate * 3));
    console.log(`📝 Ortografia: ${errors} errori su ${words.length} parole = ${(score * 100).toFixed(1)}%`);
    
    return score;
  },

  // 2. ANALISI MORFOLOGICA SUPER POTENZIATA
  analyzeMorphologyEnhanced: (text) => {
    let score = 1.0;
    let errors = 0;

    console.log('🔍 === ANALISI MORFOLOGICA SUPER POTENZIATA ===');

    // DATABASE PATTERN GRAMMATICALI COMPLETO (78 REGOLE)
    const morphologicalPatterns = [
      
      // === CATEGORIA 1: ARTICOLI DETERMINATIVI ===
      { pattern: /\bil\s+(?:casa|scuola|famiglia|vita|università|amica|idea|auto|aula|ora|età|isola|azienda)/gi, error: "articolo_maschile_nome_femminile", weight: 0.8, level: "A1" },
      { pattern: /\bla\s+(?:uomo|bambino|lavoro|computer|telefono|quaderno|libro|cane|gatto|albero|sole|mare)/gi, error: "articolo_femminile_nome_maschile", weight: 0.8, level: "A1" },
      { pattern: /\blo\s+(?:casa|scuola|famiglia|penna|pizza|strada|montagna)/gi, error: "articolo_lo_nome_femminile", weight: 0.8, level: "A1" },
      { pattern: /\ble\s+(?:uomo|uomini|bambino|bambini|libro|libri)/gi, error: "articolo_le_nome_maschile", weight: 0.8, level: "A1" },
      { pattern: /\bgli\s+(?:casa|scuola|famiglia|donna|donne|ragazze)/gi, error: "articolo_gli_nome_femminile", weight: 0.8, level: "A1" },

      // === CATEGORIA 2: ARTICOLI INDETERMINATIVI ===
      { pattern: /\bun\s+(?:amica|università|idea|auto|aula|ora|età|isola|azienda|azione)/gi, error: "articolo_indeterminativo_femminile", weight: 0.8, level: "A1" },
      { pattern: /\buna\s+(?:uomo|bambino|lavoro|computer|telefono|quaderno|libro|cane|gatto)/gi, error: "articolo_indeterminativo_maschile", weight: 0.8, level: "A1" },
      { pattern: /\buno\s+(?:casa|scuola|famiglia|penna|pizza|strada|donna|ragazza)/gi, error: "articolo_indeterminativo_uno_femminile", weight: 0.8, level: "A1" },
      { pattern: /\bun'\s+(?:uomo|bambino|amico|studente|italiano|inglese)/gi, error: "apostrofo_indeterminativo_maschile", weight: 0.8, level: "A1" },

      // === CATEGORIA 3: POSSESSIVI - CONCORDANZA GENERE ===
      { pattern: /\bmio\s+(?:sorella|famiglia|amica|scuola|casa|vita|università|madre|nonna|zia|cugina)/gi, error: "possessivo_maschile_nome_femminile", weight: 0.9, level: "A1" },
      { pattern: /\bmia\s+(?:fratello|amico|lavoro|libro|quaderno|computer|padre|nonno|zio|cugino)/gi, error: "possessivo_femminile_nome_maschile", weight: 0.9, level: "A1" },
      { pattern: /\btuo\s+(?:sorella|famiglia|amica|scuola|casa|madre|fidanzata|moglie)/gi, error: "possessivo_maschile_nome_femminile", weight: 0.9, level: "A1" },
      { pattern: /\btua\s+(?:fratello|amico|lavoro|libro|padre|fidanzato|marito)/gi, error: "possessivo_femminile_nome_maschile", weight: 0.9, level: "A1" },
      { pattern: /\bsuo\s+(?:sorella|famiglia|amica|madre|moglie|figlia|nipote)/gi, error: "possessivo_maschile_nome_femminile", weight: 0.9, level: "A1" },
      { pattern: /\bsua\s+(?:fratello|padre|marito|figlio|nipote)/gi, error: "possessivo_femminile_nome_maschile", weight: 0.9, level: "A1" },

      // === CATEGORIA 4: POSSESSIVI - CONCORDANZA NUMERO ===
      { pattern: /\bmiei\s+(?:sorella|famiglia|amica|madre)/gi, error: "possessivo_plurale_nome_singolare", weight: 0.8, level: "A2" },
      { pattern: /\bmie\s+(?:fratello|amico|padre)/gi, error: "possessivo_plurale_nome_singolare", weight: 0.8, level: "A2" },
      { pattern: /\bmio\s+(?:amici|fratelli|libri|quaderni)/gi, error: "possessivo_singolare_nome_plurale", weight: 0.8, level: "A2" },
      { pattern: /\bmia\s+(?:amiche|sorelle|case|scuole)/gi, error: "possessivo_singolare_nome_plurale", weight: 0.8, level: "A2" },

      // === CATEGORIA 5: VERBI - CONIUGAZIONE ESSERE ===
      { pattern: /\bio\s+(?:sei|è|siamo|siete)\b/gi, error: "coniugazione_essere_io", weight: 0.7, level: "A1" },
      { pattern: /\btu\s+(?:sono|è|siamo|siete)\b/gi, error: "coniugazione_essere_tu", weight: 0.7, level: "A1" },
      { pattern: /\blui\s+(?:sono|sei|siamo|siete)\b/gi, error: "coniugazione_essere_lui", weight: 0.7, level: "A1" },
      { pattern: /\blei\s+(?:sono|sei|siamo|siete)\b/gi, error: "coniugazione_essere_lei", weight: 0.7, level: "A1" },
      { pattern: /\bnoi\s+(?:sono|sei|è|siete)\b/gi, error: "coniugazione_essere_noi", weight: 0.7, level: "A1" },
      { pattern: /\bvoi\s+(?:sono|sei|è|siamo)\b/gi, error: "coniugazione_essere_voi", weight: 0.7, level: "A1" },

      // === CATEGORIA 6: VERBI - CONIUGAZIONE AVERE ===
      { pattern: /\bio\s+(?:hai|ha|abbiamo|avete|hanno)\b/gi, error: "coniugazione_avere_io", weight: 0.7, level: "A1" },
      { pattern: /\btu\s+(?:ho|ha|abbiamo|avete|hanno)\b/gi, error: "coniugazione_avere_tu", weight: 0.7, level: "A1" },
      { pattern: /\blui\s+(?:ho|hai|abbiamo|avete|hanno)\b/gi, error: "coniugazione_avere_lui", weight: 0.7, level: "A1" },
      { pattern: /\bnoi\s+(?:ho|hai|ha|avete|hanno)\b/gi, error: "coniugazione_avere_noi", weight: 0.7, level: "A1" },

      // === CATEGORIA 7: AUSILIARI PARTICIPIO PASSATO ===
      { pattern: /\bho\s+(?:andato|venuto|partito|arrivato|uscito|entrato|tornato|salito|sceso)/gi, error: "ausiliare_movimento_sbagliato", weight: 0.8, level: "A1" },
      { pattern: /\bho\s+(?:andata|venuta|partita|arrivata|uscita|entrata|tornata|salita|scesa)/gi, error: "ausiliare_movimento_sbagliato", weight: 0.8, level: "A1" },
      { pattern: /\bsono\s+(?:mangiato|bevuto|studiato|lavorato|dormito|comprato|venduto|pagato)/gi, error: "ausiliare_attività_sbagliato", weight: 0.8, level: "A1" },
      { pattern: /\bhai\s+(?:andato|venuto|partito|arrivato|nato|morto)/gi, error: "ausiliare_movimento_sbagliato", weight: 0.8, level: "A1" },
      { pattern: /\bha\s+(?:andato|venuto|partito|arrivato|nato|morto)/gi, error: "ausiliare_movimento_sbagliato", weight: 0.8, level: "A1" },

      // === CATEGORIA 8: PARTICIPIO PASSATO - CONCORDANZA ===
      { pattern: /\bsono\s+andato\s+(?:a\s+)?casa/gi, error: "participio_concordanza_femminile", weight: 0.6, level: "A2" },
      { pattern: /\bè\s+andata\s+al\s+lavoro/gi, error: "participio_concordanza_maschile", weight: 0.6, level: "A2" },
      { pattern: /\bho\s+visto\s+(?:Maria|Lucia|Anna)/gi, error: "participio_concordanza_oggetto", weight: 0.5, level: "B1" },

      // === CATEGORIA 9: PREPOSIZIONI + INFINITO ===
      { pattern: /\bper\s+(?:studia|lavora|mangia|dormi|gioca|cammina|corri|nuota)/gi, error: "preposizione_infinito_scorretto", weight: 0.7, level: "A1" },
      { pattern: /\bdi\s+(?:studia|lavora|mangia|dormi|gioca|cammina|corri|nuota)/gi, error: "preposizione_infinito_scorretto", weight: 0.7, level: "A1" },
      { pattern: /\ba\s+(?:studia|lavora|mangia|dormi|gioca|cammina|corri|nuota)/gi, error: "preposizione_infinito_scorretto", weight: 0.7, level: "A1" },
      { pattern: /\bda\s+(?:studia|lavora|mangia|dormi|gioca|cammina|corri|nuota)/gi, error: "preposizione_infinito_scorretto", weight: 0.7, level: "A1" },

      // === CATEGORIA 10: PREPOSIZIONI ARTICOLATE ===
      { pattern: /\bdi\s+il\b/gi, error: "preposizione_articolata_del", weight: 0.6, level: "A2" },
      { pattern: /\bdi\s+la\b/gi, error: "preposizione_articolata_della", weight: 0.6, level: "A2" },
      { pattern: /\ba\s+il\b/gi, error: "preposizione_articolata_al", weight: 0.6, level: "A2" },
      { pattern: /\ba\s+la\b/gi, error: "preposizione_articolata_alla", weight: 0.6, level: "A2" },
      { pattern: /\bin\s+il\b/gi, error: "preposizione_articolata_nel", weight: 0.6, level: "A2" },
      { pattern: /\bin\s+la\b/gi, error: "preposizione_articolata_nella", weight: 0.6, level: "A2" },
      { pattern: /\bda\s+il\b/gi, error: "preposizione_articolata_dal", weight: 0.6, level: "A2" },
      { pattern: /\bda\s+la\b/gi, error: "preposizione_articolata_dalla", weight: 0.6, level: "A2" },

      // === CATEGORIA 11: ACCORDI AGGETTIVI - GENERE ===
      { pattern: /\b(?:il|un)\s+\w*o\s+(?:bella|piccola|grande|buona|italiana|americana|francese)/gi, error: "accordo_aggettivo_genere", weight: 0.7, level: "A1" },
      { pattern: /\b(?:la|una)\s+\w*a\s+(?:bello|piccolo|grande|buono|italiano|americano|francese)/gi, error: "accordo_aggettivo_genere", weight: 0.7, level: "A1" },
      { pattern: /\buomo\s+(?:bella|piccola|italiana)/gi, error: "accordo_aggettivo_genere", weight: 0.7, level: "A1" },
      { pattern: /\bdonna\s+(?:bello|piccolo|italiano)/gi, error: "accordo_aggettivo_genere", weight: 0.7, level: "A1" },
      { pattern: /\bambino\s+(?:bella|piccola|italiana)/gi, error: "accordo_aggettivo_genere", weight: 0.7, level: "A1" },
      { pattern: /\bbambina\s+(?:bello|piccolo|italiano)/gi, error: "accordo_aggettivo_genere", weight: 0.7, level: "A1" },

      // === CATEGORIA 12: ACCORDI AGGETTIVI - NUMERO ===
      { pattern: /\buomo\s+(?:belli|piccoli|italiani)/gi, error: "accordo_aggettivo_numero", weight: 0.7, level: "A2" },
      { pattern: /\buomini\s+(?:bello|piccolo|italiano)/gi, error: "accordo_aggettivo_numero", weight: 0.7, level: "A2" },
      { pattern: /\bdonna\s+(?:belle|piccole|italiane)/gi, error: "accordo_aggettivo_numero", weight: 0.7, level: "A2" },
      { pattern: /\bdonne\s+(?:bella|piccola|italiana)/gi, error: "accordo_aggettivo_numero", weight: 0.7, level: "A2" },

      // === CATEGORIA 13: PRONOMI DIMOSTRATIVI ===
      { pattern: /\bquesto\s+(?:\w*a)\b/gi, error: "dimostrativo_genere_scorretto", weight: 0.6, level: "A2" },
      { pattern: /\bquesta\s+(?:\w*o)\b/gi, error: "dimostrativo_genere_scorretto", weight: 0.6, level: "A2" },
      { pattern: /\bquelli\s+(?:\w*a)\b/gi, error: "dimostrativo_genere_scorretto", weight: 0.6, level: "A2" },
      { pattern: /\bquelle\s+(?:\w*o)\b/gi, error: "dimostrativo_genere_scorretto", weight: 0.6, level: "A2" },

      // === CATEGORIA 14: PERSONA VERBALE ===
      { pattern: /\bcapisce\s+poco/gi, error: "persona_verbale_sbagliata", weight: 0.6, level: "A1" },
      { pattern: /\bparla\s+poco/gi, error: "persona_verbale_sbagliata", weight: 0.6, level: "A1" },
      { pattern: /\bstudio\s+molto/gi, error: "persona_verbale_corretta", weight: -0.1, level: "A1" },
      { pattern: /\blavoro\s+molto/gi, error: "persona_verbale_corretta", weight: -0.1, level: "A1" },

      // === CATEGORIA 15: TEMPI VERBALI - PRESENTE ===
      { pattern: /\bio\s+(?:mangi|lavori|studi|dormi|parti)/gi, error: "presente_persona_sbagliata", weight: 0.6, level: "A1" },
      { pattern: /\btu\s+(?:mangio|lavoro|studio|dormo|parto)/gi, error: "presente_persona_sbagliata", weight: 0.6, level: "A1" },
      { pattern: /\blui\s+(?:mangi|lavori|studi|dormi|parti)/gi, error: "presente_persona_sbagliata", weight: 0.6, level: "A1" },

      // === CATEGORIA 16: FUTURO SEMPLICE ===
      { pattern: /\biofarò/gi, error: "futuro_forma_scorretta", weight: 0.5, level: "A2" },
      { pattern: /\btufarai/gi, error: "futuro_forma_scorretta", weight: 0.5, level: "A2" },
      { pattern: /\bio\s+farai/gi, error: "futuro_persona_sbagliata", weight: 0.6, level: "A2" },
      { pattern: /\btu\s+farò/gi, error: "futuro_persona_sbagliata", weight: 0.6, level: "A2" },

      // === CATEGORIA 17: CONGIUNTIVO (B1+) ===
      { pattern: /\bse\s+(?:sono|sei|è|siamo|siete)\b/gi, error: "congiuntivo_mancante", weight: 0.4, level: "B1" },
      { pattern: /\bpenso\s+che\s+(?:sono|sei|è|siamo|siete)\b/gi, error: "congiuntivo_dopo_che", weight: 0.5, level: "B1" },
      { pattern: /\bspero\s+che\s+(?:vado|vai|va|andiamo|andate|vanno)\b/gi, error: "congiuntivo_dopo_che", weight: 0.5, level: "B1" },

      // === CATEGORIA 18: CONCORDANZA SOGGETTO-VERBO ===
      { pattern: /\bgli\s+studenti\s+(?:studia|lavora|va)/gi, error: "concordanza_soggetto_plurale", weight: 0.7, level: "A2" },
      { pattern: /\ble\s+ragazze\s+(?:studia|lavora|va)/gi, error: "concordanza_soggetto_plurale", weight: 0.7, level: "A2" },
      { pattern: /\blo\s+studente\s+(?:studiano|lavorano|vanno)/gi, error: "concordanza_soggetto_singolare", weight: 0.7, level: "A2" },

      // === CATEGORIA 19: FORME DI CORTESIA ===
      { pattern: /\blei\s+(?:sei|hai)/gi, error: "forma_cortesia_sbagliata", weight: 0.4, level: "A2" },
      { pattern: /\btu\s+è\b/gi, error: "forma_cortesia_confusa", weight: 0.5, level: "A2" }
    ];

    // Scansiona tutti i pattern con logging dettagliato
    morphologicalPatterns.forEach((rule, index) => {
      const matches = text.match(rule.pattern);
      if (matches) {
        matches.forEach(match => {
          errors++;
          console.log(`🔴 [${index + 1}/78] Errore ${rule.level} [${rule.error}]: "${match}" (peso: ${rule.weight})`);
          
          // Penalità proporzionale al peso e livello
          let penalty = rule.weight * 0.15;
          if (rule.level === "A1") penalty *= 1.2; // Errori A1 più gravi
          if (rule.level === "B1") penalty *= 0.8; // Errori B1 meno gravi
          
          score -= penalty;
        });
      }
    });

    const words = text.trim().split(/\s+/).length;
    const finalScore = Math.max(score, 0);
    
    console.log(`📝 MORFOLOGIA SUPER POTENZIATA (78 patterns):`);
    console.log(`   ├── ${errors} errori su ${words} parole`);
    console.log(`   ├── Score grezzo: ${score.toFixed(3)}`);
    console.log(`   └── Score finale: ${(finalScore * 100).toFixed(1)}%`);
    
    return finalScore;
  },

  // 3. ANALISI SINTATTICA SUPER POTENZIATA
  analyzeSyntaxEnhanced: (text) => {
    let score = 1.0;
    let issues = 0;

    console.log('🔗 === ANALISI SINTATTICA SUPER POTENZIATA ===');

    // PATTERN SINTATTICI AVANZATI (30 REGOLE)
    const syntaxPatterns = [
      
      // === NEGAZIONE SCORRETTA ===
      { pattern: /\bio\s+no\s+(?:parlare|sapere|capire|mangiare|dormire|studiare|lavorare)\b/gi, error: "negazione_infinito_scorretto", weight: 0.8, level: "A1" },
      { pattern: /\bno\s+ho\b/gi, error: "negazione_ausiliare_scorretto", weight: 0.8, level: "A1" },
      { pattern: /\bno\s+sono\b/gi, error: "negazione_essere_scorretto", weight: 0.8, level: "A1" },
      { pattern: /\bno\s+va\b/gi, error: "negazione_verbo_scorretto", weight: 0.8, level: "A1" },
      { pattern: /\bno\s+può\b/gi, error: "negazione_modale_scorretto", weight: 0.8, level: "A1" },
      
      // === ORDINE DELLE PAROLE ===
      { pattern: /\bvenuto\s+io\b/gi, error: "ordine_parole_soggetto_participio", weight: 0.7, level: "A1" },
      { pattern: /\bitaliano\s+io\b/gi, error: "ordine_parole_predicato_soggetto", weight: 0.7, level: "A1" },
      { pattern: /\bmolto\s+bello\s+è/gi, error: "ordine_parole_aggettivo_verbo", weight: 0.7, level: "A2" },
      { pattern: /\bgià\s+ho\s+mangiato/gi, error: "ordine_avverbio_ausiliare", weight: 0.5, level: "A2" },
      
      // === STRUTTURE INCOMPLETE ===
      { pattern: /\b(?:per|di|da|con|in)\s*$/gi, error: "preposizione_senza_complemento", weight: 0.6, level: "A1" },
      { pattern: /\bche\s*$/gi, error: "congiunzione_senza_proposizione", weight: 0.6, level: "A2" },
      { pattern: /\bperché\s*$/gi, error: "congiunzione_causale_incompleta", weight: 0.6, level: "A2" },
      { pattern: /\bquando\s*$/gi, error: "congiunzione_temporale_incompleta", weight: 0.5, level: "A2" },
      
      // === CONNETTIVI SCORRETTI ===
      { pattern: /\be\s+poi\s+e\b/gi, error: "ripetizione_connettivi", weight: 0.4, level: "A2" },
      { pattern: /\bma\s+però\b/gi, error: "doppia_avversativa", weight: 0.5, level: "A2" },
      { pattern: /\bperché\s+e\b/gi, error: "connettivi_ridondanti", weight: 0.4, level: "A2" },
      { pattern: /\bquindi\s+allora\b/gi, error: "connettivi_consecutivi_doppi", weight: 0.4, level: "B1" },
      
      // === USO PRONOMI ===
      { pattern: /\bmi\s+piace\s+loro/gi, error: "pronome_indiretto_scorretto", weight: 0.6, level: "A2" },
      { pattern: /\bli\s+ho\s+detto\s+a\s+lei/gi, error: "ridondanza_pronome_prep", weight: 0.4, level: "B1" },
      { pattern: /\blo\s+ho\s+visto\s+(?:Maria|Lucia|Anna)/gi, error: "pronome_oggetto_femminile", weight: 0.6, level: "A2" },
      { pattern: /\bla\s+ho\s+visto\s+(?:Marco|Luca|Paolo)/gi, error: "pronome_oggetto_maschile", weight: 0.6, level: "A2" },
      
      // === COSTRUZIONI VERBALI ===
      { pattern: /\bsto\s+(?:andato|venuto|partito)/gi, error: "gerundio_participio_confuso", weight: 0.7, level: "A2" },
      { pattern: /\bstavo\s+(?:andato|venuto|partito)/gi, error: "imperfetto_progressivo_scorretto", weight: 0.6, level: "B1" },
      { pattern: /\bho\s+stando/gi, error: "gerundio_composto_scorretto", weight: 0.7, level: "B1" },
      
      // === INTERROGATIVE ===
      { pattern: /\bche\s+cosa\s+è\s+(?:Marco|Luca|Paolo)/gi, error: "interrogativa_persona_cosa", weight: 0.6, level: "A1" },
      { pattern: /\bchi\s+è\s+(?:questo|questa)\s+cosa/gi, error: "interrogativa_cosa_chi", weight: 0.6, level: "A1" },
      
      // === PERIODO IPOTETICO (B1+) ===
      { pattern: /\bse\s+(?:sarò|sarai|sarà)/gi, error: "periodo_ipotetico_futuro", weight: 0.4, level: "B1" },
      { pattern: /\bse\s+ho\s+tempo\s+(?:andrò|farei)/gi, error: "periodo_ipotetico_misto", weight: 0.5, level: "B1" },
      
      // === SUBORDINATE ===
      { pattern: /\bpenso\s+di\s+che/gi, error: "subordinata_doppia_congiunzione", weight: 0.6, level: "B1" },
      { pattern: /\bspero\s+di\s+che/gi, error: "subordinata_doppia_congiunzione", weight: 0.6, level: "B1" },
      
      // === CONCORDANZA TEMPI ===
      { pattern: /\bieri\s+(?:vado|va|andiamo)/gi, error: "concordanza_temporale_passato", weight: 0.7, level: "A2" },
      { pattern: /\bdomani\s+(?:sono\s+andato|ho\s+mangiato)/gi, error: "concordanza_temporale_futuro", weight: 0.7, level: "A2" }
    ];

    // Scansiona pattern sintattici
    syntaxPatterns.forEach((rule, index) => {
      const matches = text.match(rule.pattern);
      if (matches) {
        matches.forEach(match => {
          issues++;
          console.log(`🔴 [${index + 1}/30] Problema ${rule.level} [${rule.error}]: "${match}" (peso: ${rule.weight})`);
          
          // Penalità proporzionale
          let penalty = rule.weight * 0.12;
          if (rule.level === "A1") penalty *= 1.2;
          if (rule.level === "B1") penalty *= 0.8;
          
          score -= penalty;
        });
      }
    });

    const words = text.trim().split(/\s+/).length;
    const finalScore = Math.max(score, 0);
    
    console.log(`🔗 SINTASSI SUPER POTENZIATA (30 patterns):`);
    console.log(`   ├── ${issues} problemi su ${words} parole`);
    console.log(`   ├── Score grezzo: ${score.toFixed(3)}`);
    console.log(`   └── Score finale: ${(finalScore * 100).toFixed(1)}%`);
    
    return finalScore;
  },

  // 4. ANALISI LESSICALE (mantenuta)
  analyzeLexicon: (text) => {
    const words = text.toLowerCase().trim().split(/\s+/).filter(w => w.length > 2);
    const uniqueWords = new Set(words);
    
    const lexicalRichness = uniqueWords.size / Math.max(words.length, 1);
    const score = Math.max(0, lexicalRichness);
    console.log(`📚 Lessico: ricchezza ${(lexicalRichness * 100).toFixed(1)}% = ${(score * 100).toFixed(1)}%`);
    
    return score;
  },

  // 5. ANALISI COERENZA (mantenuta)
  analyzeCoherence: (text) => {
    let score = 0.8;
    console.log(`🎯 Coerenza: ${(score * 100).toFixed(1)}%`);
    return score;
  },

  // Pesi per livello QCER (aggiustati per maggiore severità A1)
  getWeightsByLevel: (level) => {
    const weights = {
      'A1': { orthography: 0.20, morphology: 0.45, syntax: 0.25, lexicon: 0.08, coherence: 0.02 },
      'A2': { orthography: 0.15, morphology: 0.35, syntax: 0.30, lexicon: 0.15, coherence: 0.05 },
      'B1': { orthography: 0.10, morphology: 0.25, syntax: 0.30, lexicon: 0.25, coherence: 0.10 },
      'B2': { orthography: 0.05, morphology: 0.20, syntax: 0.30, lexicon: 0.30, coherence: 0.15 },
      'C1': { orthography: 0.05, morphology: 0.15, syntax: 0.25, lexicon: 0.30, coherence: 0.25 },
      'C2': { orthography: 0.05, morphology: 0.10, syntax: 0.20, lexicon: 0.30, coherence: 0.35 }
    };
    
    return weights[level] || weights['B1'];
  },

  // Suggerisce livello (soglie aggiustate)
  suggestLevel: (score) => {
    if (score >= 0.92) return 'C2';
    if (score >= 0.82) return 'C1';
    if (score >= 0.68) return 'B2';
    if (score >= 0.52) return 'B1';
    if (score >= 0.35) return 'A2';  // Soglia A2 più alta
    return 'A1';
  },

  // Genera feedback personalizzato (potenziato)
  generateFeedback: (scores, targetLevel) => {
    const feedback = [];
    
    if (scores.orthography < 0.7) {
      feedback.push("⚠️ Concentrati sull'ortografia italiana");
    }
    
    if (scores.morphology < 0.6) {
      feedback.push("📝 Lavora su concordanze e coniugazioni");
    }
    
    if (scores.syntax < 0.6) {
      feedback.push("🔗 Migliora l'ordine delle parole e le negazioni");
    }

    if (scores.lexicon < 0.5) {
      feedback.push("📚 Arricchisci il vocabolario");
    }
    
    if (feedback.length === 0) {
      feedback.push("🎉 Ottimo lavoro! Continua così!");
    }
    
    return feedback;
  }
};

// Simulazione AI Service (mantenuta dal tuo file)
export const MockQuestionService = {
  // Genera banco domande iniziale
  generateTestBank: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockQuestionBank;
  },

  // Genera domande per sezione specifica
  generateSectionQuestions: async (sectionId, userProfile) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { isNAI, motherLanguage, previousAnswers } = userProfile;
    
    switch(sectionId) {
      case 'reading':
        return MockQuestionService.selectAdaptiveQuestions(mockQuestionBank.reading, previousAnswers, 3);
      case 'grammar':
        return MockQuestionService.selectAdaptiveQuestions(mockQuestionBank.grammar, previousAnswers, 4);
      case 'writing':
        return MockQuestionService.selectAdaptiveQuestions(mockQuestionBank.writing, previousAnswers, 2);
      case 'speaking':
        return MockQuestionService.selectAdaptiveQuestions(mockQuestionBank.speaking, previousAnswers, 2);
      default:
        return [];
    }
  },

  // Selezione adattiva domande
  selectAdaptiveQuestions: (questionPool, previousAnswers, count) => {
    const performanceScore = MockQuestionService.calculatePerformance(previousAnswers);
    
    let targetLevel;
    if (performanceScore > 0.8) targetLevel = ['B2', 'C1', 'C2'];
    else if (performanceScore > 0.6) targetLevel = ['B1', 'B2'];
    else if (performanceScore > 0.4) targetLevel = ['A2', 'B1'];
    else targetLevel = ['A1', 'A2'];

    const filteredQuestions = questionPool.filter(q => 
      !q.level || targetLevel.includes(q.level)
    );

    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Calcola performance dalle risposte precedenti
  calculatePerformance: (answers) => {
    const answerKeys = Object.keys(answers);
    if (answerKeys.length === 0) return 0.5;

    let correctCount = 0;
    let totalCount = 0;

    answerKeys.forEach(key => {
      const answer = answers[key];
      if (typeof answer === 'object' && answer.isCorrect !== undefined) {
        totalCount++;
        if (answer.isCorrect) correctCount++;
      } else if (answer === 'correct') {
        totalCount++;
        correctCount++;
      } else if (['wrong1', 'wrong2', 'wrong3'].includes(answer)) {
        totalCount++;
      }
    });

    return totalCount > 0 ? correctCount / totalCount : 0.5;
  },

  // Valuta risposta scritta con sistema SUPER POTENZIATO
  evaluateWriting: async (text, level) => {
    console.log('🔍 === ANALISI AVANZATA SCRITTURA SUPER POTENZIATA ===');
    
    const result = await AdvancedWritingEvaluator.evaluateWriting(text, level);
    
    console.log('📊 Risultato finale scrittura SUPER POTENZIATA:');
    console.log('  Score:', (result.score * 100).toFixed(1) + '%');
    console.log('  Livello suggerito:', result.suggestedLevel);
    console.log('  Feedback:', result.feedback.join(' | '));
    console.log('===================================================');
    
    return {
      score: result.score,
      feedback: result.feedback.join(' | '),
      suggestedLevel: result.suggestedLevel,
      breakdown: result.breakdown
    };
  },

  // Valuta registrazione audio (mantenuta)
  evaluateSpeaking: async (audioData, level) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const duration = audioData.duration || 5000;
    const hasGoodDuration = duration > 10000 && duration < 120000;
    
    let score = 0.6;
    if (hasGoodDuration) score += 0.3;
    
    return {
      score: Math.min(score, 1.0),
      feedback: score > 0.8 ? 'Eccellente pronuncia e fluidità!' :
                score > 0.6 ? 'Buona pronuncia, continua così!' :
                'Continua a praticare la pronuncia.'
    };
  }
};

// Algoritmo di scoring QCER migliorato con debug dettagliato
export const QCERScoring = {
  calculateLevel: (allAnswers) => {
    console.log('🎯 === CALCOLO LIVELLO QCER DETTAGLIATO ===');
    
    const sectionScores = {
      reading: QCERScoring.evaluateSection(allAnswers, 'reading'),
      grammar: QCERScoring.evaluateSection(allAnswers, 'grammar'),
      writing: QCERScoring.evaluateSection(allAnswers, 'writing'),
      speaking: QCERScoring.evaluateSection(allAnswers, 'speaking')
    };

    console.log('📖 Lettura/Comprensione:', (sectionScores.reading * 100).toFixed(1) + '%');
    console.log('📝 Grammatica:', (sectionScores.grammar * 100).toFixed(1) + '%');
    console.log('✍️ Scrittura:', (sectionScores.writing * 100).toFixed(1) + '%');
    console.log('🗣️ Parlato:', (sectionScores.speaking * 100).toFixed(1) + '%');

    // Pesi aggiornati
    const totalScore = (
      sectionScores.reading * 0.20 +
      sectionScores.grammar * 0.30 +
      sectionScores.writing * 0.35 +
      sectionScores.speaking * 0.15
    );

    console.log('🎯 Punteggio Totale:', (totalScore * 100).toFixed(1) + '%');

    // Determina livello
    let assignedLevel = 'A1';
    if (totalScore >= 0.92) assignedLevel = 'C2';
    else if (totalScore >= 0.82) assignedLevel = 'C1';
    else if (totalScore >= 0.68) assignedLevel = 'B2';
    else if (totalScore >= 0.52) assignedLevel = 'B1';
    else if (totalScore >= 0.38) assignedLevel = 'A2';
    else assignedLevel = 'A1';

    // MAPPA LIVELLI A CINTURE (FIX PRINCIPALE)
    const levelToBelt = {
      'A1': 'yellow',
      'A2': 'orange', 
      'B1': 'green',
      'B2': 'blue',
      'C1': 'brown',
      'C2': 'black'
    };

    console.log('🥋 Livello Assegnato:', assignedLevel);
    console.log('🏅 Cintura:', levelToBelt[assignedLevel]);
    console.log('===========================================');

    // RETURN CON TUTTE LE PROPRIETÀ NECESSARIE
    return {
      level: assignedLevel,
      score: totalScore,
      belt: levelToBelt[assignedLevel], // ← FIX: Assicura che belt sia sempre presente
      breakdown: sectionScores,
      percentage: Math.round(totalScore * 100)
    };
  },

  evaluateSection: (answers, sectionPrefix) => {
    const sectionAnswers = Object.keys(answers)
      .filter(key => key.includes(sectionPrefix))
      .map(key => answers[key]);

    if (sectionAnswers.length === 0) return 0.5;

    let totalScore = 0;
    let count = 0;

    sectionAnswers.forEach(answer => {
      count++;
      if (typeof answer === 'object' && answer.score !== undefined) {
        totalScore += answer.score;
      } else if (answer === 'correct') {
        totalScore += 1.0;
      } else if (['wrong1', 'wrong2', 'wrong3'].includes(answer)) {
        totalScore += 0.0;
      } else {
        totalScore += 0.5;
      }
    });

    return count > 0 ? totalScore / count : 0.5;
  }
};