<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240719023644 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE billing_data (id INT AUTO_INCREMENT NOT NULL, slug VARCHAR(255) NOT NULL, app_url VARCHAR(255) NOT NULL, billing_token VARCHAR(255) NOT NULL, app_name VARCHAR(255) NOT NULL, credits_to_charge VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D281CDA4989D9B62 ON billing_data (slug)');
        $this->addSql('ALTER TABLE app_info ADD app_widget_slug VARCHAR(255) DEFAULT NULL, ADD app_widget_secret VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app_info DROP app_widget_slug, DROP app_widget_secret');
        $this->addSql('DROP INDEX UNIQ_D281CDA4989D9B62 ON billing_data');
        $this->addSql('DROP TABLE billing_data');
    }
}