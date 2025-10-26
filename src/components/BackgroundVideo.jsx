import React, { useRef, useEffect } from "react";
import "./BackgroundVideo.css";

const BackgroundVideo = ({ videoSrc, children }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure video plays on mobile devices
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
      <div className="video-content">{children}</div>
    </div>
  );
};

export default BackgroundVideo;
