import { NextRequest, NextResponse } from "next/server";
import { parsePdf } from "@/lib/parsers/pdfParser";
import { parseImage } from "@/lib/parsers/imageParser";
import { supabaseAdmin } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fileType = formData.get("fileType") as string;
    const language = formData.get("language") as string;

    if (!fileType || !language) {
      return NextResponse.json(
        { error: "Missing fileType or language" },
        { status: 400 }
      );
    }

    let rawText = "";
    let fileName = "text-input";
    let storageUrl = "";

    // ── Text input path ──────────────────────────────────────────────
    if (fileType === "text") {
      const text = formData.get("text") as string;

      if (!text || text.trim().length < 20) {
        return NextResponse.json(
          { error: "Text is too short. Please enter at least 20 characters." },
          { status: 400 }
        );
      }

      rawText = text.trim();
    }

    // ── File input path ──────────────────────────────────────────────
    else {
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      // Size check — 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit" },
          { status: 400 }
        );
      }

      fileName = file.name;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload original file to Supabase Storage
      const ext =
        fileType === "pdf" ? "pdf" : (file.name.split(".").pop() ?? "jpg");
      const storagePath = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: storageError } = await supabaseAdmin.storage
        .from("legal-docs")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (storageError) {
        console.error("Supabase storage error:", storageError.message);
        // Non-critical — continue without storage URL
      } else {
        const { data: urlData } = supabaseAdmin.storage
          .from("legal-docs")
          .getPublicUrl(storagePath);
        storageUrl = urlData.publicUrl;
      }

      // Parse the file
      if (fileType === "pdf") {
        rawText = await parsePdf(buffer);
      } else if (fileType === "image") {
        rawText = await parseImage(buffer, file.type);
      } else {
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 }
        );
      }
    }

    // Sanity check on extracted text
    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough text from the document. Please try a clearer file or paste the text directly.",
        },
        { status: 422 }
      );
    }

    // Save document record to Supabase DB
    const { data: document, error: dbError } = await supabaseAdmin
      .from("documents")
      .insert({
        file_name: fileName,
        file_type: fileType,
        raw_text: rawText,
        storage_url: storageUrl,
      })
      .select()
      .single();

    if (dbError || !document) {
      console.error("DB insert error:", dbError?.message);
      return NextResponse.json(
        { error: "Failed to save document to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      documentId: document.id,
      preview: rawText.slice(0, 200),
    });
  } catch (error: any) {
    console.error("Parse route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}