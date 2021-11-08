module.exports = {
    purge: [
        './views/**/*.hbs',
        './src/**/*.js',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            screens: {
                'max-sm': {'max': '630px'},
                'max-md': {'max': '767px'},
                'max-lg': {'max': '1023px'},
                'max-xl': {'max': '1279px'},
                'max-2xl': {'max': '1535px'},
            },
        },
    },
    variants: {
        extend: {
            overflow: ['hover'],
            height: ['hover'],
            width: ['hover'],
            transform: ['hover', 'active'],
        }
    },
    plugins: [
    ],
}