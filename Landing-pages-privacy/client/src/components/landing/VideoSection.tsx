import { useState, useRef } from "react";
import { type LandingPageData } from "@shared/schema";

interface VideoSectionProps {
  data: LandingPageData;
  viewMode: "desktop" | "mobile";
}

export function VideoSection({ data, viewMode }: VideoSectionProps) {
  const isDesktop = viewMode === "desktop";
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (data.videoUrl && videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  const containerWidth = isDesktop ? 444 : 360.8;
  const containerHeight = isDesktop ? 555 : 451;
  const playIconSize = isDesktop ? 74 : 76.386;

  return (
    <section 
      className="w-full relative"
      data-testid="section-video"
    >
      {/* Background laranja que começa no meio do vídeo e vai até o footer */}
      <div 
        className="absolute left-0 right-0 bottom-0"
        style={{ 
          backgroundColor: "#F68D3D",
          top: `${containerHeight / 2}px`
        }}
      />
      
      {/* Conteúdo do vídeo */}
      <div 
        className="relative flex justify-center"
        style={{ 
          paddingTop: isDesktop ? "64px" : "24px",
          paddingBottom: isDesktop ? "64px" : "24px",
          paddingLeft: isDesktop ? "0" : "16.6px",
          paddingRight: isDesktop ? "0" : "16.6px"
        }}
      >
        <div
          className="video-container relative overflow-hidden cursor-pointer"
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            borderRadius: "40px",
            zIndex: 10
          }}
          onClick={handlePlay}
          data-testid="container-video"
        >
          {/* Thumbnail / Video */}
          {isPlaying && data.videoUrl ? (
            <video
              ref={videoRef}
              src={data.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              data-testid="video-player"
            />
          ) : (
            <>
              {/* Thumbnail */}
              {data.videoThumbnailUrl ? (
                <img
                  src={data.videoThumbnailUrl}
                  alt="Video Thumbnail"
                  className="video-thumbnail absolute inset-0 w-full h-full object-cover"
                  data-testid="img-video-thumbnail"
                />
              ) : (
                <div className="video-thumbnail absolute inset-0 w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                  Thumbnail do Vídeo
                </div>
              )}

              {/* Gradient Overlay */}
              <div 
                className="video-gradient absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height: "342px" }}
              />

              {/* Play Icon */}
              <div 
                className="play-icon absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  width: `${playIconSize}px`,
                  height: `${playIconSize}px`
                }}
              >
                <svg 
                  width={playIconSize} 
                  height={playIconSize} 
                  viewBox="0 0 74 74" 
                  fill="none"
                >
                  <circle 
                    cx="37" 
                    cy="37" 
                    r="37" 
                    fill="white" 
                    fillOpacity="0.9"
                  />
                  <path 
                    d="M29 24L52 37L29 50V24Z" 
                    fill="#23201F"
                  />
                </svg>
              </div>

              {/* "Ver o vídeo" text (appears on hover) - uma linha só */}
              <p 
                className="video-text absolute left-1/2 -translate-x-1/2 font-semibold lowercase whitespace-nowrap"
                style={{
                  bottom: isDesktop ? "80px" : "60px",
                  fontSize: isDesktop ? "50px" : "32px",
                  color: "#F4EEE5",
                  letterSpacing: "-1.5px",
                  lineHeight: "1"
                }}
                data-testid="text-video-hover"
              >
                ver o vídeo
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
