import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase-server";
import { extractTextFromFile } from "@/lib/extractText";

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
    }

    // Validazione Dimensione (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Il file supera il limite di 10MB" }, { status: 400 });
    }

    // Validazione Tipo
    if (file.type !== "application/pdf" && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && file.type !== "application/msword") {
      return NextResponse.json({ error: "Solo file PDF o DOCX sono accettati" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Salvataggio Storage su Supabase
    const uuid = crypto.randomUUID();
    const ext = file.name.split('.').pop();
    const storagePath = `${user.id}/${uuid}.${ext}`;

    const { error: storageError } = await supabase.storage
      .from('manoscritti')
      .upload(storagePath, bytes, {
        contentType: file.type,
      });

    if (storageError) {
      console.error(storageError);
      return NextResponse.json({ error: "Errore durante il salvataggio remoto" }, { status: 500 });
    }

    // Estrazione testo (Server Side puro)
    let textExtracted = "";
    try {
      textExtracted = await extractTextFromFile(buffer, file.type);
    } catch (extractError: any) {
      return NextResponse.json({ error: extractError.message }, { status: 422 });
    }

    if (textExtracted.length < 1000) {
      return NextResponse.json({ error: "Il testo estratto è troppo corto (< 1000 caratteri)" }, { status: 422 });
    }

    // Troncamento e conteggi
    const testoTroncato = textExtracted.slice(0, 50000);
    const paroleTotali = textExtracted.split(/\s+/).length;

    // Inserimento DB
    const { data: dbData, error: dbError } = await supabase.from('manoscritti').insert({
      user_id: user.id,
      titolo: file.name.replace(`.${ext}`, ''),
      file_path: storagePath,
      file_name: file.name,
      file_size: file.size,
      stato: 'in_analisi',
      testo_estratto: testoTroncato,
      parole_totali: paroleTotali
    }).select('id').single();

    if (dbError) {
      console.error(dbError);
      return NextResponse.json({ error: "Impossibile salvare il record" }, { status: 500 });
    }

    // Spin chiamata Analisi AI asincrona
    // Nota sulla Open Question: Vercel sconsiglia fire-and-forget in serverless,
    // in produzione pro useremmo uno scheduler. Facciamo fetch immediata locale.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    fetch(`${baseUrl}/api/analizza`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manoscritto_id: dbData.id })
    }).catch(console.error); // Esecuzione asincrona svincolata

    return NextResponse.json({ success: true, manoscritto_id: dbData.id });

  } catch (err: any) {
    console.error("Upload handler crash:", err);
    return NextResponse.json({ error: "Errore interno al server" }, { status: 500 });
  }
}
