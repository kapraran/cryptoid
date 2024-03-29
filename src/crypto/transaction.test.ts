import { ec as EC } from 'elliptic';
import { MINE_REWARD } from '../config';
import { ec } from '../util/ec';
import { verifySignature } from '../util/utils';
import Transaction from './transaction';
import Wallet from './wallet';

describe('Transaction', () => {
  let senderWallet: Wallet;
  let recipientAddress: string;
  let transaction: Transaction;
  let amount: number;

  beforeEach(() => {
    senderWallet = new Wallet();
    const keyPair = ec.genKeyPair();
    recipientAddress = keyPair.getPublic().encode('hex', false);
    amount = 100.0;

    transaction = Transaction.create(senderWallet, recipientAddress, amount);
  });

  it('has an id', () => {
    expect(transaction).toHaveProperty('id');
  });

  describe('outputMap', () => {
    it('has an outputMap', () => {
      expect(transaction).toHaveProperty('outputMap');
    });

    it('outputs the `amount` to the recipient', () => {
      expect(transaction.outputMap[recipientAddress]).toEqual(amount);
    });

    it('outputs the remaining back to senderWallet', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe('input', () => {
    it('has an input', () => {
      expect(transaction).toHaveProperty('input');
    });

    it('has an input.timestamp', () => {
      expect(transaction.input).toHaveProperty('timestamp');
    });

    it('sets the amount to the senderWallet.balance', () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it('sets the addres to the senderWallet.publicKey', () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it('should have signed the input', () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe('isValidTransaction()', () => {
    let errorMock: jest.Mock;

    beforeEach(() => {
      errorMock = jest.fn();
      global.console.error = errorMock;
    });

    describe('when transaction is valid', () => {
      it('returns true', () => {
        expect(Transaction.isValidTransaction(transaction)).toBe(true);
      });
    });

    describe('when transaction is invalid', () => {
      describe('and the outputMap is invalid', () => {
        it('returns false', () => {
          transaction.outputMap[senderWallet.publicKey] = 12345;
          expect(Transaction.isValidTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and the input is invalid', () => {
        it('returns false with signature from same wallet', () => {
          transaction.input.signature = senderWallet.sign('invalid-data');
          expect(Transaction.isValidTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });

        it('returns false with signature from another wallet', () => {
          transaction.input.signature = new Wallet().sign(
            transaction.outputMap
          );
          expect(Transaction.isValidTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe('update()', () => {
    describe('and the amount is invalid', () => {
      it('throws an error', () => {
        expect(() => {
          transaction.update(senderWallet, 'some-new-recipient', 999999);
        }).toThrow('Amount exceeds the balance');
      });
    });

    describe('and the amount is valid', () => {
      let originalSignature: EC.Signature;
      let originalRemaining: number;
      let newRecipient: string;
      let newAmount: number;

      beforeEach(() => {
        originalSignature = transaction.input.signature!;
        originalRemaining = transaction.outputMap[senderWallet.publicKey];
        newRecipient = 'some-random-key-123';
        newAmount = 5;

        transaction.update(senderWallet, newRecipient, newAmount);
      });

      it('outputs the amount to the new recipient', () => {
        expect(transaction.outputMap[newRecipient]).toEqual(newAmount);
      });

      it('outputs the updated remaining balance for the sender', () => {
        expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
          originalRemaining - newAmount
        );
      });

      it('maintains the total output to be equal to the input amount', () => {
        const outputSum = Object.values(transaction.outputMap).reduce<number>(
          (sum, amount) => sum + amount,
          0
        );
        expect(outputSum).toEqual(transaction.input.amount);
      });

      it('has an updated valid signature', () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
        expect(transaction.input.signature).toEqual(
          senderWallet.sign(transaction.outputMap)
        );
      });

      describe('and another update for the an existing recipient', () => {
        let addedAmount: number;

        beforeEach(() => {
          addedAmount = 5.0;
          transaction.update(senderWallet, newRecipient, addedAmount);
        });

        it('adds the amount to the existing recipient', () => {
          expect(transaction.outputMap[newRecipient]).toEqual(
            newAmount + addedAmount
          );
        });

        it('subtracts the amount from the output for the sender', () => {
          expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
            originalRemaining - addedAmount - newAmount
          );
        });
      });
    });
  });

  describe('rewardTransaction()', () => {
    let minerWallet: Wallet;
    let rewardTransaction: Transaction;

    beforeEach(() => {
      minerWallet = new Wallet();
      rewardTransaction = Transaction.rewardTransaction(minerWallet);
    });

    it('creates a Transaction with the reward input', () => {
      expect(rewardTransaction instanceof Transaction).toBe(true);
      expect(rewardTransaction.input).toEqual(MINE_REWARD.input);
    });

    it('creates a Transaction with the reward amount for the miner', () => {
      expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(
        MINE_REWARD.amount
      );
    });
  });
});
