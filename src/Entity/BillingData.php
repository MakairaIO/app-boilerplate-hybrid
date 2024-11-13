<?php

namespace App\Entity;

use App\Repository\BillingDataRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BillingDataRepository::class)]
class BillingData
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    private ?string $appUrl = null;

    // this value is encrypted in the database by using the app_secret
    #[ORM\Column(length: 255)]
    private ?string $billingToken = null;

    #[ORM\Column(length: 255)]
    private ?string $appName = null;

    #[ORM\Column(length: 255)]
    private ?string $creditsToCharge = '150';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getAppUrl(): ?string
    {
        return $this->appUrl;
    }

    public function setAppUrl(string $appUrl): static
    {
        $this->appUrl = $appUrl;

        return $this;
    }

    public function getBillingToken(): ?string
    {
        return $this->billingToken;
    }

    public function setBillingToken(string $billingToken): static
    {
        $this->billingToken = $billingToken;

        return $this;
    }

    public function getAppName(): ?string
    {
        return $this->appName;
    }

    public function setAppName(string $appName): static
    {
        $this->appName = $appName;

        return $this;
    }

    public function getCreditsToCharge(): ?string
    {
        return $this->creditsToCharge;
    }

    public function setCreditsToCharge(string $creditsToCharge): static
    {
        $this->creditsToCharge = $creditsToCharge;

        return $this;
    }
}