import { useEffect, useRef, useState } from "react";
import { Volume2, Mic, Eye, EyeOff } from "lucide-react";

interface CameraPreviewProps {
  isListening?: boolean;
  onCameraToggle?: (enabled: boolean) => void;
}

export function CameraPreview({ isListening = false, onCameraToggle }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isCameraEnabled) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 320 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setError(null);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Camera access denied");
        setIsCameraEnabled(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraEnabled]);

  const toggleCamera = () => {
    const newState = !isCameraEnabled;
    setIsCameraEnabled(newState);
    onCameraToggle?.(newState);
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
      {isCameraEnabled && !error ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          
          {/* Listening indicator */}
          {isListening && (
            <div className="absolute inset-0 border-2 border-green-500 animate-pulse pointer-events-none"></div>
          )}

          {/* Status badge */}
          <div className="absolute top-2 left-2 flex gap-1 items-center bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
            <div className={`w-2 h-2 rounded-full ${isCameraEnabled ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-xs text-white font-semibold">You</span>
          </div>

          {/* Toggle button */}
          <button
            onClick={toggleCamera}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition backdrop-blur-sm"
            title="Toggle camera"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Listening animation */}
          {isListening && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              <div className="w-1.5 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-1.5 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-1.5 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          {error ? (
            <>
              <EyeOff className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs text-center">{error}</p>
              <button
                onClick={toggleCamera}
                className="mt-2 px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/80 transition"
              >
                Enable Camera
              </button>
            </>
          ) : (
            <>
              <EyeOff className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">Camera disabled</p>
              <button
                onClick={toggleCamera}
                className="mt-2 px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/80 transition"
              >
                Enable
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
