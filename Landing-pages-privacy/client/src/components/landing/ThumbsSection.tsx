import { type LandingPageData } from "@shared/schema";

interface ThumbsSectionProps {
  data: LandingPageData;
  viewMode: "desktop" | "mobile";
}

export function ThumbsSection({ data, viewMode }: ThumbsSectionProps) {
  const isDesktop = viewMode === "desktop";

  return (
    <section 
      className="w-full"
      style={{ 
        backgroundColor: "#F4EEE5",
        padding: isDesktop ? "82px 0 54px" : "40px 0 24px"
      }}
      data-testid="section-thumbs"
    >
      {/* Title */}
      <div 
        className="text-center"
        style={{
          padding: isDesktop ? "0" : "0 28px",
          marginBottom: isDesktop ? "76px" : "24px"
        }}
      >
        <h2
          className="font-semibold lowercase whitespace-pre-line"
          style={{
            fontSize: isDesktop ? "70px" : "36px",
            color: "#23201F",
            letterSpacing: isDesktop ? "-3.5px" : "-1.8px",
            lineHeight: "0.9"
          }}
          data-testid="text-thumbs-title"
        >
          {data.thumbsSectionTitle}{" "}
          <span style={{ color: "#F68D3D" }}>{data.thumbsSectionTitleHighlight}</span>
        </h2>
      </div>

      {/* Cards Container - Horizontal Scroll with centering wrapper */}
      <div 
        style={{
          overflowX: "auto",
          overflowY: "visible",
          padding: isDesktop ? "20px 40px" : "20px 28px"
        }}
        data-testid="container-thumbs"
      >
        <div 
          className="flex gap-[24px]"
          style={{
            justifyContent: "center",
            flexWrap: "nowrap",
            minWidth: "min-content"
          }}
        >
        {data.thumbs.map((thumb, index) => (
          <div
            key={thumb.id}
            className="thumb-card flex-shrink-0"
            style={{ width: "328px", height: "526px" }}
            data-testid={`card-thumb-${index}`}
          >
            {/* Photo Container */}
            <div 
              className="relative overflow-hidden"
              style={{ 
                width: "328px", 
                height: "407px",
                borderRadius: "40px 40px 0 0"
              }}
            >
              {/* Image */}
              {thumb.imageUrl ? (
                <img
                  src={thumb.imageUrl}
                  alt={`Foto ${index + 1}`}
                  className="thumb-photo absolute inset-0 w-full h-full object-cover"
                  data-testid={`img-thumb-${index}`}
                />
              ) : (
                <div className="thumb-photo absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                  Foto {index + 1}
                </div>
              )}

              {/* Gradient Overlay */}
              <div 
                className="thumb-gradient absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height: "250px" }}
              />

              {/* Ver agora button (appears on hover) - bege → preto no hover */}
              <a 
                href={data.thumbsCardButtonLink}
                className="thumb-button absolute left-1/2 -translate-x-1/2 opacity-0 transition-all duration-300 hover:scale-105 hover:bg-[#23201F] hover:text-[#F4EEE5]"
                style={{ 
                  bottom: "30px",
                  width: "146.695px",
                  height: "48.378px",
                  backgroundColor: "#F4EEE5",
                  color: "#23201F",
                  borderRadius: "24.189px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: 600,
                  letterSpacing: "-0.6px"
                }}
              >
                {data.thumbsCardButtonText || "ver agora"}
              </a>
            </div>

            {/* Legend */}
            <div 
              className="thumb-legend flex items-center justify-center px-[29px] py-[20px]"
              style={{ 
                width: "328px", 
                height: "119px",
                borderRadius: "0 0 40px 40px"
              }}
            >
              <p
                className="font-semibold text-[14px] leading-[1.24] lowercase text-center whitespace-pre-line"
                style={{
                  color: "#23201F",
                  letterSpacing: "-0.42px"
                }}
                data-testid={`text-thumb-legend-${index}`}
              >
                {thumb.legend}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* CTA Button - laranja → preto no hover */}
      <div className="flex justify-center" style={{ marginTop: isDesktop ? "70px" : "24px" }}>
        <a
          href={data.thumbsButtonLink}
          className="thumbs-btn font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:bg-[#23201F] hover:text-[#F4EEE5] whitespace-nowrap"
          style={{
            minWidth: isDesktop ? "680px" : "280px",
            height: isDesktop ? "100px" : "44px",
            backgroundColor: "#F68D3D",
            color: "#23201F",
            borderRadius: isDesktop ? "50px" : "22px",
            fontSize: isDesktop ? "41.189px" : "18px",
            letterSpacing: "-1.2357px",
            paddingLeft: "40px",
            paddingRight: "40px"
          }}
          data-testid="button-thumbs-cta"
        >
          {data.thumbsButtonText}
          <svg 
            width={isDesktop ? "26" : "14"} 
            height={isDesktop ? "24" : "12"} 
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
      </div>
    </section>
  );
}
