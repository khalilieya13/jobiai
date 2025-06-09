import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

export function createUploader(folder: string, allowedTypes: string[] = []) {
    const uploadPath = path.join(__dirname, '../../uploads', folder);
    fs.mkdirSync(uploadPath, { recursive: true });

    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadPath),
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${folder}-${Date.now()}${ext}`;
            cb(null, filename);
        },
    });

    const fileFilter = (
        _req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        if (allowedTypes.length === 0 || allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    };

    return multer({ storage, fileFilter });
}
