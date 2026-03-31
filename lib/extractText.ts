import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(buffer: Buffer, mimetype: string): Promise<string> {
  let text = '';

  try {
    if (mimetype === 'application/pdf') {
      const data = await pdf(buffer);
      text = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      throw new Error(`Mimetype non supportato: ${mimetype}`);
    }

    // Pulisci il testo da spazi multipli e ritorni a capo eccessivi
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  } catch (error: any) {
    console.error("Errore estrazione testo:", error);
    throw new Error(`Errore durante l'estrazione del testo dal file: ${error.message}`);
  }
}
