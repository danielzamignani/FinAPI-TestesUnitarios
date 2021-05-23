import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("Should be able to get the balance of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com.br",
      password: "teste123"
    });

    const user_id = user.id as string;

    const balance = await getBalanceUseCase.execute({user_id});


    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });

  it("Should not be able to get the balance of a non existent user", () => {
    expect(async () => {

      const user_id = "INCORRECTID";

      const balance = await getBalanceUseCase.execute({user_id});
    }).rejects.toBeInstanceOf(GetBalanceError)
  })

});
