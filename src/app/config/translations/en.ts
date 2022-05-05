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
      informations: {
        fetching_information: 'Please wait while we fetch information from server.'
      },
      notifications: {},
      warnings: {}
    },

    // Shared translations to serve external / catalog modules.
    shared: {

      catalog: {
        innovation: {
          activity_log_groups: {
            INNOVATION_MANAGEMENT: {
              title: 'Innovation management',
              description: 'Innovator activities regarding ownership and sharing preferences'
            },
            INNOVATION_RECORD: {
              title: 'Innovation record',
              description: 'Activities regarding the innovation information update'
            },
            NEEDS_ASSESSMENT: {
              title: 'Needs assessment',
              description: 'Needs assessment activities'
            },
            SUPPORT: {
              title: 'Support',
              description: 'Organisations related activities'
            },
            COMMENTS: {
              title: 'Comments',
              description: ''
            },
            ACTIONS: {
              title: 'Actions',
              description: ''
            },
          },
          activity_log_items: {
            INNOVATION_CREATION: {
              title: 'Innovation creation',
              message: `{{ innovationName }} created`,
            },
            OWNERSHIP_TRANSFER: {
              title: 'Ownership transfer',
              message: `Ownership was transfered from {{ actionUserName }} to {{ interveningUserName }}`
            },
            SHARING_PREFERENCES_UPDATE: {
              title: 'Sharing preferences update',
              message: `Sharing preferences changed`
            },
            SECTION_DRAFT_UPDATE: {
              title: 'Section draft update',
              message: `"{{ sectionTitle }}" section saved as a draft`
            },
            SECTION_SUBMISSION: {
              title: 'Section submission',
              message: `"{{ sectionTitle }}" section submitted`
            },
            INNOVATION_SUBMISSION: {
              title: 'Innovation submission',
              message: `Submitted for needs assessment`,
            },
            NEEDS_ASSESSMENT_START: {
              title: 'Needs assessment start',
              message: `{{ actionUserName }} started needs assessment`
            },
            NEEDS_ASSESSMENT_COMPLETED: {
              title: 'Needs assessment completed',
              message: `{{ actionUserName }} completed needs assessment`
            },
            ORGANISATION_SUGGESTION: {
              title: 'Organisation suggestion',
              message: `{{ actionUserName }} suggested one or more organisations to support`
            },
            SUPPORT_STATUS_UPDATE: {
              title: 'Support status update',
              message: `{{ actionUserName }} changed the support status of {{ organisationUnit }}`
            },
            COMMENT_CREATION: {
              title: 'Comment creation',
              message: `{{ actionUserName }} left a comment`
            },
            ACTION_CREATION: {
              title: 'Action creation',
              message: `{{ actionUserName }} created an action for section "{{ sectionTitle }}"`
            },
            ACTION_STATUS_IN_REVIEW_UPDATE: {
              title: 'Action changed to in review',
              message: `{{ totalActions }} actions for "{{ sectionTitle }}" section were changed to "In review"`
            },
            ACTION_STATUS_DECLINED_UPDATE: {
              title: 'Action declined',
              message: `{{ actionUserName }} declined an action from {{ interveningUserName }}`
            },
            ACTION_STATUS_COMPLETED_UPDATE: {
              title: 'Action completed',
              message: `{{ actionUserName }} marked an action as complete`
            }
          }
        },
        user: {
          lock_user_validations: {
            lastAssessmentUserOnPlatform: {
              label: 'User is not the only needs assessor on the service'
            },
            lastAccessorUserOnOrganisation: {
              label: 'User is not the only qualifying accessor within their organisation',
              description: '{{ organisation.name }}'
            },
            lastAccessorUserOnOrganisationUnit: {
              label: 'User is not the only qualifying accessor within their unit',
              description: '{{ unit.name }}'
            },
            lastAccessorFromUnitProvidingSupport: {
              label: 'User is not the person in their unit who is supporting an innovator',
              description: {
               none: 'No innovation is being supported',
               singular: '{{ supports.innovations.length }} innovation being supported',
               plural: '{{ supports.innovations.length }} innovations being supported',
              }
            }
          },
          change_orggnisation_user_role_validations: {
            lastAccessorUserOnOrganisationUnit: {
              label: 'User cannot be the last Qualifying Accessor on the organisation unit'
            }
          },
          change_organisation_user_unit: {
            lastAccessorUserOnOrganisation: {
              label: 'User is not the only {{ role }} within their organisation',
              description: '{{ organisation.name }}'
            },
            lastAccessorUserOnOrganisationUnit: {
              label: 'User is not the only {{ role }} within their organisation unit',
              description: '{{ unit.name }}'
            },
            lastAccessorFromUnitProvidingSupport: {
              label: 'User is not the person in their organisation or unit who is supporting an innovator',
              description: {
               none: 'No innovation is being supported',
               singular: '{{ supports.innovations.length }} innovation being supported',
               plural: '{{ supports.innovations.length }} innovations being supported',
              }
            }
          }

        }
      },

      forms_module: {
        validations: {
          equal_to: 'Value does not match',
          invalid_email: 'Invalid email',
          invalid_format: 'Invalid format',
          invalid_hexadecimal_format: 'Invalid hexadecimal format',
          invalid_json_format: 'Invalid JSON format',
          invalid_url_format: 'Invalid URL',
          invalid_value: 'Invalid value',
          min: 'Value below the minimum allowed',
          min_hexadecimal: 'Value below the minumum allowed',
          max: 'Value above the maximum allowed',
          max_hexadecimal: 'Value above the maximum allowed',
          min_length: 'Text must have at least {{ maxLength }} characters',
          max_length: 'Text cannot exceed {{ maxLength }} characters',
          password_mismatch: 'Passwords don\'t appear to match',
          password_regex: 'The password must contain at least minimum 8 characters: one uppercase, one lowercase, one number and one special character',
          required: 'Required'
        }
      }

    }
  }
};
