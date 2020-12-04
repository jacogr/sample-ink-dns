import fs from 'fs';
import { ApiPromise, Keyring } from '@polkadot/api';
import { CodePromise } from '@polkadot/api-contract';
import { randomAsHex } from '@polkadot/util-crypto';

function getBlueprint (alice, api) {
  console.log('');

  return new Promise(async (resolve, reject) => {
    // load the files
    const wasmHex = fs.readFileSync('dns.wasm').toString('hex');
    const abiJson = fs.readFileSync('dns.json', { encoding: 'utf-8' });

    // the code we are going to be working with
    const code = new CodePromise(api, abiJson, `0x${wasmHex}`);

    // deploy and get a blueprint
    const unsub = await code
      .createBlueprint()
      .signAndSend(alice, ({ status, blueprint, dispatchError }) => {
        console.log('getBlueprint (status)', status.toString());

        if (dispatchError) {
          reject(dispatchError);
        } else if (status.isInBlock) {
          resolve(blueprint);
          unsub();
        }
      });
  });
}

function getContract (alice, blueprint) {
  console.log('');

  return new Promise(async (resolve, reject) => {
    // deploy the contract
    const unsub = await blueprint.tx
      .new({ gasLimit: 200_000_000_000, value: 123_000_000_000 })
      .signAndSend(alice, ({ status, contract, dispatchError }) => {
        console.log('getContract (status)', status.toString());

        if (dispatchError) {
          reject(dispatchError);
        } else if (status.isInBlock) {
          resolve(contract);
          unsub();
        }
      });
  });
}

async function callContract (alice, contract) {
  console.log('');

  // create a random hash to register
  const hash = randomAsHex();

  // estimate gas for this one
  const { gasConsumed } = await contract.query.register(alice.address, {}, hash);

  // show the gas
  console.log('callContract', gasConsumed.toHuman(), 'gas limit');

  return new Promise(async (resolve, reject) => {
    // mke the registration call
    const unsub = await contract.tx
      .register({ gasLimit: gasConsumed }, hash)
      .signAndSend(alice, ({ status, contractEvents, dispatchError }) => {
        console.log('callContract (status)', status.toString());

        if (dispatchError) {
          reject(dispatchError);
        } else if (status.isInBlock) {
          console.log('callContract (events)', contractEvents.map(({ args, event: { identifier } }) =>
            `${identifier}(${args.map((a) => a.toHuman()).join(', ')})`
          ));

          resolve();
          unsub();
        }
      });
  });
}

async function main () {
  // create the api, default to 127.0.0.1:9944 (non-template like chain types)
  const api = await ApiPromise.create({
    types: {
      Address: 'AccountId',
      LookupSource: 'AccountId'
    }
  });

  // create the keyring and add Alice
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');

  // get the blueprint
  const blueprint = await getBlueprint(alice, api);

  // get the contract
  const contract = await getContract(alice, blueprint);

  // create a hash on the contract (will emit an event)
  await callContract(alice, contract);
}

main()
  .then(() => {
    console.log('');
    console.log('Done.');
    process.exit(0);
  })
  .catch((error) => {
    console.log('');
    console.error('Error.', error.message || JSON.stringify(error));
    process.exit(1);
  });
