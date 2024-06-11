/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'imageArmario': "url('../src/app/imagens/nacel-x.png')",
        'hur-image': "url('../src/app/imagens/hur-image.png')",
        'hur-2-image': "url('../src/app/imagens/hur-2-image.png')",
        
        'logo': "url('../src/app/imagens/logo.png')",
        'home_nav': "url('../src/app/imagens/bg.jpeg')",
        'home_single1': "url('../src/app/imagens/single1.jpg')",
        'home_single2': "url('../src/app/imagens/single2.jpg')",
        'home_single3': "url('../src/app/imagens/single3.jpg')",
        'home_single4': "url('../src/app/imagens/single4.jpg')",
        'home_double': "url('../src/app/imagens/double.jpg')",
        'model_eco80': "url('../src/app/imagens/eco80.jpg')",
        'login': "url('../src/app/imagens/login_bg.jpg')",

        'closet-control': "url('../src/app/imagens/Eco-80/closet-cabine-control.png')",
        'closet-estator': "url('../src/app/imagens/Eco-80/closet-estator.png')",
        'closet-multiply': "url('../src/app/imagens/Eco-80/closet-multiply.png')",
        'closet-conversor-power': "url('../src/app/imagens/closet-conversor-power.png')",
        'closet-rotor': "url('../src/app/imagens/Eco-80/closet-rotor.png')",
      },

      colors: {
        "color-primary": "#000000",
      },
    },
  },
  plugins: [],
}

