import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const { income, outcome } = allTransactions.reduce(
      (accumulator, transact) => {
        switch (transact.type) {
          case 'income':
            accumulator.income += Number(transact.value);
            break;

          case 'outcome':
            accumulator.outcome += Number(transact.value);
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;
    const finalBalance = {
      income,
      outcome,
      total,
    };
    return finalBalance;
  }
}

export default TransactionsRepository;
