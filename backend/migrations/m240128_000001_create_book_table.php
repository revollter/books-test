<?php

use yii\db\Migration;

class m240128_000001_create_book_table extends Migration
{
    public function safeUp()
    {
        $this->createTable('{{%book}}', [
            'id' => $this->primaryKey(),
            'author' => $this->string(255)->notNull(),
            'country' => $this->string(255)->notNull(),
            'imageLink' => $this->string(500),
            'language' => $this->string(100)->notNull(),
            'link' => $this->string(500),
            'pages' => $this->integer()->notNull(),
            'title' => $this->string(500)->notNull(),
            'year' => $this->integer()->notNull(),
            'created_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
            'updated_at' => $this->timestamp()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex('idx-book-title', '{{%book}}', 'title');
        $this->createIndex('idx-book-author', '{{%book}}', 'author');
    }

    public function safeDown()
    {
        $this->dropTable('{{%book}}');
    }
}
