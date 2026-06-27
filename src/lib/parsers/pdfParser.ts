export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import("unpdf");

    const uint8Array = new Uint8Array(buffer);
    const { text } = await extractText(uint8Array, { mergePages: true });

    if (!text || text.trim().length < 10) {
      throw new Error("No readable text found in PDF");
    }

    return text.trim();
  } catch (error: any) {
    throw new Error("Failed to parse PDF: " + error.message);
  }
}