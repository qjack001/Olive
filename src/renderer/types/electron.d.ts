import { electronApi } from "../../main/preload";

declare global {
  interface Window {
    menu: typeof electronApi;
  }
}
