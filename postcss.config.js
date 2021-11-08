module.exports = {
    plugins: [
        'postcss-preset-env',
        require('tailwindcss'),
        require('autoprefixer'),
        require('cssnano')({
            preset: 'default',
        }),
    ],
};