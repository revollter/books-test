<?php

use yii\db\Migration;

class m240128_000002_create_image_table extends Migration
{
    public function safeUp()
    {
        $this->createTable('{{%image}}', [
            'id' => $this->primaryKey(),
            'filename' => $this->string(255)->notNull()->unique(),
            'original_name' => $this->string(255)->notNull(),
            'mime_type' => $this->string(100)->notNull(),
            'size' => $this->integer()->notNull(),
            'created_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);
    }

    public function safeDown()
    {
        $this->dropTable('{{%image}}');
    }
}
