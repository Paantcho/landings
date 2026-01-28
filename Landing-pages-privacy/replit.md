# Privacy Landing Page Generator

## Overview

A visual landing page generator for adult content creators on the Privacy platform. The application provides a no-code builder interface where users can customize landing pages through a side panel editor with live preview, then download a complete deployable package (HTML + assets) as a ZIP file.

The generator follows a specific design system with exactly 4 brand colors (black #23201F, orange #F68D3D, beige #F4EEE5, white #FFFFFF) and uses the Poppins font family throughout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query for server state, useState for local form state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens matching Privacy brand colors
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: REST endpoints under `/api/*`
- **ZIP Generation**: Uses `archiver` package to bundle HTML + base64-decoded assets
- **File Handling**: Base64 image data from frontend converted to binary files in ZIP

### Key Data Flow
1. User fills form fields in EditorPanel component
2. LandingPageData state updates trigger live preview re-render
3. On download, frontend POSTs complete data object to `/api/generate`
4. Server generates self-contained HTML with embedded assets
5. ZIP file streams back to client for download

### Landing Page Structure
The generated landing page includes these sections:
- Modal 18+ (age verification - fully editable title and description)
- Hero Section (banner + header with logo)
- Thumbs Section (3-5 photo cards with horizontal scroll)
- Video Section (thumbnail with play overlay)
- Final Info Section (CTAs)
- Footer (institutional links)

### Recent Changes (January 2026)
- **Modal 18+ Editable**: Title and description are now customizable in the builder
- **Individual CTA Links**: All buttons have separate link fields (heroButtonLink, headerButtonLink, thumbsCardButtonLink, thumbsButtonLink, finalButton1Link, finalButton2Link, finalLoginLink)
- **SEO Meta Tags**: Added seoDescription and seoKeywords fields that go into the HTML <head>
- **Security**: All dynamic content is HTML-escaped before injection to prevent XSS
- **Video Hover Fix**: Removed container scale on hover to prevent layout shifts
- **Arrow Icon with Bounce**: Replaced hand icon with arrow-icon.png from Figma with CSS bounce animation
- **Footer Links Sync**: All footer links in exported HTML now match React preview (About, Contato, Help, Blog, Como funciona, Privacidade, Termos, Centro de Transparência)
- **Social Links Updated**: Instagram, YouTube, X, TikTok with correct URLs (Facebook removed)
- **External Links Security**: All external links now have target="_blank" rel="noopener noreferrer"

### Schema Validation
- Zod schemas define LandingPageData structure in `shared/schema.ts`
- Validates thumbs array (3-5 items), URLs, default values
- Same schema used for frontend types and backend validation

## External Dependencies

### Database
- PostgreSQL configured via Drizzle ORM
- Schema defined in `shared/schema.ts`
- Currently uses in-memory storage (`MemStorage`) for user data
- Database URL required via `DATABASE_URL` environment variable

### Third-Party Packages
- **archiver**: Server-side ZIP file generation
- **@tanstack/react-query**: Async state management
- **Radix UI**: Accessible component primitives (dialog, accordion, tabs, etc.)
- **Zod**: Runtime schema validation
- **drizzle-orm/drizzle-zod**: Database ORM and Zod integration

### Build & Dev Tools
- **Vite**: Frontend build and dev server with HMR
- **esbuild**: Server bundle for production
- **tsx**: TypeScript execution for development
- Replit-specific plugins for dev banner and error overlay