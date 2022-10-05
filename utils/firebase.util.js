const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes } = require('firebase/storage');

const { ProductsImgs } = require('../models/productImgs.models');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, productId) => {
    try {
        const imgsPromises = imgs.map(async (img) => {
            const [filename, extension] = img.originalname.split('.');
            const productImg = `${
                process.env.NODE_ENV
            }/products/${productId}/${filename}-${Date.now()}.${extension}`;

            const imgRef = ref(storage, productImg);

            const result = await uploadBytes(imgRef, img.buffer);

            return await ProductsImgs.create({
                productId,
                imgUrl: result.metadata.fullPath,
            });
        });

        await Promise.all(imgsPromises);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { storage, uploadProductImgs };
