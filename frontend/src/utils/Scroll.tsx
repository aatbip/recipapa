import React from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo({
      top: 100,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return null;
};


