"use client";

import { useEffect } from "react";
import { initRemoteConfig } from "@/lib/remoteConfig";

export function RemoteConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Remote Config 전역 초기화 시작");
        await initRemoteConfig();
        console.log("Remote Config 전역 초기화 완료");
      } catch (error) {
        console.error("Remote Config 전역 초기화 실패:", error);
      }
    };

    initialize();
  }, []);

  return <>{children}</>;
}
