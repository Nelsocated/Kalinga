import raw from "../../public/captures/layout.json";
import { parseLayout } from "./layout";

/** Where things sit on the captured screens (written by capture.ts). */
export const layout = parseLayout(raw);
