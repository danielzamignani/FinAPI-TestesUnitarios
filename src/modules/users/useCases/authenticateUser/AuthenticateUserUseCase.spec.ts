import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    })

    it("Should be able to authenticate an user", async () => {
      const user: ICreateUserDTO = {
          name: "Teste",
          email: "teste@teste.com.br",
          password: "teste123"
      }

      await createUserUseCase.execute(user);

      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });

      expect(result).toHaveProperty("token");
    });

    it("Should not be able to authenticate a non existent user", () => {
      expect(async () => {
        await authenticateUserUseCase.execute({
            email: "false@email.com",
            password: "0000",
        });
      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("Should no be able to authenticate with incorrect password", () =>{
      expect(async () => {
        const user: ICreateUserDTO = {
          name: "Teste Error",
          email: "teste@error.com.br",
          password: "teste123"
        }

        await createUserUseCase.execute(user);

        await authenticateUserUseCase.execute({
          email: user.email,
          password: "incorrectPassword",
        });

      }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

});
