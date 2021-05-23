import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType} from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to make a deposit", async () => {

    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com.br",
      password: "teste123"
    });

    const id = user.id as string;

    const deposit: ICreateStatementDTO = {
      user_id: id,
      description: "Deposit test",
      amount: 1000,
      type: "deposit" as OperationType
    };

    const depositStatement = await createStatementUseCase.execute(deposit);

    expect(depositStatement).toHaveProperty("id");
    expect(depositStatement).toHaveProperty("user_id");
    expect(depositStatement).toHaveProperty("type");
    expect(depositStatement).toHaveProperty("amount");
    expect(depositStatement).toHaveProperty("description");
  });

  it("Should be able to make a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com.br",
      password: "teste123"
    });

    const id = user.id as string;

    const deposit: ICreateStatementDTO = {
      user_id: id,
      description: "Deposit test",
      amount: 1000,
      type: "deposit" as OperationType
    };

    const withdraw: ICreateStatementDTO = {
      user_id: id,
      description: "Withdraw test",
      amount: 500,
      type: "withdraw" as OperationType
    };

    await createStatementUseCase.execute(deposit);
    const withdrawStatement = await createStatementUseCase.execute(withdraw);

    expect(withdrawStatement).toHaveProperty("id");
    expect(withdrawStatement).toHaveProperty("user_id");
    expect(withdrawStatement).toHaveProperty("type");
    expect(withdrawStatement).toHaveProperty("amount");
    expect(withdrawStatement).toHaveProperty("description");
  });

  it("Should not be able to create a statement if user not exists", () => {
    expect(async () => {

      const incorretID = "INCORRECTID"

      const deposit: ICreateStatementDTO = {
        user_id: incorretID,
        description: "Deposit test",
        amount: 1000,
        type: "deposit" as OperationType
      };

      await createStatementUseCase.execute(deposit)

    }).rejects.toBeInstanceOf(CreateStatementError);
  });

  it("Should not be able to make a withdraw if user does not have sufficient funds", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Teste",
        email: "teste@teste.com.br",
        password: "teste123"
      });

      const id = user.id as string;

      const withdraw: ICreateStatementDTO = {
        user_id: id,
        description: "Withdraw error",
        amount: 1000,
        type: "withdraw" as OperationType
      };

      await createStatementUseCase.execute(withdraw);

    }).rejects.toBeInstanceOf(CreateStatementError);
  });
});
