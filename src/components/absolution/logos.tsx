interface LogosProps {
  size?: number;
}

export const RandomLogo = ({ size = 50 }: LogosProps) => {
  const logos = [LogoKiriel, LogoKirial];
  const LogoComponent = logos[Math.floor(Math.random() * logos.length)];
  return <LogoComponent size={size} />;
};

export const LogoKiriel = ({ size = 50 }: LogosProps) => {
  return (
    <img
      src="/logos/Logo_Kiriel.png"
      alt={"Kiriel Logo"}
      width={size}
      height={size}
      className="object-contain"
    />
  );
};

export const LogoKirial = ({ size = 50 }: LogosProps) => {
  return (
    <img
      src="/logos/Logo_Kirial.png"
      alt={"Kirial Logo"}
      width={size}
      height={size}
      className="object-contain"
    />
  );
};
