import { isHexString, arrayify, hexlify } from "@ethersproject/bytes";
import Memory from "../memory";
import Stack from "../stack";
import {
  InvalidByteCode,
  InvalidProgramCounterIndex,
  UnknownOpCode,
} from "./error";
import Instruction from "../instructions";
import Opcodes from "../../opcodes";

class ExecutionContext {
  private readonly code: Uint8Array;
  public stack: Stack;
  public memory: Memory;
  private pc: number;
  private stopped: boolean;

  constructor(code: string) {
    if (!isHexString(code) || code.length % 2 !== 0) {
      throw new InvalidByteCode();
    }
    this.code = arrayify(code);
    this.stack = new Stack();
    this.memory = new Memory();
    this.pc = 0;
    this.stopped = false;
  }

  public stop(): void {
    this.stopped = true;
  }

  public run = (): void => {
    while (!this.stopped) {
      const currentCounter = this.pc;
      console.log(`@pc = ${currentCounter}`);

      const instruction = this.fetchInstruction();
      instruction.execute(this);
      console.log(`@instruction = ${instruction.name}\t @pc=${currentCounter}`);

      this.memory.print();
      this.stack.print();

      console.log("\n");
    }
  };

  private fetchInstruction(): Instruction {
    if (this.pc > this.code.length) return Opcodes[0];
    if (this.pc < 0) throw new InvalidProgramCounterIndex();

    const opcode = this.readBytesFromCode(1);
    const instruction = Opcodes[Number(opcode)];

    if (!instruction) throw new UnknownOpCode();
    return instruction;
  }

  public readBytesFromCode(bytes: number): bigint {
    const hexValues = this.code.slice(this.pc, this.pc + bytes);
    const values = BigInt(hexlify(hexValues));

    this.pc += bytes;
    return values;
  }
}

export default ExecutionContext;
