"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initRemoteConfig } from "@/lib/remoteConfig";

interface RemoteConfigContextType {
  isInitialized: boolean;
}

const RemoteConfigContext = createContext<RemoteConfigContextType>({
  isInitialized: false,
});

export function RemoteConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Remote Config 전역 초기화 시작");
        await initRemoteConfig();
        setIsInitialized(true);
        console.log("Remote Config 전역 초기화 완료");
      } catch (error) {
        console.error("Remote Config 전역 초기화 실패:", error);
        // 실패해도 기본값 사용을 위해 initialized로 표시
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  return (
    <RemoteConfigContext.Provider value={{ isInitialized }}>
      {children}
    </RemoteConfigContext.Provider>
  );
}

// Custom Hook: Remote Config 상태를 가져오는 훅
export function useRemoteConfig() {
  const context = useContext(RemoteConfigContext);
  if (context === undefined) {
    throw new Error(
      "useRemoteConfig must be used within a RemoteConfigProvider"
    );
  }
  return context;
}
