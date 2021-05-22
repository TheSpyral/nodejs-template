/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require("supertest");
const httpStatus = require("http-status");
const { expect } = require("chai");
const { some, omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const app = require("../../../index");
const DepositTransaction = require("../../models/depositTransaction.model");
const User = require("../../models/user.model");
const Bank = require("../../models/bank.model");

describe("Deposit Transaction API", async () => {
  let adminAccessToken;
  let tx;
  let dbUsers;
  let dbBanks;
  let dbDepositTx;

  const password = "123456";
  const passwordHashed = await bcrypt.hash(password, 1);

  beforeEach(async () => {
    dbBanks = {
      vietcomBank: {
        ownerName: "Nguyen Van A",
        bankName: "VIETCOMBANK",
        bankAccountID: "1298102810",
        branch: "Tao Lao"
      }
    };
    dbUsers = {
      branStark: {
        email: "branstark@gmail.com",
        password: passwordHashed,
        username: "branstark",
        name: "Bran Stark",
        role: "admin"
      },
      jonSnow: {
        email: "jonsnow@gmail.com",
        password: passwordHashed,
        username: "jonsnow",
        name: "Jon Snow"
      }
    };
    dbDepositTx = {
      txOne: {
        bankName: dbBanks.vietcomBank.bankName,
        accountBalance: 1000000,
        accountHolder: "Nguyen Van A",
        money: 5000000,
        memo: "TK 1298102810 - DUONG DINH DUNG"
      }
    };
    tx = {
      bankName: dbBanks.vietcomBank.bankName,
      accountBalance: 1000000,
      accountHolder: "Nguyen Van A",
      money: 5000000,
      memo: `TK 1298102810 - ${dbUsers.jonSnow.username}`
    };

    await User.deleteMany({});
    await Bank.deleteMany({});
    await DepositTransaction.deleteMany({});
    await User.insertMany([dbUsers.branStark, dbUsers.jonSnow]);
    await Bank.insertMany([dbBanks.vietcomBank]);

    let user = await User.findOne(dbUsers.jonSnow);
    dbDepositTx.txOne["userId"] = user.id;
    await DepositTransaction.insertMany([dbDepositTx.txOne]);

    dbUsers.branStark.password = password;
    dbUsers.jonSnow.password = password;
    adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark))
      .accessToken;
    bankAccessToken = (await User.findAndGenerateToken(dbUsers.jonSnow))
      .accessToken;
  });

  describe("POST /v1/depositTx", () => {
    it("should create a new deposit transaction when request is ok", async () => {
      const res = await request(app)
        .post("/v1/depositTx")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(tx)
        .expect(httpStatus.CREATED);
      tx["bankName"] = bank.bankName.toUpperCase();
      console.log(res.body);
      expect(res.body).to.include(tx);
    });
  });
});
