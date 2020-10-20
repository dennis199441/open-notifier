const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const EmailService = require("../email/email.service");

describe("EmailService", function () {

    describe("send", function () {
        let sendMail, client, emailService;
        beforeEach(() => {
            sendMail = sinon.stub()
            send = sinon.stub()
            client = { sendMail, send }
            emailService = new EmailService();
            emailService.client = client;
        });

        it("should return null if recipient is undefined", async function () {
            const stubValue = {
                // recipient: faker.internet.email(),
                subject: faker.random.alphaNumeric(),
                text: faker.random.alphaNumeric(),
                html: faker.random.alphaNumeric()
            };
            let result = await emailService.send(stubValue);
            expect(result).to.be.null;
        });

        it("should return null if subject is undefined", async function () {
            const stubValue = {
                recipient: faker.internet.email(),
                // subject: faker.random.alphaNumeric(),
                text: faker.random.alphaNumeric(),
                html: faker.random.alphaNumeric()
            };

            let result = await emailService.send(stubValue);
            expect(result).to.be.null;
        });

        it("should return null if text is undefined", async function () {
            const stubValue = {
                recipient: faker.internet.email(),
                subject: faker.random.alphaNumeric(),
                // text: faker.random.alphaNumeric(),
                html: faker.random.alphaNumeric()
            };

            let result = await emailService.send(stubValue);
            expect(result).to.be.null;
        });

        it("should return null if html is undefined", async function () {
            const stubValue = {
                recipient: faker.internet.email(),
                subject: faker.random.alphaNumeric(),
                text: faker.random.alphaNumeric(),
                // html: faker.random.alphaNumeric()
            };

            let result = await emailService.send(stubValue);
            expect(result).to.be.null;
        });

        it("should send mail if all information is provided", async function () {
            const stubValue = {
                recipient: faker.internet.email(),
                subject: faker.random.alphaNumeric(),
                text: faker.random.alphaNumeric(),
                html: faker.random.alphaNumeric()
            };

            const sendMailArgs = {
                from: "admin@immunodex.com",
                to: stubValue.recipient,
                subject: stubValue.subject,
                text: stubValue.text,
                html: stubValue.html
            };

            let result = await emailService.send(stubValue);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.deep.equal(sendMailArgs);
        });
    });

    describe("sendBatch", function () {
        let emailService;
        beforeEach(() => {
            emailService = new EmailService();
        });

        it("should return null if emails is undefined", async function () {
            let result = await emailService.sendBatch(undefined);
            expect(result).to.be.null;
        });

        it("should return null if emails is empty", async function () {
            let result = await emailService.sendBatch([]);
            expect(result).to.be.null;
        });
    });

});
