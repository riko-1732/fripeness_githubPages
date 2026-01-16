document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("languageSelector");

  if (!selector) return;

  // 以前の設定 > ブラウザの言語 > 英語 の順で初期言語を決定
  const savedLang = localStorage.getItem("appLang");
  const browserLang = navigator.language.startsWith("ja") ? "ja" : "en";
  const currentLang = savedLang || browserLang;

  selector.value = currentLang;

  loadLanguage(currentLang);

  // 言語を切り替えた時の処理
  selector.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    loadLanguage(selectedLang);

    localStorage.setItem("appLang", selectedLang);
  });
});

async function loadLanguage(lang) {
  try {
    const response = await fetch(`static/locales/${lang}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const translations = await response.json();

    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[key]) {
        element.innerHTML = translations[key];
      }
    });

    document.documentElement.lang = lang;
  } catch (error) {
    console.error("Language file loading failed:", error);
  }
}
