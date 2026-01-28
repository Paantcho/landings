import { type LandingPageData } from "@shared/schema";

interface Modal18PlusProps {
  data: LandingPageData;
  isOpen: boolean;
  onClose: () => void;
  isPreview?: boolean;
}

export function Modal18Plus({ data, isOpen, onClose, isPreview = false }: Modal18PlusProps) {
  if (!isOpen) return null;

  const handleExit = () => {
    if (!isPreview) {
      window.location.href = "https://google.com";
    }
  };

  // Parse modal title (split by newlines for multiple lines)
  const titleLines = (data.modalTitle || "BEM-VINDO(A)\nAO MEU SITE, AMOR!!").split("\n");

  return (
    <div 
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      data-testid="modal-18plus"
    >
      {/* Card central: 460px largura, 508px altura, fundo bege, border-radius 40px */}
      <div 
        className="relative rounded-[40px] px-[25px] pt-[43px] pb-[42px]"
        style={{ 
          backgroundColor: "#F4EEE5",
          width: "460px",
          minHeight: "508px"
        }}
        data-testid="modal-content"
      >
        {/* Logo - height: 62px, margin-bottom: 50px - EM PRETO via filter */}
        <div className="flex justify-center mb-[50px]">
          {data.logoUrl ? (
            <img 
              src={data.logoUrl} 
              alt="Logo" 
              className="h-[62px] object-contain"
              style={{ filter: "brightness(0)" }}
              data-testid="img-modal-logo"
            />
          ) : (
            <div 
              className="h-[62px] w-[142px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm"
              data-testid="placeholder-modal-logo"
            >
              Logo
            </div>
          )}
        </div>

        {/* Title - font-size: 24px, font-weight: 600, letter-spacing: -0.72px, line-height: 1.1, UPPERCASE */}
        <h2 
          className="text-center font-semibold text-[24px] leading-[1.1] mb-[16px] uppercase"
          style={{ 
            color: "#23201F", 
            letterSpacing: "-0.72px" 
          }}
          data-testid="text-modal-title"
        >
          {titleLines.map((line, idx) => (
            <span key={idx} className="block">{line}</span>
          ))}
        </h2>

        {/* Description - font-size: 14px, font-weight: 500, letter-spacing: -0.42px, line-height: 1.24, lowercase */}
        <div 
          className="text-center font-medium text-[14px] leading-[1.24] lowercase mb-[33px]"
          style={{ 
            color: "#23201F", 
            letterSpacing: "-0.42px" 
          }}
          data-testid="text-modal-description"
        >
          {(data.modalDescription || "").split(". ").map((sentence, idx, arr) => {
            // Highlight "18 anos ou mais" in bold
            const text = sentence + (idx < arr.length - 1 ? "." : "");
            if (text.includes("18 anos ou mais")) {
              const parts = text.split("18 anos ou mais");
              return (
                <p key={idx} className="mb-0">
                  {parts[0]}<span className="font-bold">18 anos ou mais</span>{parts[1]}
                </p>
              );
            }
            return <p key={idx} className="mb-0">{text}</p>;
          })}
        </div>

        {/* Buttons - gap: 10px - com hover scale + cor */}
        <div className="flex justify-center gap-[10px] mb-[33px]">
          {/* acessar: 130x44px - laranja → preto no hover */}
          <button
            onClick={onClose}
            className="w-[130px] h-[44px] rounded-[21.901px] font-semibold text-[18px] leading-[1.1] transition-all duration-300 hover:scale-105 hover:bg-[#23201F] hover:text-[#F4EEE5]"
            style={{ 
              backgroundColor: "#F68D3D", 
              color: "#F4EEE5",
              letterSpacing: "-0.54px"
            }}
            data-testid="button-modal-access"
          >
            acessar
          </button>
          {/* sair: 130x44px - outline laranja → fundo laranja no hover */}
          <button
            onClick={handleExit}
            className="w-[130px] h-[44px] rounded-[21.901px] font-semibold text-[18px] leading-[1.1] border transition-all duration-300 hover:scale-105 hover:bg-[#F68D3D] hover:text-[#F4EEE5]"
            style={{ 
              backgroundColor: "transparent", 
              borderColor: "#F68D3D",
              color: "#F68D3D",
              letterSpacing: "-0.54px"
            }}
            data-testid="button-modal-exit"
          >
            sair
          </button>
        </div>

        {/* Cookies/Terms text - font-size: 12px, font-weight: 500, color: #A0988C */}
        <p 
          className="text-center font-medium text-[12px] leading-[1.24]"
          style={{ 
            color: "#A0988C", 
            letterSpacing: "-0.36px" 
          }}
          data-testid="text-modal-terms"
        >
          Usamos cookies e tecnologias semelhantes para melhorar sua experiência por aqui, personalizar conteúdos e deixar tudo mais do seu jeito. Ao continuar, você concorda com nossos{" "}
          <a href="https://privacy.com.br/termos" style={{ color: "#F68D3D" }} data-testid="link-terms">Termos de Uso</a>
          {" "}e{" "}
          <a href="https://privacy.com.br/privacidade" style={{ color: "#F68D3D" }} data-testid="link-privacy">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}
