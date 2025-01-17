'use server'

export async function authenticate(username: string, password: string) {
  if (username === 'demo' && password === 'demo') {
    return { success: true }
  }
  return { success: false, error: 'Invalid ' }
}
