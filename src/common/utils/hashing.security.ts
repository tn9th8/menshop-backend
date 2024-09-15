import * as bcrypt from 'bcrypt';

export const hashPassword = (plain: string) => {
    const rounds = 14;
    const salt = bcrypt.genSaltSync(rounds);
    const hash = bcrypt.hashSync(plain, salt);
    return hash;
}