<?php

namespace app\commands;

use app\models\Book;
use app\models\Image;
use yii\console\Controller;
use yii\console\ExitCode;

class SeedController extends Controller
{
    /**
     * @var bool Skip downloading book covers
     */
    public bool $noCovers = false;

    public function options($actionID): array
    {
        return array_merge(parent::options($actionID), [
            'noCovers',
        ]);
    }

    public function optionAliases(): array
    {
        return array_merge(parent::optionAliases(), [
            'nc' => 'noCovers',
        ]);
    }

    public function actionIndex()
    {
        if ($this->noCovers) {
            $this->stdout("Skipping cover downloads (--no-covers flag)\n\n");
        }

        $books = $this->getBooks();

        $count = 0;
        foreach ($books as $bookData) {
            $existing = Book::find()->where(['title' => $bookData['title']])->exists();
            if ($existing) {
                $this->stdout("Skipping: {$bookData['title']} (already exists)\n");
                continue;
            }

            $imageId = $this->noCovers ? null : $this->downloadCover($bookData['title'], $bookData['author']);

            $book = new Book();
            $book->title = $bookData['title'];
            $book->author = $bookData['author'];
            $book->country = $bookData['country'];
            $book->language = $bookData['language'];
            $book->link = $bookData['link'];
            $book->pages = $bookData['pages'];
            $book->year = $bookData['year'];
            $book->image_id = $imageId;

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
        $images = Image::find()->all();
        foreach ($images as $image) {
            $filepath = \Yii::getAlias('@app/web/uploads/' . $image->filename);
            if (file_exists($filepath)) {
                unlink($filepath);
            }
            $image->delete();
        }
        $this->stdout("Deleted " . count($images) . " images.\n");

        $count = Book::deleteAll();
        $this->stdout("Deleted {$count} books.\n");
        return ExitCode::OK;
    }

    private function downloadCover(string $title, string $author): ?int
    {
        // Search for cover ID by title and author
        $query = urlencode("{$title} {$author}");
        $searchUrl = "https://openlibrary.org/search.json?q={$query}&limit=1";

        $searchResult = @file_get_contents($searchUrl);
        if ($searchResult === false) {
            $this->stderr("  Failed to search cover for: {$title}\n");
            return null;
        }

        $data = json_decode($searchResult, true);
        if (empty($data['docs'][0]['cover_i'])) {
            $this->stderr("  No cover found for: {$title}\n");
            return null;
        }

        $coverId = $data['docs'][0]['cover_i'];
        $url = "https://covers.openlibrary.org/b/id/{$coverId}-M.jpg";

        $imageData = @file_get_contents($url);
        if ($imageData === false) {
            $this->stderr("  Failed to download cover for: {$title}\n");
            return null;
        }

        $uploadPath = \Yii::getAlias('@app/web/uploads');
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        $filename = \Yii::$app->security->generateRandomString(16) . '.jpg';
        $filepath = $uploadPath . '/' . $filename;

        if (file_put_contents($filepath, $imageData) === false) {
            $this->stderr("  Failed to save cover for: {$title}\n");
            return null;
        }

        $image = new Image();
        $image->filename = $filename;
        $image->original_name = preg_replace('/[^a-zA-Z0-9]/', '_', $title) . '.jpg';
        $image->mime_type = 'image/jpeg';
        $image->size = strlen($imageData);

        if ($image->save()) {
            $this->stdout("  Downloaded cover for: {$title}\n");
            return $image->id;
        }

        unlink($filepath);
        return null;
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
