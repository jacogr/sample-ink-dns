# ink-sample-dns

A sample with Substrate contracts. Deploys code, creates a contract, registers. (Used the ink! dns contract, emitting events)

- clone
- npm
- npm start 

Output should look like -

```
$ npm start

getBlueprint (status) Ready
getBlueprint (status) {"InBlock":"0xb7a98210e9adf05c14e69c58329ff74b050c8517d2021027def082e7c491e015"}

getContract (status) Ready
getContract (status) {"InBlock":"0x4bb3ae4b6d4ad60b10d2e66baa270ee809bf51289dc3d33263f6d81b7ef9c98b"}

callContract 38,687,929,929 gas limit
callContract (status) Ready
callContract (status) {"InBlock":"0x4ad5a3849c036b3a46164daf9e3c239059d0c1c4deac0d30346bb79777b84836"}
callContract (events) [
  'Register(0x2215beb0acb209fdee3f5ba28b124b8d39ef0350bf4258a3950e93bf3659faf5, 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY)'
]

Done.
```
