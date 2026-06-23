import type React from "react";

interface ZenIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export function ZenIcon({ src, ...props }: ZenIconProps): React.JSX.Element {
  const cleanPath = src.startsWith("/") ? src.slice(1) : src;
  const fullSrc = `${import.meta.env.BASE_URL}${cleanPath}`;

  return <img src={fullSrc} alt="" aria-hidden="true" {...props} />;
}
