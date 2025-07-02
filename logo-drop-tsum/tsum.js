const logos = [
  "public/android-4.svg",
  "public/angular-icon-1.svg",
  "public/aws-2.svg",
  "public/bun-1.svg",
  "public/c--4.svg",
  "public/c-1.svg",
  "public/css-3.svg",
  "public/deno-2.svg",
  "public/docker-4.svg",
  "public/django.svg",
  "public/firebase-1.svg",
  "public/flutter-logo.svg",
  "public/git-icon.svg",
  "public/github-icon-1.svg",
  "public/go-8.svg",
  "public/google-cloud-1.svg",
  "public/Hono-logo.png",
  "public/html-1.svg",
  "public/java-14.svg",
  "public/javascript-1.svg",
  "public/jsr-3.svg",
  "public/kotlin-1.svg",
  "public/linux-tux.svg",
  "public/lua-5.svg",
  "public/mysql-logo-pure.svg",
  "public/next-js.svg",
  "public/nginx-1.svg",
  "public/nodejs-3.svg",
  "public/npm.svg",
  "public/nuxt-2.svg",
  "public/perl-programming-language.svg",
  "public/php-6.svg",
  "public/postgresql.svg",
  "public/prisma-4.svg",
  "public/python-5.svg",
  "public/react-2.svg",
  "public/redux.svg",
  "public/ruby.svg",
  "public/rust.svg",
  "public/rxjs-1.svg",
  "public/salesforce-2.svg",
  "public/scala-4.svg",
  "public/solidity.svg",
  "public/svelte-1.svg",
  "public/swift-15.svg",
  "public/tailwind-css-2.svg",
  "public/the-julia-programming-language.svg",
  "public/typescript-2.svg",
  "public/ubuntu-4.svg",
  "public/vim.svg",
  "public/visual-studio-code-1.svg",
  "public/visual-studio-2013.svg",
  "public/vue-9.svg",
  "public/webpack-icon.svg"
];
  
// 既存の積み上げロゴ情報（各ロゴ：{x, y, size}）
const stackedLogos = [];
  
function animateBounce(img, fromY, toY, duration = 900, onComplete) {
  const bounceHeight = 28;
  const start = performance.now();

  function easeOutQuad(t) { return t * (2 - t); }

  function animate(now) {
    let elapsed = now - start;
    let progress = Math.min(elapsed / duration, 1);

    if (progress < 0.82) {
      let p = easeOutQuad(progress / 0.82);
      img.style.top = (fromY + (toY - fromY) * p) + "px";
    } else {
      let bounceT = (progress - 0.82) / 0.18;
      let bounce = -Math.abs(Math.sin(Math.PI * bounceT)) * bounceHeight * (1 - bounceT);
      img.style.top = (toY + bounce) + "px";
    }
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      img.style.top = toY + "px";
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(animate);
}
  
// 新しいロゴが積むべき高さを判定する
function getStackY(x, size, floorY) {
  // クリックしたX座標中心（±幅の1/2以内）で一番高いYを探す
  let maxY = floorY; // 最初は床
  stackedLogos.forEach(logo => {
    // このロゴと新ロゴが横方向で重なっている場合
    if (!(x + size < logo.x || logo.x + logo.size < x)) {
      // 上に積みたい場合はmaxYを更新（※大きいほど下）
      if (logo.y < maxY) maxY = logo.y;
    }
  });
  return maxY;
}
  
document.body.addEventListener('click', e => {
  if (e.target.tagName === 'H2' || e.target.tagName === 'P') return;

  const size = 30 + Math.random() * 60; // 30〜90px正方形
  const img = document.createElement('img');
  img.src = logos[Math.floor(Math.random() * logos.length)];
  img.style.width = size + 'px';
  img.style.height = size + 'px';
  img.className = 'logo';

  // クリックした場所中心に配置
  const x = e.clientX - size / 2;
  const y = e.clientY - size / 2;
  img.style.left = x + 'px';
  img.style.top = y + 'px';
  document.body.appendChild(img);

  setTimeout(() => {
    const floor = document.getElementById('floor');
    const floorRect = floor.getBoundingClientRect();
    // ロゴの落下先Yは「積み上げ高さ」- ロゴサイズ
    const baseY = getStackY(x, size, floorRect.top) - size;
    animateBounce(img, y, baseY, 900, () => {
      // 完了後は「ロゴの底辺Y（baseY + size）」を保存
      stackedLogos.push({
        x: x,
        y: baseY,
        size: size
      });
    });
  }, 10);
});
  