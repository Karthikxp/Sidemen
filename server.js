import React, { useState } from "react";

const API_URL = "http://192.168.43.85:5002";

export default function AuthDashboard() {
  const [authStatus, setAuthStatus] = useState("Waiting...");

  const startAuthentication = async () => {
    setAuthStatus("🔄 Sending request...");

    await fetch(`${API_URL}/auth/request?client_id=esp8266`, { method: "GET" });

    let attempts = 0;
    while (attempts < 10) {
      const res = await fetch(`${API_URL}/auth/status?client_id=esp8266`);
      const data = await res.json();

      if (data.status === "Success") {
        setAuthStatus("✅ Access Granted!");
        return;
      }
      if (data.status === "Failed") {
        setAuthStatus("❌ Access Denied!");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    setAuthStatus("⏳ Timeout");
  };

  return (
    <div>
      <h2>Device Authentication</h2>
      <button onClick={startAuthentication}>🔐 Authenticate ESP</button>
      <p>{authStatus}</p>
    </div>
  );
}