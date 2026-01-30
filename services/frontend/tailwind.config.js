/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Matrix green terminal theme
                matrix: {
                    bg: '#0d0208',        // Almost black background
                    darker: '#000000',    // Pure black
                    text: '#00ff41',      // Matrix green
                    dim: '#008f11',       // Dimmed green
                    bright: '#39ff14',    // Bright neon green
                    border: '#00ff41',    // Green border
                    glow: 'rgba(0, 255, 65, 0.5)',
                },
                terminal: {
                    prompt: '#00ff41',
                    input: '#00cc33',
                    output: '#00ff41',
                    error: '#ff0040',
                    warning: '#ffaa00',
                    success: '#00ff41',
                },
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                blink: 'blink 1s step-end infinite',
                flicker: 'flicker 0.15s infinite',
                scanline: 'scanline 8s linear infinite',
                'matrix-rain': 'matrix-rain 20s linear infinite',
                glow: 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                blink: {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0' },
                },
                flicker: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                'matrix-rain': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                glow: {
                    '0%, 100%': { textShadow: '0 0 10px rgba(0, 255, 65, 0.8), 0 0 20px rgba(0, 255, 65, 0.5)' },
                    '50%': { textShadow: '0 0 20px rgba(0, 255, 65, 1), 0 0 30px rgba(0, 255, 65, 0.8)' },
                },
            },
            boxShadow: {
                'matrix': '0 0 20px rgba(0, 255, 65, 0.3)',
                'matrix-lg': '0 0 30px rgba(0, 255, 65, 0.5)',
            },
        },
    },
    plugins: [],
}
