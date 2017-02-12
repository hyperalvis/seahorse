from flask import Flask
from flask import jsonify
import read_write_test
import hash_key

# App.
app = Flask(__name__)

@app.route("/")
def hi():
    return("hello")


@app.route("/dataDB/<hash>/<setting>")
def from_bigchain(hash, setting):
    """ Method to put data to /dataDB.
    """
    # Obtain keys from hash.
    pri_key, pub_key = hash_key.ed25519_generate_key_pair_from_hash(hash)
    # Obtain settings given the string as dict.
    if setting != '0':
        settings = read_write_test.str_to_setting(setting)
    # If no settings are given, only read.
    if setting == '0':
        stored_settings = read_write_test.readData(pub_key)
        return jsonify(stored_settings)
    # Else, write data.
    else:
        stored_settings = read_write_test.writeData(pub_key,
                                                    pri_key,
                                                    settings)
        return jsonify(stored_settings)

if __name__ == "__main__":
    # Run app. Use threaded to create multiple requests.
    app.run(host = '0.0.0.0', threaded=True, debug=True)
    # app.run(threaded=True, debug=True)
