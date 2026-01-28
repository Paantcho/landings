import { type LandingPageData } from "@shared/schema";

interface FinalInfoSectionProps {
  data: LandingPageData;
  viewMode: "desktop" | "mobile";
}

export function FinalInfoSection({ data, viewMode }: FinalInfoSectionProps) {
  const isDesktop = viewMode === "desktop";

  return (
    <section 
      className="w-full text-center"
      style={{ 
        backgroundColor: "#F68D3D",
        padding: isDesktop ? "100px 0" : "40px 16px"
      }}
      data-testid="section-final-info"
    >
      {/* Title 1 */}
      <h2
        className="font-semibold lowercase"
        style={{
          fontSize: isDesktop ? "70px" : "32px",
          letterSpacing: isDesktop ? "-3.5px" : "-1.6px",
          lineHeight: "0.9",
          marginBottom: isDesktop ? "40px" : "24px"
        }}
        data-testid="text-final-title1"
      >
        <span style={{ color: "#F4EEE5" }}>{data.finalTitle1Line1}</span>
        <br />
        <span style={{ color: "#23201F" }}>{data.finalTitle1Line2}</span>
      </h2>

      {/* Button 1 - "quero assinar" - bege → preto no hover */}
      <a
        href={data.finalButton1Link}
        className="final-btn-1 inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#23201F] hover:text-[#F4EEE5] whitespace-nowrap"
        style={{
          minWidth: isDesktop ? "444px" : "300px",
          height: isDesktop ? "100px" : "56px",
          backgroundColor: "#F4EEE5",
          color: "#23201F",
          borderRadius: isDesktop ? "50px" : "28px",
          fontSize: isDesktop ? "41.189px" : "24px",
          letterSpacing: "-1.2357px",
          marginBottom: isDesktop ? "100px" : "32px",
          paddingLeft: "40px",
          paddingRight: "40px"
        }}
        data-testid="button-final-cta1"
      >
        {data.finalButton1Text}
        <svg 
          width={isDesktop ? "26" : "20"} 
          height={isDesktop ? "24" : "18"} 
          viewBox="0 0 27 24" 
          fill="none"
        >
          <path 
            d="M1 12H25M25 12L14 1M25 12L14 23" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </a>

      {/* Title 2 */}
      <h2
        className="font-bold lowercase"
        style={{
          fontSize: isDesktop ? "70px" : "32px",
          color: "#F4EEE5",
          letterSpacing: isDesktop ? "-2.1px" : "-1.6px",
          lineHeight: "0.98",
          marginBottom: isDesktop ? "24px" : "16px"
        }}
        data-testid="text-final-title2"
      >
        {data.finalTitle2}
      </h2>

      {/* Subtitle */}
      <p
        className="font-medium lowercase whitespace-pre-line"
        style={{
          fontSize: isDesktop ? "30px" : "14px",
          color: isDesktop ? "#F4EEE5" : "#23201F",
          letterSpacing: isDesktop ? "-0.9px" : "-0.42px",
          lineHeight: "1.24",
          marginBottom: isDesktop ? "24px" : "20px"
        }}
        data-testid="text-final-subtitle"
      >
        {data.finalSubtitle}
      </p>

      {/* Button 2 - "criar conta grátis" - preto → bege no hover */}
      <a
        href={data.finalButton2Link}
        className="final-btn-2 inline-flex items-center justify-center font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#F4EEE5] hover:text-[#23201F] whitespace-nowrap"
        style={{
          minWidth: isDesktop ? "680px" : "300px",
          height: isDesktop ? "100px" : "48px",
          backgroundColor: "#23201F",
          color: "#F4EEE5",
          borderRadius: isDesktop ? "50px" : "24px",
          fontSize: isDesktop ? "41.189px" : "18px",
          letterSpacing: "-1.2357px",
          marginBottom: "24px",
          paddingLeft: "40px",
          paddingRight: "40px"
        }}
        data-testid="button-final-cta2"
      >
        {data.finalButton2Text}
      </a>

      {/* "Já tem conta? Fazer login" link */}
      <p
        className="font-medium lowercase"
        style={{
          fontSize: isDesktop ? "23.047px" : "14px",
          color: "#23201F",
          letterSpacing: "-0.6914px"
        }}
        data-testid="text-final-login"
      >
        Já tem uma conta?{" "}
        <a 
          href={data.finalLoginLink} 
          className="underline hover:text-[#F4EEE5] transition-colors"
          data-testid="link-login"
        >
          {data.finalLoginText}
        </a>
      </p>
    </section>
  );
}
