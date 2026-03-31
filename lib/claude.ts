const PROMPT_CLAUDE = `Sei un editor editoriale esperto con 20 anni di esperienza nel mercato librario italiano. 
Hai letto il testo di un manoscritto che ti viene fornito. 
Produci una scheda editoriale professionale in italiano, strutturata esattamente in questo formato JSON:

{
  "genere": "genere principale / sottogenere (es. Narrativa contemporanea / Coming of age)",
  "pubblico_target": "descrizione dettagliata del lettore ideale: età, interessi, abitudini di lettura",
  "tono_stile": "descrizione dello stile narrativo: punto di vista, ritmo, registro linguistico",
  "trama": "sintesi della trama in massimo 3 righe, senza spoiler sul finale",
  "punti_forza": ["punto di forza 1", "punto di forza 2", "punto di forza 3"],
  "aree_miglioramento": ["area 1 con suggerimento concreto", "area 2 con suggerimento concreto"],
  "comparables": ["Titolo Autore (anno)", "Titolo Autore (anno)"],
  "potenziale_commerciale": 3,
  "potenziale_note": "motivazione del punteggio in 2-3 righe",
  "tag_semantici": {
    "generi": ["narrativa", "contemporanea"],
    "temi": ["identità", "famiglia", "crescita"],
    "tono": ["introspettivo", "lirico"],
    "pubblico_eta": "18-35",
    "lunghezza_stimata": "romanzo"
  }
}

Rispondi SOLO con il JSON, senza testo aggiuntivo, senza backtick markdown. Sii onesto ma costruttivo. Il feedback deve essere utile all'autore, non scoraggiante. I comparables devono essere libri realmente pubblicati in Italia o tradotti in italiano.`;

export async function analyzeManoscritto(testo: string) {
  const testoTroncato = testo.slice(0, 50000); // Troncamento garantito 50k char max

  const bodyQuery = JSON.stringify({
    model: "claude-3-5-sonnet-20240620", // The prompt in Briefing uses claude-sonnet-4-20250514 placeholder, using Anthropic's standard 3-5 sonnet model string if custom is offline. Let's force the placeholder they asked: claude-sonnet-4-20250514
    max_tokens: 2000,
    system: PROMPT_CLAUDE,
    messages: [
      {
        role: "user",
        content: `TESTO DEL MANOSCRITTO:\n[${testoTroncato}]`
      }
    ],
    temperature: 0.2
  });

  // Since we replace the "claude-sonnet-4-20250514" exactly as requested in the briefing:
  const finalBody = bodyQuery.replace("claude-3-5-sonnet-20240620", "claude-sonnet-4-20250514");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: finalBody
  });

  if (!response.ok) {
    throw new Error(`Anthropic API Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const rawContent = json.content[0].text.trim();

  try {
    // Tenta di parsare la risposta pulendola da eventuali Markdown blocks casuali
    const cleanedContent = rawContent.replace(/^\`\`\`(json)?/m, '').replace(/\`\`\`$/m, '').trim();
    return JSON.parse(cleanedContent);
  } catch (error) {
    throw new Error(`Impossibile parsare la risposta di Claude nel formato JSON richiesto. Risposta grezza: ${rawContent}`);
  }
}
