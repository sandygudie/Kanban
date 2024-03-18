import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntDesign} from 'antd';
import App from "./App";
import "styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <AntDesign>
      <Provider store={store}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <App />
        </CookiesProvider>
      </Provider>
      </AntDesign>
    </BrowserRouter>
  </React.StrictMode>
);
