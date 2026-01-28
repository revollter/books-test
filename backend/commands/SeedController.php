<?php

namespace app\commands;

use app\models\Book;
use yii\console\Controller;
use yii\console\ExitCode;

class SeedController extends Controller
{
    public function actionIndex()
    {
        $books = $this->getBooks();

        $count = 0;
        foreach ($books as $bookData) {
            $existing = Book::find()->where(['title' => $bookData['title']])->exists();
            if ($existing) {
                $this->stdout("Skipping: {$bookData['title']} (already exists)\n");
                continue;
            }

            $book = new Book();
            $book->attributes = $bookData;

            if ($book->save()) {
                $this->stdout("Created: {$book->title}\n");
                $count++;
            } else {
                $this->stderr("Failed: {$bookData['title']} - " . json_encode($book->errors) . "\n");
            }
        }

        $this->stdout("\nSeeded {$count} books.\n");
        return ExitCode::OK;
    }

    public function actionClear()
    {
        $count = Book::deleteAll();
        $this->stdout("Deleted {$count} books.\n");
        return ExitCode::OK;
    }

    private function getBooks(): array
    {
        return [
            [
                'title' => 'Things Fall Apart',
                'author' => 'Chinua Achebe',
                'country' => 'Nigeria',
                'language' => 'English',
                'link' => 'https://en.wikipedia.org/wiki/Things_Fall_Apart',
                'pages' => 209,
                'year' => 1958,
            ],
            [
                'title' => 'The Divine Comedy',
                'author' => 'Dante Alighieri',
                'country' => 'Italy',
                'language' => 'Italian',
                'link' => 'https://en.wikipedia.org/wiki/Divine_Comedy',
                'pages' => 928,
                'year' => 1315,
            ],
            [
                'title' => 'Don Quixote',
                'author' => 'Miguel de Cervantes',
                'country' => 'Spain',
                'language' => 'Spanish',
                'link' => 'https://en.wikipedia.org/wiki/Don_Quixote',
                'pages' => 1072,
                'year' => 1610,
            ],
            [
                'title' => 'Crime and Punishment',
                'author' => 'Fyodor Dostoevsky',
                'country' => 'Russia',
                'language' => 'Russian',
                'link' => 'https://en.wikipedia.org/wiki/Crime_and_Punishment',
                'pages' => 551,
                'year' => 1866,
            ],
            [
                'title' => 'The Brothers Karamazov',
                'author' => 'Fyodor Dostoevsky',
                'country' => 'Russia',
                'language' => 'Russian',
                'link' => 'https://en.wikipedia.org/wiki/The_Brothers_Karamazov',
                'pages' => 824,
                'year' => 1880,
            ],
            [
                'title' => 'Madame Bovary',
                'author' => 'Gustave Flaubert',
                'country' => 'France',
                'language' => 'French',
                'link' => 'https://en.wikipedia.org/wiki/Madame_Bovary',
                'pages' => 528,
                'year' => 1857,
            ],
            [
                'title' => 'One Hundred Years of Solitude',
                'author' => 'Gabriel Garcia Marquez',
                'country' => 'Colombia',
                'language' => 'Spanish',
                'link' => 'https://en.wikipedia.org/wiki/One_Hundred_Years_of_Solitude',
                'pages' => 417,
                'year' => 1967,
            ],
            [
                'title' => 'The Iliad',
                'author' => 'Homer',
                'country' => 'Greece',
                'language' => 'Greek',
                'link' => 'https://en.wikipedia.org/wiki/Iliad',
                'pages' => 608,
                'year' => -750,
            ],
            [
                'title' => 'The Odyssey',
                'author' => 'Homer',
                'country' => 'Greece',
                'language' => 'Greek',
                'link' => 'https://en.wikipedia.org/wiki/Odyssey',
                'pages' => 374,
                'year' => -700,
            ],
            [
                'title' => 'Ulysses',
                'author' => 'James Joyce',
                'country' => 'Ireland',
                'language' => 'English',
                'link' => 'https://en.wikipedia.org/wiki/Ulysses_(novel)',
                'pages' => 730,
                'year' => 1922,
            ],
            [
                'title' => 'The Trial',
                'author' => 'Franz Kafka',
                'country' => 'Czechoslovakia',
                'language' => 'German',
                'link' => 'https://en.wikipedia.org/wiki/The_Trial',
                'pages' => 160,
                'year' => 1925,
            ],
            [
                'title' => 'War and Peace',
                'author' => 'Leo Tolstoy',
                'country' => 'Russia',
                'language' => 'Russian',
                'link' => 'https://en.wikipedia.org/wiki/War_and_Peace',
                'pages' => 1296,
                'year' => 1867,
            ],
            [
                'title' => '1984',
                'author' => 'George Orwell',
                'country' => 'United Kingdom',
                'language' => 'English',
                'link' => 'https://en.wikipedia.org/wiki/1984_(novel)',
                'pages' => 328,
                'year' => 1949,
            ],
            [
                'title' => 'Pride and Prejudice',
                'author' => 'Jane Austen',
                'country' => 'United Kingdom',
                'language' => 'English',
                'link' => 'https://en.wikipedia.org/wiki/Pride_and_Prejudice',
                'pages' => 226,
                'year' => 1813,
            ],
            [
                'title' => 'The Great Gatsby',
                'author' => 'F. Scott Fitzgerald',
                'country' => 'United States',
                'language' => 'English',
                'link' => 'https://en.wikipedia.org/wiki/The_Great_Gatsby',
                'pages' => 180,
                'year' => 1925,
            ],
        ];
    }
}
