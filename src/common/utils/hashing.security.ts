import * as bcrypt from 'bcrypt';

export const hashPassword = async (plain: string) => {
    // todo: see again
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(plain, salt);
    return hash;
}