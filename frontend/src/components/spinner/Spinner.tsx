import React from "react";
import { FidgetSpinner } from "react-loader-spinner";

interface Prop {
  isLoading: boolean;
  positionAbsolute: boolean;
}

const Spinner: React.FC<Prop> = ({ isLoading, positionAbsolute }) => {
  return isLoading ? (
    <FidgetSpinner
      visible={true}
      height="150"
      width="150"
      ariaLabel="dna-loading"
      wrapperStyle={
        positionAbsolute
          ? {
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }
          : {
              margin: "0 auto",
            }
      }
      wrapperClass="dna-wrapper"
      ballColors={["#F54748", "#2E2E2E", "#E4BE9E"]}
      backgroundColor="#F4442E"
    />
  ) : null;
};

export default Spinner;
