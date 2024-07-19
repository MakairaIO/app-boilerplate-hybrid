<?php

declare(strict_types=1);

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\CustomCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;

class MakairaAppAuthenticator extends AbstractAuthenticator
{
    public const AUTH_TOKEN = 'APP-SIGNATURE-TOKEN';
    private string $appUrl = '';
    private string $appStoreUrl;
    private string $appStoreSecret;

    public function __construct($appStoreSecret, $appStoreUrl)
    {
        $this->appStoreSecret = $appStoreSecret;
        $this->appStoreUrl = $appStoreUrl;
    }

    /**
     * @param Request $request
     *
     * @return bool|null
     */
    public function supports(Request $request): ?bool
    {
        return true;
    }

    /**
     * @param Request $request
     *
     * @return Passport
     */
    public function authenticate(Request $request): Passport
    {
        $token = $request->headers->get($this::AUTH_TOKEN);
        if (null === $token) {
            throw new AuthenticationException();
        }

        return $this->verifyAuthToken($token);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string
     *
     * @return Response|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        $request->attributes->set('appUrl', $this->appUrl);

        return null;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     *
     * @return Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @param string $token
     *
     * @return Passport
     */
    private function verifyAuthToken(string $token): Passport
    {
        $parameters = json_decode(base64_decode($token), true);
        if (
            !$parameters
            || !is_array($parameters)
            || !array_key_exists('appUrl', $parameters)
            || !array_key_exists('hmac', $parameters)
        ) {
            throw new AuthenticationException();
        }

        $expected = hash_hmac(
            'sha256',
            $this->appStoreUrl,
            $this->appStoreSecret,
        );
        $this->appUrl = $parameters['appUrl'];
        return new Passport(new UserBadge("signed_request"), new CustomCredentials(
            function ($credentials) {
                return $credentials[0] === $credentials[1];
            },
            [$expected, $parameters['hmac']]
        ));
    }
}