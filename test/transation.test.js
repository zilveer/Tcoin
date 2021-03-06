const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/index");

describe("Transaction", ()=>{
    let transaction, wallet, recipient, amount;

    beforeEach(() =>{
        wallet = new Wallet();
        amount = 50;
        recipient = "recipient address";
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it("should output the amount minus the wallet balance", () =>{
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it("should input the balance of the balance of the wallet", ()=>{
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it("should output the amount added to the recipient", () =>{
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

    it("should validates a valid Transaction", ()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);  
    });

    it("should invalidates a valid Transaction", ()=>{
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);  
    });


    describe("updating a transaction", ()=>{
        let nextAmount, nextRecipient;

        beforeEach(()=>{
            nextAmount = 20;
            nextRecipient = "n3sc_reciias";
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it("Substract the next amount from the senders output", ()=>{
           expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        });

        it("ouputs an amount for the next recipient", ()=>{
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
         });

    })
});
