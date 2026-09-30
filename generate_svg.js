const fs = require('fs');

const svgContent = `
<svg class="campus-svg" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" id="campusSvg">
    <style>
        .road { fill: #2a2a35; stroke: none; }
        .campus-bg { fill: #1a2e1f; }
        .building { fill: #d48b3b; stroke: #8b5a2b; stroke-width: 1; transition: all 0.3s; }
        .building-gray { fill: #7a7a7a; stroke: #4a4a4a; stroke-width: 1; }
        .building-highlight { cursor: pointer; }
        .building-highlight:hover { filter: brightness(1.3); }
        .fen-edebiyat { fill: #e63946; stroke: #900; stroke-width: 2; }
        .yemekhane { fill: #f4a261; stroke: #b05a11; stroke-width: 2; }
        .konferans { fill: #9b5de5; stroke: #5a2e99; stroke-width: 2; }
        .giris { fill: #2a9d8f; stroke: #1a5e56; stroke-width: 2; }
        .label { font-family: 'Inter', sans-serif; font-size: 14px; fill: #fff; font-weight: bold; pointer-events: none; }
        .road-label { font-family: 'Inter', sans-serif; font-size: 18px; fill: #aaa; }
        .walking-path { fill: none; stroke: #e9c46a; stroke-width: 3; stroke-dasharray: 10 5; animation: walk 2s linear infinite; }
        @keyframes walk { to { stroke-dashoffset: -15; } }
    </style>

    <!-- Campus Background (Green area) -->
    <path class="campus-bg" d="M 200,900 C 100,800 200,600 300,500 L 400,150 L 700,150 L 900,300 L 900,900 Z" />

    <!-- Roads -->
    <path class="road" d="M 350,150 L 950,150 L 950,120 L 350,120 Z" />
    <text class="road-label" x="500" y="110">Murat Paşa Sokak</text>

    <path class="road" d="M 900,150 L 1000,300 L 950,900 L 900,900 L 950,300 L 850,150 Z" />
    <text class="road-label" x="920" y="500" transform="rotate(80 920 500)">Kasr-ı Ali Caddesi</text>

    <path class="road" d="M 200,950 C 100,850 150,700 300,500 L 350,550 C 200,750 150,850 250,950 Z" />
    <text class="road-label" x="180" y="750" transform="rotate(-60 180 750)">Sarayyolu Caddesi</text>

    <!-- Atatürk Fen Lisesi Area (Excluded) -->
    <rect x="500" y="200" width="200" height="250" fill="#2c3e50" stroke="#1a252f" stroke-width="2" />
    <text class="road-label" x="600" y="325" text-anchor="middle" fill="#555" font-size="16">Atatürk Fen Lisesi</text>
    <text class="road-label" x="600" y="350" text-anchor="middle" fill="#555" font-size="12">(Harita Dışı)</text>

    <!-- General Buildings (Just shapes as requested) -->
    <!-- Top Right area -->
    <rect class="building" x="800" y="200" width="40" height="40" transform="rotate(45 820 220)" />
    <rect class="building" x="720" y="250" width="30" height="30" />
    <rect class="building" x="760" y="250" width="30" height="30" />
    <rect class="building" x="720" y="290" width="30" height="30" />
    <rect class="building" x="760" y="290" width="30" height="30" />
    <rect class="building" x="800" y="270" width="50" height="80" />

    <!-- Center/Left buildings -->
    <rect class="building" x="350" y="550" width="50" height="40" />
    <rect class="building" x="420" y="550" width="50" height="40" />
    <rect class="building" x="380" y="600" width="80" height="50" />
    
    <!-- Bottom left buildings -->
    <rect class="building" x="250" y="750" width="40" height="40" />
    <rect class="building" x="250" y="800" width="40" height="40" />
    <rect class="building" x="300" y="800" width="60" height="50" />

    <!-- Large building bottom right -->
    <path class="building" d="M 600,650 L 800,650 L 800,850 L 600,850 L 600,800 L 750,800 L 750,700 L 600,700 Z" />
    <rect class="building" x="820" y="700" width="50" height="150" />

    <!-- HIGHLIGHTED BUILDINGS -->

    <!-- 17: Fen Edebiyat Fakültesi (Large E-shape on the right) -->
    <g class="building-highlight" id="bld-fen-edebiyat" onclick="switchToFloor()">
        <path class="fen-edebiyat" d="M 720,400 L 850,400 L 850,600 L 720,600 L 720,550 L 800,550 L 800,520 L 720,520 L 720,480 L 800,480 L 800,450 L 720,450 Z" />
        <text class="label" x="830" y="500" text-anchor="middle" transform="rotate(90 830 500)">İnsan ve Toplum Bilimleri (Fen Edebiyat)</text>
    </g>

    <!-- 11: Yemekhane (Square on the left of Fen Lisesi/Fen Edebiyat) -->
    <g class="building-highlight" id="bld-yemekhane" onclick="highlightBuilding('bld-yemekhane')">
        <rect class="yemekhane" x="450" y="400" width="40" height="50" />
        <text class="label" x="470" y="430" text-anchor="middle" font-size="10">Yemekhane</text>
    </g>

    <!-- 26: İbrahim Üzümcü Konferans Salonu -->
    <g class="building-highlight" id="bld-konferans" onclick="highlightBuilding('bld-konferans')">
        <rect class="konferans" x="480" y="650" width="60" height="50" />
        <text class="label" x="510" y="675" text-anchor="middle" font-size="10">İbrahim Üzümcü</text>
        <text class="label" x="510" y="690" text-anchor="middle" font-size="10">Konf. Salonu</text>
    </g>

    <!-- Ana Giriş Kapısı -->
    <g class="building-highlight" id="bld-giris" onclick="highlightBuilding('bld-giris')">
        <circle class="giris" cx="300" cy="850" r="15" />
        <text class="label" x="300" y="880" text-anchor="middle" font-size="12">Giriş Kapısı</text>
    </g>

    <!-- Walking Path from Entrance to Fen Edebiyat -->
    <path class="walking-path" d="M 315,850 L 400,800 L 450,700 L 550,600 L 650,550 L 700,500" />
    <circle cx="720" cy="500" r="5" fill="#e9c46a" />

</svg>
`;

let html = fs.readFileSync('index.html', 'utf8');
// Replace the old SVG with the new one
html = html.replace(/<svg class="campus-svg"[\s\S]*?<\/svg>/, svgContent);
fs.writeFileSync('index.html', html);
console.log('SVG replaced');
