import Color from "color";
import { keyframes } from "@emotion/core";
import React from "react";
import { styled, useTheme } from "./emotion";
import Flex from "./Flex";

const spinAnimation = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },

  "100%": {
    transform: "rotate(360deg)",
  },
});

const Base = styled.button(
  {
    borderRadius: "0.375rem",
    fontSize: "1.25rem",
    fontWeight: 400,
    padding: "0.5rem 0.75rem",
    textAlign: "center",
    transition: "0.3s all linear",
    verticalAlign: "middle",
  },
  ({ theme }) => ({
    boxShadow: theme.elevation.dp1,
  }),
);

const Loading = styled.div<{ bgColor: string; fgColor: string }>(
  {
    animation: `${spinAnimation} 1.4s infinite linear`,
    borderRadius: "50%",
    fontSize: "0.75rem",
    height: "1.5rem",
    position: "relative",
    transform: "translateZ(0)",
    width: "1.5rem",

    "&:before": {
      borderRadius: "100% 0 0 0",
      content: "''",
      height: "50%",
      width: "50%",
      position: "absolute",
      top: 0,
      left: 0,
    },

    "&:after": {
      borderRadius: "50%",
      content: "''",
      height: "75%",
      width: "75%",
      margin: "auto",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  },
  ({ bgColor, fgColor }) => ({
    background: `linear-gradient(to right, ${fgColor} 10%, ${bgColor} 40%)`,

    "&:before": {
      background: fgColor,
    },

    "&:after": {
      background: bgColor,
    },
  }),
);

type Variant = "default" | "eggplant" | "outline" | "primary" | "secondary";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  onClick: VoidFunction;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  loading = false,
  variant = "default",
  onClick,
  ...props
}) => {
  const { colors } = useTheme();
  const mainColorByVariant = {
    default: colors.midnight,
    eggplant: colors.eggplant,
    outline: colors.secondary,
    primary: colors.primary,
    secondary: colors.secondary,
  }[variant];

  const altColorByVariant = {
    default: colors.secondary,
    eggplant: colors.secondary,
    outline: colors.primary,
    primary: colors.secondary,
    secondary: colors.primary,
  }[variant];

  const mainColor = Color(mainColorByVariant);
  const altColor = Color(altColorByVariant);

  const isOutline = variant === "outline";
  // Don't change the background color on hover if these conditions are met:
  const isHoverInitial = isOutline || disabled || variant === "secondary";

  return (
    <Base
      aria-disabled={disabled}
      css={{
        background: mainColor.hex(),
        border: isOutline ? `3px solid ${altColor.hex()}` : "none",
        color: altColor.hex(),
        opacity: disabled ? 0.5 : 1,

        "&:hover": {
          background: isHoverInitial
            ? mainColor.hex()
            : mainColor.darken(0.2).hex(),
          textDecoration: disabled ? "none" : "underline",
        },

        "&:focus": {
          outlineColor:
            variant === "secondary" ? colors.secondary : colors.primary,
        },
      }}
      disabled={disabled}
      onClick={disabled || loading ? undefined : onClick}
      type="button"
      {...props}
    >
      {loading ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          data-testid="button-loading"
        >
          <Loading bgColor={mainColor.hex()} fgColor={altColor.hex()} />
        </Flex>
      ) : (
        children
      )}
    </Base>
  );
};

export default Button;
