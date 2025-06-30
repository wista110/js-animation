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

animationArea.addEventListener('click', e => {
    // ラベルや底をクリックした場合は無視
    if (e.target.classList.contains('area-label') || e.target.classList.contains('ground')) return;
    
    const img = document.createElement('img');
    img.src = logos[Math.floor(Math.random() * logos.length)];
    const size = 40 + Math.random() * 40;
    img.style.width = size + 'px';
    img.className = 'logo';
    
    // ★ アニメーションエリア内での相対位置を取得
    const areaRect = animationArea.getBoundingClientRect();
    const relativeX = e.clientX - areaRect.left;
    const relativeY = e.clientY - areaRect.top;
    
    // 開始位置（エリア内の相対位置）
    const startX = relativeX - size/2;
    const startY = relativeY - size/2;
    
    // 最終位置を計算（エリア内で完結）
    const finalX = calculateFinalPosition(startX, size, areaRect.width);
    const stackHeight = calculateStackHeight(finalX, size);
    const areaHeight = areaRect.height;
    const finalY = areaHeight - 50 - size - stackHeight;  // 底の上
    
    // 開始位置を設定
    img.style.left = startX + 'px';
    img.style.top = startY + 'px';
    
    // ★ アニメーションエリア内に追加
    animationArea.appendChild(img);
    
    // CSS変数で最終位置を設定
    img.style.setProperty('--final-x', finalX + 'px');
    img.style.setProperty('--final-y', finalY + 'px');
    img.style.setProperty('--start-x', startX + 'px');
    img.style.setProperty('--start-y', startY + 'px');
    
    // アニメーション開始
    img.classList.add('falling');
    
    // アニメーション終了後の処理
    img.addEventListener('animationend', () => {
        img.classList.remove('falling');
        img.classList.add('landed');
        
        landedLogos.push({
            element: img,
            x: finalX,
            width: size,
            height: size
        });
    });
});

// ★ エリア内での位置計算に修正
function calculateFinalPosition(startX, logoWidth, areaWidth) {
    let finalX = startX;
    
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
        
        if (Math.abs(x - logoX) < Math.max(width, logoWidth) * 0.8) {
            stackHeight += logo.height * 0.8;
        }
    });
    
    return stackHeight;
}
  