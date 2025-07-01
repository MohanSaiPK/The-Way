import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserItemsProvider } from "./context/UserItemsContext.jsx"; // ✅ import your context provider
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserItemsProvider>
        <App />
      </UserItemsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
