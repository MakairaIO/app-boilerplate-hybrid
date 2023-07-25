<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\CommunicationService;


class AuthController extends AbstractController
{
    public function __construct(
        private readonly CommunicationService $communicationService
    )
    {

    }

    #[Route('/api/auth', name: 'api_auth')]
    public function auth(Request $request): Response
    {
        $domain      = $request->query->get("domain") ?? '';
        $instance    = $request->query->get("instance") ?? '';
        $makairaHmac = $request->query->get("hmac") ?? '';
        $slug = $request->query->get("slug") ?? '';

        $nonce = $this->communicationService->getNonce();
        $hmac  = $this->communicationService->getHMAC($instance, $domain, $makairaHmac, $slug);

        return new JsonResponse([
            'hmac'        => $hmac,
            'makairaHmac' => $makairaHmac,
            'nonce'       => $nonce,
            'domain'      => $domain,
            'instance'    => $instance,
            'slug'    => $slug,
        ]);
    }
}