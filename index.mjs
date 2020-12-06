import fs from 'fs';
import { ApiPromise, Keyring } from '@polkadot/api';
import { CodePromise } from '@polkadot/api-contract';
import { randomAsHex } from '@polkadot/util-crypto';

// a generic helper to resolve a result into a promise
function resultPromise (callType, tx, pair, onInBlock) {
  return new Promise(async (resolve, reject) => {
    const unsub = await tx.signAndSend(pair, (result) => {
      const { status, contractEvents, dispatchError, dispatchInfo, events } = result;

      console.log(`${callType} (status) ${status.toString()}`);

      // these are for errors that are thrown via the txpool, the tx didn't make it into a block
      if (result.isError) {
        reject(result);
        unsub();
      } else if (status.isInBlock) {
        // all the extrinsic events, if available (this may include failed,
        // where we have the dispatchError extracted)
        // https://polkadot.js.org/docs/api/cookbook/blocks#how-do-i-map-extrinsics-to-their-events
        if (events) {
          console.log(`${callType} (events/system)`, events.map(({ event: { data, method, section } }) =>
            `${section}.${method}${data ? `(${JSON.stringify(data.toHuman())})` : ''}`
          ));
        }

        // should only be available in the case of a call, still handle it here
        // (this is decoded from the system ContractExecution event against the ABI)
        if (contractEvents) {
          console.log(`${callType} (events/contract)`, contractEvents.map(({ args, event: { identifier } }) =>
            `${identifier}(${JSON.stringify(args.map((a) => a.toHuman()))})`
          ));
        }

        // this is part of the ExtrinsicSuccess/ExtrinsicFailed event, the API extracts it from those
        // (which mans it will match with whatever Sucess/Failed eents above are showing)
        console.log(`${callType} (dispatch) ${JSON.stringify(dispatchInfo.toHuman())}`);

        // The dispatchError is extracted from the system ExtrinsicFailed event above
        // (so will match the details there, the API conveinence helper extracts it to ease-of-use)
        if (dispatchError) {
          // show the actual errors as received here by looking up the indexes against the registry
          // https://polkadot.js.org/docs/api/cookbook/tx#how-do-i-get-the-decoded-enum-for-an-extrinsicfailed-event
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = tx.registry.findMetaError(dispatchError.asModule);
            const { documentation, name, section } = decoded;

            console.log(`${callType} (error) ${section}.${name}: ${documentation.join(' ')}`);
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            console.log(`${callType} (error) ${JSON.stringify(dispatchError.toHuman())}`);
          }

          reject(dispatchError);
        } else {
          resolve(onInBlock(result));
        }

        unsub();
      }
    });
  });
}

// deploys a code bundle on-chain, returning a blueprint
async function getBlueprint (pair, api) {
  console.log('');

  // load the files
  const wasmHex = fs.readFileSync('dns.wasm').toString('hex');
  const abiJson = fs.readFileSync('dns.json', { encoding: 'utf-8' });

  // the code we are going to be working with
  const code = new CodePromise(api, abiJson, `0x${wasmHex}`);
  const tx = code.createBlueprint();

  return resultPromise('getBlueprint', tx, pair, ({ blueprint }) => blueprint);
}

// instantiates a new contract via blueprint
function getContract (pair, blueprint) {
  console.log('');

  // instantiate via constructor
  const tx = blueprint.tx.new({ gasLimit: 300_000_000_000, value: 123_000_000_000 });

  return resultPromise('getContract', tx, pair, ({ contract }) => contract);
}

async function callContract (pair, contract) {
  console.log('');

  // create a random hash to register
  const hash = randomAsHex();

  // estimate gas for this one
  const { gasConsumed } = await contract.query.register(pair.address, {}, hash);
  const tx = contract.tx.register({ gasLimit: gasConsumed }, hash);

  // show the gas
  console.log('callContract', gasConsumed.toHuman(), 'gas limit');

  return resultPromise('callContract', tx, pair, () => undefined);
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
