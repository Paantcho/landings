import { useRef } from "react";
import { type LandingPageData, type Thumb } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Plus, Trash2, Download, Monitor, Smartphone } from "lucide-react";

interface EditorPanelProps {
  data: LandingPageData;
  onChange: (data: LandingPageData) => void;
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export function EditorPanel({ 
  data, 
  onChange, 
  viewMode, 
  onViewModeChange, 
  onDownload,
  isGenerating 
}: EditorPanelProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerDesktopRef = useRef<HTMLInputElement>(null);
  const bannerMobileRef = useRef<HTMLInputElement>(null);
  const videoThumbnailRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const thumbInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: keyof LandingPageData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    thumbIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newThumbs = [...data.thumbs];
        newThumbs[thumbIndex] = {
          ...newThumbs[thumbIndex],
          imageUrl: reader.result as string
        };
        onChange({ ...data, thumbs: newThumbs });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, videoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateThumbLegend = (index: number, legend: string) => {
    const newThumbs = [...data.thumbs];
    newThumbs[index] = { ...newThumbs[index], legend };
    onChange({ ...data, thumbs: newThumbs });
  };

  const addThumb = () => {
    if (data.thumbs.length < 5) {
      const newThumb: Thumb = {
        id: `${data.thumbs.length + 1}`,
        imageUrl: "",
        legend: "Legenda da foto"
      };
      onChange({ ...data, thumbs: [...data.thumbs, newThumb] });
    }
  };

  const removeThumb = (index: number) => {
    if (data.thumbs.length > 3) {
      const newThumbs = data.thumbs.filter((_, i) => i !== index);
      onChange({ ...data, thumbs: newThumbs });
    }
  };

  return (
    <div 
      className="h-full overflow-y-auto p-4 space-y-4"
      style={{ backgroundColor: "#23201F" }}
      data-testid="editor-panel"
    >
      {/* Header with View Toggle and Download */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {/* View Mode Toggle - NO hover effects per Figma spec */}
        <div className="flex rounded-lg overflow-hidden border border-[#F68D3D]">
          <button
            onClick={() => onViewModeChange("desktop")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
              viewMode === "desktop" 
                ? "bg-[#F68D3D] text-[#23201F]" 
                : "bg-transparent text-[#F68D3D]"
            }`}
            data-testid="button-view-desktop"
          >
            <Monitor size={16} />
            Desktop
          </button>
          <button
            onClick={() => onViewModeChange("mobile")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
              viewMode === "mobile" 
                ? "bg-[#F68D3D] text-[#23201F]" 
                : "bg-transparent text-[#F68D3D]"
            }`}
            data-testid="button-view-mobile"
          >
            <Smartphone size={16} />
            Mobile
          </button>
        </div>

        {/* Download Button */}
        <Button
          onClick={onDownload}
          disabled={isGenerating}
          className="bg-[#F68D3D] text-[#23201F] hover:bg-[#F68D3D]/90 font-semibold"
          data-testid="button-download"
        >
          <Download size={16} className="mr-2" />
          {isGenerating ? "Gerando..." : "Baixar Landing Page"}
        </Button>
      </div>

      {/* SECTION: SEO */}
      <Card className="bg-[#2d2a29] border-[#3d3a39]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F4EEE5] text-lg">SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Page Title */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Título da Página</Label>
            <Input
              value={data.seoTitle}
              onChange={(e) => onChange({ ...data, seoTitle: e.target.value })}
              placeholder="Título exibido na aba do navegador"
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-seo-title"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Meta Description</Label>
            <Textarea
              value={data.seoDescription}
              onChange={(e) => onChange({ ...data, seoDescription: e.target.value })}
              placeholder="Descrição para mecanismos de busca..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5] resize-none"
              rows={3}
              data-testid="input-seo-description"
            />
          </div>

          {/* Meta Keywords */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Meta Keywords</Label>
            <Textarea
              value={data.seoKeywords}
              onChange={(e) => onChange({ ...data, seoKeywords: e.target.value })}
              placeholder="palavras-chave, separadas, por, vírgulas"
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5] resize-none"
              rows={3}
              data-testid="input-seo-keywords"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-[#3d3a39]" />

      {/* SECTION: Modal 18+ */}
      <Card className="bg-[#2d2a29] border-[#3d3a39]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F4EEE5] text-lg">Modal 18+</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Modal Title */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Título do Modal</Label>
            <Textarea
              value={data.modalTitle}
              onChange={(e) => onChange({ ...data, modalTitle: e.target.value })}
              placeholder="BEM-VINDO(A)&#10;AO MEU SITE, AMOR!!"
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5] resize-none"
              rows={2}
              data-testid="input-modal-title"
            />
            <p className="text-[#A0988C] text-xs">Use quebra de linha para separar em linhas</p>
          </div>

          {/* Modal Description */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Descrição do Modal</Label>
            <Textarea
              value={data.modalDescription}
              onChange={(e) => onChange({ ...data, modalDescription: e.target.value })}
              placeholder="Texto de descrição do modal..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5] resize-none"
              rows={3}
              data-testid="input-modal-description"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-[#3d3a39]" />

      {/* SECTION: Geral */}
      <Card className="bg-[#2d2a29] border-[#3d3a39]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F4EEE5] text-lg">Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Logo da Criadora (PNG/SVG)</Label>
            <input
              type="file"
              ref={logoInputRef}
              accept="image/png,image/svg+xml"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "logoUrl")}
              data-testid="input-logo"
            />
            <Button
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
              className="w-full border-dashed border-[#F68D3D] text-[#F68D3D] hover:bg-[#F68D3D]/10"
              data-testid="button-upload-logo"
            >
              <Upload size={16} className="mr-2" />
              {data.logoUrl ? "Alterar Logo" : "Enviar Logo"}
            </Button>
            {data.logoUrl && (
              <div className="mt-2 p-2 bg-[#1a1817] rounded flex items-center justify-center">
                <img src={data.logoUrl} alt="Logo" className="h-12 object-contain" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-[#3d3a39]" />

      {/* SECTION: Hero */}
      <Card className="bg-[#2d2a29] border-[#3d3a39]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F4EEE5] text-lg">Hero (Banner Principal)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Banner Desktop */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Banner Desktop (1920x953px)</Label>
            <input
              type="file"
              ref={bannerDesktopRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "bannerDesktopUrl")}
              data-testid="input-banner-desktop"
            />
            <Button
              variant="outline"
              onClick={() => bannerDesktopRef.current?.click()}
              className="w-full border-dashed border-[#F68D3D] text-[#F68D3D] hover:bg-[#F68D3D]/10"
              data-testid="button-upload-banner-desktop"
            >
              <Upload size={16} className="mr-2" />
              {data.bannerDesktopUrl ? "Alterar Banner Desktop" : "Enviar Banner Desktop"}
            </Button>
            {data.bannerDesktopUrl && (
              <div className="mt-2 p-2 bg-[#1a1817] rounded">
                <img src={data.bannerDesktopUrl} alt="Banner Desktop" className="w-full h-20 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Banner Mobile */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Banner Mobile (394x859px)</Label>
            <input
              type="file"
              ref={bannerMobileRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "bannerMobileUrl")}
              data-testid="input-banner-mobile"
            />
            <Button
              variant="outline"
              onClick={() => bannerMobileRef.current?.click()}
              className="w-full border-dashed border-[#F68D3D] text-[#F68D3D] hover:bg-[#F68D3D]/10"
              data-testid="button-upload-banner-mobile"
            >
              <Upload size={16} className="mr-2" />
              {data.bannerMobileUrl ? "Alterar Banner Mobile" : "Enviar Banner Mobile"}
            </Button>
            {data.bannerMobileUrl && (
              <div className="mt-2 p-2 bg-[#1a1817] rounded">
                <img src={data.bannerMobileUrl} alt="Banner Mobile" className="w-full h-20 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Hero Title */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Título Principal</Label>
            <Input
              value={data.heroTitle}
              onChange={(e) => onChange({ ...data, heroTitle: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-hero-title"
            />
          </div>

          {/* Hero Subtitle */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Subtítulo</Label>
            <Textarea
              value={data.heroSubtitle}
              onChange={(e) => onChange({ ...data, heroSubtitle: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5] resize-none"
              rows={2}
              data-testid="input-hero-subtitle"
            />
          </div>

          {/* Hero Button Text */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Texto do Botão "Ver Agora"</Label>
            <Input
              value={data.heroButtonText}
              onChange={(e) => onChange({ ...data, heroButtonText: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-hero-button"
            />
          </div>

          {/* Hero Button Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link do Botão "Ver Agora"</Label>
            <Input
              value={data.heroButtonLink}
              onChange={(e) => onChange({ ...data, heroButtonLink: e.target.value })}
              placeholder="https://privacy.com.br/..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-hero-button-link"
            />
          </div>

          {/* Header Button Text */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Texto do Botão "Assine Já"</Label>
            <Input
              value={data.headerButtonText}
              onChange={(e) => onChange({ ...data, headerButtonText: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-header-button"
            />
          </div>

          {/* Header Button Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link do Botão "Assine Já"</Label>
            <Input
              value={data.headerButtonLink}
              onChange={(e) => onChange({ ...data, headerButtonLink: e.target.value })}
              placeholder="https://privacy.com.br/..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-header-button-link"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-[#3d3a39]" />

      {/* SECTION: Thumbs */}
      <Card className="bg-[#2d2a29] border-[#3d3a39]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F4EEE5] text-lg">Fotos (3-5)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section Title */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Título da Seção</Label>
            <Textarea
              value={data.thumbsSectionTitle}
              onChange={(e) => onChange({ ...data, thumbsSectionTitle: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5] resize-none"
              rows={2}
              data-testid="input-thumbs-title"
            />
          </div>

          {/* Section Title Highlight */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Destaque do Título (laranja)</Label>
            <Input
              value={data.thumbsSectionTitleHighlight}
              onChange={(e) => onChange({ ...data, thumbsSectionTitleHighlight: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-thumbs-highlight"
            />
          </div>

          {/* Thumbs */}
          <div className="space-y-4">
            <Label className="text-[#F4EEE5]">Fotos e Legendas</Label>
            {data.thumbs.map((thumb, index) => (
              <div key={thumb.id} className="p-3 bg-[#1a1817] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#F68D3D] font-medium">Foto {index + 1}</span>
                  {data.thumbs.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeThumb(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      data-testid={`button-remove-thumb-${index}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={(el) => { thumbInputRefs.current[index] = el }}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleThumbImageUpload(e, index)}
                  data-testid={`input-thumb-image-${index}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => thumbInputRefs.current[index]?.click()}
                  className="w-full border-dashed border-[#F68D3D] text-[#F68D3D] hover:bg-[#F68D3D]/10"
                  data-testid={`button-upload-thumb-${index}`}
                >
                  <Upload size={14} className="mr-2" />
                  {thumb.imageUrl ? "Alterar Imagem" : "Enviar Imagem"}
                </Button>
                
                {thumb.imageUrl && (
                  <img src={thumb.imageUrl} alt={`Thumb ${index + 1}`} className="w-full h-16 object-cover rounded" />
                )}
                
                <Textarea
                  value={thumb.legend}
                  onChange={(e) => updateThumbLegend(index, e.target.value)}
                  placeholder="Legenda da foto..."
                  className="bg-[#2d2a29] border-[#3d3a39] text-[#F4EEE5] resize-none text-sm"
                  rows={3}
                  data-testid={`input-thumb-legend-${index}`}
                />
              </div>
            ))}

            {data.thumbs.length < 5 && (
              <Button
                variant="outline"
                onClick={addThumb}
                className="w-full border-dashed border-[#F68D3D] text-[#F68D3D] hover:bg-[#F68D3D]/10"
                data-testid="button-add-thumb"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Foto
              </Button>
            )}
          </div>

          {/* Thumbs Card Button Text */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Texto do Botão "Ver Agora" (nos cards)</Label>
            <Input
              value={data.thumbsCardButtonText}
              onChange={(e) => onChange({ ...data, thumbsCardButtonText: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-thumbs-card-button"
            />
          </div>

          {/* Thumbs Card Button Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link do Botão "Ver Agora" (nos cards)</Label>
            <Input
              value={data.thumbsCardButtonLink}
              onChange={(e) => onChange({ ...data, thumbsCardButtonLink: e.target.value })}
              placeholder="https://privacy.com.br/..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-thumbs-card-button-link"
            />
          </div>

          {/* Thumbs CTA Text */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Texto do Botão CTA "Assine e Veja Muito Mais"</Label>
            <Input
              value={data.thumbsButtonText}
              onChange={(e) => onChange({ ...data, thumbsButtonText: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-thumbs-cta"
            />
          </div>

          {/* Thumbs CTA Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link do Botão CTA "Assine e Veja Muito Mais"</Label>
            <Input
              value={data.thumbsButtonLink}
              onChange={(e) => onChange({ ...data, thumbsButtonLink: e.target.value })}
              placeholder="https://privacy.com.br/..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-thumbs-cta-link"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-[#3d3a39]" />

      {/* SECTION: Video */}
      <Card className="bg-[#2d2a29] border-[#3d3a39]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F4EEE5] text-lg">Vídeo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Thumbnail */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Thumbnail do Vídeo</Label>
            <input
              type="file"
              ref={videoThumbnailRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, "videoThumbnailUrl")}
              data-testid="input-video-thumbnail"
            />
            <Button
              variant="outline"
              onClick={() => videoThumbnailRef.current?.click()}
              className="w-full border-dashed border-[#F68D3D] text-[#F68D3D] hover:bg-[#F68D3D]/10"
              data-testid="button-upload-video-thumbnail"
            >
              <Upload size={16} className="mr-2" />
              {data.videoThumbnailUrl ? "Alterar Thumbnail" : "Enviar Thumbnail"}
            </Button>
            {data.videoThumbnailUrl && (
              <div className="mt-2 p-2 bg-[#1a1817] rounded">
                <img src={data.videoThumbnailUrl} alt="Video Thumbnail" className="w-full h-20 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Video File */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Arquivo de Vídeo (MP4)</Label>
            <input
              type="file"
              ref={videoRef}
              accept="video/mp4"
              className="hidden"
              onChange={handleVideoUpload}
              data-testid="input-video-file"
            />
            <Button
              variant="outline"
              onClick={() => videoRef.current?.click()}
              className="w-full border-dashed border-[#F68D3D] text-[#F68D3D] hover:bg-[#F68D3D]/10"
              data-testid="button-upload-video"
            >
              <Upload size={16} className="mr-2" />
              {data.videoUrl ? "Alterar Vídeo" : "Enviar Vídeo (MP4)"}
            </Button>
            {data.videoUrl && (
              <p className="text-[#F68D3D] text-sm">✓ Vídeo carregado</p>
            )}
          </div>

          {/* Video Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link do Vídeo (ao clicar)</Label>
            <Input
              value={data.videoLink}
              onChange={(e) => onChange({ ...data, videoLink: e.target.value })}
              placeholder="https://privacy.com.br/..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-video-link"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-[#3d3a39]" />

      {/* SECTION: Final Info */}
      <Card className="bg-[#2d2a29] border-[#3d3a39]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F4EEE5] text-lg">Seção Final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Final Title 1 - Line 1 */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Título 1 - Linha 1 (bege)</Label>
            <Input
              value={data.finalTitle1Line1}
              onChange={(e) => onChange({ ...data, finalTitle1Line1: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-title1-line1"
            />
          </div>

          {/* Final Title 1 - Line 2 */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Título 1 - Linha 2 (preto)</Label>
            <Input
              value={data.finalTitle1Line2}
              onChange={(e) => onChange({ ...data, finalTitle1Line2: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-title1-line2"
            />
          </div>

          {/* Final Button 1 */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Texto Botão "Quero Assinar"</Label>
            <Input
              value={data.finalButton1Text}
              onChange={(e) => onChange({ ...data, finalButton1Text: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-button1"
            />
          </div>

          {/* Final Button 1 Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link Botão "Quero Assinar"</Label>
            <Input
              value={data.finalButton1Link}
              onChange={(e) => onChange({ ...data, finalButton1Link: e.target.value })}
              placeholder="https://privacy.com.br/..."
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-button1-link"
            />
          </div>

          {/* Final Title 2 */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Título 2</Label>
            <Input
              value={data.finalTitle2}
              onChange={(e) => onChange({ ...data, finalTitle2: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-title2"
            />
          </div>

          {/* Final Subtitle */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Subtítulo</Label>
            <Textarea
              value={data.finalSubtitle}
              onChange={(e) => onChange({ ...data, finalSubtitle: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5] resize-none"
              rows={3}
              data-testid="input-final-subtitle"
            />
          </div>

          {/* Final Button 2 */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Texto Botão "Criar Conta"</Label>
            <Input
              value={data.finalButton2Text}
              onChange={(e) => onChange({ ...data, finalButton2Text: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-button2"
            />
          </div>

          {/* Final Button 2 Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link Botão "Criar Conta"</Label>
            <Input
              value={data.finalButton2Link}
              onChange={(e) => onChange({ ...data, finalButton2Link: e.target.value })}
              placeholder="https://privacy.com.br/auth?route=sign-up"
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-button2-link"
            />
          </div>

          {/* Final Login Text */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Texto "Fazer Login"</Label>
            <Input
              value={data.finalLoginText}
              onChange={(e) => onChange({ ...data, finalLoginText: e.target.value })}
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-login"
            />
          </div>

          {/* Final Login Link */}
          <div className="space-y-2">
            <Label className="text-[#F4EEE5]">Link "Fazer Login"</Label>
            <Input
              value={data.finalLoginLink}
              onChange={(e) => onChange({ ...data, finalLoginLink: e.target.value })}
              placeholder="https://privacy.com.br/auth?route=sign-in"
              className="bg-[#1a1817] border-[#3d3a39] text-[#F4EEE5]"
              data-testid="input-final-login-link"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
