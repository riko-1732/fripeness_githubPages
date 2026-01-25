document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const loadingOverlay = document.getElementById("loadingOverlay");

  // モーダル制御のコードを追加
  const helpModal = document.getElementById("helpModal");
  const openHelpBtn = document.getElementById("openHelp");
  const closeHelpBtn = document.getElementById("closeHelp");

  // 開く
  if (openHelpBtn) {
    openHelpBtn.addEventListener("click", (e) => {
      e.preventDefault(); // フォーム送信などを防ぐ
      helpModal.style.display = "flex";
    });
  }

  // 閉じるボタン
  if (closeHelpBtn) {
    closeHelpBtn.addEventListener("click", () => {
      helpModal.style.display = "none";
    });
  }

  // 背景クリックでも閉じる
  if (helpModal) {
    helpModal.addEventListener("click", (e) => {
      if (e.target === helpModal) {
        helpModal.style.display = "none";
      }
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) return;

    // ローディング表示
    if (loadingOverlay) loadingOverlay.style.display = "flex";

    // 画像を読み込む
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    // Base64形式に変換して保存するためのFileReader
    const reader = new FileReader();

    reader.onload = function (event) {
      const base64Image = event.target.result;

      img.onload = () => {
        setTimeout(() => {
          // 計算実行 (ripeness_logic.jsの関数)
          const ripeness = calculateRipenessFromImage(img);

          // 結果と画像をSessionStorageに保存
          sessionStorage.setItem("ripenessResult", ripeness);
          sessionStorage.setItem("bananaImage", base64Image);

          // 結果ページへ遷移
          window.location.href = "result.html";
        }, 800);
      };
      img.src = objectUrl;
    };

    // 画像をBase64として読み込む開始
    reader.readAsDataURL(file);
  });
});
