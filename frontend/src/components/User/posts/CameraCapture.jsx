import React, { useRef, useEffect, useState } from "react";
import { FlipHorizontal, TreePine, Globe, Maximize, Minimize } from "lucide-react";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [facingMode, setFacingMode] = useState("user");
  const [activeFilter, setActiveFilter] = useState(null);
  const [overlayPos, setOverlayPos] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ---------------- Camera ---------------- */
  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    };
    startCamera();
    return () => videoRef.current?.srcObject?.getTracks().forEach((t) => t.stop());
  }, [facingMode]);

  /* ---------------- Drag logic ---------------- */
  const startDrag = () => setDragging(true);
  const stopDrag = () => setDragging(false);

  const onDrag = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setOverlayPos({ x: clientX - 40, y: clientY - 40 });
  };

  /* ---------------- Capture ---------------- */
  const takePicture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    if (activeFilter) {
      ctx.font = "80px serif";
      ctx.textAlign = "center";

      const scaleX = canvas.width / containerRef.current.clientWidth;
      const scaleY = canvas.height / containerRef.current.clientHeight;

      const x = (overlayPos.x + 40) * scaleX;
      const y = (overlayPos.y + 80) * scaleY;

      if (activeFilter === "tree") ctx.fillText("🌳", x, y);
      if (activeFilter === "earth") ctx.fillText("🌍", x, y);
    }

    onCapture(canvas.toDataURL("image/jpeg", 0.9));
  };

  /* ---------------- Fullscreen ---------------- */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className=" w-full flex items-center justify-center"
    >
      {/* Camera container with mobile aspect ratio */}
      <div
        ref={containerRef}
        className="relative w-[360px] h-[640px] overflow-hidden rounded-2xl"
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onTouchMove={onDrag}
        onTouchEnd={stopDrag}
      >
        {/* Camera video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover rounded-2xl"
        />

        {/* Draggable Overlay */}
        {activeFilter && (
          <div
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className="absolute text-6xl cursor-move select-none"
            style={{ left: overlayPos.x, top: overlayPos.y, touchAction: "none" }}
          >
            {activeFilter === "tree" && "🌳"}
            {activeFilter === "earth" && "🌍"}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <button
            onClick={() => setActiveFilter("tree")}
            className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white flex items-center gap-1 hover:bg-white/30 transition"
          >
            <TreePine size={16} /> 🌳
          </button>
          <button
            onClick={() => setActiveFilter("earth")}
            className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white flex items-center gap-1 hover:bg-white/30 transition"
          >
            <Globe size={16} /> 🌍
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-10">
          {/* Flip Camera */}
          <button
            onClick={() =>
              setFacingMode((p) => (p === "user" ? "environment" : "user"))
            }
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition"
          >
            <FlipHorizontal size={20} />
          </button>

          {/* Capture */}
          <button onClick={takePicture}>
            <div className="h-16 w-16 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition">
              <div className="h-12 w-12 bg-white rounded-full" />
            </div>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;
