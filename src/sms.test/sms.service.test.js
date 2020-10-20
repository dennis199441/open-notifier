const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const SmsService = require("../sms/sms.service");

describe("SmsService", function () {

    describe("send", function () {
        let client, messages, create, smsService;
        beforeEach(() => {
            create = sinon.stub();
            messages = { create }
            client = { messages }
            smsService = new SmsService(client);
        });

        it("should return null if recipient is undefined", async function () {
            const stubValue = {
                body: faker.random.alphaNumeric(),
            };
            let result = await smsService.send(stubValue);
            expect(result).to.be.null;
        });

        it("should return null if body is undefined", async function () {
            const stubValue = {
                recipient: faker.phone.phoneNumber(),
            };

            let result = await smsService.send(stubValue);
            expect(result).to.be.null;
        });

        it("should send mail if all information is provided", async function () {
            const stubValue = {
                recipient: faker.phone.phoneNumber(),
                body: faker.random.alphaNumeric(),
            };

            const createArgs = {
                body: stubValue.body,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: stubValue.recipient,
            };

            let result = await smsService.send(stubValue);
            expect(create.calledOnce).to.be.true;
            expect(create.args[0][0]).to.deep.equal(createArgs);
        });
    });

    describe("sendBatch", function () {
        let client, messages, create, smsService;
        beforeEach(() => {
            create = sinon.stub();
            messages = { create }
            client = { messages }
            smsService = new SmsService(client);
        });

        it("should return null if messages is undefined", async function () {
            let result = await smsService.sendBatch(undefined);
            expect(result).to.be.null;
        });

        it("should return null if messages is empty", async function () {
            let result = await smsService.sendBatch([]);
            expect(result).to.be.null;
        });
    });

});
