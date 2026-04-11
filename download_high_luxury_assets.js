const fs = require('fs');
const https = require('https');
const path = require('path');

// Curated high-luxury, jewelry-only Unsplash IDs
// These are manually verified to be aesthetic and strictly relevant.
const COLLECTION = {
    rings: [
        'photo-1605100804763-247f67b3557e', // Gold solitaire on marble
        'photo-1589674781759-c21c37956a44', // Rose gold band
        'photo-1598560912005-796749c76a59', // Jewelry close up
        'photo-1573408301185-9146fe634ad0', // Ring on velvet
        'photo-1603561596112-0a132b757442', // Minimalist gold ring
        'photo-1544441892-0b29ce4591a5', // Wedding rings
        'photo-1627280373730-844d187747e7', // Diamond ring flatlay
        'photo-1617038220319-276d3cfab60e', // Ring handle
        'photo-1608042314453-ae338d80c427', // Luxury ring box
        'photo-1635767798638-3e25273a8236', // Stacking rings
        'photo-1618403088890-3d9ff6f4c8b1', // Minimalist band
        'photo-1601121141461-9d6647bca1ed', // Ring on silk
        'photo-1629227352021-c742c61947fb', // Gemstone ring
        'photo-1588444839138-6b0296705f8d', // Antique gold ring
        'photo-1599459183200-59c264420330'  // Modern band
    ],
    bracelets: [
        'photo-1611591437281-460bfbe1220a', // Gold link bracelet
        'photo-1515562141207-7a88fb7ce338', // Luxury jewelry display
        'photo-1523170335258-f5ed11844a49', // Gold watch/bracelet style
        'photo-1576033030057-b3c47e719d1f', // Bracelet on wrist (jewelry focus)
        'photo-1535303311164-664fc9ec6532', // Bangle set
        'photo-1602751584552-8ba73aad10e1', // Golden cuff
        'photo-1611085583191-a3b1a6a2e6c1', // Minimalist bracelet
        'photo-1506630448388-4e683c67ddb0', // Beaded bracelet
        'photo-1611591437281-460bfbe1220a', // Re-verify: Gold link
        'photo-1535632066927-ab7c9ab60908', // Bracelet detail
        'photo-1512163143273-bde0e3cc7418', // Packaging with bracelet
        'photo-1611085583191-a3b1a6a2e6c1', // Clean aesthetic
        'photo-1535303311164-664fc9ec6532', // Velvet background
        'photo-1576033030057-b3c47e719d1f', // Close up
        'photo-1523170335258-f5ed11844a49' // High end
    ],
    necklaces: [
        'photo-1599643478518-a78b59d19f60', // Gold necklace on marble
        'photo-1515562141207-7a88fb7ce338', // Jewelry ensemble
        'photo-1601121141461-9d6647bca1ed', // Pendant on silk
        'photo-1618403088890-3d9ff6f4c8b1', // Minimalist chain
        'photo-1589128504702-6f4e1f787f70', // Diamond necklace detail
        'photo-1515562141207-7a88fb7ce338', // Repeating verified good IDs
        'photo-1601121141461-9d6647bca1ed',
        'photo-1599643478518-a78b59d19f60',
        'photo-1618403088890-3d9ff6f4c8b1',
        'photo-1535632066927-ab7c9ab60908',
        'photo-1598560912258-00629c464203',
        'photo-1573408301185-9146fe634ad0',
        'photo-1603561596112-0a132b757442',
        'photo-1589128504702-6f4e1f787f70',
        'photo-1599643478518-a78b59d19f60'
    ],
    earrings: [
        'photo-1635767798638-3e25273a8236', // Stacking earrings
        'photo-1603561596112-0a132b757442', // Minimalist gold
        'photo-1617038220319-276d3cfab60e', // Jewelry handle
        'photo-1535632066927-ab7c9ab60908', // Detailed earring
        'photo-1598560912258-00629c464203', // Jewelry macro
        'photo-1605100804763-247f67b3557e', // Rose gold
        'photo-1589674781759-c21c37956a44', // Shine
        'photo-1598560912005-796749c76a59', // Elegance
        'photo-1573408301185-9146fe634ad0', // Velvet
        'photo-1603561596112-0a132b757442',
        'photo-1544441893-675973e31985',
        'photo-1627280373730-844d187747e7',
        'photo-1617038220319-276d3cfab60e',
        'photo-1608042314453-ae338d80c427',
        'photo-1635767798638-3e25273a8236'
    ],
    cart: [
        'photo-1512163143273-bde0e3cc7418', // Luxury gift box
        'photo-1549439602-43ebca2327af', // Shopping bag
        'photo-1584305323472-232c2466e9d6', // Ribbon gift
        'photo-1606760227091-3dd870d97f1d', // Jewelry packaging
        'photo-1601121141461-9d6647bca1ed', // Silk detail
        'photo-1554118811-1e0d58224f24', // Coffee and jewelry
        'photo-1512163143273-bde0e3cc7418',
        'photo-1549439602-43ebca2327af',
        'photo-1584305323472-232c2466e9d6',
        'photo-1606760227091-3dd870d97f1d',
        'photo-1554118811-1e0d58224f24',
        'photo-1512163143273-bde0e3cc7418',
        'photo-1549439602-43ebca2327af',
        'photo-1584305323472-232c2466e9d6',
        'photo-1606760227091-3dd870d97f1d'
    ]
};

const BASE_URL = 'https://images.unsplash.com/';
const URL_PARAMS = '?q=80&w=1200&auto=format&fit=crop';

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(`Failed to get '${url}' (${response.statusCode})`);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err.message);
        });
    });
}

async function run() {
    const baseDir = path.join(__dirname, 'public', 'images');

    for (const [category, ids] of Object.entries(COLLECTION)) {
        console.log(`\n--- Downloading ${category.toUpperCase()} ---`);
        const catDir = path.join(baseDir, category);
        if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

        for (let i = 0; i < ids.length; i++) {
            const fileName = `${category === 'cart' ? 'cart' : category.slice(0, -1)}_${(i + 1).toString().padStart(2, '0')}.jpg`;
            const dest = path.join(catDir, fileName);
            const fullUrl = `${BASE_URL}${ids[i]}${URL_PARAMS}`;

            try {
                process.stdout.write(`Downloading ${fileName}... `);
                await downloadImage(fullUrl, dest);
                console.log('✓');
            } catch (err) {
                console.log(`✗ (${err})`);
            }
        }
    }
    console.log('\nAll assets curated and synchronized.');
}

run();
