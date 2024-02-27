import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider,extendTheme } from "@chakra-ui/react";
import App from "./App";
import "styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";


const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        fontFamily: null,
        lineHeight: null,
        bg:null,
        color:null
      }
    })
  }
});


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
