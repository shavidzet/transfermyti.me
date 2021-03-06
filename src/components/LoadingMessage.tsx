import React from "react";

interface Props {
  size?: "small" | "large";
}

const LoadingMessage: React.FC<Props> = ({ size = "small", ...props }) => (
  <div
    css={theme => ({
      fontSize: size === "large" ? "2rem" : "1rem",
      fontWeight: theme.fontWeights.bold,
      margin: "1rem 0 3rem 0",
      textAlign: "center",
    })}
    {...props}
  />
);

export default LoadingMessage;
