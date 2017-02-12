from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
import bigchaindb_driver.exceptions as exs
import operator
import time

# Non-necessary imports. To be removed later.
import os
import pickle

def makeBigchain():
    """ Init bigchainDB driver at address
    """
    # TODO: Made method for easy change localhost. Change localhost?
    return BigchainDB('http://127.0.0.1:9984')


def str_to_setting(str):
    data = [str[i:i+2] for i in range(0, len(str), 2)]
    dict = {}
    for i in range(len(data)):
        dict[data[i][0]] = int(data[i][1])
    return dict


def userNotExists(public_key):
    """ Method to quickly establish whether a user is already enrolled.
        True if list is empty.
    """
    # Init bigchainDB driver at address
    bdb = makeBigchain()
    return not bdb.outputs.get(public_key=public_key)


def createAssets(public_key, settings):
    """ Method to create a set of assets and corresponding metadata.
        Tweak assets for desired format.
    """
    # Data as we have it now. Only identity.
    # TODO: Add encryption?
    asset = {
        'data': {
            'identity': public_key
        },
    }
    # Add settings as metadata.
    asset_metadata = {
        'settings': settings,
        'timestamp': time.time()
    }
    return asset, asset_metadata


def runTrials(tx_id):
    """ Method to wait for completion transaction (validity check).
    """
    bdb = makeBigchain()
    trials = 0
    # Try to establish whether the transaction has been completed.
    while trials < 60:
        try:
            if bdb.transactions.status(tx_id).get('status') == 'valid':
                print('Tx valid in:', trials, 'secs')
                break
        except exs.NotFoundError:
            trials += 1
            time.sleep(1)
    return 0


def readData(public_key):
    """ Method to read the setting metadata given a public key.
    :return: the settings of a user.
    """
    # Init bigchainDB driver at address
    bdb = makeBigchain()
    # Check if the user has entries in the database.
    if userNotExists(public_key):
        # If empty return empty dictionary.
        return {}
    # Receive all transaction keys by this public key.
    txs_retrieved = bdb.outputs.get(public_key=public_key)
    # Obtain the actual transactions.
    txs_objs = [bdb.transactions.retrieve(tx.
                split('/')[2]) for tx in txs_retrieved]
    # Obtain metadata, which includes a timestamp.
    txs_meta = [[tx['metadata']['timestamp'], tx['metadata']['settings']]
                for tx in txs_objs]
    # Sort the transactions, based on their timestamps.
    # TODO: See if timestamps is reliable enough, or
    # TODO: if we need an actual sequence number.
    txs_meta = sorted(txs_meta, key=operator.itemgetter(0), reverse=True)
    print(txs_meta)
    return txs_meta[0][1]


def writeData(public_key, private_key, settings):
    """ Method to write data to bigchainDB given a public key,
        private key. We get a dictionary of settings which have
        to be stored in the database.
    :return: latest settings for the user (as feedback of execution).
    """
    # Init bigchainDB driver at address
    bdb = makeBigchain()
    # Create assets.
    setting_asset, setting_asset_metadata = createAssets(public_key, settings)
    # Prepare transaction.
    prepared_creation_tx = bdb.transactions.prepare(
        operation='CREATE',
        signers=public_key,
        asset=setting_asset,
        metadata=setting_asset_metadata
    )
    # Complete the creation of the transaction, by assigning private key.
    fulfilled_creation_tx = bdb.transactions.fulfill(
        prepared_creation_tx,
        private_keys=private_key
    )
    # Now ONCHAIN, send the transaction.
    bdb.transactions.send(fulfilled_creation_tx)
    # Validate the transaction, by verifying completion (wait)
    runTrials(fulfilled_creation_tx['id'])
    # Return the latest changed settings back to user.
    return readData(public_key)


if __name__ == "__main__":
    # TEST FOR READING.
    # result = readData('CkDn7o1GEPDsM6B4qxHEQuzUdwFpXXMfPsXxuCd3hBSc')
    # print(result)

    # TEST FOR WRITING.
    ses = {'fb': True, 'aws': False, 'nsa': True}

    if not os.path.exists('keypair.p'):
        new = generate_keypair()
        # Printing on firt generation of key.
        print('pkey: ', new.public_key)
        # Dump to pickled file.
        with open('keypair.p', 'wb') as f:
            pickle.dump(new, f)
    else:
        # Open keypair from pickled file.
        with open('keypair.p', 'rb') as f:
            new = pickle.load(f)
            # TODO: REMOVE, for sanity.
            print('pkey from file: ', new.public_key)

    result = writeData(new.public_key, new.private_key, ses)
    print(result)

    print("YOU ARE TERMINATED!")
    print("je bent zelf terminated.")
