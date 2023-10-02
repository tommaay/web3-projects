import Image from "next/image";
import { Card, CardHeader } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";

type Props = {
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  style?: Record<string, string>;
  isLoading: boolean;
};

function HeroCard({ title, description, imageUrl, altText, style = {}, isLoading }: Props) {
  return (
    <Card className="flex flex-col sm:flex-row sm:min-h-[300px] rounded overflow-clip">
      <div className="relative w-full min-h-[200px] sm:w-2/5 flex justify-center items-center">
        {isLoading ? (
          <SpinnerRoundFilled color="#fff" />
        ) : (
          <Image
            src={imageUrl}
            alt={altText}
            fill={true}
            className="object-cover object-center"
            style={style}
          />
        )}
      </div>
      <CardHeader>
        <div className="flex-1 min-h-[160px]">
          <h1 className="pb-2 text-3xl font-medium md:text-4xl bg-gradient-to-br text-gradient-blue">
            {title}
          </h1>
          <p className="pt-2 font-medium text:lg md:text-xl">{description}</p>
        </div>
      </CardHeader>
    </Card>
  );
}

export default HeroCard;
