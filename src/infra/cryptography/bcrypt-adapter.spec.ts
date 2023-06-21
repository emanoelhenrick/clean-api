import { describe, expect, test, vitest } from 'vitest'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface Sut {
  sut: BcryptAdapter
  salt: number
}

const makeSut = (): Sut => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = vitest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(bcrypt.compareSync('any_value', hash))
      .toBeTruthy()
  })

  test('Should throws if bcrypt throws', async () => {
    const { sut } = makeSut()

    vitest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(async () =>
        await new Promise((resolve, reject) => {
          reject(new Error())
        }))

    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})
