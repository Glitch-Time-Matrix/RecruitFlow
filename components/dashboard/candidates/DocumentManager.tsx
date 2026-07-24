"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Trash2,
  Upload,
  Sparkles,
  Eye,
  Loader2,
  FileCheck2,
} from "lucide-react";
import {
  generateResume,
  uploadCandidateDocument,
  deleteDocument,
} from "@/lib/actions/documents";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ManagedDoc = {
  id: string;
  kind: string;
  file_name: string;
  url: string | null;
  created_at: string;
};

const DOC_LABELS: Record<string, string> = {
  resume: "Résumé (uploaded)",
  generated_resume: "Generated Résumé",
  certificate: "Certificate",
  other: "Document",
};

const UPLOAD_KINDS = [
  { value: "resume", label: "Résumé" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other document" },
];

function initialKindLabel(kind: string) {
  return DOC_LABELS[kind] ?? "Document";
}

export function DocumentManager({
  candidateId,
  documents,
}: {
  candidateId: string;
  documents: ManagedDoc[];
}) {
  const router = useRouter();
  const [generating, startGenerate] = useTransition();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, startUpload] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletePending, startDelete] = useTransition();
  const [uploadKind, setUploadKind] = useState("resume");
  const fileRef = useRef<HTMLInputElement>(null);

  const generated = documents.find((d) => d.kind === "generated_resume");
  const others = documents.filter((d) => d.kind !== "generated_resume");

  function onGenerate() {
    startGenerate(async () => {
      const res = await generateResume(candidateId);
      if (res.success) {
        toast.success(generated ? "Résumé regenerated." : "Résumé generated.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("candidateId", candidateId);
    fd.append("kind", uploadKind);
    const f = fileRef.current?.files?.[0];
    if (!f) {
      toast.error("Please choose a file.");
      return;
    }
    fd.append("file", f);
    startUpload(async () => {
      const res = await uploadCandidateDocument(fd);
      if (res.success) {
        toast.success("Document uploaded.");
        setUploadOpen(false);
        if (fileRef.current) fileRef.current.value = "";
        setUploadKind("resume");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  function onDelete(id: string) {
    setDeletingId(id);
    startDelete(async () => {
      const res = await deleteDocument(id);
      if (res.success) {
        toast.success("Document deleted.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
      setDeletingId(null);
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
          <FileText className="size-4 text-secondary" /> Documents
        </h2>
        <Button variant="outline" size="xs" onClick={() => setUploadOpen(true)}>
          <Upload /> Upload
        </Button>
      </div>

      {/* Generated résumé block */}
      <div className="mb-4 rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
        <div className="flex items-start gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground">Agency Résumé</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              {generated
                ? "Built from this profile. Add a summary, experience & education, then regenerate to refresh it."
                : "Add a professional summary, experience & education to the profile, then generate a branded, ATS-ready résumé."}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="xs" onClick={onGenerate} disabled={generating}>
            {generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {generated ? "Regenerate" : "Generate"}
          </Button>
          <Button asChild variant="outline" size="xs">
            <a href={`/dashboard/candidates/${candidateId}/resume`} target="_blank" rel="noopener noreferrer">
              <Eye /> Preview &amp; Print
            </a>
          </Button>
          {generated?.url && (
            <Button asChild variant="ghost" size="xs">
              <a href={generated.url} target="_blank" rel="noopener noreferrer">
                <Download /> Download
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Uploaded / other documents */}
      {others.length === 0 ? (
        <p className="text-xs text-muted-foreground">No uploaded documents.</p>
      ) : (
        <ul className="space-y-2">
          {others.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileCheck2 className="size-4" />
              </div>
              <a
                href={doc.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1"
              >
                <p className="line-clamp-1 text-xs font-semibold text-foreground">
                  {initialKindLabel(doc.kind)}
                </p>
                <p className="line-clamp-1 text-[11px] text-muted-foreground">{doc.file_name}</p>
              </a>
              <a
                href={doc.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Download"
              >
                <Download className="size-4" />
              </a>
              <button
                type="button"
                onClick={() => onDelete(doc.id)}
                disabled={deletePending && deletingId === doc.id}
                className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                aria-label="Delete"
              >
                {deletePending && deletingId === doc.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={onUpload}>
            <DialogHeader>
              <DialogTitle>Upload document</DialogTitle>
              <DialogDescription>
                Attach a résumé, certificate, or other file to this candidate. PDF or Word, up to 10MB.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Document type</Label>
                <Select value={uploadKind} onValueChange={setUploadKind}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UPLOAD_KINDS.map((k) => (
                      <SelectItem key={k.value} value={k.value}>
                        {k.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-file">File</Label>
                <Input
                  id="doc-file"
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
