<?php

namespace App\Command;

use App\Entity\BillingData;
use App\Service\EncryptionService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:create-billing-data',
    description: 'create billing data',
)]
class CreateBillingDataCommand extends Command
{
    public function __construct(
        private readonly EncryptionService $encryptionService,
        private readonly EntityManagerInterface $em,
        string $name = null,
    )
    {
        parent::__construct($name);
    }

    protected function configure(): void
    {
        $this
            ->addArgument('slug', InputArgument::REQUIRED, 'app slug')
            ->addArgument('app-url', InputArgument::REQUIRED, 'app url')
            ->addArgument('billing-token', InputArgument::REQUIRED, 'non-encrypted billing token')
            ->addArgument('app-name', InputArgument::REQUIRED, 'app-name')
            ->addArgument('credits-to-charge', InputArgument::OPTIONAL, '150 default', '150')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $billingData = (new BillingData())
            ->setSlug($input->getArgument('slug'))
            ->setAppUrl($input->getArgument('app-url'))
            ->setBillingToken($this->encryptionService->encryptValue($input->getArgument('billing-token')))
            ->setAppName($input->getArgument('app-name'))
            ->setCreditsToCharge($input->getArgument('credits-to-charge'));

        $this->em->persist($billingData);
        $this->em->flush();

        $io->success('Billing Data saved.');

        return Command::SUCCESS;
    }
}