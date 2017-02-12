from cryptoconditions.crypto import (Base58Encoder, Ed25519SigningKey)
import nacl.signing


class Ed25519SigningKeyFromHash(Ed25519SigningKey):

    def __init__(self, key, encoding='base58'):
        super().__init__(key, encoding=encoding)

    @classmethod
    def generate(cls, from_hash):
        return cls(nacl.signing.SigningKey(from_hash[:32]).encode(encoder=Base58Encoder))

def ed25519_generate_key_pair_from_hash(from_hash):
    """
    Generate a new key pair.

    Returns:
        A tuple of (private_key, public_key) encoded in base58.
    """
    from_hash = bytes(from_hash, encoding='utf-8')
    sk = Ed25519SigningKeyFromHash.generate(from_hash=from_hash)
    # Private key
    private_value_base58 = sk.encode(encoding='base58')

    # Public key
    public_value_compressed_base58 = sk.get_verifying_key().encode(encoding='base58')

    return private_value_base58.decode('utf-8'), \
           public_value_compressed_base58.decode('utf-8')

if __name__ == "__main__":
    h = "0x9c2cf3bd9d5287fcf5be885bf3b408b184f6103d"
    p1, p2 = ed25519_generate_key_pair_from_hash(h)
    print(p1, p2)
