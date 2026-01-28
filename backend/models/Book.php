<?php

namespace app\models;

use yii\db\ActiveRecord;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;

class Book extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%book}}';
    }

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::class,
                'value' => new Expression('CURRENT_TIMESTAMP'),
            ],
        ];
    }

    public function rules()
    {
        return [
            [['author', 'country', 'language', 'pages', 'title', 'year'], 'required'],
            [['pages', 'year', 'image_id'], 'integer'],
            [['author', 'country'], 'string', 'max' => 255],
            [['language'], 'string', 'max' => 100],
            [['link', 'title'], 'string', 'max' => 500],
            [['link'], 'url', 'defaultScheme' => 'https', 'skipOnEmpty' => true],
            [['year'], 'integer', 'min' => -3000, 'max' => 2100],
            [['pages'], 'integer', 'min' => 1],
            [['image_id'], 'exist', 'targetClass' => Image::class, 'targetAttribute' => 'id', 'skipOnEmpty' => true],
        ];
    }

    public function getImage()
    {
        return $this->hasOne(Image::class, ['id' => 'image_id']);
    }

    public function fields()
    {
        return [
            'id',
            'author',
            'country',
            'imageLink' => function ($model) {
                return $model->image ? $model->image->url : null;
            },
            'language',
            'link',
            'pages',
            'title',
            'year',
        ];
    }
}
