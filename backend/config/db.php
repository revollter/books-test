<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:host=' . (getenv('DB_HOST') ?: 'localhost') . ';dbname=' . (getenv('DB_NAME') ?: 'books_db'),
    'username' => getenv('DB_USER') ?: 'books_user',
    'password' => getenv('DB_PASSWORD') ?: 'books_password',
    'charset' => 'utf8',
    'schemaMap' => [
        'pgsql' => [
            'class' => 'yii\db\pgsql\Schema',
            'defaultSchema' => 'public',
        ],
    ],

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
