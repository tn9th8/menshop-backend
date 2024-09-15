import * as bcrypt from 'bcrypt';

export const hashPassword = async (plain: string) => {
    const saltRounds = 14;
    return await bcrypt.hash(plain, saltRounds);
}