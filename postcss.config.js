const tailwind = require('tailwindcss');

module.exports = {
    plugins: [
        tailwind('./tailwind.config.js'),
        require('autoprefixer'),
        require('cssnano')({
        preset: 'default',
        }),
    ],
    };
    