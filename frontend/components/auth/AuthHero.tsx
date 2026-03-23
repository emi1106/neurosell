import Image from 'next/image';

interface AuthHeroProps {
  title: string;
  description: string;
  imageSrc: string;
}

export default function AuthHero({ title, description, imageSrc }: AuthHeroProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-100">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute bottom-10 left-10 text-white z-10">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg opacity-90">{description}</p>
      </div>
    </div>
  );
}
