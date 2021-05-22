/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest')
const httpStatus = require('http-status')
const { expect } = require('chai')
const { some } = require('lodash')
const bcrypt = require('bcryptjs')
const app = require('../../../index')
const Bank = require('../../models/bank.model')
const User = require('../../models/user.model')
const { handleBankMessage } = require('../../helpers/bank.helper')

describe('Bank helpers', async () => {
  const dbBanks = {
    vietcomBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'VIETCOMBANK',
      bankAccountId: '0121000891319',
      branch: 'Tao Lao',
      pattern: '0121000891319'
    },
    mbBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'MBBANK',
      bankAccountId: '7220xxxx2005',
      branch: 'Tao Lao',
      pattern: '7220xxxx2005'
    },
    techcomBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'TECHCOMBANK',
      bankAccountId: '19034589147017​​​​​​​​',
      branch: 'Tao Lao',
      pattern: '19034589147017​​​​​​​​'
    },
    sacomBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'SACOMBANK',
      bankAccountId: '050109499355',
      branch: 'Tao Lao',
      pattern: '050109499355'
    },
    vibBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'VIBBANK',
      bankAccountId: '659704060152236',
      branch: 'Tao Lao',
      pattern: '659704060152236'
    },
    acbBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'ACBBANK',
      bankAccountId: '7241387',
      branch: 'Tao Lao',
      pattern: '7241387'
    },
    dongaBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'DONGABANK',
      bankAccountId: '0111099552',
      branch: 'Tao Lao',
      pattern: '0111099552'
    },
    bidvBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'BIDVBANK',
      bankAccountId: '670xxx7492',
      branch: 'Tao Lao',
      pattern: '670xxx7492'
    },
    vietinBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'VIETINBANK',
      bankAccountId: '104870349370',
      branch: 'Tao Lao',
      pattern: '104870349370'
    },
    vpBank: {
      ownerName: 'Nguyen Van A',
      bankName: 'VPBANK',
      bankAccountId: '186708598',
      branch: 'Tao Lao',
      pattern: '186708598'
    }
  }

  const mbBankMessage =
    'TK 7220xxxx2005|GD: +5,000,000VND 29/02/20 01:15|SD:151,495,520VND|ND: Mua hang Tu: PHAM VIET HUNG'
  const mbBankData = {
    accountHolder: '7220xxxx2005',
    money: '5,000,000',
    accountBalance: '151,495,520',
    transferCode: 'Mua hang Tu: PHAM VIET HUNG',
    time: '29/02/20 01:15',
    ownerName: dbBanks.mbBank.ownerName,
    bankName: dbBanks.mbBank.bankName
  }

  const techcomBankMessage = `TK 19034589147017​​​​​​​​
  So tien GD:+10,000,000​
  So du:734,571,040 
  VND_TGTT_NGUYEN TRONG HIEN`
  const techcomBankData = {
    accountHolder: '19034589147017​​​​​​​​',
    money: '10,000,000​',
    accountBalance: '734,571,040',
    transferCode: 'VND_TGTT_NGUYEN TRONG HIEN',
    time: '',
    ownerName: dbBanks.techcomBank.ownerName,
    bankName: dbBanks.techcomBank.bankName
  }

  const sacomBankMessage = `Sacombank 29/02/2020 10:14
  TK: 050109499355
  PS: +1,200,000 VND
  So du kha dung: 414,546,016 VND
  TRAN CON SON NOP TM TK
  `
  const sacomBankData = {
    accountHolder: '050109499355',
    money: '1,200,000',
    accountBalance: '414,546,016',
    transferCode: 'TRAN CON SON NOP TM TK',
    time: '29/02/2020 10:14',
    ownerName: dbBanks.sacomBank.ownerName,
    bankName: dbBanks.sacomBank.bankName
  }

  const vcbBankMessage =
    'SD TK 0121000891319 +4,100,000VND luc 29-02-2020 00:11:31. SD 112,734,090VND. Ref MBVCB351883554.BX16BX9701G.CT tu 0881000450606 LE HUU TRUONG toi 012100089…'
  const vcbBankData = {
    accountHolder: '0121000891319',
    money: '4,100,000',
    accountBalance: '112,734,090',
    transferCode:
      'MBVCB351883554.BX16BX9701G.CT tu 0881000450606 LE HUU TRUONG toi 012100089…',
    time: '29-02-2020 00:11:31',
    ownerName: dbBanks.vietcomBank.ownerName,
    bankName: dbBanks.vietcomBank.bankName
  }

  const vietinBankMessage =
    'VietinBank:29/02/2020 09:33|TK:104870349370|GD:+5,000,000VND|SDC:522,578,293VND|ND:BUI VAN DUC TAN Chuyen tien; tai iPay'
  const vietinBankData = {
    accountHolder: '104870349370',
    money: '5,000,000',
    accountBalance: '522,578,293',
    transferCode: 'BUI VAN DUC TAN Chuyen tien; tai iPay',
    time: '29/02/2020 09:33',
    ownerName: dbBanks.vietinBank.ownerName,
    bankName: dbBanks.vietinBank.bankName
  }

  const bidvBankMessage =
    'TK670xxx7492 tai BIDV +30,000,000VND vao 02:11 29/02/2020. So du:921,301,529VND. ND: CK31310000806217 TRAN HUYNH DUY Chuyen tien Transaction at date 2020-02-29-'
  const bidvBankData = {
    accountHolder: '670xxx7492',
    money: '30,000,000',
    accountBalance: '921,301,529',
    transferCode:
      'CK31310000806217 TRAN HUYNH DUY Chuyen tien Transaction at date 2020-02-29-',
    time: '02:11 29/02/2020',
    ownerName: dbBanks.bidvBank.ownerName,
    bankName: dbBanks.bidvBank.bankName
  }

  const dongaBankMessage =
    '29/02/20 08:47 DongA Bank thong bao: TK 0111099552 da thay doi: +600,000 VND. Nhan CK tu TK 0110384868 - DUONG DINH DUNG. So du hien tai la: 339,733,050 VND.'
  const dongaBankData = {
    accountHolder: '0111099552',
    money: '600,000',
    accountBalance: '339,733,050',
    transferCode: 'TK 0110384868 - DUONG DINH DUNG',
    time: '29/02/20 08:47',
    ownerName: dbBanks.dongaBank.ownerName,
    bankName: dbBanks.dongaBank.bankName
  }

  const acbBankMessage =
    'ACB: TK 7241387(VND) + 2,000,000 luc 08:24 29/02/2020. So du 763,222,700. GD: HOANG TRONG NHAN CK, IBHOANG TRONG NHAN CHUYEN KHOAN CHO PHAM MINH TONG'
  const acbBankData = {
    accountHolder: '7241387',
    money: '2,000,000',
    accountBalance: '763,222,700',
    transferCode:
      'HOANG TRONG NHAN CK, IBHOANG TRONG NHAN CHUYEN KHOAN CHO PHAM MINH TONG',
    time: '08:24 29/02/2020',
    ownerName: dbBanks.acbBank.ownerName,
    bankName: dbBanks.acbBank.bankName
  }

  const vibBankMessage = `12:19;29/02/2020
  TK:659704060152236VND
  PS:+5,000,000
  ND:TRAN VAN TUAN chuyen tien noi bo toi PHAM MINH TONG-659704060152236
  SODU:+9,315,200`
  const vibBankData = {
    accountHolder: '659704060152236',
    money: '5,000,000',
    accountBalance: '9,315,200',
    transferCode:
      'TRAN VAN TUAN chuyen tien noi bo toi PHAM MINH TONG-659704060152236',
    time: '12:19;29/02/2020',
    ownerName: dbBanks.vibBank.ownerName,
    bankName: dbBanks.vibBank.bankName
  }

  const vpBankMessage =
    'TK 186708598 tai VPB tang 500,000VND do KHACH HANG CMT 141785020 NOP TIEN T AI MAY CDM. So du TK sau GD la 553,115,403VND'
  const vpBankData = {
    accountHolder: '186708598',
    money: '500,000',
    accountBalance: '553,115,403',
    transferCode: 'KHACH HANG CMT 141785020 NOP TIEN T AI MAY CDM',
    time: '',
    ownerName: dbBanks.vpBank.ownerName,
    bankName: dbBanks.vpBank.bankName
  }

  beforeEach(async () => {
    try {
      await Bank.deleteMany({})
      await Bank.insertMany([
        dbBanks.vietcomBank,
        dbBanks.vibBank,
        dbBanks.vpBank,
        dbBanks.vietinBank,
        dbBanks.bidvBank,
        dbBanks.dongaBank,
        dbBanks.acbBank,
        dbBanks.sacomBank,
        dbBanks.techcomBank,
        dbBanks.mbBank
      ])
    } catch (error) {
      console.log(error)
    }
  })

  describe('Test parse message', () => {
    it('should parse success MBBANK data', async () => {
      const result = await handleBankMessage(mbBankMessage)
      expect(result).to.include(mbBankData)
    })
    it('should parse success TECHCOMBANK data', async () => {
      const result = await handleBankMessage(techcomBankMessage)
      expect(result).to.include(techcomBankData)
    })
    it('should parse success SACOMBANK data', async () => {
      const result = await handleBankMessage(sacomBankMessage)
      expect(result).to.include(sacomBankData)
    })
    it('should parse success VIB data', async () => {
      const result = await handleBankMessage(vibBankMessage)
      expect(result).to.include(vibBankData)
    })
    it('should parse success ACB data', async () => {
      const result = await handleBankMessage(acbBankMessage)
      expect(result).to.include(acbBankData)
    })
    it('should parse success DONGA data', async () => {
      const result = await handleBankMessage(dongaBankMessage)
      expect(result).to.include(dongaBankData)
    })
    it('should parse success BIDV data', async () => {
      const result = await handleBankMessage(bidvBankMessage)
      expect(result).to.include(bidvBankData)
    })
    it('should parse success VIETINBANK data', async () => {
      const result = await handleBankMessage(vietinBankMessage)
      expect(result).to.include(vietinBankData)
    })
    it('should parse success VIETCOMBANK data', async () => {
      const result = await handleBankMessage(vcbBankMessage)
      expect(result).to.include(vcbBankData)
    })
    it('should parse success VPBANK data', async () => {
      const result = await handleBankMessage(vpBankMessage)
      expect(result).to.include(vpBankData)
    })
  })
})

describe('Banks API', async () => {
  let adminAccessToken
  let bank
  let dbUsers
  let dbBanks

  const password = '123456'
  let passwordHashed
  bcrypt.hash(password, 1).then(hash => (passwordHashed = hash))
  beforeEach(async () => {
    bank = {
      ownerName: 'Nguyen Van A',
      bankName: 'MBBANK',
      bankAccountId: '7220xxxx2005',
      branch: 'Tao Lao'
    }
    dbBanks = {
      vietcomBank: {
        ownerName: 'Nguyen Van A',
        bankName: 'VIETCOMBANK',
        bankAccountId: '1298102810',
        branch: 'Tao Lao',
        pattern: '1298102810'
      }
    }
    dbUsers = {
      branStark: {
        email: 'branstark@gmail.com',
        password: passwordHashed,
        username: 'branstark',
        name: 'Bran Stark',
        role: 'admin'
      },
      jonSnow: {
        email: 'jonsnow@gmail.com',
        password: passwordHashed,
        username: 'jonsnow',
        name: 'Jon Snow'
      }
    }
    await User.deleteMany({})
    await Bank.deleteMany({})
    await User.insertMany([dbUsers.branStark, dbUsers.jonSnow])
    await Bank.insertMany([dbBanks.vietcomBank])
    dbUsers.branStark.password = password
    dbUsers.jonSnow.password = password

    adminAccessToken = (await User.findAndGenerateToken(dbUsers.branStark))
      .accessToken
    bankAccessToken = (await User.findAndGenerateToken(dbUsers.jonSnow))
      .accessToken
  })

  describe('POST /v1/banks', () => {
    it('should create a new bank when request is ok', () => {
      return request(app)
        .post('/v1/banks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(bank)
        .expect(httpStatus.CREATED)
        .then(res => {
          bank['bankName'] = bank.bankName.toUpperCase()
          expect(res.body).to.include(bank)
        })
    })

    it('should report error when bankName is not provided', () => {
      delete bank.bankName

      return request(app)
        .post('/v1/banks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(bank)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          const { field } = res.body.errors[0]
          const { location } = res.body.errors[0]
          const { messages } = res.body.errors[0]
          expect(field).to.be.equal('bankName')
          expect(location).to.be.equal('body')
          expect(messages).to.include('"bankName" is required')
        })
    })

    it('should report error when bankName length is less than 3', () => {
      bank.bankName = '12'

      return request(app)
        .post('/v1/banks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(bank)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          const { field } = res.body.errors[0]
          const { location } = res.body.errors[0]
          const { messages } = res.body.errors[0]
          expect(field).to.be.equal('bankName')
          expect(location).to.be.equal('body')
          expect(messages).to.include(
            '"bankName" length must be at least 3 characters long'
          )
        })
    })
  })

  describe('GET /v1/banks', () => {
    it('should get all banks', () => {
      return request(app)
        .get('/v1/banks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK)
        .then(async res => {
          const includesMBBank = some(res.body, dbUsers.vietcomBank)
          // before comparing it is necessary to convert String to Date
          res.body[0].createdAt = new Date(res.body[0].createdAt)

          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(1)
          expect(includesMBBank).to.be.true
        })
    })

    it('should get all banks with pagination', () => {
      return request(app)
        .get('/v1/banks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 2, perPage: 1 })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(0)
        })
    })

    it('should filter banks', () => {
      return request(app)
        .get('/v1/banks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({
          page: 1,
          perPage: 1,
          bankName: 'VietComBank'
        })
        .expect(httpStatus.OK)
        .then(res => {
          const includesVCB = some(res.body, dbBanks.vietcomBank)

          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf(1)
          expect(includesVCB).to.be.true
        })
    })

    it('should report error if logged bank is not an admin', () => {
      return request(app)
        .get('/v1/banks')
        .set('Authorization', `Bearer ${bankAccessToken}`)
        .expect(httpStatus.FORBIDDEN)
        .then(res => {
          expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN)
          expect(res.body.message).to.be.equal('Forbidden')
        })
    })
  })

  describe('GET /v1/banks/:bankId', () => {
    it('should get bank', async () => {
      const id = (await Bank.findOne({}))._id

      return request(app)
        .get(`/v1/banks/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.include(dbBanks.vietcomBank)
        })
    })

    it('should report error "Bank does not exist" when bank does not exists', () => {
      return request(app)
        .get('/v1/banks/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND)

      expect(res.body.code).to.be.equal(404)
      expect(res.body.message).to.be.equal('Bank does not exist')
    })
  })

  describe('PUT /v1/banks/:bankId', () => {
    it('should replace bank', async () => {
      const id = (await Bank.findOne({}))._id

      return request(app)
        .put(`/v1/banks/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(bank)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.include({
            ...bank,
            bankName: bank.bankName.toUpperCase()
          })
        })
    })

    it('should report error bank when bankName length is less than 3', async () => {
      const id = (await Bank.findOne({}))._id
      bank.bankName = '12'

      return request(app)
        .put(`/v1/banks/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(bank)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          const { field } = res.body.errors[0]
          const { location } = res.body.errors[0]
          const { messages } = res.body.errors[0]
          expect(field).to.be.equal('bankName')
          expect(location).to.be.equal('body')
          expect(messages).to.include(
            '"bankName" length must be at least 3 characters long'
          )
        })
    })

    it('should report error "Bank does not exist" when bank does not exists', () => {
      return request(app)
        .put('/v1/banks/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(bank)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.code).to.be.equal(404)
          expect(res.body.message).to.be.equal('Bank does not exist')
        })
    })
  })

  describe('PATCH /v1/banks/:bankId', () => {
    it('should update bank', async () => {
      const id = (await Bank.findOne({}))._id
      let name = { ...bank }
      name.bankName = 'Bank Tao Lao'
      return request(app)
        .patch(`/v1/banks/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(name)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.bankName).to.be.equal(name.bankName.toUpperCase())
          expect(res.body.bankName).to.not.be.equal(bank.bankName)
        })
    })

    it('should not update bank when no parameters were given', async () => {
      const id = (await Bank.findOne({}))._id

      return request(app)
        .patch(`/v1/banks/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST)
    })

    it('should report error "Bank does not exist" when bank does not exists', async () => {
      const res = await request(app)
        .patch('/v1/banks/56c787ccc67fc16ccc1a5e92')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(bank)
      expect(res.body.status).to.be.equal(404)
      expect(res.body.message).to.be.equal('Bank does not exist')
    })
  })

  describe('DELETE /v1/banks', () => {
    it('should delete bank', async () => {
      const id = (await Bank.findOne({}))._id

      return request(app)
        .delete(`/v1/banks/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT)
        .then(() => request(app).get('/v1/banks'))
        .then(async () => {
          const banks = await Bank.find({})
          expect(banks).to.have.lengthOf(0)
        })
    })
  })
})
