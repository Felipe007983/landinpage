import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/banners');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `banner-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens (jpeg, jpg, png, webp) são permitidas!'));
    }
}).single('banner');

export class UploadController {
    static async uploadBanner(req: Request, res: Response) {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'Erro no upload: ' + err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado' });
            }

            const fileUrl = `/uploads/banners/${req.file.filename}`;
            res.json({ url: fileUrl });
        });
    }
}
