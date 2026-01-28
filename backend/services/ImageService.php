<?php

namespace app\services;

use app\models\Image;
use yii\web\UploadedFile;
use Yii;

class ImageService
{
    public function upload(UploadedFile $file): ?Image
    {
        $image = new Image();
        $image->filename = Yii::$app->security->generateRandomString(16) . '.' . $file->extension;
        $image->original_name = $file->baseName . '.' . $file->extension;
        $image->mime_type = $file->type;
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
}
