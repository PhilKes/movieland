import colors from 'vuetify/es5/util/colors'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - movieland-frontend',
    title: 'movieland-frontend',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''}
    ],
    link: [
      {rel: 'icon', type: 'posterUrl/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/style.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/repos.js',
    '~/plugins/eventBus.js',
    '~/plugins/filters.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/proxy',
    ['vuetify-dialog/nuxt', {property: '$dialog'}]
  ],

  proxy: {
    '/api': {
      target: 'http://localhost:8080/api',
      pathRewrite: {
        '^/api': '/'
      }
    }
  },

  axios: {baseURL: 'http://localhost:8080/api'},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    options: {
      customProperties: true,
    },
    theme: {
      dark: false,
      icons: {
        iconfont: 'fa',
      },
      themes: {
        light: {
          primary: '#991b1b',
          accent: colors.grey.darken3,
          secondary: '#150f82',
          info: '#76b6fd',
          warning: '#fd921f',
          error: '#bb1919',
          success: colors.green.darken1,
          background: '#ffe9e9'
        }
      }
    }
  },

  vuetifyDialog: {
    property: '$dialog',
    confirm: {
      actions: {},
      icon: false, // to disable icon just put false
      width: 1200
    },
    warning: {
      width: 1200
    },
    error: {
      width: 1200

    },
    prompt: {
      width: 1200
    },
    width:1200
    // ...
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  auth: {
    redirect: false,
    strategies: {
      local: {
        endpoints: {
          login: {url: '/auth/signin', method: 'post', propertyName: 'accessToken'},
          logout: {url: '/auth/signout', method: 'post'},
          user: {url: '/users/me', method: 'get', propertyName: ''},
        },
        tokenType: 'Bearer',
        tokenRequired: true,
        globalToken: true
      }
    }
  }
}
