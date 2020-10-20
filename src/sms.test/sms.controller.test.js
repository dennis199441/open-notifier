const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const SmsService = require("../sms/sms.service");
const SmsController = require("../sms/sms.controller");

describe("SmsController", function () {
    
    describe("heartbeat", function () {
        let send, res, smsService;
        beforeEach(() => {
            send = sinon.stub();
            res = { send };
            smsService = new SmsService();
        });

        it("should send alive message", async function () {
            const req = sinon.stub();
            await new SmsController(smsService).heartbeat(req, res);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("Sms notifiation service is still alive!");
        });

    });

    describe("send", function () {
        let send, status, res, smsService;
        beforeEach(() => {
            send = sinon.stub();
            status = sinon.stub();
            res = { send, status };
            status.returns(res);
            smsService = new SmsService();
        });

        it("should send sms notification if all information is provided", async function () {
            const req = {
                body: {
                    recipient: faker.phone.phoneNumber(),
                    body: faker.random.alphaNumeric(),
                }
            }

            const stubInfo = {}
            const stubSend = sinon.stub(smsService, "send").returns(stubInfo);
            await new SmsController(smsService).send(req, res);
            expect(stubSend.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.deep.equal({
                msg: "200 Send sms success.",
                me: "open-notifier",
                data: stubInfo
            });
        });

        it("should not send sms notification if recipient is not provided", async function () {
            const req = {
                body: {
                    body: faker.random.alphaNumeric(),
                }
            }

            await new SmsController(smsService).send(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"recipient\" is required");
        });

        it("should not send sms notification if body is not provided", async function () {
            const req = {
                body: {
                    recipient: faker.phone.phoneNumber(),
                }
            }

            await new SmsController(smsService).send(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"body\" is required");
        });

    });

    describe("sendBatch", function () {
        let send, status, res, smsService;
        beforeEach(() => {
            send = sinon.stub();
            status = sinon.stub();
            res = { send, status };
            status.returns(res);
            smsService = new SmsService();
        });

        it("should send sms notification if all information is provided", async function () {
            const req = {
                body: [
                    {
                        recipient: faker.phone.phoneNumber(),
                        body: faker.random.alphaNumeric(),
                    },
                    {
                        recipient: faker.phone.phoneNumber(),
                        body: faker.random.alphaNumeric(),
                    },
                ]
            }

            const stubInfo = [{}]
            const stubSend = sinon.stub(smsService, "sendBatch").returns(stubInfo);
            await new SmsController(smsService).sendBatch(req, res);
            expect(stubSend.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.deep.equal({
                msg: "200 Batch send sms success.",
                me: "open-notifier",
                data: stubInfo
            });
        });

        it("should not send sms notification if recipient is not provided", async function () {
            const req = {
                body: [
                    {
                        // recipient: faker.phone.phoneNumber(),
                        body: faker.random.alphaNumeric(),
                    },
                    {
                        recipient: faker.phone.phoneNumber(),
                        body: faker.random.alphaNumeric(),
                    },
                ]
            }

            await new SmsController(smsService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"[0].recipient\" is required");
        });

        it("should not send sms notification if subject is not provided", async function () {
            const req = {
                body: [
                    {
                        recipient: faker.phone.phoneNumber(),
                        // body: faker.random.alphaNumeric(),
                    },
                    {
                        recipient: faker.phone.phoneNumber(),
                        body: faker.random.alphaNumeric(),
                    },
                ]
            }

            await new SmsController(smsService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"[0].body\" is required");
        });

        it("should not send sms notification if request body is empty", async function () {
            const req = {
                body: []
            }

            await new SmsController(smsService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"value\" does not contain at least one required match");
        });
    });

});
