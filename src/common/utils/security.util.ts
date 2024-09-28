import * as bcrypt from 'bcrypt';

// function hash password
export const hashPass = async (plain: string): Promise<string> => {
    const saltRounds = 14;
    return await bcrypt.hash(plain, saltRounds);
}

// function compare password and hashing
export const isMatchPass = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}
