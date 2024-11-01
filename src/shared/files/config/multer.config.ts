import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import fs from 'fs';
import { diskStorage } from "multer";
import path, { join } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    // lấy path của root folder
    getRootPath = () => {
        return process.cwd();
    };

    // chuẩn bị folder để store
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists.');
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    // Error:
                    // Requested location already exists, but it's not a directory.
                    break;
                case 'ENOTDIR':
                    // Error:
                    // The parent hierarchy contains a file with the same name as the dir
                    // you're trying to create.
                    break;
                default:
                    // Some other error like permission denied.
                    console.error(error);
                    break;
            }
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            // cấu hình việc lưu động
            storage: diskStorage({
                // cấu hình nơi lưu
                destination: (req, file, callback) => {
                    const folder = req?.headers?.folder_type ?? "default";
                    this.ensureExists(`public/${folder}`); //(`public/images/${folder}`)
                    callback(null, join(this.getRootPath(), `public/${folder}`)) // return
                },
                // cấu hình đổi tên file
                filename: (req, file, callback) => {
                    //get image extension
                    let extName = path.extname(file.originalname);
                    //get image's name (without extension)
                    let baseName = path.basename(file.originalname, extName);
                    let finalName = `${baseName}-${Date.now()}${extName}`
                    callback(null, finalName)
                }
            }),
            limits: {
                fileSize: 1024 * 1024 * 1 // 1MB
            },
            fileFilter: (req, file, callback) => {
                const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
                const fileExtension = file.originalname.split('.').pop().toLowerCase();
                const isValidFileType = allowedFileTypes.includes(fileExtension);
                if (!isValidFileType) {
                    callback(new HttpException('Invalid file type', HttpStatus.UNPROCESSABLE_ENTITY), null);
                } else
                    // return true if accept file
                    callback(null, true);
            },
        };
    }
}