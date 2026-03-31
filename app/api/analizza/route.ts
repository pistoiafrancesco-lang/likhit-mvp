import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeManoscritto } from "@/lib/claude";

// Usiamo il service role per bypassare RLS ed operare in background per conto di Likhit
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { manoscritto_id } = await req.json();

    if (!manoscritto_id) {
      return NextResponse.json({ error: "manoscritto_id richiesto" }, { status: 400 });
    }

    // Recupera testo
    const { data: mn, error: mnError } = await supabaseAdmin
      .from("manoscritti")
      .select("testo_estratto")
      .eq("id", manoscritto_id)
      .single();

    if (mnError || !mn) {
      return NextResponse.json({ error: "Manoscritto inesistente o db error" }, { status: 404 });
    }

    try {
      // Chiama Claude
      const jsonScheda = await analyzeManoscritto(mn.testo_estratto);

      // Salva Scheda Editoriale
      const { error: insertError } = await supabaseAdmin.from("schede").insert({
        manoscritto_id,
        genere: jsonScheda.genere,
        pubblico_target: jsonScheda.pubblico_target,
        tono_stile: jsonScheda.tono_stile,
        trama: jsonScheda.trama,
        punti_forza: jsonScheda.punti_forza,
        aree_miglioramento: jsonScheda.aree_miglioramento,
        comparables: jsonScheda.comparables,
        potenziale_commerciale: jsonScheda.potenziale_commerciale,
        potenziale_note: jsonScheda.potenziale_note,
        tag_semantici: jsonScheda.tag_semantici,
        raw_response: JSON.stringify(jsonScheda)
      });

      if (insertError) throw new Error(insertError.message);

      // Aggiorna stato manoscritto
      await supabaseAdmin
        .from("manoscritti")
        .update({ stato: 'completato' })
        .eq('id', manoscritto_id);

      return NextResponse.json({ success: true });

    } catch (aiError: any) {
      console.error(`Errore analisi manoscritto ${manoscritto_id}:`, aiError);
      
      // Manda in errore il manoscritto lato db
      await supabaseAdmin
        .from("manoscritti")
        .update({ stato: 'errore' })
        .eq('id', manoscritto_id);

      return NextResponse.json({ error: aiError.message }, { status: 500 });
    }

  } catch (err: any) {
    console.error("Analizza handler crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
