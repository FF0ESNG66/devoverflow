import Image from "next/image";
import Link from "next/link";

interface Props {
    imgUrl: string;
    alt: string;
    value: string | number;
    title: string
    href?: string;
    textStyles?: string; 
    imgStyle?: string;
    isAuthor?: boolean;
}

const Metric = ( {
    imgUrl, alt, value, title, href, textStyles, imgStyle, isAuthor
}: Props ) => {
    const metricContent = (
        <>
            <Image 
                src={imgUrl}
                alt={alt}
                width={0}
                height={0}
                className={`rounded-full object-cover w-4 h-4 ${imgStyle}`}
            />
            <p className={`${textStyles} flex items-center gap-1`}>
                {value}
                <span className={`small-regular line-clamp-1 ${isAuthor ? 'max-sm:hidden' : ''}`}> 
                    {/* This check if the incoming Metric contains Author, if so, we just hide it*/}
                    {/* The "title" of other metric will be display but not the author one */}
                    {title}
                </span>
            </p>
        </>
    )

  return href ? (
    <Link 
        href={href}
        className="flex flex-center gap-1"
    >
        {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">
        {metricContent}
    </div>
  )
}

export default Metric
