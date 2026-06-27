"use client";

import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ImageIcon,
  Type,
  Upload,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Language, FileType } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

interface UploadSectionProps {
  language: Language;
}

export default function UploadSection({ language }: UploadSectionProps) {
  const t = useTranslation(language);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("pdf");

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateAndSetPdf = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error(t("upload.toast.invalidPdf.title"), {
        description: t("upload.toast.invalidPdf.desc"),
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("upload.toast.tooLarge.title"), {
        description: t("upload.toast.tooLargePdf.desc"),
      });
      return;
    }
    setPdfFile(file);
  };

  const validateAndSetImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("upload.toast.invalidPdf.title"), {
        description: t("upload.toast.invalidImage.desc"),
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("upload.toast.tooLarge.title"), {
        description: t("upload.toast.tooLargeImage.desc"),
      });
      return;
    }
    setImageFile(file);
  };

  const handlePdfDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetPdf(file);
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetImage(file);
  }, []);

  const handleAnalyze = async () => {
    let file: File | null = null;
    let fileType: FileType = "text";

    if (activeTab === "pdf") {
      if (!pdfFile) {
        toast.error(t("upload.toast.noFile.title"), { description: t("upload.toast.noPdf.desc") });
        return;
      }
      file = pdfFile;
      fileType = "pdf";
    } else if (activeTab === "image") {
      if (!imageFile) {
        toast.error(t("upload.toast.noFile.title"), { description: t("upload.toast.noImage.desc") });
        return;
      }
      file = imageFile;
      fileType = "image";
    } else {
      if (textInput.trim().length < 20) {
        toast.error(t("upload.toast.tooShort.title"), { description: t("upload.toast.tooShort.desc") });
        return;
      }
      fileType = "text";
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("fileType", fileType);
      formData.append("language", language);
      if (fileType === "text") formData.append("text", textInput);

      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        const err = await parseResponse.json();
        throw new Error(err.error || "Failed to parse document");
      }

      const { documentId } = await parseResponse.json();
      router.push(`/analyzing/${documentId}?lang=${language}`);
    } catch (error: any) {
      console.error(error);
      toast.error(t("upload.toast.uploadFailed.title"), {
        description: error.message || t("upload.toast.tryAgain"),
      });
      setIsAnalyzing(false);
    }
  };

  const DropZone = ({
    isDragging,
    file,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
    onRemove,
    icon: Icon,
    label,
    hint,
    badge,
  }: {
    isDragging: boolean;
    file: File | null;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onClick: () => void;
    onRemove: () => void;
    icon: any;
    label: string;
    hint: string;
    badge: string;
  }) => (
    <Card
      className={`relative border-2 border-dashed transition-all duration-200 p-5 sm:p-8 text-center ${
        isDragging
          ? "border-primary bg-primary/5 cursor-copy"
          : file
          ? "border-primary/50 bg-primary/5 cursor-default"
          : "border-border hover:border-primary/50 cursor-pointer"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !file && onClick()}
    >
      {file ? (
        <div className="flex items-center justify-between gap-3">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary shrink-0" />
          <div className="text-left flex-1 min-w-0">
            <p className="font-medium truncate text-sm sm:text-base">{file.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB · {t("upload.readyToAnalyze")}
            </p>
          </div>
          <button
            type="button"
            className="p-1.5 hover:bg-muted rounded-md transition-colors shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm sm:text-base">{label}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{hint}</p>
          </div>
          <Badge variant="secondary" className="text-xs whitespace-normal text-center max-w-full">
            {badge}
          </Badge>
        </div>
      )}
    </Card>
  );

  return (
    <div id="upload-section" className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full mb-4 h-auto">
          <TabsTrigger value="pdf" className="flex items-center gap-1.5 py-2 text-xs sm:text-sm">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t("upload.tab.pdf")}</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1.5 py-2 text-xs sm:text-sm">
            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t("upload.tab.photo")}</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1.5 py-2 text-xs sm:text-sm">
            <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t("upload.tab.text")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pdf">
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) validateAndSetPdf(file);
            }}
          />
          <DropZone
            isDragging={isDraggingPdf}
            file={pdfFile}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingPdf(true);
            }}
            onDragLeave={() => setIsDraggingPdf(false)}
            onDrop={handlePdfDrop}
            onClick={() => pdfInputRef.current?.click()}
            onRemove={() => setPdfFile(null)}
            icon={FileText}
            label={t("upload.pdf.dropLabel")}
            hint={t("upload.pdf.hint")}
            badge={t("upload.pdf.badge")}
          />
        </TabsContent>

        <TabsContent value="image">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) validateAndSetImage(file);
            }}
          />
          <DropZone
            isDragging={isDraggingImage}
            file={imageFile}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingImage(true);
            }}
            onDragLeave={() => setIsDraggingImage(false)}
            onDrop={handleImageDrop}
            onClick={() => imageInputRef.current?.click()}
            onRemove={() => setImageFile(null)}
            icon={ImageIcon}
            label={t("upload.image.dropLabel")}
            hint={t("upload.image.hint")}
            badge={t("upload.image.badge")}
          />
        </TabsContent>

        {/* Text tab — matches the same card language as PDF/Image tabs
            instead of a bare unstyled textarea */}
        <TabsContent value="text">
          <Card className="border-2 border-dashed border-border p-5 sm:p-8">
            <div className="space-y-2.5 sm:space-y-3 mb-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Type className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm sm:text-base">
                  {t("upload.text.label")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("upload.text.hint")}
                </p>
              </div>
            </div>

            <textarea
              className="w-full h-36 sm:h-44 bg-background border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-primary/50 transition-colors text-sm leading-relaxed"
              placeholder={t("upload.text.placeholder")}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {textInput.length} {t("upload.text.charCount")}
              </span>
              {textInput.length > 0 && textInput.length < 20 && (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t("upload.text.minChars")}
                </span>
              )}
            </div>
            <Badge variant="secondary" className="text-xs mt-3 mx-auto block w-fit text-center">
              {t("upload.text.badge")}
            </Badge>
          </Card>
        </TabsContent>
      </Tabs>

      <Button
        className="w-full mt-4 h-11 sm:h-12 text-sm sm:text-base font-semibold"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {t("upload.button.analyzing")}
          </>
        ) : (
          t("upload.button.analyze")
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        {t("upload.footer")}
      </p>
    </div>
  );
}