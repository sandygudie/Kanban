import React from "react";
import ReactDOM from "react-dom/client";
import { App as AppDesign } from "antd";
import App from "./App";
import "styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "none",
            colorText: "unset",
          },
          components: {
            Modal: {
              colorText: "unset",
            },
          },
        }}
      >
        <Provider store={store}>
          <AppDesign>
            <App />
          </AppDesign>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
