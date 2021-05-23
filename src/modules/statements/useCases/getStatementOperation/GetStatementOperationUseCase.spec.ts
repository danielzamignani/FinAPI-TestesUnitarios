import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { IGetStatementOperationDTO } from "./IGetStatementOperationDTO";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get stament", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Should be able to get a statement of an account", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com.br",
      password: "teste123"
    });

    const deposit: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "Deposit test",
      amount: 1000,
      type: "deposit" as OperationType
    };

    const depositStatement = await createStatementUseCase.execute(deposit);

    const statement: IGetStatementOperationDTO = {
      user_id: user.id as string,
      statement_id: depositStatement.id as string
    };

    const statementInfo = await getStatementOperationUseCase.execute(statement)

    expect(statementInfo).toHaveProperty("id");
    expect(statementInfo).toHaveProperty("user_id");
    expect(statementInfo).toHaveProperty("type");
    expect(statementInfo).toHaveProperty("amount");
    expect(statementInfo).toHaveProperty("description");
  });

  it("Should not be able to get a statement if user non exists", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Teste",
        email: "teste@teste.com.br",
        password: "teste123"
      });

      const deposit: ICreateStatementDTO = {
        user_id: user.id as string,
        description: "Deposit test",
        amount: 1000,
        type: "deposit" as OperationType
      };

      const depositStatement = await createStatementUseCase.execute(deposit);

      const incorrectUserId = "INCORRECTUSERID"

      const statement: IGetStatementOperationDTO = {
        user_id: incorrectUserId,
        statement_id: depositStatement.id as string
      };

      await getStatementOperationUseCase.execute(statement)

    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });

  it("Should not be able to get a inexistent statement ", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Teste",
        email: "teste@teste.com.br",
        password: "teste123"
      });

      const incorrectStatementId = "INCORRECTSTATEMENTID"

      const statement: IGetStatementOperationDTO = {
        user_id: user.id as string,
        statement_id: incorrectStatementId
      };

      await getStatementOperationUseCase.execute(statement);

    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });
});
