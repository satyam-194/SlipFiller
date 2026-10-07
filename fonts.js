import { Font } from '@react-pdf/renderer'

// Shared font registration for all PDF slip templates
Font.register({
  family: 'NotoGujarati',
  fonts: [
    { src: '/fonts/NotoSansGujarati-Regular.ttf?v=3', fontWeight: 400 },
    { src: '/fonts/NotoSansGujarati-Bold.ttf?v=3', fontWeight: 700 },
  ],
})

// Dot-matrix printer font (Doto, static instance) for typed slip values
Font.register({
  family: 'DotMatrix',
  src: '/fonts/DotMatrix.ttf?v=3',
})

// Art-deco display font (Righteous) for the Jaynath masthead and numerals
Font.register({
  family: 'Deco',
  src: '/fonts/Deco.ttf?v=1',
})
