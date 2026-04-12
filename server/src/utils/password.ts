export function hashPassword(password: string) {
  return Bun.password.hash(password);
}

export function verifyPassword(password: string, hash: string) {
  return Bun.password.verify(password, hash);
}
