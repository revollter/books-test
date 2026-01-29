<?php

namespace app\services;

use app\models\Image;
use yii\web\UploadedFile;
use Yii;

class ImageService
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png' => ['png'],
    ];

    private const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public function upload(UploadedFile $file): ?Image
    {
        if (!$this->validateFile($file)) {
            return null;
        }

        $realMimeType = $this->detectMimeType($file->tempName);

        $image = new Image();
        $image->filename = Yii::$app->security->generateRandomString(16) . '.' . $file->extension;
        $image->original_name = $file->baseName . '.' . $file->extension;
        $image->mime_type = $realMimeType;
        $image->size = $file->size;

        if (!$image->validate()) {
            return null;
        }

        $uploadPath = $this->getUploadPath();
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        if (!$file->saveAs($uploadPath . '/' . $image->filename)) {
            return null;
        }

        if (!$image->save(false)) {
            $this->deleteFile($image->filename);
            return null;
        }

        return $image;
    }

    public function delete(Image $image): bool
    {
        $filename = $image->filename;

        if ($image->delete()) {
            $this->deleteFile($filename);
            return true;
        }

        return false;
    }

    public function getUploadPath(): string
    {
        return Yii::getAlias('@webroot/uploads');
    }

    private function deleteFile(string $filename): void
    {
        $filePath = $this->getUploadPath() . '/' . $filename;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    private function validateFile(UploadedFile $file): bool
    {
        // Check file size
        if ($file->size > self::MAX_FILE_SIZE) {
            return false;
        }

        // Detect real MIME type from file content
        $realMimeType = $this->detectMimeType($file->tempName);
        if ($realMimeType === null) {
            return false;
        }

        // Check if MIME type is allowed
        if (!isset(self::ALLOWED_MIME_TYPES[$realMimeType])) {
            return false;
        }

        // Check if extension matches MIME type
        $extension = strtolower($file->extension);
        if (!in_array($extension, self::ALLOWED_MIME_TYPES[$realMimeType], true)) {
            return false;
        }

        return true;
    }

    private function detectMimeType(string $filePath): ?string
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($filePath);

        return $mimeType !== false ? $mimeType : null;
    }
}
