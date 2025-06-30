const logos = [
    "https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png",
    "https://raw.githubusercontent.com/github/explore/main/topics/python/python.png",
    "https://raw.githubusercontent.com/github/explore/main/topics/java/java.png",
    "https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png"
  ];
  
  document.body.addEventListener('click', e => {
    if (e.target.tagName === 'H2' || e.target.tagName === 'P') return;
    const img = document.createElement('img');
    img.src = logos[Math.floor(Math.random() * logos.length)];
    const size = 40 + Math.random() * 60;
    img.style.width = size + 'px';
    img.className = 'logo';
    img.style.left = (e.clientX - size/2) + 'px';
    img.style.top = (e.clientY - size/2) + 'px';
    document.body.appendChild(img);
    img.addEventListener('animationend', () => {
      img.remove();
    });
  });
  