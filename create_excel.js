const fs = require('fs');
const path = require('path');

// Hex data from attachment
const hexData = `50 4b 03 04 14 00 00 00 08 00 95 2e aa 5c 46 c7 4d 48 95 00 00 00 cd 00 00 00 10 00 00 00 64 6f 63 50 72 6f 70 73 2f 61 70 70 2e 78 6d 6c 4d cf 4d 0b c2 30 0c 06 e0 bf 52 76 b7 99 8a 1e a4 0e 44 3d 8a 9e bc cf 2e 75 85 b6 29 6d 84 fa ef ed 04 3f 6e 79 79 c8 1b a2 2e 89 22 26 b6 98 45 f1 2e e4 6d 33 32 c7 0d 40 d6 23 fa 3e cb ca a1 8a a1 e4 7b ae 31 dd 81 8c b1 1a 0f a4 1f 1e 03 c3`;

// Split and convert to buffer
const bytes = hexData.split(' ').map(h => parseInt(h, 16));
const buffer = Buffer.from(bytes);

fs.writeFileSync(path.join(__dirname, 'Andhra_Pradesh_Hospitals.xlsx'), buffer);
console.log('File created');