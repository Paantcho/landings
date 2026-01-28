import { useState } from "react";
import { type LandingPageData } from "@shared/schema";
import { Modal18Plus } from "./Modal18Plus";
import { HeroSection } from "./HeroSection";
import { ThumbsSection } from "./ThumbsSection";
import { VideoSection } from "./VideoSection";
import { FinalInfoSection } from "./FinalInfoSection";
import { FooterSection } from "./FooterSection";

interface LandingPreviewProps {
  data: LandingPageData;
  viewMode: "desktop" | "mobile";
}

export function LandingPreview({ data, viewMode }: LandingPreviewProps) {
  const [showModal, setShowModal] = useState(true);
  const isDesktop = viewMode === "desktop";

  return (
    <div 
      className="relative overflow-auto bg-[#F4EEE5]"
      style={{
        width: isDesktop ? "1512px" : "394px",
        minHeight: "100%"
      }}
      data-testid="landing-preview"
    >
      {/* Modal 18+ */}
      <Modal18Plus 
        data={data} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        isPreview={true}
      />

      {/* Landing Page Content */}
      <div className={showModal ? "blur-sm pointer-events-none" : ""}>
        <HeroSection data={data} viewMode={viewMode} />
        <ThumbsSection data={data} viewMode={viewMode} />
        <VideoSection data={data} viewMode={viewMode} />
        <FinalInfoSection data={data} viewMode={viewMode} />
        <FooterSection viewMode={viewMode} />
      </div>
    </div>
  );
}
