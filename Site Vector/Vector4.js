const upload = document.getElementById('upload');
const originalImg = document.getElementById('original');
const canvas = document.getElementById('vectorized');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = (event) => {
originalImg.src = event.target.result;
};
reader.readAsDataURL(file);
});

function vectorize() {
if (!originalImg.src || originalImg.src === "#") {
alert("Por favor, envie uma imagem primeiro.");
return;
}
const threshold = document.getElementById('threshold').value;
const colors = document.getElementById('colors').value;
const smoothing = document.getElementById('smoothing').value;
const minsize = document.getElementById('minsize').value;

const img = new Image();
img.crossOrigin = "anonymous";
img.src = originalImg.src;
img.onload = () => {
canvas.width = img.width;
canvas.height = img.height;
ctx.drawImage(img, 0, 0);
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// Aplicar Threshold simples
for (let i = 0; i < imageData.data.length; i += 4) {
let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
let value = avg > threshold ? 255 : 0;
imageData.data[i] = value;
imageData.data[i + 1] = value;
imageData.data[i + 2] = value;
}

ctx.putImageData(imageData, 0, 0);

// Suavizar (apenas uma ideia simples)
if (smoothing > 0) {
for (let i = 0; i < smoothing; i++) {
ctx.filter = "blur(1px)";
ctx.drawImage(canvas, 0, 0);
ctx.filter = "none";
}
}

// Colorir baseado em número de cores
recolorize(colors);
}
}

function recolorize(colors) {
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const steps = 255 / (colors - 1);

for (let i = 0; i < imageData.data.length; i += 4) {
let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
let newVal = Math.round(avg / steps) * steps;
imageData.data[i] = newVal;
imageData.data[i + 1] = newVal;
imageData.data[i + 2] = newVal;
}

ctx.putImageData(imageData, 0, 0);
}

function downloadImage() {
const link = document.createElement('a');
link.download = 'vetorizado.png';
link.href = canvas.toDataURL();
link.click();
}