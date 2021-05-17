import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com.br",
      password: "teste123"
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new user with email in use", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Teste",
        email: "teste@error.com.br",
        password: "Teste"
      });

      await createUserUseCase.execute({
        name: "Teste2",
        email: "teste@error.com.br",
        password: "Teste"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });

});
