let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require("../server")
// Assertion style
chai.should();
chai.use(chaiHttp)
describe('Supplier API', () => {
    // TEST THE GET ROUTE of VIEW ALL SUPPLIERS
    describe('GET /api/view/allsuppliers', () => {
        it("it should get all suppliers", (done) => {
            chai.request(server)
                .get("/api/view/allsuppliers")
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('data')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    done()
                })
        })
    })
    //   TEST THE GET ROUTE OF VIEW SINGLE SUPPLIER BY ID
    describe('GET /api/view/singlesupplier/:supplierCode', () => {
        it("it should get a supplier by supplier code", (done) => {
            const supplierCode = 'ALKEM2'
            chai.request(server)
                .get("/api/view/singlesupplier/" + supplierCode)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('data')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    response.body.data.should.have.property('id')
                    response.body.data.should.have.property('supplierName')
                    response.body.data.should.have.property('supplierCode').eq(supplierCode)
                    done()
                })
        })
    })
    // TEST THE POST ROUTE OF ADD SUPPLIER
    describe('POST /api/add/supplier', () => {
        it("it should post a new supplier", (done) => {
            const supplier = {
                "_partition": "101",
                "userId": "6048708c946251d02c88f329",
                "addressLine1": "PUNE",
                "addressLine2": "BANNER",
                "city": "PUNE",
                "country": "INDIA",
                "isoCountry": "IND",
                "district": "PUNE",
                "postalCode": "784512",
                "directions": "WEST",
                "landmark": "NEW GALAXY MALL",
                "region": "EAST",
                "town": "PUNE",
                "zip": "PUNE",
                "email": "email@gmail.com",
                "phone": "9999999999",
                "supplierCode": "ALKEM2",
                "deliveryFee": 100,
                "lastProductSeq": "45A",
                "supplierName": "ALKEM2",
                "catalogTags": [
                    "string"
                ],
                "usdPrice": 0
            }
            chai.request(server)
                .post("/api/add/supplier")
                .send(supplier)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('supplierId')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    done()
                })
        })
    })
})
// TEST THE POST ROUTE OF UPLOAD MEDICATION FILE 
describe('Medication API', () => {
    describe('POST /api/upload/medications', () => {
        it("it should upload new medications by upload file", (done) => {
            const data = {
                userId: '1234',
                supplierCode: 'ALKEM',
                supplierName: 'ALKEM PHARMA',
                isoCountryCode: 'IND'
            }
            chai.request(server)
                .post("/api/upload/medications")
                .set('content-type', 'multipart/form-data')
                .field('userId', '1234')
                .field('supplierCode', 'ALKEM')
                .field('supplierName', 'ALKEM PHARMA')
                .field('isoCountryCode', 'IND')
                .attach('file', 'test/File/cataloguefile.csv')
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('status').eq(true)
                    response.body.should.have.property('invalidRowsCount')
                    response.body.should.have.property('validRowsCount')
                    response.body.should.have.property('totalRowsCount')
                    response.body.should.have.property('duplicateEntryCount')
                    done()
                })
        })
    })
})
/////////////////////////////// 
describe('Points Audit API', () => {
    describe('GET /api/user/transactiondetails/:residentId', () => {
        it("it get transaction details by id", (done) => {
            const residentId = '60a75b1896d47c785a6f818c'
            chai.request(server)
                .get("/api/user/transactiondetails/" + residentId)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('data')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    done()
                })
        })
    })
    describe('post /api/redeemdetails', () => {
        it("it post redeemdetails", (done) => {
            let data = {
                residentId: '60a75b1896d47c785a6f818c',
                redeemedPoints: 10
            }
            chai.request(server)
                .post("/api/redeemdetails")
                .send(data)
                .end((err, response) => {
                    console.log('response', response.body)
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    done()
                })
        })
    })
    describe('GET /api/user/points/:residentId/', () => {
        it("User points details", (done) => {
            const residentId = '603626e901815265caaa30a4'
            chai.request(server)
                .get("/api/user/points/" + residentId)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    done()
                })
        })
    })
    describe('POST /api/pointconversion', () => {
        it("Points Convertion", (done) => {
            let body = {
                residentId: "60a75b1896d47c785a6f818c",
                countryCode: "IND",
                redeemPoints: 1
            }
            chai.request(server)
                .post("/api/pointconversion")
                .send(body)
                .end((err, response) => {
                    console.log('response', response.body)
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    done()
                })
        })
    })
})
describe('Order API', () => {
    describe('POST /api/processorder', () => {
        it("Process order", (done) => {
            let body = {
                orderId: '60a87f040c88736dca217d59',
                redeemedPoints: 1,
                countryCode: "IND",
                pointSource: 'order'
            }
            chai.request(server)
                .post("/api/processorder")
                .send(body)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.should.have.property('status')
                    response.body.should.have.property('message')
                    response.body.should.have.property('status').eq(true)
                    done()
                })
        })
    })
})
        ///////////////
