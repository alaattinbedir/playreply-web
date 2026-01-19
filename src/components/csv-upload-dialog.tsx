"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  HelpCircle,
  Cloud,
  ExternalLink,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

interface CSVUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appId: string;
  appName: string;
  packageName: string;
  platform: "android" | "ios";
  onSuccess?: (count: number) => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";
type ImportMode = "cloud-storage" | "csv-upload";

export function CSVUploadDialog({
  open,
  onOpenChange,
  appId,
  appName,
  packageName,
  platform,
  onSuccess,
}: CSVUploadDialogProps) {
  const [mode, setMode] = useState<ImportMode>("cloud-storage");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cloudStorageUrl, setCloudStorageUrl] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    success_count: number;
    error_count: number;
    total_processed: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parse bucket_id from Cloud Storage URL
  const parseBucketId = (url: string): string | null => {
    // Handle formats:
    // gs://pubsite_prod_rev_XXXXX/reviews/
    // gs://pubsite_prod_rev_XXXXX
    // pubsite_prod_rev_XXXXX
    const match = url.match(/(?:gs:\/\/)?([^\/]+)/);
    return match ? match[1] : null;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        setUploadState("idle");
        setResult(null);
        setErrorMessage(null);
      } else {
        setErrorMessage("Please upload a CSV file");
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadState("idle");
      setResult(null);
      setErrorMessage(null);
    }
  }, []);

  const handleCloudStorageImport = async () => {
    const bucketId = parseBucketId(cloudStorageUrl);
    if (!bucketId) {
      setErrorMessage("Invalid Cloud Storage URL");
      return;
    }

    setUploadState("uploading");
    setProgress(10);
    setErrorMessage(null);

    try {
      // Call Cloud Storage import API
      const response = await fetch("/api/n8n/import-cloud-storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          bucket_id: bucketId,
          package_name: packageName,
        }),
      });

      setProgress(50);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Import failed");
      }

      // Cloud Storage import is async - we get a started status
      const data = await response.json();
      setProgress(100);

      if (data.status === "started" || data.success) {
        setResult({
          success_count: -1, // -1 means "processing"
          error_count: 0,
          total_processed: 0,
        });
        setUploadState("success");

        if (onSuccess) {
          onSuccess(0); // Trigger refresh
        }
      } else {
        throw new Error(data.error || "Import failed");
      }
    } catch (error) {
      setUploadState("error");
      setErrorMessage(error instanceof Error ? error.message : "Import failed");
    }
  };

  const handleCsvUpload = async () => {
    if (!file) return;

    setUploadState("uploading");
    setProgress(10);
    setErrorMessage(null);

    try {
      // Read file content
      const content = await file.text();
      setProgress(30);

      // Send to API
      const response = await fetch("/api/n8n/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          csv_content: content,
          platform,
        }),
      });

      setProgress(80);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      setProgress(100);
      setResult(data);
      setUploadState("success");

      if (onSuccess && data.success_count > 0) {
        onSuccess(data.success_count);
      }
    } catch (error) {
      setUploadState("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleImport = () => {
    if (mode === "cloud-storage") {
      handleCloudStorageImport();
    } else {
      handleCsvUpload();
    }
  };

  const handleClose = () => {
    setFile(null);
    setCloudStorageUrl("");
    setUploadState("idle");
    setProgress(0);
    setResult(null);
    setErrorMessage(null);
    onOpenChange(false);
  };

  const resetUpload = () => {
    setFile(null);
    setCloudStorageUrl("");
    setUploadState("idle");
    setProgress(0);
    setResult(null);
    setErrorMessage(null);
  };

  const canImport = mode === "cloud-storage"
    ? cloudStorageUrl.trim().length > 0
    : file !== null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Import Historical Reviews
          </DialogTitle>
          <DialogDescription>
            Import older reviews for {appName} that aren&apos;t available via the API
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Info Box */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
            <div className="flex gap-3">
              <HelpCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Neden geçmiş yorumları import etmeliyim?
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Google Play API <strong>sadece son 7 günün</strong> yorumlarını döndürüyor.
                  Daha eski yorumlarınızı almak için aşağıdaki yöntemlerden birini kullanabilirsiniz.
                  Bu işlem <strong>bir kez</strong> yapılır - sonrasında günlük senkronizasyon otomatik devam eder.
                </p>
              </div>
            </div>
          </div>

          {uploadState === "idle" && (
            <Tabs value={mode} onValueChange={(v) => setMode(v as ImportMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cloud-storage" className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Cloud Storage
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                    Önerilen
                  </span>
                </TabsTrigger>
                <TabsTrigger value="csv-upload" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CSV Yükle
                </TabsTrigger>
              </TabsList>

              {/* Cloud Storage Tab */}
              <TabsContent value="cloud-storage" className="space-y-4 mt-4">
                {/* Benefits */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Tek URL ile tümü</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Otomatik güncelleme</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Tek seferlik kurulum</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="cloud-storage-url">Cloud Storage URL</Label>
                    <Input
                      id="cloud-storage-url"
                      placeholder="gs://pubsite_prod_rev_XXXXX/reviews/"
                      value={cloudStorageUrl}
                      onChange={(e) => {
                        setCloudStorageUrl(e.target.value);
                        setErrorMessage(null);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      <a
                        href="https://play.google.com/console"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Play Console
                      </a>
                      {" → Download reports → Reviews → "}
                      <strong>&quot;Cloud Storage URI&apos;sını kopyala&quot;</strong>
                    </p>
                  </div>

                  {/* Setup Instructions */}
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Tek Seferlik Kurulum Gerekli
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      PlayReply&apos;ın Cloud Storage bucket&apos;ınıza erişmesi için izin verin:
                    </p>
                    <ol className="text-xs text-amber-700 dark:text-amber-300 space-y-1.5 list-decimal list-inside">
                      <li>
                        <a
                          href="https://console.cloud.google.com/iam-admin/iam"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-amber-900 dark:hover:text-amber-100"
                        >
                          Google Cloud Console → IAM
                        </a>
                        {" sayfasına gidin"}
                      </li>
                      <li>
                        Üst menüden <strong>Google Play Developer hesabınızla ilişkili projeyi</strong> seçin
                        <span className="block text-[10px] opacity-75 mt-0.5">
                          (genellikle uygulama adınızı içerir, örn: &quot;Stepster&quot;, &quot;MyApp&quot;)
                        </span>
                      </li>
                      <li><strong>&quot;Grant Access&quot;</strong> butonuna tıklayın</li>
                      <li>Aşağıdaki email&apos;i ekleyin:</li>
                    </ol>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-2 py-1.5 bg-white dark:bg-amber-950 rounded text-xs font-mono text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 truncate">
                        playreplyservice@playreply.iam.gserviceaccount.com
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 shrink-0 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
                        onClick={() => {
                          navigator.clipboard.writeText("playreplyservice@playreply.iam.gserviceaccount.com");
                        }}
                      >
                        Kopyala
                      </Button>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      5. Rol olarak <strong>&quot;Storage Object Viewer&quot;</strong> seçin ve kaydedin
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* CSV Upload Tab */}
              <TabsContent value="csv-upload" className="space-y-4 mt-4">
                {/* Info about limitations */}
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p>
                    <strong>Not:</strong> CSV dosyaları Play Console&apos;da her ay için ayrı ayrı indirilir.
                    Çok sayıda geçmiş yorumunuz varsa Cloud Storage yöntemi daha pratiktir.
                  </p>
                </div>

                <div
                  className={`
                    relative border-2 border-dashed rounded-lg p-8
                    transition-colors cursor-pointer
                    ${dragActive
                      ? "border-primary bg-primary/5"
                      : file
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("csv-file-input")?.click()}
                >
                  <input
                    id="csv-file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-3 text-center">
                    {file ? (
                      <>
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-300">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Kaldır
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {dragActive ? "CSV dosyasını bırakın" : "CSV dosyasını sürükle & bırak"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            veya tıklayarak seçin
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">CSV dosyası nasıl indirilir:</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>
                      <a
                        href="https://play.google.com/console"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Play Console
                      </a>
                      {" → Download reports → Reviews"}
                    </li>
                    <li>İstediğiniz ayın yanındaki indirme ikonuna (↓) tıklayın</li>
                    <li>İndirilen CSV dosyasını buraya yükleyin</li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Uploading State */}
          {uploadState === "uploading" && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {mode === "cloud-storage" ? "Cloud Storage'a bağlanılıyor..." : "Yorumlar import ediliyor..."}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {mode === "cloud-storage"
                  ? "Bucket'ınızdaki tüm yorum dosyaları çekiliyor..."
                  : "Büyük dosyalar için biraz zaman alabilir"
                }
              </p>
            </div>
          )}

          {/* Success State */}
          {uploadState === "success" && result && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {result.success_count === -1 ? "Import Başlatıldı!" : "Import Tamamlandı!"}
                  </p>
                  <p className="text-muted-foreground">
                    {result.success_count === -1
                      ? "Yorumlar arka planda import ediliyor"
                      : `${result.success_count} yorum başarıyla import edildi`
                    }
                  </p>
                </div>
              </div>

              {/* Stats - only show for CSV upload */}
              {result.success_count !== -1 && (
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-green-600">{result.success_count}</p>
                    <p className="text-xs text-muted-foreground">Import Edildi</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-red-600">{result.error_count}</p>
                    <p className="text-xs text-muted-foreground">Hata</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">{result.total_processed}</p>
                    <p className="text-xs text-muted-foreground">Toplam</p>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-3">
                <p className="text-sm text-green-700 dark:text-green-300 text-center">
                  {result.success_count === -1
                    ? "Yorumlar kısa süre içinde görünecek. AI yanıtları otomatik olarak üretilecek."
                    : "Yeni yorumlar için AI yanıtları otomatik olarak üretilecek"
                  }
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {uploadState === "error" && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Import Başarısız</p>
                  <p className="text-muted-foreground text-sm">
                    {errorMessage || "Yorumlar import edilirken bir hata oluştu"}
                  </p>
                </div>
              </div>

              {mode === "cloud-storage" && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3">
                  <p className="text-xs text-amber-700 dark:text-amber-300 text-center">
                    Service account&apos;a Storage Object Viewer izni verdiğinizden emin olun
                  </p>
                </div>
              )}

              <Button variant="outline" className="w-full" onClick={resetUpload}>
                Tekrar Dene
              </Button>
            </div>
          )}

          {/* Error Message (for input errors) */}
          {errorMessage && uploadState === "idle" && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
        </div>

        <DialogFooter>
          {uploadState === "idle" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                İptal
              </Button>
              <Button onClick={handleImport} disabled={!canImport}>
                {mode === "cloud-storage" ? (
                  <>
                    <Cloud className="mr-2 h-4 w-4" />
                    Cloud Storage&apos;dan Import Et
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Yorumları Import Et
                  </>
                )}
              </Button>
            </>
          )}
          {uploadState === "success" && (
            <Button onClick={handleClose}>
              Tamam
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
