export const locale = {
  lang: 'en',
  data: {
    // Global app/configuration translations.
    app: {
      title: 'NHS Innovation Service',

      date_formats: {
        full_date_time: 'EEEE, MMMM d, y \'at\' h:mm:ss a',
        long_date_time: 'd MMMM y \'at\' h:mm a',
        long_date: 'd MMMM y',
        short_date: 'd mm y',
        medium_time: 'h:mm:ss a',
        short: 'M/d/yy, h:mm a',
        short_seconds: 'M/d/yy, h:mm:ss a'
      }

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

      shared_pages: {
        page_error: {
          title: 'It appears that something went wrong!',
          message: 'The operation you are trying to do is no longer available.',
          action: 'Go back to home'
        },
        page_not_found: {
          title: 'It appears that something went wrong!',
          message: 'Give us time while we investigate what happened that took you to here.',
          action: 'Go back to home'
        }
      }

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
          equal_to: 'Value does not match',
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
