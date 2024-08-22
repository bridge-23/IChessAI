import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "ic-use-internet-identity"; // Ensure the correct path
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </React.StrictMode>
);