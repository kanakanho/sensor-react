import React, { useRef } from "react";
import "./App.css";

type SensorDataAcc = {
  x: number;
  y: number;
  z: number;
};

type SensorDataGyro = {
  alpha: number;
  beta: number;
  gamma: number;
};

const App: React.FC = () => {
  const [sensorDataAcc, setSensorDataAcc] = React.useState<SensorDataAcc[]>([]);
  const [sensorDataGyro, setSensorDataGyro] = React.useState<SensorDataGyro[]>([]);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  const requestPermission = async () => {
    try {
      // 加速度計とジャイロスコープの使用許可を求める
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        const motionPermission = await DeviceMotionEvent.requestPermission();
        if (motionPermission !== "granted") {
          throw new Error("DeviceMotion permission not granted");
        }
      }

      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const orientationPermission = await DeviceOrientationEvent.requestPermission();
        if (orientationPermission !== "granted") {
          throw new Error("DeviceOrientation permission not granted");
        }
      }

      // 許可が得られた後にセンサーの取得を開始
      startSensor();
    } catch (e) {
      console.error("Permission request failed", e);
    }
  };

  const startSensor = () => {
    window.addEventListener("devicemotion", handleAcc);
    window.addEventListener("deviceorientation", handleGyro);
  };

  const stopSensor = () => {
    window.removeEventListener("devicemotion", handleAcc);
    window.removeEventListener("deviceorientation", handleGyro);
  };

  const exportCSV = () => {
    if (!sensorDataAcc.length && !sensorDataGyro.length) return;
    if (!downloadLinkRef.current) return;

    const accCsvLines = sensorDataAcc.map((data) => `${data.x},${data.y},${data.z}`).join("\n");
    const gyroCsvLines = sensorDataGyro.map((data) => `${data.alpha},${data.beta},${data.gamma}`).join("\n");
    const csv = `acc,x,y,z\n${accCsvLines}\ngyro,alpha,beta,gamma\n${gyroCsvLines}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    downloadLinkRef.current.href = url;
    downloadLinkRef.current.download = "sensorData.csv";
    downloadLinkRef.current.click();
  };

  const handleAcc = (event: DeviceMotionEvent) => {
    const { acceleration } = event;
    const acc: SensorDataAcc = {
      x: acceleration?.x ?? 0,
      y: acceleration?.y ?? 0,
      z: acceleration?.z ?? 0,
    };
    setSensorDataAcc((prev) => [...prev, acc]);
  };

  const handleGyro = (event: DeviceOrientationEvent) => {
    const { alpha, beta, gamma } = event;
    const gyro: SensorDataGyro = {
      alpha: alpha ?? 0,
      beta: beta ?? 0,
      gamma: gamma ?? 0,
    };
    setSensorDataGyro((prev) => [...prev, gyro]);
  };

  return (
    <main>
      <button type="button" onClick={requestPermission}>
        許可
      </button>
      <button type="button" onClick={startSensor}>
        スタート
      </button>
      <button type="button" onClick={stopSensor}>
        エンド
      </button>
      <button type="button" onClick={exportCSV}>
        保存
      </button>
      {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
      <a ref={downloadLinkRef} style={{ display: "none" }}>
        ダウンロード
      </a>
      <pre>{JSON.stringify({ sensorDataAcc, sensorDataGyro }, null, 2)}</pre>
    </main>
  );
};

export default App;
