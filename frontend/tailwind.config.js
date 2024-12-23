// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient': 'linear-gradient(180deg, #5277AD 10.79%, #360B60 100%)',
                'star-layer': "url('/src/assets/images/background-layer/star.png')",
                'gradient-card': 'linear-gradient(359.65deg, #6E5ABA 27.64%, #4A609A 99.69%)',
                'gradient-button': 'linear-gradient(270deg, #809EEB 0%, #A794F4 100%)',
                "gradient-game-lucky-box": "linear-gradient(180deg, #D3D9FF 0%, #6C5BB9 100%)"
            },
            fontFamily: {
                rubik: ['Rubik', 'sans-serif'],
            },
            maxWidth: {
                'phone-screen': '414px',
            },
        },
    },
    plugins: [],
}