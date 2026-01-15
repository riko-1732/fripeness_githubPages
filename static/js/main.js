document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const resultSection = document.getElementById("resultSection"); // HTMLに復活させます
  const resultContent = document.getElementById("resultContent"); // HTMLに復活させます
  const retryButton = document.getElementById("retryButton"); // HTMLに復活させます

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) return;

    // 1. ローディング表示
    if (loadingOverlay) loadingOverlay.style.display = "flex";
    if (resultSection) resultSection.style.display = "none";

    // 2. 画像を読み込んでJSで処理開始
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // ★ここでPythonの代わりにJSで計算！(一瞬で終わります)
      // 少しだけローディングを見せる演出を入れる(500ms)
      setTimeout(() => {
        const ripeness = calculateRipenessFromImage(img);

        // 3. 結果を表示
        showResult(objectUrl, ripeness);

        if (loadingOverlay) loadingOverlay.style.display = "none";
      }, 800);
    };

    img.src = objectUrl;
  });

  // 結果表示関数
  function showResult(imageUrl, ripeness) {
    if (resultSection && resultContent) {
      resultSection.style.display = "block";
      form.style.display = "none"; // フォームを隠す

      // i18n対応のために属性をつけることも可能ですが、
      // ここではシンプルに結果を表示します
      resultContent.innerHTML = `
                <div class="result-card">
                    <img src="${imageUrl}" alt="Analyzed Banana" style="max-width: 300px; border-radius: 10px; border: 3px solid #592d2d; margin-bottom: 20px;">
                    <h3>Result</h3>
                    <h4 style="font-size: 40px; color: #af0303;">${ripeness}%</h4>
                </div>
            `;
    }
  }

  // リトライボタンの処理
  if (retryButton) {
    retryButton.addEventListener("click", () => {
      resultSection.style.display = "none";
      form.style.display = "flex"; // フォームを再表示
      document.getElementById("preview").innerHTML = ""; // プレビュークリア
      form.reset();
    });
  }
});
