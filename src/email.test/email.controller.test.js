const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const EmailService = require("../email/email.service");
const EmailController = require("../email/email.controller");

describe("EmailController", function () {
    
    describe("heartbeat", function () {
        let send, res, emailService;
        beforeEach(() => {
            send = sinon.stub();
            res = { send };
            emailService = new EmailService();
        });

        it("should send alive message", async function () {
            const req = sinon.stub();
            await new EmailController(emailService).heartbeat(req, res);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("Email notifiation service is still alive!");
        });

    });

    describe("send", function () {
        let send, status, res, emailService;
        beforeEach(() => {
            send = sinon.stub();
            status = sinon.stub();
            res = { send, status };
            status.returns(res);
            emailService = new EmailService();
        });

        it("should send email notification if all information is provided", async function () {
            const req = {
                body: {
                    recipient: faker.internet.email(),
                    subject: faker.random.alphaNumeric(),
                    text: faker.random.alphaNumeric(),
                    html: "<b>" + faker.random.alphaNumeric() + "</b>"
                }
            }

            const stubInfo = {}
            const stubSend = sinon.stub(emailService, "send").returns(stubInfo);
            await new EmailController(emailService).send(req, res);
            expect(stubSend.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.deep.equal({
                msg: "200 Send email success.",
                me: "open-notifier",
                data: stubInfo
            });
        });

        it("should not send email notification if recipient is not provided", async function () {
            const req = {
                body: {
                    subject: faker.random.alphaNumeric(),
                    text: faker.random.alphaNumeric(),
                    html: "<b>" + faker.random.alphaNumeric() + "</b>"
                }
            }

            await new EmailController(emailService).send(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"recipient\" is required");
        });

        it("should not send email notification if subject is not provided", async function () {
            const req = {
                body: {
                    recipient: faker.internet.email(),
                    text: faker.random.alphaNumeric(),
                    html: "<b>" + faker.random.alphaNumeric() + "</b>"
                }
            }

            await new EmailController(emailService).send(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"subject\" is required");
        });

        it("should not send email notification if text is not provided", async function () {
            const req = {
                body: {
                    recipient: faker.internet.email(),
                    subject: faker.random.alphaNumeric(),
                    html: "<b>" + faker.random.alphaNumeric() + "</b>"
                }
            }

            await new EmailController(emailService).send(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"text\" is required");
        });

        it("should not send email notification if html is not provided", async function () {
            const req = {
                body: {
                    recipient: faker.internet.email(),
                    subject: faker.random.alphaNumeric(),
                    text: faker.random.alphaNumeric(),
                }
            }

            await new EmailController(emailService).send(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"html\" is required");
        });
    });

    describe("sendBatch", function () {
        let send, status, res, emailService;
        beforeEach(() => {
            send = sinon.stub();
            status = sinon.stub();
            res = { send, status };
            status.returns(res);
            emailService = new EmailService();
        });

        it("should send email notification if all information is provided", async function () {
            const req = {
                body: [
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                ]
            }

            const stubInfo = [{}]
            const stubSend = sinon.stub(emailService, "sendBatch").returns(stubInfo);
            await new EmailController(emailService).sendBatch(req, res);
            expect(stubSend.calledOnce).to.be.true;
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(200);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.deep.equal({
                msg: "200 Batch send email success.",
                me: "open-notifier",
                data: stubInfo
            });
        });

        it("should not send email notification if recipient is not provided", async function () {
            const req = {
                body: [
                    {
                        // recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                ]
            }

            await new EmailController(emailService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"[0].recipient\" is required");
        });

        it("should not send email notification if subject is not provided", async function () {
            const req = {
                body: [
                    {
                        recipient: faker.internet.email(),
                        // subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                ]
            }

            await new EmailController(emailService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"[0].subject\" is required");
        });

        it("should not send email notification if text is not provided", async function () {
            const req = {
                body: [
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        // text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                ]
            }

            await new EmailController(emailService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"[0].text\" is required");
        });

        it("should not send email notification if html is not provided", async function () {
            const req = {
                body: [
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                    {
                        recipient: faker.internet.email(),
                        subject: faker.random.alphaNumeric(),
                        text: faker.random.alphaNumeric(),
                        // html: "<b>" + faker.random.alphaNumeric() + "</b>"
                    },
                ]
            }

            await new EmailController(emailService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"[1].html\" is required");
        });

        it("should not send email notification if request body is empty", async function () {
            const req = {
                body: []
            }

            await new EmailController(emailService).sendBatch(req, res);
            expect(status.calledOnce).to.be.true;
            expect(status.args[0][0]).to.equal(422);
            expect(send.calledOnce).to.be.true;
            expect(send.args[0][0]).to.equal("\"value\" does not contain at least one required match");
        });
    });

});
