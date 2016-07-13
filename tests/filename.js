var f0133 = require('../lib');
var chai = require('chai');

var FILENAME_LEN = 47;

var EX_TAXID = '1234567890';
var EX_OFFICE = '2615';
var EX_FORM = 'F0103305'; // tretja hrupa pjat' prcentiv!

describe('File format function', function () {
    var options = {
        taxId: EX_TAXID,
        taxOffice: EX_OFFICE,
        form: EX_FORM,
        period: 3,
        year: 2016,
    };
    var filename = f0133.formatFileName(options);

    it('should always returns filename of fixed length', function () {
        chai.expect(filename.length).to.equal(FILENAME_LEN);
    });

    it('should always end with .xml', function () {
        chai.expect(filename.substr(43)).to.eql('.xml');
    });

    it('should set tax office id as first field', function () {
        chai.expect(filename.substr(0, 4)).to.eql('2615');
    });

    it('should set proper personal tax id as second field', function () {
        chai.expect(filename.substr(4, 10)).to.eql('1234567890');
    });

    it('should set form code as third field', function () {
        chai.expect(filename.substr(14, 8)).to.eql('F0103305');
    });

    it('should set 1 (tax declaration) as default state in fourth field', function () {
        chai.expect(filename.substr(22, 1)).to.eql('1');
    });

    it('should set other documents states if specified in options', function () {
        var filename1 = f0133.formatFileName(Object.assign(
            {}, options, {state: 2}
        ));
        chai.expect(filename1.substr(22, 1)).to.eql('2');
    });

    it('should set other documents states if specified as text 1/3', function () {
        var filename1 = f0133.formatFileName(Object.assign(
            {}, options, {state: 'tax'}
        ));
        chai.expect(filename1.substr(22, 1)).to.eql('1');
    });

    it('should set other documents states if specified as text 2/3', function () {
        var filename1 = f0133.formatFileName(Object.assign(
            {}, options, {state: 'new'}
        ));
        chai.expect(filename1.substr(22, 1)).to.eql('2');
    });

    it('should set other documents states if specified as text 3/3', function () {
        var filename1 = f0133.formatFileName(Object.assign(
            {}, options, {state: 'amend'}
        ));
        chai.expect(filename1.substr(22, 1)).to.eql('3');
    });

    it('should set 00 as amendment number by default', function () {
        chai.expect(filename.substr(23, 2)).to.eql('00');
    });

    it('should set 000000001 as sequence number by default', function () {
        chai.expect(filename.substr(25, 7)).to.eql('0000001');
    });
});
