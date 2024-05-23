'use strict';

const Translator = require('../components/translator.js');

const AMERICAN_TO_BRITISH_LOCALE = 'american-to-british';
const BRITISH_TO_AMERICAN_LOCALE = 'british-to-american';

const validLocales = [ AMERICAN_TO_BRITISH_LOCALE, BRITISH_TO_AMERICAN_LOCALE ];

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      console.log(req.body);

      if(req.body.locale === undefined || req.body.text === undefined) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      if(!req.body.text || req.body.text.trim().length === 0) {
        res.json({ error: 'No text to translate' });
        return;
      }

      if(!req.body.locale || !validLocales.includes(req.body.locale)) {
        res.json({ error: 'Invalid value for locale field' });
        return;
      }

      let translatedText = req.body.locale === AMERICAN_TO_BRITISH_LOCALE ?
        translator.translateToBritish(req.body.text) :
        translator.translateToAmerican(req.body.text);

      if(translatedText === req.body.text) {
        translatedText = 'Everything looks good to me!';
      }

      res.json({text: req.body.text, translation: translatedText});
    });
};
