# ink-sample-dns

A sample with Substrate contracts. Deploys code, creates a contract, registers. (Used the ink! dns contract, emitting events)

- clone
- npm
- npm start

Output should look like -

```
$ npm start

getBlueprint (status) Ready
getBlueprint (status) {"InBlock":"0x68403e09be3b5d6b8448730a7c399c1427d6433513539a4ec56b85304f010006"}
getBlueprint (events/system) [
  'contracts.CodeStored(["0xcf3eee6ac5d38f6f503293735a72b011960e09ec1dd09185ab3c3d28e7770009"])',
  'system.ExtrinsicSuccess([{"weight":"8,274,783,000","class":"Normal","paysFee":"Yes"}])'
]
getBlueprint (dispatch) {"weight":"8,274,783,000","class":"Normal","paysFee":"Yes"}

getContract (status) Ready
getContract (status) {"InBlock":"0x9453c0ce2dd966580cfb74d56ca293c26aaf6a85fb1ae049421ea439cc395339"}
getContract (events/system) [
  'system.NewAccount(["5D39aWjHU3bcX4z8KsNCW73U8Nz8tc63jWwFFDRh3FYNcfN9"])',
  'balances.Endowed(["5D39aWjHU3bcX4z8KsNCW73U8Nz8tc63jWwFFDRh3FYNcfN9","123.0000 mUnit"])',
  'balances.Transfer(["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5D39aWjHU3bcX4z8KsNCW73U8Nz8tc63jWwFFDRh3FYNcfN9","123.0000 mUnit"])',
  'contracts.Instantiated(["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5D39aWjHU3bcX4z8KsNCW73U8Nz8tc63jWwFFDRh3FYNcfN9"])',
  'system.ExtrinsicSuccess([{"weight":"4,641,795,449","class":"Normal","paysFee":"Yes"}])'
]
getContract (dispatch) {"weight":"4,641,795,449","class":"Normal","paysFee":"Yes"}

callContract 38,687,929,929 gas limit
callContract (status) Ready
callContract (status) {"InBlock":"0x36873c543381faaa3f042cec096f6618ab1ce03c01e6c23b4408d2458f79bf46"}
callContract (events/system) [
  'contracts.ContractExecution(["5D39aWjHU3bcX4z8KsNCW73U8Nz8tc63jWwFFDRh3FYNcfN9","0x005e336b2b94fcafc4c08fa6f384a6ca23f80466fcfd9b445713800591da1c939ed43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"])',
  'system.ExtrinsicSuccess([{"weight":"38,687,929,929","class":"Normal","paysFee":"Yes"}])'
]
callContract (events/contract) [
  'Register(["0x5e336b2b94fcafc4c08fa6f384a6ca23f80466fcfd9b445713800591da1c939e","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"])'
]
callContract (dispatch) {"weight":"38,687,929,929","class":"Normal","paysFee":"Yes"}

Done.
```

In the case of errors, those will also be decoded, for instance here we have an `OutOfGas` error -

```
...
getContract (status) Ready
getContract (status) {"InBlock":"0x5660bfaac3043ec951fb36070388c652a60a2fbab253da2ce63747a0425ca771"}
getContract (events/system) [
  'system.ExtrinsicFailed([{"Module":{"index":"8","error":"6"}},{"weight":"200,000","class":"Normal","paysFee":"Yes"}])'
]
getContract (dispatch) {"weight":"200,000","class":"Normal","paysFee":"Yes"}
getContract (error) contracts.OutOfGas:  The executed contract exhausted its gas limit.

Error. {"Module":{"index":8,"error":6}}
```
