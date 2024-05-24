const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    test('Translation with text and locale fields: POST request to /api/translate', function(done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'american-to-british' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'text', 'Body should contain text if text was translated');
                assert.property(res.body, 'translation', 'Body should contain translation if text was translated');
                assert.notProperty(res.body, 'error', 'Body should not contain error if there were no issues when translating');
                assert.equal(res.body.text, 'Mangoes are my favorite fruit.');
                assert.equal(res.body.translation, `Mangoes are my <span class="highlight">favourite</span> fruit.`);
            });

        chai.request(server)
            .post('/api/translate')
            .send({ text: 'We watched the footie match for a while.', locale: 'british-to-american' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'text', 'Body should contain text if text was translated');
                assert.property(res.body, 'translation', 'Body should contain translation if text was translated');
                assert.notProperty(res.body, 'error', 'Body should not contain error if there were no issues when translating');
                assert.equal(res.body.text, 'We watched the footie match for a while.');
                assert.equal(res.body.translation, `We watched the <span class="highlight">soccer</span> match for a while.`);
            });
        
        done();
    });

    test('Translation with text and invalid locale field: POST request to /api/translate', function(done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: 'Mangoes are my favourite fruit.', locale: 'american-to-french' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.notProperty(res.body, 'text', 'Body should not contain text if there was an issue during translation');
                assert.notProperty(res.body, 'translation', 'Body should not contain translation if there was an issue during translation');
                assert.property(res.body, 'error', 'Body should contain error if there was any issue when translating');
                assert.equal(res.body.error, 'Invalid value for locale field');
            });
        
        done();
    });

    test('Translation with missing text field: POST request to /api/translate', function(done) {
        chai.request(server)
            .post('/api/translate')
            .send({ locale: 'american-to-british' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.notProperty(res.body, 'text', 'Body should not contain text if there was an issue during translation');
                assert.notProperty(res.body, 'translation', 'Body should not contain translation if there was an issue during translation');
                assert.property(res.body, 'error', 'Body should contain error if there was any issue when translating');
                assert.equal(res.body.error, 'Required field(s) missing');
            });
        
        done();
    });

    test('Translation with missing locale field: POST request to /api/translate', function(done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: 'Mangoes are my favourite fruit.' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.notProperty(res.body, 'text', 'Body should not contain text if there was an issue during translation');
                assert.notProperty(res.body, 'translation', 'Body should not contain translation if there was an issue during translation');
                assert.property(res.body, 'error', 'Body should contain error if there was any issue when translating');
                assert.equal(res.body.error, 'Required field(s) missing');
            });
        
        done();
    });

    test('Translation with empty text: POST request to /api/translate', function(done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: '', locale: 'american-to-british' })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.notProperty(res.body, 'text', 'Body should not contain text if there was an issue during translation');
                assert.notProperty(res.body, 'translation', 'Body should not contain translation if there was an issue during translation');
                assert.property(res.body, 'error', 'Body should contain error if there was any issue when translating');
                assert.equal(res.body.error, 'No text to translate');
            });
        
        done();
    });

    test('Translation with text that needs no translation: POST request to /api/translate', function(done) {
        chai.request(server)
            .post('/api/translate')
            .send({ text: 'Mangoes are my favourite fruit.', locale: 'american-to-british'})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'text', 'Body should contain text if text was translated');
                assert.property(res.body, 'translation', 'Body should contain translation if text was translated');
                assert.notProperty(res.body, 'error', 'Body should not contain error if there were no issues when translating');
                assert.equal(res.body.text, 'Mangoes are my favourite fruit.');
                assert.equal(res.body.translation, `Everything looks good to me!`);
            });

        chai.request(server)
            .post('/api/translate')
            .send({ text: 'We watched the soccer match for a while.', locale: 'british-to-american'})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'text', 'Body should contain text if text was translated');
                assert.property(res.body, 'translation', 'Body should contain translation if text was translated');
                assert.notProperty(res.body, 'error', 'Body should not contain error if there were no issues when translating');
                assert.equal(res.body.text, 'We watched the soccer match for a while.');
                assert.equal(res.body.translation, `Everything looks good to me!`);
            });
        
        done();
    });
});
