const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const americanOnlyWords = Object.keys(americanOnly);
const britishFromAmericanOnly = Object.values(americanOnly);
const britishOnlyWords = Object.keys(britishOnly);
const americanFromBritishOnly = Object.values(britishOnly);
const americanSpelling = Object.keys(americanToBritishSpelling);
const britishSpelling = Object.values(americanToBritishSpelling);
const americanTitles = Object.keys(americanToBritishTitles);
const britishTitles = Object.values(americanToBritishTitles);

const translateWord = (text, wordsFrom, wordsTo) => {
    wordsFrom.forEach((word, i) => {
        let regex = new RegExp(`(?<=^|[.'"\\s])${word}(?=[.'"\\s]|$)`, 'gi');
        let replacingWord = wordsTo[i];
        text = text.replaceAll(regex, `<span class="highlight">${replacingWord}</span>`);
    });
    
    return text;
};

const translateTitle = (text, titlesFrom, titlesTo) => {
    titlesFrom.forEach((title, i) => {
        let regex = new RegExp(`(?<=^|[.'"\\s])${title}(?=[.'"\\s]|$)`, 'gi');
        // NOTE: Needed to capitalise title in order to pass one of the freeCodeCamp tests.
        let replacingTitle = titlesTo[i].charAt(0).toUpperCase() + titlesTo[i].slice(1);
        text = text.replaceAll(regex, `<span class="highlight">${replacingTitle}</span>`);
    });
    
    return text;
};

const translateTime = (text, dividerFrom, dividerTo) => {
    let regex = new RegExp(`(?<=^|[.'"\\s])(\\d{1,2})${dividerFrom}(\\d{2})(?=[.'"\\s]|$)`, 'g');
    text = text.replaceAll(regex, `<span class="highlight">$1${dividerTo}$2</span>`);

    return text;
}

class Translator {
    

    translateToAmerican(text) {
        text = translateWord(text, britishOnlyWords, americanFromBritishOnly);
        text = translateWord(text, britishSpelling, americanSpelling);
        text = translateTitle(text, britishTitles, americanTitles);
        text = translateTime(text, '.', ':');

        return text;
    }
    
    translateToBritish(text) {
        text = translateWord(text, americanOnlyWords, britishFromAmericanOnly);
        text = translateWord(text, americanSpelling, britishSpelling);
        text = translateTitle(text, americanTitles, britishTitles);
        text = translateTime(text, ':', '.');

        return text;
    }
}

module.exports = Translator;