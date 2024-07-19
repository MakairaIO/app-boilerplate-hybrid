<?php

namespace App\Service;

class EncryptionService
{
    public function __construct(private readonly string $appSecret)
    {
    }

    public function encryptValue(string $value): string
    {
        $ivlen = openssl_cipher_iv_length($cipher="AES-128-CBC");
        $iv = openssl_random_pseudo_bytes($ivlen);
        $cipherTextRaw = openssl_encrypt($value, $cipher, $this->appSecret, $options=OPENSSL_RAW_DATA, $iv);
        $hmac = hash_hmac('sha256', $cipherTextRaw, $this->appSecret, $as_binary=true);
        $cipherText = base64_encode( $iv.$hmac.$cipherTextRaw );

        return $cipherText;
    }

    public function decryptValue(string $value): string
    {
        $c = base64_decode($value);
        $ivlen = openssl_cipher_iv_length($cipher="AES-128-CBC");
        $iv = substr($c, 0, $ivlen);
        $hmac = substr($c, $ivlen, $sha2len=32);
        $cipherTextRaw = substr($c, $ivlen+$sha2len);
        $originalPlaintext = openssl_decrypt($cipherTextRaw, $cipher, $this->appSecret, $options=OPENSSL_RAW_DATA, $iv);
        $calcmac = hash_hmac('sha256', $cipherTextRaw, $this->appSecret, $as_binary=true);
        if (hash_equals($hmac, $calcmac)) // Rechenzeitangriff-sicherer Vergleich
        {
            return $originalPlaintext;
        }

        throw new \Error('unable to encrypt token...');
    }
}