/**
 * Python(OpenCV)のロジックをJavaScriptで完全再現したファイル
 * 基準: OpenCVのHSVスケール (H:0-179, S:0-255, V:0-255) に合わせて計算します
 */

function calculateRipenessFromImage(imageElement) {
  // 1. 画像をCanvasに描画してピクセルデータを取得
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.drawImage(imageElement, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data; // [R, G, B, A, R, G, B, A, ...]

  let bananaPixelCount = 0;
  let totalHue = 0;
  let brownPixelCount = 0;

  // 2. 全ピクセルを走査
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // RGB を HSV (OpenCV Scale) に変換
    const hsv = rgbToHsvOpenCV(r, g, b);
    const h = hsv.h;
    const s = hsv.s;
    const v = hsv.v;

    // --- バナナの範囲抽出 (extract_banana) ---
    // Python: lower_white=[0,0,220], upper_white=[255,60,255]
    // これに含まれると「背景(白)」。含まれないものが「バナナ」
    const isWhite = s <= 60 && v >= 220;

    if (!isWhite) {
      bananaPixelCount++;
      totalHue += h;

      // --- シュガースポット判定 (calc_Spot_Bonus) ---
      // Mask1: H[0-25], S[0-225], V[0-127]
      // Mask2: H[170-179], S[0-225], V[0-127]
      const isBrown1 = h >= 0 && h <= 25 && s <= 225 && v <= 127;
      const isBrown2 = h >= 170 && h <= 179 && s <= 225 && v <= 127;

      if (isBrown1 || isBrown2) {
        brownPixelCount++;
      }
    }
  }

  if (bananaPixelCount === 0) return "0.00";

  // 3. ベーススコア計算 (calc_Base_Score)
  const meanH = totalHue / bananaPixelCount;
  const minH = 25; // FULL YELLOW
  const maxH = 40; // ALL GREEN

  let baseScore = 0;
  if (meanH >= maxH) {
    baseScore = 0;
  } else if (meanH <= minH) {
    baseScore = 80;
  } else {
    // 線形補間
    const ratio = (maxH - meanH) / (maxH - minH);
    baseScore = ratio * 80;
  }

  // 4. ボーナススコア計算 (calc_Spot_Bonus)
  const brownRatio = (brownPixelCount / bananaPixelCount) * 100;
  const bonusScore = brownRatio * 2.0;

  // 5. 合計
  let totalScore = baseScore + bonusScore;
  return totalScore.toFixed(2);
}

// ヘルパー関数: RGBをOpenCV基準のHSVに変換する
// H: 0-179, S: 0-255, V: 0-255
function rgbToHsvOpenCV(r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs);
  diff = v - Math.min(rabs, gabs, babs);
  diffc = (c) => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = (num) => Math.round(num * 100) / 100;

  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }

  // OpenCVスケールへの正規化
  return {
    h: Math.round(h * 179), // 0-179
    s: Math.round(s * 255), // 0-255
    v: Math.round(v * 255), // 0-255
  };
}
