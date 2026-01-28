import type { Express } from "express";
import { createServer, type Server } from "http";
import archiver from "archiver";
import { generateZipRequestSchema } from "@shared/schema";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // POST /api/generate - Generate landing page ZIP
  app.post("/api/generate", async (req, res) => {
    try {
      // Validate request body with Zod
      const validationResult = generateZipRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid landing data",
          details: validationResult.error.errors 
        });
      }

      const { landingData } = validationResult.data;

      // Generate HTML content
      const htmlContent = generateLandingPageHTML(landingData);

      // Create ZIP archive
      const archive = archiver("zip", { zlib: { level: 9 } });

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=landing-page.zip");

      archive.pipe(res);

      // Add index.html
      archive.append(htmlContent, { name: "index.html" });

      // Process and add images
      if (landingData.logoUrl && landingData.logoUrl.startsWith("data:")) {
        const logoData = extractBase64Data(landingData.logoUrl);
        const logoExt = getExtensionFromBase64(landingData.logoUrl);
        archive.append(Buffer.from(logoData, "base64"), { name: `assets/logo.${logoExt}` });
      }

      if (landingData.bannerDesktopUrl && landingData.bannerDesktopUrl.startsWith("data:")) {
        const data = extractBase64Data(landingData.bannerDesktopUrl);
        const ext = getExtensionFromBase64(landingData.bannerDesktopUrl);
        archive.append(Buffer.from(data, "base64"), { name: `assets/banner-desktop.${ext}` });
      }

      if (landingData.bannerMobileUrl && landingData.bannerMobileUrl.startsWith("data:")) {
        const data = extractBase64Data(landingData.bannerMobileUrl);
        const ext = getExtensionFromBase64(landingData.bannerMobileUrl);
        archive.append(Buffer.from(data, "base64"), { name: `assets/banner-mobile.${ext}` });
      }

      if (landingData.videoThumbnailUrl && landingData.videoThumbnailUrl.startsWith("data:")) {
        const data = extractBase64Data(landingData.videoThumbnailUrl);
        const ext = getExtensionFromBase64(landingData.videoThumbnailUrl);
        archive.append(Buffer.from(data, "base64"), { name: `assets/video-thumbnail.${ext}` });
      }

      if (landingData.videoUrl && landingData.videoUrl.startsWith("data:")) {
        const data = extractBase64Data(landingData.videoUrl);
        archive.append(Buffer.from(data, "base64"), { name: `assets/video.mp4` });
      }

      // Process thumbs
      if (landingData.thumbs && Array.isArray(landingData.thumbs)) {
        landingData.thumbs.forEach((thumb: any, index: number) => {
          if (thumb.imageUrl && thumb.imageUrl.startsWith("data:")) {
            const data = extractBase64Data(thumb.imageUrl);
            const ext = getExtensionFromBase64(thumb.imageUrl);
            archive.append(Buffer.from(data, "base64"), { name: `assets/thumb-${index + 1}.${ext}` });
          }
        });
      }

      // Add Privacy logo PNG and favicon to the ZIP
      const privacyLogoPath = resolve(process.cwd(), "attached_assets/logo_privacy_1769595369321.png");
      const faviconPath = resolve(process.cwd(), "attached_assets/icon_privacy_1769595313868.png");
      
      if (existsSync(privacyLogoPath)) {
        archive.append(readFileSync(privacyLogoPath), { name: "assets/privacy-logo.png" });
      }
      
      if (existsSync(faviconPath)) {
        archive.append(readFileSync(faviconPath), { name: "assets/favicon.png" });
      }

      await archive.finalize();
    } catch (error) {
      console.error("Error generating landing page:", error);
      res.status(500).json({ error: "Failed to generate landing page" });
    }
  });

  return httpServer;
}

function extractBase64Data(dataUrl: string): string {
  const matches = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
  return matches ? matches[1] : "";
}

function getExtensionFromBase64(dataUrl: string): string {
  const matches = dataUrl.match(/^data:image\/([^;]+);/);
  if (matches) {
    const mimeType = matches[1];
    if (mimeType === "svg+xml") return "svg";
    if (mimeType === "jpeg") return "jpg";
    return mimeType;
  }
  return "png";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function generateLandingPageHTML(data: any): string {
  const logoPath = data.logoUrl ? "assets/logo." + getExtensionFromBase64(data.logoUrl) : "";
  const bannerDesktopPath = data.bannerDesktopUrl ? "assets/banner-desktop." + getExtensionFromBase64(data.bannerDesktopUrl) : "";
  const bannerMobilePath = data.bannerMobileUrl ? "assets/banner-mobile." + getExtensionFromBase64(data.bannerMobileUrl) : "";
  const videoThumbnailPath = data.videoThumbnailUrl ? "assets/video-thumbnail." + getExtensionFromBase64(data.videoThumbnailUrl) : "";
  const videoPath = data.videoUrl ? "assets/video.mp4" : "";

  const thumbsHTML = data.thumbs.map((thumb: any, index: number) => {
    const thumbPath = thumb.imageUrl ? `assets/thumb-${index + 1}.${getExtensionFromBase64(thumb.imageUrl)}` : "";
    return `
      <div class="thumb-card">
        <div class="thumb-photo-container">
          ${thumbPath ? `<img src="${thumbPath}" alt="Foto ${index + 1}" class="thumb-photo">` : '<div class="thumb-placeholder">Foto</div>'}
          <div class="thumb-gradient"></div>
          <a href="${escapeHtml(data.thumbsCardButtonLink || 'https://privacy.com.br/')}" class="thumb-button">
            <span>${escapeHtml(data.thumbsCardButtonText || 'ver agora')}</span>
          </a>
        </div>
        <div class="thumb-legend">
          <p>${escapeHtml(thumb.legend).replace(/\n/g, "<br>")}</p>
        </div>
      </div>
    `;
  }).join("");

  // Escape SEO fields for HTML meta tags
  const seoDescription = escapeHtml(data.seoDescription || "");
  const seoKeywords = escapeHtml(data.seoKeywords || "");
  
  // Parse modal title for HTML (escape each line)
  const modalTitleLines = (data.modalTitle || "BEM-VINDO(A)\nAO MEU SITE, AMOR!!").split("\n");
  const modalTitleHTML = modalTitleLines.map((line: string) => `<span class="block">${escapeHtml(line)}</span>`).join("");
  
  // Parse modal description for HTML (escape first, then add strong tags)
  const escapedModalDescription = escapeHtml(data.modalDescription || "Antes de entrar, só um detalhe importante. Você precisa ter 18 anos ou mais para acessar esse conteúdo. Confirme essa informação abaixo.");
  const modalDescriptionHTML = escapedModalDescription.replace(/18 anos ou mais/g, "<strong>18 anos ou mais</strong>");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="robots" content="index, follow" />
  <meta name="language" content="Portuguese" />
  <meta name="description" content="${seoDescription}" />
  <meta name="keywords" content="${seoKeywords}" />
  <title>Landing Page</title>
  <link rel="icon" type="image/png" href="assets/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background-color: #F4EEE5;
      color: #23201F;
    }

    /* Modal 18+ - 460x508px, border-radius 40px */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      width: 460px;
      height: 508px;
      background: #F4EEE5;
      border-radius: 40px;
      padding: 43px 25px 42px;
      text-align: center;
    }

    .modal-logo {
      height: 62px;
      margin-bottom: 50px;
      object-fit: contain;
      filter: brightness(0);
    }

    .modal-title {
      font-size: 24px;
      font-weight: 600;
      color: #23201F;
      letter-spacing: -0.72px;
      line-height: 1.1;
      margin-bottom: 16px;
      text-transform: uppercase;
    }

    .modal-title .block {
      display: block;
    }

    .modal-text {
      font-size: 14px;
      font-weight: 500;
      color: #23201F;
      letter-spacing: -0.42px;
      line-height: 1.24;
      text-transform: lowercase;
      margin-bottom: 33px;
    }

    .modal-text strong {
      font-weight: 700;
    }

    .modal-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 33px;
    }

    .modal-btn {
      width: 130px;
      height: 44px;
      border-radius: 21.901px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.54px;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
    }

    .modal-btn-access:hover {
      transform: scale(1.05);
      background: #23201F;
      color: #F4EEE5;
    }

    .modal-btn-access {
      background: #F68D3D;
      color: #F4EEE5;
    }

    .modal-btn-exit {
      background: transparent;
      border: 1px solid #F68D3D;
      color: #F68D3D;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-btn-exit:hover {
      transform: scale(1.05);
      background: #F68D3D;
      color: #F4EEE5;
    }

    .modal-terms {
      font-size: 12px;
      font-weight: 500;
      color: #A0988C;
      letter-spacing: -0.36px;
      line-height: 1.24;
    }

    .modal-terms a {
      color: #F68D3D;
      text-decoration: none;
    }

    .page-content {
      transition: filter 0.3s ease;
    }

    .page-content.blurred {
      filter: blur(5px);
      pointer-events: none;
    }

    /* Hero Section - height: 953px desktop */
    .hero {
      position: relative;
      width: 100%;
      height: 953px;
      overflow: hidden;
      background: #23201F;
    }

    .hero-banner {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }

    /* Gradiente EXATO do Figma: linear-gradient(to bottom, rgba(246, 141, 61, 0) 7.555%, #F68D3D 111.49%) */
    .hero-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(246, 141, 61, 0) 7.555%, #F68D3D 111.49%);
      pointer-events: none;
    }

    .hero-header {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 45px 63px 0 181px;
    }

    .hero-logo {
      height: 55.828px;
      width: 130px;
      object-fit: contain;
    }

    .hero-subscribe-btn {
      min-width: 140px;
      height: 52px;
      background: #F68D3D;
      color: #23201F;
      border-radius: 35.753px;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.66px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      white-space: nowrap;
      transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
    }

    .hero-subscribe-btn:hover {
      transform: scale(1.05);
      background: #23201F;
      color: #F4EEE5;
    }

    .hero-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: calc(953px - 150px);
      padding-bottom: 60px;
    }

    .hero-title {
      font-size: 108.31px;
      font-weight: 600;
      color: #F4EEE5;
      letter-spacing: -8.6648px;
      line-height: 0.84;
      text-transform: lowercase;
    }

    .hero-subtitle {
      font-size: 50.173px;
      font-weight: 600;
      color: #F4EEE5;
      letter-spacing: -2.5086px;
      line-height: 0.84;
      text-transform: lowercase;
      margin-top: 16px;
      white-space: pre-line;
    }

    .hero-arrow {
      width: 36px;
      margin: 32px 0 18px;
    }

    .hero-arrow.bounce {
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }

    .hero-cta {
      min-width: 188px;
      height: 62px;
      background: #23201F;
      color: #F4EEE5;
      border-radius: 31px;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.84px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      white-space: nowrap;
      transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
    }

    .hero-cta:hover {
      transform: scale(1.05);
      background: #F4EEE5;
      color: #23201F;
    }

    .hero-cta-inner {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Thumbs Section */
    .thumbs {
      width: 100%;
      background: #F4EEE5;
      padding: 82px 0 54px;
    }

    .thumbs-title {
      text-align: center;
      font-size: 70px;
      font-weight: 600;
      color: #23201F;
      letter-spacing: -3.5px;
      line-height: 0.84;
      text-transform: lowercase;
      margin-bottom: 76px;
      white-space: pre-line;
    }

    .thumbs-title span {
      color: #F68D3D;
    }

    .thumbs-container {
      overflow-x: auto;
      overflow-y: visible;
      padding: 20px 40px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .thumbs-container::-webkit-scrollbar {
      display: none;
    }

    .thumbs-inner {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: nowrap;
      min-width: min-content;
    }

    /* Thumb card: 328x526px */
    .thumb-card {
      width: 328px;
      height: 526px;
      flex-shrink: 0;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .thumb-card:hover {
      transform: scale(1.02);
    }

    .thumb-card:hover .thumb-photo {
      transform: scale(1.05);
    }

    .thumb-photo-container {
      position: relative;
      width: 328px;
      height: 407px;
      border-radius: 40px 40px 0 0;
      overflow: hidden;
    }

    .thumb-photo {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .thumb-placeholder {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }

    /* Gradiente normal: linear-gradient(to bottom, rgba(35, 32, 31, 0) 9.728%, #23201F 110.89%) */
    .thumb-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 250px;
      background: linear-gradient(to bottom, rgba(35, 32, 31, 0) 9.728%, #23201F 110.89%);
      pointer-events: none;
      transition: background 0.4s ease;
    }

    .thumb-button {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      width: 146.695px;
      height: 48.378px;
      background: #F4EEE5;
      border-radius: 24.189px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      color: #23201F;
      letter-spacing: -0.6px;
      opacity: 0;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    /* Hover effects: foto scale(1.1), gradiente preto→laranja, legenda branca→laranja */
    .thumb-card:hover .thumb-photo {
      transform: scale(1.1);
    }

    .thumb-card:hover .thumb-gradient {
      background: linear-gradient(to bottom, rgba(246, 141, 61, 0) 9.728%, #F68D3D 110.89%);
    }

    .thumb-card:hover .thumb-button {
      opacity: 1;
    }

    .thumb-button:hover {
      background: #23201F;
      color: #F4EEE5;
      transform: translateX(-50%) scale(1.05);
    }

    .thumb-card:hover .thumb-legend {
      background: #F68D3D;
    }

    .thumb-legend {
      width: 328px;
      height: 119px;
      background: #FFFFFF;
      border-radius: 0 0 40px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 29px;
      transition: background 0.4s ease;
    }

    .thumb-legend p {
      font-size: 14px;
      font-weight: 600;
      color: #23201F;
      letter-spacing: -0.42px;
      line-height: 1.24;
      text-transform: lowercase;
      text-align: center;
    }

    .thumbs-cta {
      display: flex;
      justify-content: center;
      margin-top: 70px;
    }

    .thumbs-btn {
      min-width: 680px;
      height: 100px;
      background: #F68D3D;
      color: #23201F;
      border-radius: 50px;
      font-size: 41.189px;
      font-weight: 600;
      letter-spacing: -1.2357px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 40px;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .thumbs-btn:hover {
      transform: scale(1.05);
      background: #23201F;
      color: #F4EEE5;
    }

    /* Video Section - 444x555px desktop */
    .video-section {
      width: 100%;
      position: relative;
    }

    .video-section-bg {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background: #F68D3D;
      top: 277.5px;
    }

    .video-section-content {
      position: relative;
      display: flex;
      justify-content: center;
      padding: 64px 0;
    }

    .video-container {
      position: relative;
      width: 444px;
      height: 555px;
      border-radius: 40px;
      overflow: hidden;
      cursor: pointer;
      z-index: 10;
    }

    .video-thumbnail {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .video-placeholder {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }

    /* Gradiente video normal: linear-gradient(to bottom, rgba(35, 32, 31, 0) 9.728%, #23201F 110.17%) */
    .video-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 342px;
      background: linear-gradient(to bottom, rgba(35, 32, 31, 0) 9.728%, #23201F 110.17%);
      pointer-events: none;
      transition: background 0.4s ease;
    }

    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 74px;
      height: 74px;
      transition: all 0.4s ease;
    }

    .video-hover-text {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 50px;
      font-weight: 600;
      color: #F4EEE5;
      letter-spacing: -1.5px;
      text-transform: lowercase;
      opacity: 0;
      transition: opacity 0.4s ease;
      white-space: nowrap;
      line-height: 1;
    }

    /* Video hover: thumbnail scale, play icon aumenta (scale 1.27), texto aparece */
    .video-container:hover .video-thumbnail {
      transform: scale(1.1);
    }

    .video-container:hover .video-gradient {
      background: linear-gradient(to bottom, rgba(246, 141, 61, 0) 9.728%, #F68D3D 110.17%);
    }

    .video-container:hover .play-icon {
      transform: translate(-50%, -50%) scale(1.27);
    }

    .video-container:hover .video-hover-text {
      opacity: 1;
    }

    .video-player {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Final Info Section - fundo laranja #F68D3D */
    .final-info {
      width: 100%;
      background: #F68D3D;
      padding: 100px 0;
      text-align: center;
    }

    .final-title-1 {
      font-size: 70px;
      font-weight: 600;
      letter-spacing: -3.5px;
      line-height: 0.84;
      text-transform: lowercase;
      margin-bottom: 40px;
    }

    .final-title-1 .beige {
      color: #F4EEE5;
    }

    .final-title-1 .black {
      color: #23201F;
    }

    .final-btn-1 {
      min-width: 444px;
      height: 100px;
      background: #F4EEE5;
      color: #23201F;
      border-radius: 50px;
      font-size: 41.189px;
      font-weight: 600;
      letter-spacing: -1.2357px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 100px;
      padding: 0 40px;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .final-btn-1:hover {
      transform: scale(1.05);
      background: #23201F;
      color: #F4EEE5;
    }

    .final-title-2 {
      font-size: 70px;
      font-weight: 700;
      color: #F4EEE5;
      letter-spacing: -2.1px;
      line-height: 0.98;
      text-transform: lowercase;
      margin-bottom: 24px;
    }

    .final-subtitle {
      font-size: 30px;
      font-weight: 500;
      color: #F4EEE5;
      letter-spacing: -0.9px;
      line-height: 1.24;
      text-transform: lowercase;
      margin-bottom: 24px;
      white-space: pre-line;
    }

    .final-btn-2 {
      min-width: 680px;
      height: 100px;
      background: #23201F;
      color: #F4EEE5;
      border-radius: 50px;
      font-size: 41.189px;
      font-weight: 600;
      letter-spacing: -1.2357px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      padding: 0 40px;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .final-btn-2:hover {
      transform: scale(1.05);
      background: #F4EEE5;
      color: #23201F;
    }

    .final-login {
      font-size: 23.047px;
      font-weight: 500;
      color: #23201F;
      letter-spacing: -0.6914px;
      text-transform: lowercase;
    }

    .final-login a {
      color: #23201F;
      text-decoration: underline;
      transition: color 0.3s ease;
    }

    .final-login a:hover {
      color: #F4EEE5;
    }

    /* Footer */
    .footer {
      width: 100%;
      background: #23201F;
      padding: 46px 63px 38px;
    }

    .footer-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .footer-logo {
      height: 36px;
      width: auto;
    }

    .footer-links {
      display: flex;
      gap: 64px;
    }

    .footer-column h3 {
      font-size: 16px;
      font-weight: 500;
      color: #F68D3D;
      margin-bottom: 16px;
    }

    .footer-column ul {
      list-style: none;
    }

    .footer-column li {
      margin-bottom: 8px;
    }

    .footer-column a {
      font-size: 14px;
      font-weight: 500;
      color: #F4EEE5;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-column a:hover {
      color: #F68D3D;
    }

    .footer-social {
      display: flex;
      gap: 16px;
    }

    .footer-social a {
      color: #F4EEE5;
      transition: all 0.3s ease;
    }

    .footer-social a:hover {
      color: #F68D3D;
      transform: scale(1.1);
    }

    .footer-divider {
      width: 100%;
      height: 1px;
      background: rgba(154, 154, 154, 0.2);
      margin-bottom: 28px;
    }

    .footer-bottom {
      text-align: center;
    }

    .footer-copyright {
      font-size: 16px;
      font-weight: 400;
      color: rgba(154, 154, 154, 0.42);
    }

    .footer-address {
      font-size: 12px;
      font-weight: 400;
      color: rgba(154, 154, 154, 0.42);
      margin-top: 8px;
    }

    /* Scroll Reveal Animation */
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Mobile Styles - 394px */
    @media (max-width: 768px) {
      .modal-content {
        width: 90%;
        max-width: 460px;
        height: auto;
        min-height: 508px;
      }

      .hero {
        height: 859px;
      }

      .hero-header {
        padding: 46px 0 0;
        justify-content: center;
      }

      .hero-logo {
        height: 68px;
        width: 158.344px;
      }

      .hero-subscribe-btn {
        display: none;
      }

      .hero-content {
        height: calc(859px - 150px);
      }

      .hero-title {
        font-size: 58.31px;
        letter-spacing: -4.6648px;
      }

      .hero-subtitle {
        font-size: 24px;
        letter-spacing: -1.2px;
      }

      .hero-arrow {
        width: 26px;
      }

      .hero-cta {
        min-width: 160px;
        height: 52px;
        font-size: 22px;
      }

      .thumbs {
        padding: 40px 0 24px;
      }

      .thumbs-title {
        font-size: 36px;
        letter-spacing: -1.8px;
        padding: 0 28px;
        line-height: 0.9;
        margin-bottom: 24px;
      }

      .thumbs-container {
        padding: 20px 28px;
      }

      .thumbs-btn {
        min-width: 280px;
        height: 44px;
        font-size: 18px;
        border-radius: 22px;
      }

      .thumbs-cta {
        margin-top: 24px;
      }

      .video-hover-text {
        font-size: 32px;
        bottom: 60px;
      }

      .video-section {
        padding: 24px 16.6px;
      }

      .video-container {
        width: 360.8px;
        height: 451px;
      }

      .play-icon {
        width: 76.386px;
        height: 76.386px;
      }

      .final-info {
        padding: 40px 16px;
      }

      .final-title-1 {
        font-size: 32px;
        letter-spacing: -1.6px;
        line-height: 0.9;
        margin-bottom: 24px;
      }

      .final-btn-1 {
        min-width: 300px;
        height: 56px;
        font-size: 24px;
        border-radius: 28px;
        margin-bottom: 32px;
      }

      .final-title-2 {
        font-size: 32px;
        letter-spacing: -1.6px;
        margin-bottom: 16px;
      }

      .final-subtitle {
        font-size: 14px;
        letter-spacing: -0.42px;
        color: #23201F;
        margin-bottom: 20px;
      }

      .final-btn-2 {
        min-width: 300px;
        height: 48px;
        font-size: 18px;
        border-radius: 24px;
      }

      .final-login {
        font-size: 14px;
      }

      .footer {
        padding: 46px 34px 38px;
      }

      .footer-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 32px;
      }

      .footer-logo {
        height: 48px;
      }

      .footer-links {
        flex-direction: column;
        gap: 24px;
        text-align: left;
      }

      .footer-social {
        justify-content: flex-start;
      }
    }
  </style>
</head>
<body>
  <!-- Modal 18+ -->
  <div class="modal-overlay" id="modal18">
    <div class="modal-content">
      ${logoPath ? `<img src="${logoPath}" alt="Logo" class="modal-logo">` : '<div style="height: 62px; margin-bottom: 50px;"></div>'}
      <h2 class="modal-title">${modalTitleHTML}</h2>
      <div class="modal-text">
        ${modalDescriptionHTML}
      </div>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-access" onclick="closeModal()">acessar</button>
        <a href="javascript:void(0)" onclick="exitPage()" class="modal-btn modal-btn-exit">sair</a>
      </div>
      <p class="modal-terms">
        Usamos cookies e tecnologias semelhantes para melhorar sua experiência por aqui, personalizar conteúdos e deixar tudo mais do seu jeito. Ao continuar, você concorda com nossos 
        <a href="https://privacy.com.br/termos">Termos de Uso</a> e 
        <a href="https://privacy.com.br/privacidade">Política de Privacidade</a>.
      </p>
    </div>
  </div>

  <!-- Page Content -->
  <div class="page-content blurred" id="pageContent">
    <!-- Hero Section -->
    <section class="hero">
      ${bannerDesktopPath ? `
        <picture>
          <source media="(max-width: 768px)" srcset="${bannerMobilePath || bannerDesktopPath}">
          <img src="${bannerDesktopPath}" alt="Banner" class="hero-banner">
        </picture>
      ` : '<div class="hero-banner" style="background: linear-gradient(135deg, #666 0%, #333 100%);"></div>'}
      <div class="hero-gradient"></div>
      <header class="hero-header">
        ${logoPath ? `<img src="${logoPath}" alt="Logo" class="hero-logo">` : '<div style="width: 130px; height: 55.828px;"></div>'}
        <a href="${escapeHtml(data.headerButtonLink || 'https://privacy.com.br/')}" class="hero-subscribe-btn">${escapeHtml(data.headerButtonText)}</a>
      </header>
      <div class="hero-content">
        <h1 class="hero-title fade-in">${escapeHtml(data.heroTitle)}</h1>
        <p class="hero-subtitle fade-in">${escapeHtml(data.heroSubtitle)}</p>
        <svg class="hero-arrow fade-in bounce" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="#F4EEE5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <a href="${escapeHtml(data.heroButtonLink || 'https://privacy.com.br/')}" class="hero-cta fade-in">${escapeHtml(data.heroButtonText)}</a>
      </div>
    </section>

    <!-- Thumbs Section -->
    <section class="thumbs">
      <h2 class="thumbs-title fade-in">${escapeHtml(data.thumbsSectionTitle)} <span>${escapeHtml(data.thumbsSectionTitleHighlight)}</span></h2>
      <div class="thumbs-container">
        <div class="thumbs-inner">
          ${thumbsHTML}
        </div>
      </div>
      <div class="thumbs-cta">
        <a href="${escapeHtml(data.thumbsButtonLink || 'https://privacy.com.br/')}" class="thumbs-btn fade-in">
          ${escapeHtml(data.thumbsButtonText)}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </section>

    <!-- Video Section - Background laranja começa no meio do vídeo e vai até footer -->
    <section class="video-section">
      <div class="video-section-bg"></div>
      <div class="video-section-content">
        <div class="video-container" id="videoContainer" onclick="playVideo()">
          ${videoThumbnailPath ? `<img src="${videoThumbnailPath}" alt="Video" class="video-thumbnail" id="videoThumbnail">` : '<div class="video-placeholder">Vídeo</div>'}
          <div class="video-gradient" id="videoGradient"></div>
          <svg class="play-icon" id="playIcon" viewBox="0 0 74 74" fill="none">
            <circle cx="37" cy="37" r="37" fill="white" fill-opacity="0.9"/>
            <path d="M29 24L52 37L29 50V24Z" fill="#23201F"/>
          </svg>
          <span class="video-hover-text" id="videoHoverText">ver o vídeo</span>
          ${videoPath ? `<video class="video-player" id="videoPlayer" src="${videoPath}" muted loop playsinline style="display: none;"></video>` : ''}
        </div>
      </div>
    </section>

    <!-- Final Info Section -->
    <section class="final-info">
      <h2 class="final-title-1 fade-in">
        <span class="beige">${escapeHtml(data.finalTitle1Line1)}</span><br>
        <span class="black">${escapeHtml(data.finalTitle1Line2)}</span>
      </h2>
      <a href="${escapeHtml(data.finalButton1Link || 'https://privacy.com.br/')}" class="final-btn-1 fade-in">
        ${escapeHtml(data.finalButton1Text)}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <h2 class="final-title-2 fade-in">${escapeHtml(data.finalTitle2)}</h2>
      <p class="final-subtitle fade-in">${escapeHtml(data.finalSubtitle)}</p>
      <a href="${escapeHtml(data.finalButton2Link || 'https://privacy.com.br/auth?route=sign-up')}" class="final-btn-2 fade-in">${escapeHtml(data.finalButton2Text)}</a>
      <p class="final-login fade-in">Já tem uma conta? <a href="${escapeHtml(data.finalLoginLink || 'https://privacy.com.br/auth?route=sign-in')}">${escapeHtml(data.finalLoginText || 'Fazer login')}</a></p>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-top">
        <img class="footer-logo" src="assets/privacy-logo.png" alt="Privacy" />
        <div class="footer-links">
          <div class="footer-column">
            <h3>Institucional</h3>
            <ul>
              <li><a href="https://privacy.com.br/About" target="_blank" rel="noopener noreferrer">Sobre</a></li>
              <li><a href="https://privacy.com.br/Contato" target="_blank" rel="noopener noreferrer">Contato</a></li>
              <li><a href="https://help.privacy.com.br/" target="_blank" rel="noopener noreferrer">Ajuda & FAQ</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Criador</h3>
            <ul>
              <li><a href="https://blog.privacy.com.br/" target="_blank" rel="noopener noreferrer">Blog</a></li>
              <li><a href="https://privacy.com.br/howitworks" target="_blank" rel="noopener noreferrer">Como funciona</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Informações legais</h3>
            <ul>
              <li><a href="https://privacy.com.br/privacidade" target="_blank" rel="noopener noreferrer">Privacidade</a></li>
              <li><a href="https://privacy.com.br/termos" target="_blank" rel="noopener noreferrer">Termos e políticas</a></li>
              <li><a href="https://privacy.com.br/centroTransparencia" target="_blank" rel="noopener noreferrer">Centro de Segurança e Transparência</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-social">
          <a href="https://www.instagram.com/sejaprivacy" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/channel/UCyFUBfYINgM8jAVTPAXIk0A" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="https://x.com/sejaprivacy" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@privacy.brasil" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <p class="footer-copyright">©2026 Privacy</p>
        <p class="footer-address">ORANGE SEA CORP, 80 main street, Po BOX 3200, Road Town, Tortola VG1110, Ilhas Virgens Britânicas<br>QMS520 TECHNOLOGY INTERNATIONAL, LDA - Rua Castilho 213, 7º andar, Avenidas Novas, 1070-051 Lisboa, Portugal.</p>
      </div>
    </footer>
  </div>

  <script>
    function closeModal() {
      document.getElementById('modal18').style.display = 'none';
      document.getElementById('pageContent').classList.remove('blurred');
    }

    function exitPage() {
      window.location.href = 'https://google.com';
    }

    function playVideo() {
      const video = document.getElementById('videoPlayer');
      const thumbnail = document.getElementById('videoThumbnail');
      const gradient = document.getElementById('videoGradient');
      const playIcon = document.getElementById('playIcon');
      const hoverText = document.getElementById('videoHoverText');
      
      if (video) {
        video.style.display = 'block';
        video.play();
        if (thumbnail) thumbnail.style.display = 'none';
        if (gradient) gradient.style.display = 'none';
        if (playIcon) playIcon.style.display = 'none';
        if (hoverText) hoverText.style.display = 'none';
      }
    }

    // Scroll Reveal - IntersectionObserver com threshold: 0.1
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  </script>
</body>
</html>`;
}
