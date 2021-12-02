const fuzzy = require('fuzzy');

const typeToListItem = ({types, disableEmoji}, type) => {
  const {description, emoji, value} = types[type];
  const prefix = emoji && !disableEmoji ? emoji + '  ' : '';

  return {
    name: prefix + (value + ':').padEnd(12, ' ') + description,
    value: type
  };
};

/**
 * Searches for the type that includes the given substring.
 *
 * @param {string} substring Substring to search with.
 * @param {{list: string[], types: {[key: string]: Object}}} config The whole config.
 */
const findType = function (substring, config) {
  /** @type string[] */
  const types = config.list;

  return Promise.resolve(fuzzy.filter(substring || '', types, {
    extract (input) {
      const keywords = config.types[input].keywords || '';

      return config.types[input].description + config.types[input].value + input + keywords;
    }
  }).map(({original: type}) => typeToListItem(config, type)));
};

exports.createQuestion = (state) => {
  const {config} = state;
  const question = {
    message: 'Select the type of change that you\'re committing:',
    name: 'type',
    source: (_answers, input) => findType(input, config),
    type: 'autocomplete'
  };

  return question;
};
