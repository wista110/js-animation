const logos = [
    "https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png",
    "https://raw.githubusercontent.com/github/explore/main/topics/python/python.png",
    "https://raw.githubusercontent.com/github/explore/main/topics/java/java.png",
    "https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png"
];

// 底に着いたロゴを管理する配列
let landedLogos = [];

// ★ アニメーションエリア内のクリックのみを検知
const animationArea = document.querySelector('.animation-area');
const animationContent = document.querySelector('.animation-content');

animationArea.addEventListener('click', e => {
    // ラベルや底をクリックした場合は無視
    if (e.target.classList.contains('area-label') || e.target.classList.contains('ground')) return;
    
    const img = document.createElement('img');
    img.src = logos[Math.floor(Math.random() * logos.length)];
    const size = 40 + Math.random() * 40;
    img.style.width = size + 'px';
    img.className = 'logo';
    
    // ★ アニメーションエリア内での相対位置を取得（スクロール位置を考慮）
    const areaRect = animationArea.getBoundingClientRect();
    const relativeX = e.clientX - areaRect.left;
    const relativeY = e.clientY - areaRect.top + animationArea.scrollTop;
    
    // 開始位置（クリックした位置）
    const startX = relativeX - size/2;
    const startY = relativeY - size/2;
    
    // ★ 最終位置は常にエリアの最下部（横位置はクリック位置を基準にランダム調整）
    const finalX = calculateFinalPosition(relativeX - size/2, size, areaRect.width);
    const stackHeight = calculateStackHeight(finalX, size);
    const contentHeight = animationContent.offsetHeight;
    const finalY = contentHeight - 50 - size - stackHeight;
    
    // ★ 落下距離を計算
    const fallDistance = finalY - startY;
    
    // ★ 一定の落下速度を設定（ピクセル/秒）
    const fallSpeed = 50; // 300px/秒の速度で落下
    
    // ★ 落下時間を計算（最小1秒、最大4秒）
    const fallDuration = Math.max(1, Math.min(4, fallDistance / fallSpeed));
    
    // ★ ランダムな最終角度を生成（-30度から+30度の範囲）
    const finalRotation = (Math.random() - 0.5) * 60;
    
    // 開始位置を設定
    img.style.left = startX + 'px';
    img.style.top = startY + 'px';
    
    // アニメーションコンテンツ内に追加
    animationContent.appendChild(img);
    
    // CSS変数で最終位置、角度、アニメーション時間を設定
    img.style.setProperty('--final-x', finalX + 'px');
    img.style.setProperty('--final-y', finalY + 'px');
    img.style.setProperty('--start-x', startX + 'px');
    img.style.setProperty('--start-y', startY + 'px');
    img.style.setProperty('--final-rotation', finalRotation + 'deg');
    img.style.setProperty('--fall-duration', fallDuration + 's');  // ★ 計算された落下時間を設定
    
    // アニメーション開始
    img.classList.add('falling');
    
    // アニメーション終了後の処理
    img.addEventListener('animationend', () => {
        img.classList.remove('falling');
        img.classList.add('landed');
        
        // ★ 最終位置を確実に設定（CSS変数の値を直接適用）
        img.style.left = finalX + 'px';
        img.style.top = finalY + 'px';
        img.style.transform = `rotate(${finalRotation}deg) scale(1)`;
        
        landedLogos.push({
            element: img,
            x: finalX,
            y: finalY,
            width: size,
            height: size
        });
    });
});

// ★ エリア内での位置計算（横位置にランダム要素を追加）
function calculateFinalPosition(startX, logoWidth, areaWidth) {
    // クリック位置を基準に±20px程度のランダム調整
    let finalX = startX + (Math.random() - 0.5) * 40;
    
    // エリア内での端の調整
    if (finalX < 0) finalX = 0;
    if (finalX + logoWidth > areaWidth) finalX = areaWidth - logoWidth;
    
    return finalX;
}

// 積み重なりの高さを計算
function calculateStackHeight(x, width) {
    let stackHeight = 0;
    
    landedLogos.forEach(logo => {
        const logoX = logo.x;
        const logoWidth = logo.width;
        
        // ★ 重なり判定の範囲を調整
        if (Math.abs(x - logoX) < Math.max(width, logoWidth) * 0.7) {
            stackHeight += logo.height * 0.9;  // ★ 積み重ね間隔を調整
        }
    });
    
    return stackHeight;
}
  