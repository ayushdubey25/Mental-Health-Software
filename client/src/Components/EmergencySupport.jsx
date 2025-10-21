import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

const EmotionDetector = ({ onResult }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        await tf.ready();

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;

        await new Promise(resolve => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });

        const modelName = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detector = await faceLandmarksDetection.createDetector(modelName, {
          runtime: "tfjs",
          refineLandmarks: true,
        });

        console.log("✅ FaceMesh model loaded successfully");
        detectFace(detector);
      } catch (err) {
        console.error("EmotionDetector init error:", err);
      }
    };

    const detectFace = async (detector) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || cancelled) return;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const detect = async () => {
        if (cancelled) return;
        if (!videoRef.current || !canvasRef.current) return;

        const faces = await detector.estimateFaces(videoRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let happy = 0, stress = 0, anxiety = 0, audioLevel = 0;

        if (faces.length > 0) {
          for (const face of faces) {
            const keypoints = face.keypoints;
            ctx.beginPath();
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            keypoints.forEach(point => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
          happy = Math.random() * 10;
          stress = Math.random() * 10;
          anxiety = Math.random() * 10;
          audioLevel = Math.random() * 100;
        }
        if (onResult) {
          onResult({
            time: new Date().toLocaleTimeString(),
            happy,
            stress,
            anxiety,
            audioLevel
          });
        }

        animationFrameId.current = requestAnimationFrame(detect);
      };

      detect();
    };

    start();

    return () => {
      cancelled = true;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [onResult]);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl"
        style={{ width: 400, height: 300 }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 400,
          height: 300,
        }}
      />
    </div>
  );
};

export default EmotionDetector;
