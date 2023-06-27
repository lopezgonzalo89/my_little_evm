Example of for loop in OPCODES like a EVM (Ehtereum Virtual Machine)

```bash
CALLDATASIZE
PUSH1 0x00
CALLDATASIZE
PUSH1 0x20
SUB
CALLDATACOPY

// Add DEST in stack
JUMPDEST
PUSH1 0x03
PC
SUB

// Load memory to stack
PUSH1 0x00
MLOAD

// Substract 1 and save to memory
PUSH1 0x01
SWAP1
SUB
DUP1
PUSH1 0x00
MSTORE

// Save to memory and JUMP back if value is not 0
PUSH1 0x0
LT // EVAL
SWAP1 // JUMPI -> DEST, EVAL
JUMPI
```
