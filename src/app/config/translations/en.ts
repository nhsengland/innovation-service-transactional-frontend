export const locale = {
  lang: 'en',
  data: {
    // Global app/configuration translations.
    app: {
      title: 'NHS Innovation Service',

      date_formats: {
        full: 'EEEE, MMMM d, y \'at\' h:mm:ss a',
        medium_time: 'h:mm:ss a',
        short: 'M/d/yy, h:mm a',
        short_seconds: 'M/d/yy, h:mm:ss a'
      },

    },

    // Single words, ALWAYS lowercased.
    dictionary: {
      yes: 'yes',
    },

    // Forms (fields) related translations.
    forms: {
      address: { label: 'Address' }
    },

    // Specific translations to specific features (modules).
    features: {

    },

    labels: {

    },

    messages: {
      errors: {},
      informations: {},
      notifications: {},
      warnings: {}
    },

    // Shared translations to serve external / catalog modules.
    shared: {
      forms_module: {
        validations: {
          invalid_email: 'Invalid email',
          invalid_format: 'Invalid format.',
          invalid_hexadecimal_format: 'Invalid hexadecimal format',
          invalid_json_format: 'Invalid JSON format',
          invalid_url_format: 'Invalid URL',
          invalid_value: 'Invalid value',
          min: 'Value below the minimum allowed',
          min_hexadecimal: 'Value below the minumum allowed',
          max: 'Value above the maximum allowed',
          max_hexadecimal: 'Value above the maximum allowed',
          min_length: 'Min length',
          max_length: 'Max length',
          password_mismatch: 'Passwords don\'t appear to match',
          password_regex: 'The password must contain at least minimum 8 characters: one uppercase, one lowercase, one number and one special character.',
          required: 'Required'
        }
      }
    }
  }
};
