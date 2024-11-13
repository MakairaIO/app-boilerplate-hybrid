<?php

namespace App\Repository;

use App\Entity\BillingData;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<BillingData>
 *
 * @method BillingData|null find($id, $lockMode = null, $lockVersion = null)
 * @method BillingData|null findOneBy(array $criteria, array $orderBy = null)
 * @method BillingData[]    findAll()
 * @method BillingData[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BillingDataRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BillingData::class);
    }

    public function save(BillingData $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(BillingData $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

}