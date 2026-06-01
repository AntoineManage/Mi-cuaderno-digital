export interface SignaturePad {
  canvas: HTMLCanvasElement;
  isDrawing: boolean;
  lastX: number;
  lastY: number;
}

export const signatureService = {
  initializeCanvas: (canvas: HTMLCanvasElement, dpr: number = window.devicePixelRatio) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
  },

  getCoordinates: (e: TouchEvent | MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if (e instanceof TouchEvent) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  },

  startDrawing: (e: TouchEvent | MouseEvent, canvas: HTMLCanvasElement): SignaturePad => {
    const { x, y } = signatureService.getCoordinates(e, canvas);
    return {
      canvas,
      isDrawing: true,
      lastX: x,
      lastY: y,
    };
  },

  draw: (e: TouchEvent | MouseEvent, pad: SignaturePad) => {
    if (!pad.isDrawing) return;

    const { x, y } = signatureService.getCoordinates(e, pad.canvas);
    const ctx = pad.canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pad.lastX, pad.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    pad.lastX = x;
    pad.lastY = y;
  },

  stopDrawing: (pad: SignaturePad) => {
    pad.isDrawing = false;
  },

  clear: (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  isEmpty: (canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData.data.every(pixel => pixel === 0);
  },

  toBase64: (canvas: HTMLCanvasElement): string => {
    return canvas.toDataURL('image/png');
  },

  fromBase64: (canvas: HTMLCanvasElement, base64: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = base64;
  },
};
