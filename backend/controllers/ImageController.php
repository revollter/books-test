<?php

namespace app\controllers;

use app\models\Image;
use app\services\ImageService;
use yii\rest\ActiveController;
use yii\filters\Cors;
use yii\web\UploadedFile;
use yii\web\BadRequestHttpException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

class ImageController extends ActiveController
{
    public $modelClass = 'app\models\Image';

    private ImageService $imageService;

    public function __construct($id, $module, ImageService $imageService = null, $config = [])
    {
        $this->imageService = $imageService ?? new ImageService();
        parent::__construct($id, $module, $config);
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        unset($behaviors['authenticator']);

        $behaviors['corsFilter'] = [
            'class' => Cors::class,
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'DELETE', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
                'Access-Control-Allow-Credentials' => false,
                'Access-Control-Max-Age' => 86400,
            ],
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        //needs customization:
        unset($actions['create']);
        unset($actions['update']);
        unset($actions['delete']);

        return $actions;
    }

    public function actionCreate()
    {
        $file = UploadedFile::getInstanceByName('file');

        if (!$file) {
            throw new BadRequestHttpException('No file uploaded');
        }

        $image = $this->imageService->upload($file);

        if ($image) {
            \Yii::$app->response->statusCode = 201;
            return $image;
        }

        \Yii::$app->response->statusCode = 422;
        return ['error' => 'Failed to upload image'];
    }

    public function actionDelete($id)
    {
        $image = Image::findOne($id);

        if (!$image) {
            throw new NotFoundHttpException('Image not found');
        }

        if ($this->imageService->delete($image)) {
            \Yii::$app->response->statusCode = 204;
            return null;
        }

        throw new ServerErrorHttpException('Failed to delete image');
    }
}
