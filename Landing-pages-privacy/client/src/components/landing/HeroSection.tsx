import { type LandingPageData } from "@shared/schema";

interface HeroSectionProps {
  data: LandingPageData;
  viewMode: "desktop" | "mobile";
}

export function HeroSection({ data, viewMode }: HeroSectionProps) {
  const isDesktop = viewMode === "desktop";
  const bannerUrl = isDesktop ? data.bannerDesktopUrl : data.bannerMobileUrl;

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{ 
        height: isDesktop ? "953px" : "859px",
        backgroundColor: "#23201F"
      }}
      data-testid="section-hero"
    >
      {/* Background Image */}
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover object-top"
          data-testid="img-hero-banner"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center">
          <span className="text-white/50 text-lg">Banner {isDesktop ? "Desktop" : "Mobile"}</span>
        </div>
      )}

      {/* Gradient Overlay - EXATO do Figma */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(246, 141, 61, 0) 7.555%, #F68D3D 111.49%)"
        }}
      />

      {/* Header */}
      <header 
        className="relative z-10 flex items-center"
        style={{
          padding: isDesktop ? "45px 63px 0 181px" : "46px 0 0",
          justifyContent: isDesktop ? "space-between" : "center"
        }}
      >
        {/* Logo */}
        {data.logoUrl ? (
          <img
            src={data.logoUrl}
            alt="Logo"
            style={{
              height: isDesktop ? "55.828px" : "68px",
              width: isDesktop ? "130px" : "158.344px"
            }}
            className="object-contain"
            data-testid="img-header-logo"
          />
        ) : (
          <div 
            className="bg-white/20 rounded flex items-center justify-center text-white/50 text-sm"
            style={{
              height: isDesktop ? "55.828px" : "68px",
              width: isDesktop ? "130px" : "158.344px"
            }}
          >
            Logo
          </div>
        )}

        {/* Assine já button - Desktop only - laranja → preto no hover */}
        {isDesktop && (
          <a
            href={data.headerButtonLink}
            className="hero-subscribe-btn font-semibold text-[22px] leading-[1.1] rounded-[35.753px] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#23201F] hover:text-[#F4EEE5] whitespace-nowrap"
            style={{
              minWidth: "140px",
              height: "52px",
              backgroundColor: "#F68D3D",
              color: "#23201F",
              letterSpacing: "-0.66px",
              paddingLeft: "20px",
              paddingRight: "20px"
            }}
            data-testid="button-header-subscribe"
          >
            {data.headerButtonText}
          </a>
        )}
      </header>

      {/* Central Content */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{
          height: isDesktop ? "calc(953px - 150px)" : "calc(859px - 150px)",
          paddingBottom: "60px"
        }}
      >
        {/* Title */}
        <h1
          className="font-semibold lowercase"
          style={{
            fontSize: isDesktop ? "108.31px" : "58.31px",
            color: "#F4EEE5",
            letterSpacing: isDesktop ? "-8.6648px" : "-4.6648px",
            lineHeight: "0.84"
          }}
          data-testid="text-hero-title"
        >
          {data.heroTitle}
        </h1>

        {/* Subtitle */}
        <p
          className="font-semibold lowercase whitespace-pre-line mt-4"
          style={{
            fontSize: isDesktop ? "50.173px" : "24px",
            color: "#F4EEE5",
            letterSpacing: isDesktop ? "-2.5086px" : "-1.2px",
            lineHeight: "0.84"
          }}
          data-testid="text-hero-subtitle"
        >
          {data.heroSubtitle}
        </p>

        {/* Arrow icon - SVG com animação bounce */}
        <svg 
          className="mt-8 mb-[18px] animate-bounce"
          style={{ width: isDesktop ? "36px" : "26px", height: "auto" }}
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 4L12 20M12 20L18 14M12 20L6 14" 
            stroke="#F4EEE5" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>

        {/* Ver agora button - preto → bege no hover */}
        <a
          href={data.heroButtonLink}
          className="hero-cta font-semibold rounded-[31px] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#F4EEE5] hover:text-[#23201F] whitespace-nowrap"
          style={{
            minWidth: isDesktop ? "188px" : "160px",
            height: isDesktop ? "62px" : "52px",
            backgroundColor: "#23201F",
            color: "#F4EEE5",
            fontSize: isDesktop ? "28px" : "22px",
            letterSpacing: "-0.84px",
            paddingLeft: "24px",
            paddingRight: "24px"
          }}
          data-testid="button-hero-cta"
        >
          {data.heroButtonText}
        </a>
      </div>
    </section>
  );
}
