import { injectGlobal } from 'styled-components'
import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`  
    @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
p {
  font-family: 'Open Sans', sans-serif;
}

h3 {
  font-family: 'Open Sans', sans-serif;
  font-weight:600;
}

h2 {
  font-family: 'Open Sans', sans-serif;
  font-weight:600;
}

h1 {
  font-family: 'Open Sans', sans-serif;
  font-weight:600;
}

a {
  font-family: 'Open Sans', sans-serif;
}
i {
  font-family: 'Open Sans', sans-serif;
  font-style: italic;
}
`;

