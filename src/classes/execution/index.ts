import { isHexString, arrayify, hexlify } from "@ethersproject/bytes";
import Memory from "../memory";
import Stack from "../stack";
import { InvalidByteCode } from "./error";

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
      const opcode = this.readBytesFromCode(1);
      if (!opcode) {
        this.stop();
      }
    }
  };

  public readBytesFromCode(bytes: number): bigint {
    const hexValues = this.code.slice(this.pc, this.pc + bytes);
    const values = BigInt(hexlify(hexValues));

    this.pc += bytes;
    return values;
  }
}

export default ExecutionContext;
