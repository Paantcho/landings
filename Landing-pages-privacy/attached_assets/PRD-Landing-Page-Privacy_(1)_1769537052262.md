# PRD - Gerador de Landing Pages para Criadoras Privacy

## 1. Visão Geral do Projeto

### 1.1 Objetivo
Criar um **gerador visual de landing pages** para criadoras de conteúdo adulto da plataforma Privacy. O sistema deve permitir que um usuário não técnico crie landing pages personalizadas de forma rápida, apenas substituindo textos, imagens e vídeos, sem necessidade de programação.

### 1.2 Produto Final
Um arquivo HTML (gerador) que:
1. Abre no navegador
2. Permite preencher campos (textos, links)
3. Permite fazer upload de mídias (logo, banners, fotos, vídeo)
4. Mostra prévia ao vivo da landing page
5. Permite alternar entre visualização Desktop e Mobile
6. Gera/baixa uma pasta completa pronta para deploy

### 1.3 Fluxo de Uso
```
1. Usuário abre gerador.html no navegador
2. Preenche campos no painel lateral esquerdo
3. Faz upload das imagens e vídeo
4. Visualiza prévia em tempo real no lado direito
5. Alterna entre Desktop (1512px) e Mobile (394px)
6. Clica em "Baixar Landing Page"
7. Recebe pasta com index.html + assets
8. Faz deploy na Vercel (subdomínio: nome.privacy.com.br)
```

---

## 2. Especificações Visuais (Pixel a Pixel do Figma)

### 2.1 Paleta de Cores (4 cores APENAS)

| Nome | Hex | Uso |
|------|-----|-----|
| Preto | `#23201F` | Textos, botões escuros, fundos escuros, footer |
| Laranja | `#F68D3D` | CTAs, destaques, gradientes, hovers |
| Bege | `#F4EEE5` | Fundo principal da página |
| Branco | `#FFFFFF` | Cards, textos claros |

### 2.2 Tipografia

- **Fonte:** Poppins (Google Fonts)
- **Pesos utilizados:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Estilo geral:** lowercase (minúsculas) em quase todos os textos
- **Letter-spacing:** Negativo (letras mais juntas) - valores específicos por elemento

### 2.3 Estrutura da Landing Page

A LP tem 5 seções + modal de entrada:

```
1. MODAL 18+ (sobrepõe tudo na entrada)
2. HERO (banner principal)
3. THUMBS (grid de fotos com carrossel)
4. VIDEO (preview de vídeo)
5. INFOS FINAIS (CTAs finais)
6. FOOTER (rodapé padrão Privacy)
```

---

## 3. Especificações por Seção

### 3.1 MODAL 18+ (Verificação de Idade)

**Aparece:** Automaticamente ao entrar na página (bloqueia conteúdo)

**Estrutura:**
- Fundo: overlay preto 80% opacidade
- Card central: 460px largura, fundo bege (#F4EEE5), border-radius 40px
- Padding: 43px top, 25px laterais, 42px bottom

**Conteúdo:**
1. Logo da criadora (height: 62px, margin-bottom: 50px)
2. Título: "BEM-VINDO(A) AO MEU SITE, AMOR!!" 
   - font-size: 24px, font-weight: 600, color: #23201F
   - letter-spacing: -0.72px, line-height: 1.1
   - UPPERCASE
3. Texto explicativo:
   - "antes de entrar, só um detalhe importante."
   - "Você precisa ter **18 anos ou mais**" (bold no "18 anos ou mais")
   - "para acessar esse conteúdo."
   - "confirme essa informação abaixo."
   - font-size: 14px, font-weight: 500, color: #23201F
   - letter-spacing: -0.42px, line-height: 1.24, lowercase
4. Dois botões lado a lado (gap: 10px):
   - **"acessar"**: 130x44px, bg: #F68D3D, color: #F4EEE5, border-radius: 21.901px
   - **"sair"**: 130x44px, bg: transparent, border: 1px solid #F68D3D, color: #F68D3D
   - font-size: 18px, font-weight: 600
5. Texto de cookies/termos:
   - font-size: 12px, font-weight: 500, color: #A0988C
   - Links em laranja (#F68D3D)

**Comportamento:**
- Botão "acessar": fecha modal, mostra página
- Botão "sair": redireciona para google.com

---

### 3.2 HERO (Banner Principal)

#### Desktop (1512px)

**Dimensões:** width: 100%, height: 953px

**Estrutura:**
1. **Imagem de fundo:** object-fit: cover, object-position: center top
2. **Gradiente sobreposto:** 
   - linear-gradient(to bottom, rgba(246, 141, 61, 0) 7.555%, #F68D3D 111.49%)
   - Cobre toda a altura
3. **Header:**
   - padding: 45px 63px 0 181px
   - Logo à esquerda: height: 55.828px, width: 130px
   - Botão "assine já" à direita: 140x52px, bg: #F68D3D, border-radius: 35.753px
     - font-size: 22px, font-weight: 600, color: #23201F, letter-spacing: -0.66px
4. **Conteúdo central (flex, centralizado):**
   - Título principal: 
     - font-size: 108.31px, font-weight: 600, color: #F4EEE5
     - letter-spacing: -8.6648px, line-height: 0.84, lowercase
   - Subtítulo:
     - font-size: 50.173px, font-weight: 600, color: #F4EEE5
     - letter-spacing: -2.5086px, line-height: 0.84, lowercase
   - Ícone de mão apontando para baixo: width: 36px, margin-bottom: 18px
   - Botão "ver agora": 188x62px, bg: #23201F, color: #F4EEE5, border-radius: 31px
     - font-size: 28px, font-weight: 600, letter-spacing: -0.84px

#### Mobile (394px)

**Dimensões:** width: 100%, height: 859px

**Diferenças:**
- Header: padding: 46px 0 0, justify-content: center
- Logo: height: 68px, width: 158.344px
- Botão "assine já": **OCULTO** (display: none)
- Título: font-size: 58.31px, letter-spacing: -4.6648px
- Subtítulo: font-size: 24px, letter-spacing: -1.2px
- Ícone mão: width: 26px

---

### 3.3 THUMBS (Seção de Fotos)

#### Desktop (1512px)

**Container:** padding: 82px 0 54px, background: #F4EEE5

**Título:**
- font-size: 70px, font-weight: 600, color: #23201F
- letter-spacing: -3.5px, line-height: 0.84, lowercase
- Última linha em laranja (#F68D3D): usar `<span>`
- margin-bottom: 76px

**Grid de Cards:**
- Container: display: flex, gap: 24px, justify-content: center
- padding: 0 176px
- overflow-x: auto (scroll horizontal suave)
- scrollbar oculta

**Cada Card (thumb-card):**
- Dimensões: 328x526px
- cursor: pointer

**Estrutura do Card:**
1. **Foto container:** 328x407px, border-radius: 40px 40px 0 0, overflow: hidden
   - Imagem: object-fit: cover, 100% width/height
   - Gradiente sobreposto na base: 
     - height: 250px
     - linear-gradient(to bottom, rgba(35, 32, 31, 0) 9.728%, #23201F 110.89%)
   - Botão hover (aparece no hover): 
     - 146.695x48.378px, bg: #F4EEE5, border-radius: 24.189px
     - position: absolute, centered
     - font-size: 20px, font-weight: 600, color: #23201F
     - opacity: 0 → 1 no hover

2. **Legenda:** 328x174px, bg: #FFFFFF, border-radius: 0 0 40px 40px
   - padding: 20px 29px
   - Texto: font-size: 14px, font-weight: 600, color: #23201F
   - letter-spacing: -0.42px, line-height: 1.24, lowercase, text-align: center

**Estados Hover (IMPORTANTE):**
- Foto: transform: scale(1.1), transition: 0.4s
- Gradiente muda para: linear-gradient(to bottom, rgba(246, 141, 61, 0) 9.728%, #F68D3D 110.89%)
- Legenda: background muda para #F68D3D
- Botão "ver agora" aparece (opacity: 1)

**Botão CTA abaixo dos cards:**
- margin-top: 70px, centralizado
- 680x100px, bg: #F68D3D, border-radius: 50px
- font-size: 41.189px, font-weight: 600, color: #23201F
- letter-spacing: -1.2357px
- Inclui ícone de seta (SVG) após o texto

#### Mobile (394px)

**Diferenças:**
- Título: font-size: 50px, letter-spacing: -2.5px, padding: 0 28px
- Container cards: padding: 0 28px, justify-content: flex-start
- Botão CTA: 304x44.706px, font-size: 18.414px, border-radius: 22.353px

---

### 3.4 VIDEO (Seção de Vídeo)

#### Desktop (1512px)

**Container:** padding: 64px 0, background: #F4EEE5, display: flex, justify-content: center

**Video Container:**
- 444x555px, border-radius: 40px, overflow: hidden
- cursor: pointer

**Estrutura:**
1. Thumbnail (imagem): object-fit: cover, 100%
2. Gradiente na base:
   - height: 342px
   - linear-gradient(to bottom, rgba(35, 32, 31, 0) 9.728%, #23201F 110.17%)
3. Ícone Play:
   - position: absolute, centered
   - width/height: 74px
   - Círculo branco 90% opacidade + triângulo play preto
4. Texto hover "ver o vídeo":
   - position: absolute, bottom: 80px, centered
   - font-size: 50px, font-weight: 600, color: #F4EEE5
   - letter-spacing: -1.5px, lowercase
   - opacity: 0 → 1 no hover

**Estados Hover:**
- Thumbnail: transform: scale(1.1), transition: 0.4s
- Gradiente muda para laranja (igual thumbs)
- Play icon: width/height aumenta para 94px, cor muda para laranja
- Texto "ver o vídeo" aparece

#### Mobile (394px)

**Diferenças:**
- Container: padding: 32px 16.6px
- Video: 360.8x451px
- Play icon: 76.386px

---

### 3.5 INFOS FINAIS (CTAs Finais)

#### Desktop (1512px)

**Container:** background: #F68D3D, padding: 100px 0, text-align: center

**Estrutura:**
1. **Título 1:**
   - Linha 1: color: #F4EEE5 (bege)
   - Linha 2: color: #23201F (preto)
   - font-size: 70px, font-weight: 600, letter-spacing: -3.5px, line-height: 0.84, lowercase
   - margin-bottom: 60px

2. **Botão "quero assinar":**
   - 444x100px, bg: #F4EEE5, border-radius: 50px
   - font-size: 41.189px, font-weight: 600, color: #23201F
   - letter-spacing: -1.2357px
   - Seta SVG após texto
   - margin-bottom: 192px

3. **Título 2:**
   - font-size: 70px, font-weight: 700, color: #F4EEE5
   - letter-spacing: -2.1px, line-height: 0.98, lowercase
   - margin-bottom: 39px

4. **Subtítulo:**
   - font-size: 30px, font-weight: 500, color: #F4EEE5
   - letter-spacing: -0.9px, line-height: 1.24, lowercase
   - margin-bottom: 39px

5. **Botão "criar conta grátis":**
   - 680x100px, bg: #23201F, border-radius: 50px
   - font-size: 41.189px, font-weight: 600, color: #F4EEE5
   - Hover: bg muda para #F4EEE5, color para #23201F
   - margin-bottom: 39px

6. **Link "Já tem conta?":**
   - font-size: 23.047px, font-weight: 500, color: #23201F
   - letter-spacing: -0.6914px, lowercase
   - "Fazer login" com underline

#### Mobile (394px)

**Diferenças:**
- Container: padding: 70px 16px
- Título 1: font-size: 40px, letter-spacing: -2px
- Botão "quero assinar": 348x78.378px, font-size: 32.283px, margin-bottom: 130px
- Título 2: font-size: 40px
- Subtítulo: font-size: 18px, color: #23201F (preto, não bege!)
- Botão "criar conta": 326.4x48px, font-size: 19.771px
- Link: font-size: 14px

---

### 3.6 FOOTER

#### Desktop (1512px)

**Container:** background: #23201F, padding: 46px 63px 38px

**Estrutura:**
1. **Top section (flex, space-between):**
   - Logo Privacy à esquerda (height: 36px)
   - 3 colunas de links no centro:
     - **Institucional:** Sobre, Imprensa, Contato, Ajuda & FAQ
     - **Criador:** Blog, Como funciona
     - **Informações legais:** Privacidade, Termos e políticas, Centro de Segurança e Transparência
   - Redes sociais à direita (Facebook, Instagram, TikTok, X/Twitter)
   
   **Títulos das colunas:**
   - font-size: 16px, font-weight: 500, color: #F68D3D
   
   **Links:**
   - font-size: 14px, font-weight: 500, color: #F4EEE5
   - Hover: color: #F68D3D

2. **Linha divisória:**
   - width: 100%, height: 1px, background: rgba(154, 154, 154, 0.2)
   - margin-bottom: 28px

3. **Bottom (copyright):**
   - text-align: center
   - font-size: 16px, font-weight: 400, color: rgba(154, 154, 154, 0.42)
   - "©2026 Privacy"
   - Endereços legais

#### Mobile (394px)

**Diferenças:**
- padding: 46px 34px 38px
- Layout em coluna (flex-direction: column)
- Links empilhados verticalmente

---

## 4. Interações e Animações

### 4.1 Transições Gerais
- **Duração padrão:** 0.3s para botões, 0.4s para cards/imagens
- **Easing:** ease ou ease-out
- **Sempre suaves, nunca bruscas**

### 4.2 Botões
- **Hover:** transform: scale(1.05) + mudança de cor quando aplicável
- **Transição:** all 0.3s ease

### 4.3 Cards de Foto (Thumbs)
- **Hover na foto:** transform: scale(1.1)
- **Gradiente:** muda de preto para laranja
- **Box de legenda:** muda de branco para laranja
- **Botão "ver agora":** opacity 0 → 1
- **Transição:** 0.4s ease

### 4.4 Vídeo
- **Hover:** igual aos cards
- **Play icon:** aumenta de tamanho + muda cor para laranja
- **Texto "ver o vídeo":** aparece com opacity

### 4.5 Scroll Reveal (Animação de Entrada)
- **Elementos:** títulos, cards, botões (classe .fade-in)
- **Inicial:** opacity: 0, transform: translateY(30px)
- **Visível:** opacity: 1, transform: translateY(0)
- **Trigger:** IntersectionObserver com threshold: 0.1
- **Transição:** 0.6s ease

### 4.6 Carrossel de Cards
- **scroll-behavior:** smooth
- **-webkit-overflow-scrolling:** touch
- **scrollbar:** oculta (scrollbar-width: none)

---

## 5. Campos Editáveis no Gerador

### 5.1 Seção "Geral"
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Logo da Criadora | Upload (PNG/SVG) | Usado no modal e header |
| Link de destino | URL | Link com UTM para todos os CTAs |

### 5.2 Seção "Hero"
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Banner Desktop | Upload (JPG/WebP) | Recomendado: 1920x953px |
| Banner Mobile | Upload (JPG/WebP) | Recomendado: 394x859px |
| Título Principal | Texto | Ex: "conteúdo exclusivo" |
| Subtítulo | Textarea | Ex: "O que você\nprocura está aqui" |
| Botão "Ver Agora" | Texto | Texto do CTA |
| Botão "Assine Já" | Texto | Texto do header |

### 5.3 Seção "Fotos"
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Título da Seção | Textarea | Última linha fica em laranja |
| Botão CTA | Texto | Ex: "assine e veja muito mais" |
| Cards (dinâmico) | Lista | Cada card tem: foto (upload) + texto (textarea) |

### 5.4 Seção "Vídeo"
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Thumbnail | Upload (JPG/WebP) | Preview do vídeo |
| Vídeo | Upload (MP4) | Arquivo de vídeo |

### 5.5 Seção "Infos Finais"
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Título 1 - Linha 1 | Texto | Cor bege |
| Título 1 - Linha 2 | Texto | Cor preta |
| Botão "Quero Assinar" | Texto | |
| Título 2 | Texto | |
| Subtítulo | Textarea | |
| Botão "Criar Conta" | Texto | |

### 5.6 Seção "Modal 18+"
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Título de Boas-vindas | Textarea | Ex: "BEM-VINDO(A)\nAO MEU SITE, AMOR!!" |

---

## 6. Estrutura de Arquivos de Saída

Quando o usuário clica em "Baixar Landing Page", deve gerar:

```
/nome-da-criadora/
├── index.html          # Página completa com CSS inline
└── assets/
    ├── logo.png        # Logo da criadora
    ├── banner-desktop.jpg
    ├── banner-mobile.jpg
    ├── foto-1.jpg
    ├── foto-2.jpg
    ├── foto-3.jpg
    ├── video-thumb.jpg
    └── video.mp4
```

**Nota:** Como é difícil gerar ZIP com múltiplos arquivos via JavaScript puro, uma alternativa é:
1. Gerar apenas o index.html com instruções
2. O usuário cria a pasta assets manualmente e coloca as imagens com os nomes corretos
3. Ou usar JSZip para gerar ZIP completo

---

## 7. Requisitos Técnicos

### 7.1 Tecnologias
- HTML5 + CSS3 + JavaScript Vanilla
- Google Fonts (Poppins)
- Nenhuma dependência externa obrigatória
- Opcional: JSZip para gerar ZIP

### 7.2 Compatibilidade
- Chrome, Firefox, Safari, Edge (últimas 2 versões)
- Mobile: iOS Safari, Chrome Android

### 7.3 Performance
- Imagens devem ser otimizadas (WebP quando possível)
- CSS inline no HTML final (sem arquivos externos)
- Carregamento rápido (importante para conversão)

### 7.4 Responsividade
- **Breakpoint:** 768px
- **Desktop:** ≥769px (base: 1512px)
- **Mobile:** ≤768px (base: 394px)

---

## 8. Fluxo do Gerador

### 8.1 Interface do Gerador

```
┌─────────────────────────────────────────────────────────────────┐
│  PAINEL DE EDIÇÃO (420px)  │  ÁREA DE PREVIEW (resto da tela)  │
│                            │                                    │
│  ┌────────────────────┐    │  ┌────────────────────────────┐   │
│  │ Gerador de LP      │    │  │ [Desktop] [Mobile]         │   │
│  │ Privacy            │    │  └────────────────────────────┘   │
│  └────────────────────┘    │                                    │
│                            │  ┌────────────────────────────┐   │
│  ═══ GERAL ═══════════     │  │                            │   │
│  [Upload Logo]             │  │                            │   │
│  [Link destino ____]       │  │    PREVIEW DA LP           │   │
│                            │  │    (ao vivo)               │   │
│  ═══ HERO ════════════     │  │                            │   │
│  [Upload Banner Desktop]   │  │                            │   │
│  [Upload Banner Mobile]    │  │                            │   │
│  [Título ____]             │  │                            │   │
│  [Subtítulo ____]          │  │                            │   │
│                            │  │                            │   │
│  ═══ FOTOS ═══════════     │  │                            │   │
│  [Título seção ____]       │  │                            │   │
│  ┌─ Card 1 ─────────┐      │  │                            │   │
│  │ [Upload foto]    │      │  │                            │   │
│  │ [Texto ____]     │      │  │                            │   │
│  └──────────────────┘      │  │                            │   │
│  [+ Adicionar Foto]        │  │                            │   │
│                            │  └────────────────────────────┘   │
│  ═══ VÍDEO ═══════════     │                                    │
│  ...                       │                                    │
│                            │                                    │
│  ┌────────────────────┐    │                                    │
│  │ ⬇️ BAIXAR LP       │    │                                    │
│  └────────────────────┘    │                                    │
│  [Testar Modal 18+]        │                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Funcionalidades do Gerador

1. **Preview em tempo real:** Qualquer alteração nos campos atualiza a preview instantaneamente
2. **Alternância Desktop/Mobile:** Botões para trocar a largura da preview
3. **Upload com preview:** Ao fazer upload, mostra miniatura da imagem
4. **Cards dinâmicos:** Pode adicionar/remover cards de fotos
5. **Teste de modal:** Botão para visualizar o modal 18+
6. **Download:** Gera HTML final pronto para deploy

---

## 9. Considerações Importantes

### 9.1 Pixel Perfect
- **CRÍTICO:** A implementação deve ser IDÊNTICA ao Figma
- Não adicionar nada que não esteja no design
- Não mudar posições, tamanhos ou cores
- Respeitar todos os valores de font-size, letter-spacing, line-height, etc.

### 9.2 Imagens
- O usuário envia imagens SEM gradiente
- O gradiente é aplicado via CSS
- Isso permite ajustes e mantém flexibilidade

### 9.3 Escalabilidade
- O sistema deve permitir criar múltiplas LPs por dia
- Processo deve ser rápido: preencher campos → baixar → deploy
- Sem necessidade de conhecimento técnico

### 9.4 Segurança
- Modal 18+ é obrigatório (conteúdo adulto)
- Links trackáveis com UTM para analytics

---

## 10. Links de Referência do Figma

### 10.1 Layouts Completos
- **Desktop (1512px):** `https://www.figma.com/design/70OoTWJ2YmMT1E0lAghNkF/Landing-creators---Tadalafellas?node-id=6005-514`
- **Mobile (394px):** `https://www.figma.com/design/70OoTWJ2YmMT1E0lAghNkF/Landing-creators---Tadalafellas?node-id=6005-794`

### 10.2 Componentes
- **Paleta de Cores:** `node-id=6015-60`
- **Card Foto (Normal + Hover):** `node-id=6005-612`
- **Vídeo (Normal + Hover):** `node-id=6005-632`
- **Modal 18+:** `node-id=6017-69`
- **Botões (variações):** `node-id=6017-120`

---

## 11. Checklist de Entrega

### 11.1 Gerador
- [ ] Interface com painel lateral + área de preview
- [ ] Todos os campos editáveis funcionando
- [ ] Upload de imagens com preview
- [ ] Preview ao vivo atualiza em tempo real
- [ ] Alternância Desktop/Mobile
- [ ] Botão de teste do modal 18+
- [ ] Botão de download funcionando

### 11.2 Landing Page Gerada
- [ ] Modal 18+ funcionando (bloqueia página, botões funcionais)
- [ ] Hero com gradiente correto
- [ ] Seção de thumbs com carrossel
- [ ] Todos os hovers funcionando (foto, vídeo, botões)
- [ ] Animações de scroll (fade-in)
- [ ] Footer completo
- [ ] 100% responsivo (Desktop + Mobile)
- [ ] Pixel perfect conforme Figma

### 11.3 Qualidade
- [ ] Cores exatas (#23201F, #F68D3D, #F4EEE5, #FFFFFF)
- [ ] Fonte Poppins com pesos corretos
- [ ] Todos os tamanhos de fonte conforme especificado
- [ ] Letter-spacing e line-height corretos
- [ ] Border-radius corretos
- [ ] Transições suaves (0.3s-0.4s)

---

## 12. Notas Finais

Este PRD contém todas as especificações necessárias para implementar o gerador de landing pages. O objetivo é criar uma ferramenta que permita produção em escala de landing pages personalizadas para criadoras da Privacy, mantendo consistência visual e qualidade profissional.

**Prioridade máxima:** Fidelidade ao design do Figma (pixel perfect).

**Flexibilidade:** Apenas nos campos editáveis (textos, imagens, links).

Qualquer dúvida durante a implementação, consulte os links do Figma ou este documento.
