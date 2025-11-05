import { fetchAndActivate, getString, getValue } from "firebase/remote-config";
import { remoteConfig } from "./firebase";

/**
 * Remote Config 초기화 및 최신 값 가져오기
 * 앱 시작 시 한 번 호출
 */
export const initRemoteConfig = async () => {
  if (!remoteConfig) {
    console.warn("Remote Config가 초기화되지 않았습니다.");
    return false;
  }

  try {
    console.log("Remote Config fetch 시작...");

    // Remote Config 값 fetch 및 activate
    const activated = await fetchAndActivate(remoteConfig);
    console.log("Remote Config 초기화 완료:", activated);

    return activated;
  } catch (error) {
    console.error("Remote Config 초기화 실패:", error);
    return false;
  }
};

/**
 * Remote Config에서 문자열 값 가져오기
 * @param key - 매개변수 키
 * @param defaultValue - 기본값 (optional)
 */
export const getConfigString = (
  key: string,
  defaultValue: string = ""
): string => {
  if (!remoteConfig) {
    console.warn(`Remote Config 미초기화: ${key} 기본값 반환`);
    return defaultValue;
  }

  try {
    const value = getString(remoteConfig, key) || defaultValue;
    const rawValue = getValue(remoteConfig, key);

    console.log("받아온 값 >> ", getString(remoteConfig, key));

    console.log(`Remote Config [${key}]:`, {
      value: value,
      source: rawValue.getSource(), // 값의 출처 (default, remote, static)
      defaultValue: defaultValue,
    });

    return value;
  } catch (error) {
    console.error(`Remote Config 값 가져오기 실패 (${key}):`, error);
    return defaultValue;
  }
};
