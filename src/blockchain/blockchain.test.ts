import faker from 'faker';
import { FAKER_SEED } from '../config';
import Transaction from '../crypto/transaction';
import Wallet from '../crypto/wallet';
import { hashData } from '../util/utils';
import Block from './block';
import Blockchain from './blockchain';

faker.seed(FAKER_SEED);

describe('Blockchain', () => {
  let blockchain: Blockchain;
  let errorMock: jest.Mock;

  beforeEach(() => {
    blockchain = new Blockchain();
    errorMock = jest.fn();

    global.console.error = errorMock;
  });

  it('starts with `genesis` block', () => {
    expect(blockchain.chain[0].isEqual(Block.getGenesis())).toBe(true);
  });

  it('adds a new block to the chain', () => {
    const data = faker.address.streetAddress();
    blockchain.addData(data);

    expect(blockchain.getLastBlock().data).toEqual(data);
  });

  describe('isValid()', () => {
    describe('starts with the genesis block', () => {
      it('returns true', () => {
        expect(blockchain.chain[0].isEqual(Block.getGenesis())).toBe(true);
        expect(Blockchain.isValid(blockchain.chain)).toBe(true);
      });

      it('returns false', () => {
        blockchain.chain[0].data = faker.name.lastName();

        expect(blockchain.chain[0].isEqual(Block.getGenesis())).toBe(false);
        expect(Blockchain.isValid(blockchain.chain)).toBe(false);
      });
    });

    describe('has more than one block', () => {
      beforeEach(() => {
        // add some blocks
        blockchain.addData(faker.company.companyName());
        blockchain.addData(faker.company.companyName());
        blockchain.addData(faker.company.companyName());
      });

      it('returns true if contains only valid blocks', () => {
        expect(Blockchain.isValid(blockchain.chain)).toBe(true);
      });

      describe('and the `prevHash` has changed', () => {
        it('returns false', () => {
          blockchain.getLastBlock().prevHash = faker.random.alphaNumeric(64);
          expect(Blockchain.isValid(blockchain.chain)).toBe(false);
        });
      });

      describe('prevent a difficulty jump', () => {
        it('returns false', () => {
          const prevHash = blockchain.getLastBlock().hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = faker.random.word();
          const difficulty = blockchain.getLastBlock().difficulty + 4;
          const hash = hashData(data, timestamp, difficulty, nonce, prevHash);

          const badBlock = new Block(
            data,
            timestamp,
            difficulty,
            nonce,
            prevHash,
            hash
          );
          blockchain.chain.push(badBlock);

          expect(Blockchain.isValid(blockchain.chain)).toBe(false);
        });
      });

      describe('and any of the fields has changed', () => {
        it('return false', () => {
          blockchain.getLastBlock().nonce = faker.random.number();
          expect(Blockchain.isValid(blockchain.chain)).toBe(false);
        });

        it('return false', () => {
          blockchain.getLastBlock().hash = faker.random.alphaNumeric(64);
          expect(Blockchain.isValid(blockchain.chain)).toBe(false);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    let originalChain: Block[];
    let newChain: Block[];

    beforeEach(() => {
      originalChain = blockchain.chain;

      // create new chain
      const tmp = new Blockchain();
      tmp.addData(faker.name.jobTitle());
      tmp.addData(faker.name.jobTitle());

      newChain = tmp.chain;
    });

    describe('when the chain is not longer', () => {
      it('does not replace the chain', () => {
        const wasReplaced = blockchain.replaceChain(
          [
            Block.createBlock(
              faker.name.firstName(),
              0,
              faker.random.number(),
              faker.random.alphaNumeric(16)
            ),
          ],
          false
        );

        expect(wasReplaced).toBe(false);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe('when the chain is longer', () => {
      it('replaces the chain if it is valid', () => {
        blockchain.replaceChain(newChain, false);
        expect(blockchain.chain).toEqual(newChain);
      });

      it('does not replaces the chain if it is invalid', () => {
        newChain[1].data = faker.random.word();

        blockchain.replaceChain(newChain, false);
        expect(blockchain.chain).not.toEqual(newChain);
      });
    });
  });

  describe('validTransactionData()', () => {
    let transaction: Transaction;
    let wallet: Wallet;
    let rewardTransaction: Transaction;
    let newBlockchain: Blockchain;

    beforeEach(() => {
      wallet = new Wallet();
      newBlockchain = new Blockchain();
      transaction = wallet.createTransaction(100, 'food-address');
      rewardTransaction = Transaction.rewardTransaction(wallet);
    });

    describe('transaction data is valid', () => {
      it('return true', () => {
        newBlockchain.addData([transaction, rewardTransaction]);
        expect(blockchain.validTransactionData(newBlockchain.chain)).toBe(true);
      });
    });

    describe('transaction data is invalid', () => {
      describe('when it has multiple reward transactions', () => {
        it('returns false', () => {
          newBlockchain.addData([
            transaction,
            rewardTransaction,
            rewardTransaction,
          ]);
          expect(blockchain.validTransactionData(newBlockchain.chain)).toBe(
            false
          );
        });
      });

      describe('and it has one or more malformed outputMap', () => {
        describe('and the transaction is not a rewad', () => {
          it('returns false', () => {
            transaction.outputMap[wallet.publicKey] = 99999;
            newBlockchain.addData([transaction, rewardTransaction]);
            expect(blockchain.validTransactionData(newBlockchain.chain)).toBe(
              false
            );
          });
        });

        describe('and the transaction is a rewad', () => {
          it('returns false', () => {
            rewardTransaction.outputMap[wallet.publicKey] = 99999;
            newBlockchain.addData([transaction, rewardTransaction]);
            expect(blockchain.validTransactionData(newBlockchain.chain)).toBe(
              false
            );
          });
        });
      });

      describe('and it has one or more malformed input', () => {
        it('returns false', () => {
          wallet.balance = 99999;

          const badOutputMap = {
            [wallet.publicKey]: 99999 - 100,
            randomAddress: 100,
          };

          const badTransaction = new Transaction('abc', badOutputMap, {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(badOutputMap),
          });

          newBlockchain.addData([badTransaction, rewardTransaction]);
          expect(blockchain.validTransactionData(newBlockchain.chain)).toBe(
            false
          );
        });
      });

      describe('and a block contains multiple identical transactions', () => {
        it('returns false', () => {
          newBlockchain.addData([transaction, transaction, rewardTransaction]);
          expect(blockchain.validTransactionData(newBlockchain.chain)).toBe(
            false
          );
        });
      });
    });
  });
});
