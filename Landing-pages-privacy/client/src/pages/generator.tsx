import { useState } from "react";
import { type LandingPageData, defaultLandingPageData } from "@shared/schema";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { LandingPreview } from "@/components/landing/LandingPreview";
import { useToast } from "@/hooks/use-toast";

export default function Generator() {
  const [data, setData] = useState<LandingPageData>(defaultLandingPageData);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ landingData: data }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar landing page");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "landing-page.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Sucesso!",
        description: "Landing page gerada e baixada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar landing page. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#1a1817" }}
      data-testid="page-generator"
    >
      {/* Left Panel - Editor */}
      <div 
        className="w-[400px] flex-shrink-0 border-r"
        style={{ borderColor: "#3d3a39" }}
      >
        <EditorPanel
          data={data}
          onChange={setData}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onDownload={handleDownload}
          isGenerating={isGenerating}
        />
      </div>

      {/* Right Panel - Preview */}
      <div 
        className="flex-1 overflow-auto p-8 flex justify-center"
        style={{ backgroundColor: "#1a1817" }}
      >
        <div 
          className="shadow-2xl rounded-lg overflow-hidden"
          style={{
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto"
          }}
        >
          <LandingPreview data={data} viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}
