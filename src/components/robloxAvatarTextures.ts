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
 * 1. Face Texture - Exact Match to Reference Image
 * - Classic Roblox fair skin (#fae0cb)
 * - Forehead white paper talisman ("DO NOT TOUCH MY LOVE") with tape at top
 * - Bold anime squinting eyes pointing outward (< and >)
 * - Tilted open laughing mouth with single sharp white fang on upper left and pink tongue at bottom
 */
export function createFaceTexture(): THREE.CanvasTexture | null {
  return makeCanvas(512, 512, (ctx) => {
    // 1. Base skin tone
    ctx.fillStyle = '#fae0cb';
    ctx.fillRect(0, 0, 512, 512);

    // Soft warm blush under eyes
    const blushL = ctx.createRadialGradient(145, 340, 5, 145, 340, 48);
    blushL.addColorStop(0, 'rgba(255, 130, 140, 0.35)');
    blushL.addColorStop(1, 'rgba(255, 130, 140, 0)');
    ctx.fillStyle = blushL;
    ctx.beginPath();
    ctx.arc(145, 340, 48, 0, Math.PI * 2);
    ctx.fill();

    const blushR = ctx.createRadialGradient(367, 340, 5, 367, 340, 48);
    blushR.addColorStop(0, 'rgba(255, 130, 140, 0.35)');
    blushR.addColorStop(1, 'rgba(255, 130, 140, 0)');
    ctx.fillStyle = blushR;
    ctx.beginPath();
    ctx.arc(367, 340, 48, 0, Math.PI * 2);
    ctx.fill();

    // -------------------------------------------------------------
    // 2. Forehead Talisman / Paper Tag ("DO NOT TOUCH MY LOVE")
    // Hangs vertically down the center of the forehead
    // -------------------------------------------------------------
    ctx.save();
    const tagX = 250;
    const tagY = 205; // Center of tag
    const tagW = 104;
    const tagH = 158;

    // Subtle paper shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(tagX - tagW / 2 + 4, tagY - tagH / 2 + 4, tagW, tagH);

    // Paper background
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(tagX - tagW / 2, tagY - tagH / 2, tagW, tagH);

    // Paper fine dark border
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(tagX - tagW / 2 + 2, tagY - tagH / 2 + 2, tagW - 4, tagH - 4);

    // Jagged / torn bottom edge detail
    ctx.fillStyle = '#fae0cb'; // skin color cutting into paper bottom
    ctx.beginPath();
    ctx.moveTo(tagX - tagW / 2 - 2, tagY + tagH / 2);
    ctx.lineTo(tagX - tagW / 4, tagY + tagH / 2 - 6);
    ctx.lineTo(tagX, tagY + tagH / 2);
    ctx.lineTo(tagX + tagW / 4, tagY + tagH / 2 - 5);
    ctx.lineTo(tagX + tagW / 2 + 2, tagY + tagH / 2);
    ctx.lineTo(tagX + tagW / 2 + 2, tagY + tagH / 2 + 10);
    ctx.lineTo(tagX - tagW / 2 - 2, tagY + tagH / 2 + 10);
    ctx.closePath();
    ctx.fill();

    // Tape at the top of the tag
    ctx.fillStyle = 'rgba(235, 230, 220, 0.9)';
    ctx.fillRect(tagX - 22, tagY - tagH / 2 - 14, 44, 22);
    ctx.strokeStyle = 'rgba(180, 170, 155, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tagX - 22, tagY - tagH / 2 - 14, 44, 22);

    // Text on talisman (Exact lines from the reference)
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = '900 16px "Arial Black", Impact, sans-serif';
    ctx.fillText('DO', tagX, tagY - 48);
    ctx.font = '900 17px "Arial Black", Impact, sans-serif';
    ctx.fillText('NOT', tagX, tagY - 26);
    ctx.font = '900 14px "Arial Black", Impact, sans-serif';
    ctx.fillText('TOUCH', tagX, tagY - 6);
    ctx.font = '900 15px "Arial Black", Impact, sans-serif';
    ctx.fillText('MY', tagX, tagY + 14);
    ctx.font = '900 16px "Arial Black", Impact, sans-serif';
    ctx.fillText('LOVE', tagX, tagY + 36);

    // Bottom seal / barcode lines
    ctx.fillStyle = '#334155';
    for (let bx = tagX - 35; bx <= tagX + 35; bx += 7) {
      const bw = bx % 14 === 0 ? 3.5 : 2;
      ctx.fillRect(bx, tagY + 54, bw, 10);
    }

    ctx.restore();

    // -------------------------------------------------------------
    // 3. Anime Squinting Eyes
    // Bold, crisp black lines pointing outward (< on left, > on right)
    // -------------------------------------------------------------
    ctx.strokeStyle = '#111111';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left Eye (< pointing to the left)
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(186, 268);
    ctx.lineTo(112, 285);
    ctx.lineTo(178, 312);
    ctx.stroke();

    // Left eye cute top lash
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(136, 280);
    ctx.lineTo(124, 264);
    ctx.stroke();

    // Right Eye (> pointing to the right) - Clear & prominent in reference!
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(318, 268);
    ctx.lineTo(396, 285);
    ctx.lineTo(326, 312);
    ctx.stroke();

    // Right eye cute top lash
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(372, 280);
    ctx.lineTo(384, 264);
    ctx.stroke();

    // -------------------------------------------------------------
    // 4. Mischievous Laughing Mouth with Single Sharp Fang
    // Tilted upwards on the right side
    // -------------------------------------------------------------
    ctx.save();
    ctx.beginPath();

    // Upper lip starts at left (192, 356), dips slightly and rises high to right (328, 332)
    ctx.moveTo(192, 356);
    ctx.quadraticCurveTo(256, 352, 328, 332);
    // Lower lip drops down to deep cheerful smile (258, 428)
    ctx.quadraticCurveTo(342, 412, 258, 428);
    ctx.quadraticCurveTo(180, 412, 192, 356);
    ctx.closePath();

    // Deep crimson / ruby red mouth interior
    ctx.fillStyle = '#a61c22';
    ctx.fill();

    // Clip inside mouth to draw tongue and fang
    ctx.clip();

    // Rounded pink tongue at the bottom of the mouth
    ctx.fillStyle = '#ea7e8a';
    ctx.beginPath();
    ctx.ellipse(262, 432, 54, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Single Sharp White Vampire / Anime Fang on Upper Left!
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(204, 354);
    ctx.lineTo(215, 386); // Sharp downward tip
    ctx.lineTo(230, 354);
    ctx.closePath();
    ctx.fill();

    // Fang black outline
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();

    // Outer bold mouth outline
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(192, 356);
    ctx.quadraticCurveTo(256, 352, 328, 332);
    ctx.quadraticCurveTo(342, 412, 258, 428);
    ctx.quadraticCurveTo(180, 412, 192, 356);
    ctx.closePath();
    ctx.stroke();

    // Smirk corner tick on upper right
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(328, 332);
    ctx.lineTo(340, 324);
    ctx.stroke();
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

    // Crossbody Strap (Avatar's Right Shoulder -> Left Hip)
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

    // Pusheen with Glasses Graphic (Centered on chest)
    ctx.save();
    const cx = 252;
    const cy = 295;

    // Body shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 92, 105, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pusheen body base
    ctx.fillStyle = '#cfbeab';
    ctx.strokeStyle = '#4a3c30';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(cx - 38, cy - 75);
    ctx.lineTo(cx - 72, cy - 110);
    ctx.lineTo(cx - 86, cy - 65);
    ctx.bezierCurveTo(cx - 128, cy - 20, cx - 132, cy + 50, cx - 105, cy + 85);
    ctx.bezierCurveTo(cx - 75, cy + 104, cx + 75, cy + 104, cx + 105, cy + 85);
    ctx.bezierCurveTo(cx + 132, cy + 50, cx + 128, cy - 20, cx + 86, cy - 65);
    ctx.lineTo(cx + 72, cy - 110);
    ctx.lineTo(cx + 38, cy - 75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tabby Stripes on head
    ctx.fillStyle = '#7a6a5d';
    ctx.beginPath();
    ctx.roundRect(cx - 7, cy - 82, 14, 22, 6);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx - 32, cy - 74, 12, 18, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cx + 20, cy - 74, 12, 18, 5);
    ctx.fill();

    // Tabby stripes on back
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

    // Eyes behind glasses
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
    ctx.beginPath();
    ctx.arc(cx - 36, cy - 20, 26, 0, Math.PI * 2);
    ctx.stroke();
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

    // Cute Cat Mouth :3
    ctx.strokeStyle = '#4a3c30';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx - 9, cy + 12, 9, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 9, cy + 12, 9, 0, Math.PI);
    ctx.stroke();

    // Whiskers
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 4);
    ctx.lineTo(cx - 120, cy - 14);
    ctx.moveTo(cx - 82, cy + 12);
    ctx.lineTo(cx - 124, cy + 12);
    ctx.moveTo(cx - 80, cy + 28);
    ctx.lineTo(cx - 118, cy + 38);

    ctx.moveTo(cx + 80, cy - 4);
    ctx.lineTo(cx + 120, cy - 14);
    ctx.moveTo(cx + 82, cy + 12);
    ctx.lineTo(cx + 124, cy + 12);
    ctx.moveTo(cx + 80, cy + 28);
    ctx.lineTo(cx + 118, cy + 38);
    ctx.stroke();

    // Cute front paws
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
 */
export function createBackpackPusheenTexture(): THREE.CanvasTexture | null {
  return makeCanvas(512, 512, (ctx) => {
    ctx.fillStyle = '#cfbfad';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 1);
    }
    for (let x = 0; x < 512; x += 4) {
      ctx.fillRect(x, 0, 1, 512);
    }

    ctx.strokeStyle = '#9c8772';
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, 492, 492);

    ctx.fillStyle = '#b3a08d';
    ctx.strokeStyle = '#826f5d';
    ctx.lineWidth = 4;

    ctx.fillRect(70, 0, 48, 512);
    ctx.strokeRect(70, 0, 48, 512);

    ctx.fillRect(394, 0, 48, 512);
    ctx.strokeRect(394, 0, 48, 512);

    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.fillRect(74, 380, 40, 30);
    ctx.strokeRect(74, 380, 40, 30);
    ctx.fillRect(398, 380, 40, 30);
    ctx.strokeRect(398, 380, 40, 30);

    // Pusheen Eating Donut
    ctx.save();
    const cx = 256;
    const cy = 250;

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

    ctx.strokeStyle = '#2d221c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx - 32, cy - 26, 12, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 32, cy - 26, 12, Math.PI, 0);
    ctx.stroke();

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

    // Strawberry Donut
    ctx.fillStyle = '#fcd34d';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy + 28, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#d6c7b6';
    ctx.beginPath();
    ctx.arc(cx, cy + 28, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(cx, cy + 27, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d6c7b6';
    ctx.beginPath();
    ctx.arc(cx, cy + 27, 16, 0, Math.PI * 2);
    ctx.fill();

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
 * 4. Banknotes Texture
 */
export function createCashNotesTexture(): THREE.CanvasTexture | null {
  return makeCanvas(256, 128, (ctx) => {
    ctx.fillStyle = '#c7eae5';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = '#2b7a78';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 244, 116);

    ctx.strokeStyle = '#3aafa9';
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, 228, 100);

    ctx.fillStyle = '#17252a';
    ctx.font = 'bold 36px monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100', 128, 64);

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
 * 5. Cargo Pants Texture
 */
export function createPantsTexture(): THREE.CanvasTexture | null {
  return makeCanvas(512, 512, (ctx) => {
    ctx.fillStyle = '#f4f5f7';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = 'rgba(0,0,0,0.015)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 1);
    }

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(80, 160, 140, 170);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(75, 150, 150, 45);
    ctx.strokeRect(75, 150, 150, 45);

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(150, 172, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(40, 360);
    ctx.lineTo(470, 360);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 440, 512, 72);
    ctx.strokeRect(0, 440, 512, 72);
  });
}
