<?php

use yii\db\Migration;

class m240128_000003_add_image_id_to_book extends Migration
{
    public function safeUp()
    {
        // Add image_id column
        $this->addColumn('{{%book}}', 'image_id', $this->integer()->null());
        // Add foreign key
        $this->addForeignKey(
            'fk-book-image_id',
            '{{%book}}',
            'image_id',
            '{{%image}}',
            'id',
            'SET NULL',
            'CASCADE'
        );
        // Remove old imageLink column
        $this->dropColumn('{{%book}}', 'imageLink');
    }

    public function safeDown()
    {
        // Restore imageLink column
        $this->addColumn('{{%book}}', 'imageLink', $this->string(500));
        // Remove foreign key
        $this->dropForeignKey('fk-book-image_id', '{{%book}}');
        // Remove image_id column
        $this->dropColumn('{{%book}}', 'image_id');
    }
}
