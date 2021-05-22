import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("Should be able to show an user profile", async () => {

    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com.br",
      password: "teste123"
    });

    const id = user.id as string

    const userProfile = await showUserProfileUseCase.execute(id)

    expect(userProfile).toHaveProperty("name")
    expect(userProfile).toHaveProperty("email")
    expect(userProfile).toHaveProperty("id")

  });

  it("Should no be able to show user profile with an incorrect id", () =>{
    expect(async () => {
      await createUserUseCase.execute({
        name: "Teste",
        email: "teste@teste.com.br",
        password: "teste123"
      });

      const incorretID = "INCORRECTID"

      await showUserProfileUseCase.execute(incorretID)

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
}
);

