import * as THREE from 'three';

// Helper to generate CanvasTexture safely in client-side Next.js
function makeCanvas(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * 1. Face Texture
 * Expressive Roblox anime face:
 * - squinting "> <" laughing eyes
 * - wide cheerful open mouth with teeth and pink tongue
 * - forehead paper sticker with "PLEASE / DO NOT / HURT MY LOVE" aesthetic text
 */
export function createFaceTexture(): THREE.CanvasTexture | null {
  return makeCanvas(512, 512, (ctx) => {
    // Base skin color
    ctx.fillStyle = '#fae0cb';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle skin blush
    const gradL = ctx.createRadialGradient(150, 310, 10, 150, 310, 50);
    gradL.addColorStop(0, 'rgba(255, 140, 150, 0.45)');
    gradL.addColorStop(1, 'rgba(255, 140, 150, 0)');
    ctx.fillStyle = gradL;
    ctx.beginPath();
    ctx.arc(150, 310, 50, 0, Math.PI * 2);
    ctx.fill();

    const gradR = ctx.createRadialGradient(362, 310, 10, 362, 310, 50);
    gradR.addColorStop(0, 'rgba(255, 140, 150, 0.45)');
    gradR.addColorStop(1, 'rgba(255, 140, 150, 0)');
    ctx.fillStyle = gradR;
    ctx.beginPath();
    ctx.arc(362, 310, 50, 0, Math.PI * 2);
    ctx.fill();

    // -------------------------------------------------------------
    // Eyes: Anime Laughing / Squinting "> <"
    // -------------------------------------------------------------
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left Eye: ">"
    ctx.beginPath();
    ctx.moveTo(120, 240);
    ctx.lineTo(175, 268);
    ctx.lineTo(125, 295);
    ctx.stroke();

    // Left eye lashes / accents
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(155, 242);
    ctx.lineTo(170, 230);
    ctx.moveTo(140, 292);
    ctx.lineTo(145, 308);
    ctx.stroke();

    // Right Eye: "<"
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(392, 240);
    ctx.lineTo(337, 268);
    ctx.lineTo(387, 295);
    ctx.stroke();

    // Right eye lashes / accents
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(357, 242);
    ctx.lineTo(342, 230);
    ctx.moveTo(372, 292);
    ctx.lineTo(367, 308);
    ctx.stroke();

    // -------------------------------------------------------------
    // Mouth: Wide cheerful open laughing mouth (classic Roblox XD)
    // -------------------------------------------------------------
    ctx.save();
    ctx.beginPath();
    // Mouth shape
    ctx.moveTo(195, 325);
    ctx.quadraticCurveTo(256, 320, 317, 325);
    ctx.quadraticCurveTo(325, 400, 256, 408);
    ctx.quadraticCurveTo(187, 400, 195, 325);
    ctx.closePath();

    // Mouth background fill (deep ruby red)
    ctx.fillStyle = '#b91c1c';
    ctx.fill();

    // Clip inside mouth for teeth & tongue
    ctx.clip();

    // Top teeth
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(200, 325);
    ctx.lineTo(312, 325);
    ctx.lineTo(306, 348);
    ctx.quadraticCurveTo(256, 354, 206, 348);
    ctx.closePath();
    ctx.fill();

    // Teeth line detail
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(256, 325);
    ctx.lineTo(256, 350);
    ctx.stroke();

    // Tongue
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(256, 415, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Mouth outline
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(195, 325);
    ctx.quadraticCurveTo(256, 320, 317, 325);
    ctx.quadraticCurveTo(325, 400, 256, 408);
    ctx.quadraticCurveTo(187, 400, 195, 325);
    ctx.closePath();
    ctx.stroke();

    // Cute mouth corner ticks
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(195, 325);
    ctx.lineTo(185, 318);
    ctx.moveTo(317, 325);
    ctx.lineTo(327, 318);
    ctx.stroke();

    // -------------------------------------------------------------
    // Forehead Sticker: Paper Talisman ("NOT MY LOVE")
    // Tilted slightly on forehead
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(248, 115);
    ctx.rotate(0.08); // Slight organic tilt

    // Paper drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(-58, -80, 120, 112);

    // Paper slip body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-60, -82, 120, 110);

    // Paper inner border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.strokeRect(-55, -77, 110, 100);

    // Tape at the top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(-22, -90, 44, 18);
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-22, -90, 44, 18);

    // Text on paper
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 16px "Courier New", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PLEASE', 0, -56);
    ctx.font = '900 18px "Courier New", monospace, sans-serif';
    ctx.fillText('NOT', 0, -34);
    ctx.font = '900 14px "Courier New", monospace, sans-serif';
    ctx.fillText('MY LOVE', 0, -14);

    // Barcode / talisman symbol at bottom
    ctx.fillStyle = '#334155';
    for (let x = -40; x <= 40; x += 7) {
      const barW = (x % 14 === 0) ? 4 : 2;
      ctx.fillRect(x, 4, barW, 12);
    }

    ctx.restore();
  });
}

/**
 * 2. Shirt Front Texture
 * Crisp white shirt with:
 * - Pusheen the cat wearing round black-framed glasses
 * - Diagonally crossing messenger bag strap
 */
export function createShirtFrontTexture(): THREE.CanvasTexture | null {
  return makeCanvas(512, 512, (ctx) => {
    // Pure crisp white t-shirt background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);

    // Crew neckline trim
    ctx.fillStyle = '#edeef2';
    ctx.beginPath();
    ctx.arc(256, 0, 95, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(256, 0, 78, 0, Math.PI);
    ctx.fill();

    // -------------------------------------------------------------
    // Crossbody Strap (Avatar's Right Shoulder -> Left Hip)
    // Runs from top-left (approx x=90, y=0) to bottom-right (x=460, y=512)
    // -------------------------------------------------------------
    ctx.save();
    ctx.strokeStyle = '#c4b3a2';
    ctx.lineWidth = 52;
    ctx.beginPath();
    ctx.moveTo(60, -20);
    ctx.lineTo(470, 530);
    ctx.stroke();

    // Strap edge stitches
    ctx.strokeStyle = '#9c8874';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(42, -20);
    ctx.lineTo(452, 530);
    ctx.moveTo(78, -20);
    ctx.lineTo(488, 530);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // -------------------------------------------------------------
    // Pusheen with Glasses Graphic (Centered on chest)
    // -------------------------------------------------------------
    ctx.save();
    const cx = 252;
    const cy = 295;

    // Body shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 92, 105, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pusheen body base
    ctx.fillStyle = '#cfbeab'; // Pusheen warm soft taupe-gray
    ctx.strokeStyle = '#4a3c30'; // Dark brown outline
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    // Start at top center between ears
    ctx.moveTo(cx - 38, cy - 75);
    // Left ear
    ctx.lineTo(cx - 72, cy - 110);
    ctx.lineTo(cx - 86, cy - 65);
    // Left body side curve
    ctx.bezierCurveTo(cx - 128, cy - 20, cx - 132, cy + 50, cx - 105, cy + 85);
    // Bottom curve
    ctx.bezierCurveTo(cx - 75, cy + 104, cx + 75, cy + 104, cx + 105, cy + 85);
    // Right body side curve
    ctx.bezierCurveTo(cx + 132, cy + 50, cx + 128, cy - 20, cx + 86, cy - 65);
    // Right ear
    ctx.lineTo(cx + 72, cy - 110);
    ctx.lineTo(cx + 38, cy - 75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tabby Stripes on head
    ctx.fillStyle = '#7a6a5d';
    // Center stripe
    ctx.beginPath();
    ctx.roundRect(cx - 7, cy - 82, 14, 22, 6);
    ctx.fill();
    // Left stripe
    ctx.beginPath();
    ctx.roundRect(cx - 32, cy - 74, 12, 18, 5);
    ctx.fill();
    // Right stripe
    ctx.beginPath();
    ctx.roundRect(cx + 20, cy - 74, 12, 18, 5);
    ctx.fill();

    // Tabby stripes on back (left side of cat)
    ctx.beginPath();
    ctx.roundRect(cx - 114, cy - 12, 24, 11, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx - 118, cy + 16, 26, 11, 5);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy - 96);
    ctx.lineTo(cx - 60, cy - 72);
    ctx.lineTo(cx - 76, cy - 72);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 70, cy - 96);
    ctx.lineTo(cx + 76, cy - 72);
    ctx.lineTo(cx + 60, cy - 72);
    ctx.closePath();
    ctx.fill();

    // -------------------------------------------------------------
    // Thick Round Glasses & Eyes
    // -------------------------------------------------------------
    // Cat eyes behind glasses
    ctx.fillStyle = '#221915';
    ctx.beginPath();
    ctx.arc(cx - 36, cy - 20, 8, 0, Math.PI * 2);
    ctx.arc(cx + 36, cy - 20, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eye shines
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 38, cy - 23, 3, 0, Math.PI * 2);
    ctx.arc(cx + 34, cy - 23, 3, 0, Math.PI * 2);
    ctx.fill();

    // Black nerd glasses frames
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 8;

    // Left lens
    ctx.beginPath();
    ctx.arc(cx - 36, cy - 20, 26, 0, Math.PI * 2);
    ctx.stroke();

    // Right lens
    ctx.beginPath();
    ctx.arc(cx + 36, cy - 20, 26, 0, Math.PI * 2);
    ctx.stroke();

    // Glasses bridge
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 20);
    ctx.lineTo(cx + 10, cy - 20);
    ctx.stroke();

    // Glasses frame sides
    ctx.beginPath();
    ctx.moveTo(cx - 62, cy - 20);
    ctx.lineTo(cx - 82, cy - 24);
    ctx.moveTo(cx + 62, cy - 20);
    ctx.lineTo(cx + 82, cy - 24);
    ctx.stroke();

    // Cute Cat Nose & Mouth :3
    ctx.strokeStyle = '#4a3c30';
    ctx.lineWidth = 5;
    ctx.beginPath();
    // Mouth curve
    ctx.arc(cx - 9, cy + 12, 9, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 9, cy + 12, 9, 0, Math.PI);
    ctx.stroke();

    // Whiskers (3 on each side)
    ctx.lineWidth = 4;
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 4);
    ctx.lineTo(cx - 120, cy - 14);
    ctx.moveTo(cx - 82, cy + 12);
    ctx.lineTo(cx - 124, cy + 12);
    ctx.moveTo(cx - 80, cy + 28);
    ctx.lineTo(cx - 118, cy + 38);
    // Right whiskers
    ctx.moveTo(cx + 80, cy - 4);
    ctx.lineTo(cx + 120, cy - 14);
    ctx.moveTo(cx + 82, cy + 12);
    ctx.lineTo(cx + 124, cy + 12);
    ctx.moveTo(cx + 80, cy + 28);
    ctx.lineTo(cx + 118, cy + 38);
    ctx.stroke();

    // Cute front paws together
    ctx.fillStyle = '#cfbeab';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(cx - 24, cy + 56, 15, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + 24, cy + 56, 15, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  });
}

/**
 * 3. Backpack Pusheen with Donut Texture
 * Displayed on the back of the tan messenger duffle bag:
 * - Pusheen eating a pink strawberry glazed donut with sprinkles
 * - Canvas bag fabric texture and leather straps
 */
export function createBackpackPusheenTexture(): THREE.CanvasTexture | null {
  return makeCanvas(512, 512, (ctx) => {
    // Bag canvas background
    ctx.fillStyle = '#cfbfad';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle canvas fabric weave texture
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 1);
    }
    for (let x = 0; x < 512; x += 4) {
      ctx.fillRect(x, 0, 1, 512);
    }

    // Outer edge border / piping
    ctx.strokeStyle = '#9c8772';
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, 492, 492);

    // Vertical bag leather straps
    ctx.fillStyle = '#b3a08d';
    ctx.strokeStyle = '#826f5d';
    ctx.lineWidth = 4;

    ctx.fillRect(70, 0, 48, 512);
    ctx.strokeRect(70, 0, 48, 512);

    ctx.fillRect(394, 0, 48, 512);
    ctx.strokeRect(394, 0, 48, 512);

    // Metal buckles on straps
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.fillRect(74, 380, 40, 30);
    ctx.strokeRect(74, 380, 40, 30);
    ctx.fillRect(398, 380, 40, 30);
    ctx.strokeRect(398, 380, 40, 30);

    // -------------------------------------------------------------
    // Pusheen Eating Donut Illustration
    // -------------------------------------------------------------
    ctx.save();
    const cx = 256;
    const cy = 250;

    // Body base
    ctx.fillStyle = '#d6c7b6';
    ctx.strokeStyle = '#4a3c30';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(cx - 34, cy - 70);
    ctx.lineTo(cx - 65, cy - 100);
    ctx.lineTo(cx - 78, cy - 60);
    ctx.bezierCurveTo(cx - 115, cy - 20, cx - 120, cy + 45, cx - 95, cy + 78);
    ctx.bezierCurveTo(cx - 65, cy + 95, cx + 65, cy + 95, cx + 95, cy + 78);
    ctx.bezierCurveTo(cx + 120, cy + 45, cx + 115, cy - 20, cx + 78, cy - 60);
    ctx.lineTo(cx + 65, cy - 100);
    ctx.lineTo(cx + 34, cy - 70);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stripes on head
    ctx.fillStyle = '#7a6a5d';
    ctx.beginPath();
    ctx.roundRect(cx - 6, cy - 76, 12, 18, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx - 28, cy - 70, 10, 16, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx + 18, cy - 70, 10, 16, 4);
    ctx.fill();

    // Happy closed eyes "^ ^"
    ctx.strokeStyle = '#2d221c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx - 32, cy - 26, 12, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 32, cy - 26, 12, Math.PI, 0);
    ctx.stroke();

    // Cat Whiskers
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 68, cy - 12);
    ctx.lineTo(cx - 104, cy - 20);
    ctx.moveTo(cx - 70, cy + 4);
    ctx.lineTo(cx - 108, cy + 4);
    ctx.moveTo(cx + 68, cy - 12);
    ctx.lineTo(cx + 104, cy - 20);
    ctx.moveTo(cx + 70, cy + 4);
    ctx.lineTo(cx + 108, cy + 4);
    ctx.stroke();

    // -------------------------------------------------------------
    // Delicious Strawberry Donut with Sprinkles!
    // -------------------------------------------------------------
    // Donut dough base
    ctx.fillStyle = '#fcd34d'; // golden dough
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy + 28, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Donut hole
    ctx.fillStyle = '#d6c7b6'; // cat body showing through
    ctx.beginPath();
    ctx.arc(cx, cy + 28, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pink strawberry icing
    ctx.fillStyle = '#f472b6'; // bright pink icing
    ctx.beginPath();
    ctx.arc(cx, cy + 27, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d6c7b6';
    ctx.beginPath();
    ctx.arc(cx, cy + 27, 16, 0, Math.PI * 2);
    ctx.fill();

    // Sprinkles on donut!
    const sprinkleColors = ['#ffffff', '#38bdf8', '#facc15', '#4ade80'];
    const sprinkles = [
      { x: cx - 22, y: cy + 12, rot: 0.3, col: sprinkleColors[0] },
      { x: cx + 18, y: cy + 10, rot: -0.4, col: sprinkleColors[1] },
      { x: cx - 24, y: cy + 34, rot: 0.7, col: sprinkleColors[2] },
      { x: cx + 22, y: cy + 32, rot: -0.2, col: sprinkleColors[3] },
      { x: cx, y: cy + 54, rot: 0.1, col: sprinkleColors[0] },
      { x: cx - 12, y: cy + 48, rot: -0.6, col: sprinkleColors[1] },
      { x: cx + 12, y: cy + 48, rot: 0.5, col: sprinkleColors[2] },
    ];

    sprinkles.forEach((s) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.fillStyle = s.col;
      ctx.fillRect(-5, -2, 10, 4);
      ctx.restore();
    });

    // Paws holding the donut
    ctx.fillStyle = '#d6c7b6';
    ctx.strokeStyle = '#4a3c30';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.ellipse(cx - 36, cy + 22, 14, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + 36, cy + 22, 14, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  });
}

/**
 * 4. Banknotes Texture for cash sticking out of backpack
 */
export function createCashNotesTexture(): THREE.CanvasTexture | null {
  return makeCanvas(256, 128, (ctx) => {
    // Light cyan/mint currency note (Euro/Roblox cash)
    ctx.fillStyle = '#c7eae5';
    ctx.fillRect(0, 0, 256, 128);

    // Dark border
    ctx.strokeStyle = '#2b7a78';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 244, 116);

    // Inner guilloche patterns
    ctx.strokeStyle = '#3aafa9';
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, 228, 100);

    // Center denomination
    ctx.fillStyle = '#17252a';
    ctx.font = 'bold 36px monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100', 128, 64);

    // Subtle lines
    ctx.strokeStyle = '#3aafa9';
    ctx.lineWidth = 1.5;
    for (let x = 30; x < 90; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 108);
      ctx.stroke();
    }
    for (let x = 166; x < 226; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, 108);
      ctx.stroke();
    }
  });
}

/**
 * 5. Cargo Pants Texture (Pockets, seams, creases)
 */
export function createPantsTexture(): THREE.CanvasTexture | null {
  return makeCanvas(512, 512, (ctx) => {
    // Pure white / soft cream denim
    ctx.fillStyle = '#f4f5f7';
    ctx.fillRect(0, 0, 512, 512);

    // Soft denim fabric texture
    ctx.fillStyle = 'rgba(0,0,0,0.015)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 1);
    }

    // Side cargo flap pocket stitching
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;

    // Pocket shape
    ctx.strokeRect(80, 160, 140, 170);
    // Flap
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(75, 150, 150, 45);
    ctx.strokeRect(75, 150, 150, 45);

    // Flap button
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(150, 172, 8, 0, Math.PI * 2);
    ctx.fill();

    // Knee seam
    ctx.beginPath();
    ctx.moveTo(40, 360);
    ctx.lineTo(470, 360);
    ctx.stroke();

    // Rolled bottom cuff
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 440, 512, 72);
    ctx.strokeRect(0, 440, 512, 72);
  });
}
