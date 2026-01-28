import { z } from "zod";

// Schema para os dados da landing page
export const thumbSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  legend: z.string(),
});

export const landingPageDataSchema = z.object({
  // SEO
  seoTitle: z.string().default("Landing Page"),
  seoDescription: z.string().default("Privacy é a plataforma de conteúdo exclusivo do Brasil. Crie seu perfil para monetizar fotos e vídeos ou assine para ter acesso a conteúdo oculto!!!"),
  seoKeywords: z.string().default("privacy, onlyfans, privacidade, onlyfans, nudes, rede social paga, ganhar dinheiro, renda extra, privacy nudes, vender privacy, ganhar na privacy, cadastrar privacy, conta privacy, Vale a pena privacy, Como ganhar na privacy, onlyfans privacy, onlyfans brasileiro, privacy nudy, nudes de famosas"),
  
  // Modal 18+
  modalTitle: z.string().default("BEM-VINDO(A)\nAO MEU SITE, AMOR!!"),
  modalDescription: z.string().default("Antes de entrar, só um detalhe importante. Você precisa ter 18 anos ou mais para acessar esse conteúdo. Confirme essa informação abaixo."),
  
  // Geral
  logoUrl: z.string().optional(),
  
  // Hero
  bannerDesktopUrl: z.string().optional(),
  bannerMobileUrl: z.string().optional(),
  heroTitle: z.string().default("conteúdo exclusivo"),
  heroSubtitle: z.string().default("o que você\nprocura está aqui"),
  heroButtonText: z.string().default("ver agora"),
  heroButtonLink: z.string().default("https://privacy.com.br/"),
  headerButtonText: z.string().default("assine já"),
  headerButtonLink: z.string().default("https://privacy.com.br/"),
  
  // Thumbs (3-5 fotos)
  thumbsSectionTitle: z.string().default("conteúdos exclusivos\nem um"),
  thumbsSectionTitleHighlight: z.string().default("único lugar."),
  thumbs: z.array(thumbSchema).min(3).max(5).default([
    { id: "1", imageUrl: "", legend: "een the industry's standard dummy\ntext ever since the 1500s, when an unknown printer took a galley\nof type and scrambled" },
    { id: "2", imageUrl: "", legend: "een the industry's standard dummy\ntext ever since the 1500s, when an unknown printer took a galley\nof type and scrambled" },
    { id: "3", imageUrl: "", legend: "een the industry's standard dummy\ntext ever since the 1500s, when an unknown printer took a galley\nof type and scrambled" },
  ]),
  thumbsCardButtonText: z.string().default("ver agora"),
  thumbsCardButtonLink: z.string().default("https://privacy.com.br/"),
  thumbsButtonText: z.string().default("assine e veja muito mais"),
  thumbsButtonLink: z.string().default("https://privacy.com.br/"),
  
  // Vídeo
  videoThumbnailUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  videoLink: z.string().default("https://privacy.com.br/"),
  
  // Infos Finais
  finalTitle1Line1: z.string().default("quer aproveitar tudo isso"),
  finalTitle1Line2: z.string().default("e muitoooo mais?"),
  finalButton1Text: z.string().default("quero assinar"),
  finalButton1Link: z.string().default("https://privacy.com.br/"),
  finalTitle2: z.string().default("seu acesso começa aqui"),
  finalSubtitle: z.string().default("crie sua conta grátis e explore\nconteúdos exclusivos\nno seu ritmo."),
  finalButton2Text: z.string().default("criar conta grátis"),
  finalButton2Link: z.string().default("https://privacy.com.br/auth?route=sign-up"),
  finalLoginText: z.string().default("fazer login"),
  finalLoginLink: z.string().default("https://privacy.com.br/auth?route=sign-in"),
});

export type Thumb = z.infer<typeof thumbSchema>;
export type LandingPageData = z.infer<typeof landingPageDataSchema>;

// Schema para upload de arquivos
export const uploadResponseSchema = z.object({
  success: z.boolean(),
  url: z.string().optional(),
  error: z.string().optional(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;

// Schema para geração do ZIP
export const generateZipRequestSchema = z.object({
  landingData: landingPageDataSchema,
});

export type GenerateZipRequest = z.infer<typeof generateZipRequestSchema>;

// Default data for initialization
export const defaultLandingPageData: LandingPageData = {
  // SEO
  seoTitle: "Landing Page",
  seoDescription: "Privacy é a plataforma de conteúdo exclusivo do Brasil. Crie seu perfil para monetizar fotos e vídeos ou assine para ter acesso a conteúdo oculto!!!",
  seoKeywords: "privacy, onlyfans, privacidade, onlyfans, nudes, rede social paga, ganhar dinheiro, renda extra, privacy nudes, vender privacy, ganhar na privacy, cadastrar privacy, conta privacy, Vale a pena privacy, Como ganhar na privacy, onlyfans privacy, onlyfans brasileiro, privacy nudy, nudes de famosas",
  
  // Modal 18+
  modalTitle: "BEM-VINDO(A)\nAO MEU SITE, AMOR!!",
  modalDescription: "Antes de entrar, só um detalhe importante. Você precisa ter 18 anos ou mais para acessar esse conteúdo. Confirme essa informação abaixo.",
  
  // Geral
  logoUrl: "",
  
  // Hero
  bannerDesktopUrl: "",
  bannerMobileUrl: "",
  heroTitle: "conteúdo exclusivo",
  heroSubtitle: "o que você\nprocura está aqui",
  heroButtonText: "ver agora",
  heroButtonLink: "https://privacy.com.br/",
  headerButtonText: "assine já",
  headerButtonLink: "https://privacy.com.br/",
  
  // Thumbs
  thumbsSectionTitle: "conteúdos exclusivos\nem um",
  thumbsSectionTitleHighlight: "único lugar.",
  thumbs: [
    { id: "1", imageUrl: "", legend: "een the industry's standard dummy\ntext ever since the 1500s, when an unknown printer took a galley\nof type and scrambled" },
    { id: "2", imageUrl: "", legend: "een the industry's standard dummy\ntext ever since the 1500s, when an unknown printer took a galley\nof type and scrambled" },
    { id: "3", imageUrl: "", legend: "een the industry's standard dummy\ntext ever since the 1500s, when an unknown printer took a galley\nof type and scrambled" },
  ],
  thumbsCardButtonText: "ver agora",
  thumbsCardButtonLink: "https://privacy.com.br/",
  thumbsButtonText: "assine e veja muito mais",
  thumbsButtonLink: "https://privacy.com.br/",
  
  // Video
  videoThumbnailUrl: "",
  videoUrl: "",
  videoLink: "https://privacy.com.br/",
  
  // Final Info
  finalTitle1Line1: "quer aproveitar tudo isso",
  finalTitle1Line2: "e muitoooo mais?",
  finalButton1Text: "quero assinar",
  finalButton1Link: "https://privacy.com.br/",
  finalTitle2: "seu acesso começa aqui",
  finalSubtitle: "crie sua conta grátis e explore\nconteúdos exclusivos\nno seu ritmo.",
  finalButton2Text: "criar conta grátis",
  finalButton2Link: "https://privacy.com.br/auth?route=sign-up",
  finalLoginText: "fazer login",
  finalLoginLink: "https://privacy.com.br/auth?route=sign-in",
};

// User types (kept for compatibility with storage interface)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}
