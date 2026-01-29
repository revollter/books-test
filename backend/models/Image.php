<?php

namespace app\models;

use yii\db\ActiveRecord;

class Image extends ActiveRecord
{
    /**
     * @var \yii\web\UploadedFile
     */
    public $uploadedFile;

    public static function tableName()
    {
        return '{{%image}}';
    }

    public function rules()
    {
        return [
            [['filename', 'original_name', 'mime_type', 'size'], 'required'],
            [['filename', 'original_name', 'mime_type'], 'string', 'max' => 255],
            [['size'], 'integer'],
            [['filename'], 'unique'],
            [['uploadedFile'], 'image',
                'extensions' => ['jpg', 'jpeg', 'png'],
                'mimeTypes' => ['image/jpeg', 'image/png'],
                'maxSize' => 5 * 1024 * 1024,
                'checkExtensionByMimeType' => true,
                'skipOnEmpty' => true,
            ],
        ];
    }

    public function fields()
    {
        return [
            'id',
            'filename',
            'original_name',
            'url',
        ];
    }

    public function getUrl()
    {
        return '/uploads/' . $this->filename;
    }
}
