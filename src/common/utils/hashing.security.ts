import * as bcrypt from 'bcrypt';

export const hashPass = async (plain: string) => {
    const saltRounds = 14;
    return await bcrypt.hash(plain, saltRounds);
}

export const isMatchPass = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}
