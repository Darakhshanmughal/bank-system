#! /usr/bin/env node 

import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";

class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobNumber: string;
    accountNumber: number;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobNumber: string, accountNumber: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobNumber = mobNumber;
        this.accountNumber = accountNumber;
    }
}

interface BankAccount {
    accountNumber: number;
    balance: number;
}

class Bank {
    customers: Customer[] = [];
    accounts: BankAccount[] = [];

    addCustomer(customer: Customer) {
        this.customers.push(customer);
    }

    addAccount(account: BankAccount) {
        this.accounts.push(account);
    }

    findAccount(accountNumber: number): BankAccount | undefined {
        return this.accounts.find(account => account.accountNumber === accountNumber);
    }
}

let myBank = new Bank();
for (let i = 1; i <= 3; i++) {
    let firstName = faker.person.firstName("male");
    let lastName = faker.person.lastName();
    let mobNumber = faker.string.numeric(10); // Generate a 10-digit numeric string for phone number
    const formattedMobNumber = mobNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Format the phone number
    const customer = new Customer(firstName, lastName, "male", 25 * i, formattedMobNumber, 1000 + i);

    myBank.addCustomer(customer);
    myBank.addAccount({ accountNumber: customer.accountNumber, balance: 100 * i });
}

// Bank functionality
async function bankService(bank: Bank) {
    while (true) {
        let { select } = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the service",
            choices: ["view balance", "cash withdraw", "cash deposit", "exit"]
        });

        if (select === "exit") {
            console.log(chalk.bold.green("Thank you for using the bank system. Goodbye!"));
            break;
        }

        let { accountNumber } = await inquirer.prompt({
            type: "number",
            name: "accountNumber",
            message: "Please enter your account number:"
        });

        let account = bank.findAccount(accountNumber);

        if (!account) {
            console.log(chalk.bold.red("Account not found."));
            continue;
        }

        if (select === "view balance") {
            console.log(chalk.bold.green(`Your balance is $${account.balance}`));
        } else if (select === "cash withdraw") {
            let { amount } = await inquirer.prompt({
                type: "number",
                name: "amount",
                message: "Please enter the amount to withdraw:"
            });

            if (amount > account.balance) {
                console.log(chalk.bold.red("Insufficient funds."));
            } else {
                account.balance -= amount;
                console.log(chalk.bold.green(`Withdrawal successful. New balance is $${account.balance}`));
            }
        } else if (select === "cash deposit") {
            let { amount } = await inquirer.prompt({
                type: "number",
                name: "amount",
                message: "Please enter the amount to deposit:"
            });

            account.balance += amount;
            console.log(chalk.bold.green(`Deposit successful. New balance is $${account.balance}`));
        }
    }
} 

bankService(myBank);
