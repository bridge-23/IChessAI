import React from "react";
import { useInternetIdentity } from "ic-use-internet-identity";

const LoginButton: React.FC = () => {
  const { isLoggingIn, login, clear, identity } = useInternetIdentity();

  // If the user is logged in, clear the identity. Otherwise, log in.
  function handleClick() {
    if (identity) {
      clear();
    } else {
      login();
    }
  }

  const buttonText = () => {
    if (identity) {
      const principal = identity.getPrincipal().toString();
      return principal.substring(0, 5) + "..." + principal.substring(principal.length - 3, principal.length);
    } else if (isLoggingIn) {
      return "Logging in...";
    }
    return "Login/Register";
  };

  return (
    <button
      onClick={handleClick}
      className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
    >
      {buttonText()}
    </button>
  );
};

export default LoginButton;