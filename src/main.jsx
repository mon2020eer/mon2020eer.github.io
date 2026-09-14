import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/* اتجاه الصفحة ولغتها يُضبطان برمجياً أيضاً، لا في الوسم فقط —
   لأن معاينة الـ Artifact تغلّف الصفحة في هيكل <html> خاص بها. */
const root = document.documentElement;
root.setAttribute("dir", "rtl");
root.setAttribute("lang", "ar");

/* استعادة الوضع المختار قبل أول رسم، تفادياً لوميض الألوان */
try {
  const saved = localStorage.getItem("amt-theme");
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
} catch {
  /* التخزين قد يكون محجوباً في التصفح الخاص — لا يضر */
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
