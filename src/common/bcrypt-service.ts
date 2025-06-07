import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class CryptService {
  private saltRounds = 12; // Número recomendado de rounds (custo)

  public async hash(arg: string): Promise<string> {
    // Gera um novo salt para cada hash (mais seguro)
    const salt = await genSalt(this.saltRounds);
    const hashedPass = await hash(arg, salt);
    return hashedPass;
  }

  public async compare(arg: string, hash: string): Promise<boolean> {
    return await compare(arg, hash);
  }
}
