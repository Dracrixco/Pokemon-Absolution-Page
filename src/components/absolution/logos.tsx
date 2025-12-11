interface LogosProps {
  size?: number;
}

export const RandomLogo = ({ size = 50 }: LogosProps) => {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;
  const LogoComponent = isNight ? LogoKiriel : LogoKirial;
  return <LogoComponent size={size} />;
};

export const LogoKiriel = ({ size = 50 }: LogosProps) => {
  return (
    <img
      src="/GameLogo/Logo_Kiriel.png"
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
      src="/GameLogo/Logo_Kirial.png"
      alt={"Kirial Logo"}
      width={size}
      height={size}
      className="object-contain"
    />
  );
};
