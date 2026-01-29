"use client";

import Image from "next/image";
import { Input } from "../ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";


interface Props {
    route: string;
    imgSrc: string;
    placeholder: string;
    otherClasses?: string;
}

const LocalSearch = ( {route, imgSrc, placeholder, otherClasses}: Props) => {

    const router = useRouter();
    const searchParams = useSearchParams(); // used to read the current URL's query string parameters.
    const query = searchParams.get("query") || "";
    const pathname = usePathname()

    const [searchQuery, setSearchQuery] = useState(query)

    const previousSearchRef = useRef(searchQuery);

    useEffect( () => {

        if (previousSearchRef.current === searchQuery) return;

        previousSearchRef.current = searchQuery;

        const delayDebounceFn = setTimeout(() => {  // using debouncing, limit how often a function is executed

            if(searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),  // query=[value]
                    key: "query",
                    value: searchQuery,
                })

                router.push(newUrl, {scroll: false});

            } else {
                if(pathname === route) {
                    // removing keys from the query cuz our input is completely empty
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["query"]
                    })
                    router.push(newUrl, {scroll: false});
                }
            }
                
        }, 1000) // miliseconds
        
        return () => clearTimeout(delayDebounceFn) // whenever using "timeout" in a useEffect, put this at the end and return callback function clearTimeout

    }, [searchQuery, searchParams, router, route, pathname] ) // whenever any of these functionalities change, we want to be able to recall the use effect

  return (
    <div className={`background-light800_darkgradient flex min-h-14 grow items-center gap-4 rounded-[10px] px-4 ${otherClasses} `} >
        <Image 
            src={imgSrc}
            alt="Search"
            width={24}
            height={24}
            className="cursor-pointer"
        />
        <Input type="text" 
                placeholder={placeholder}
                value={searchQuery} 
                onChange={(event) => {setSearchQuery(event.target.value)}} 
                className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
                />
    </div>
  )
}

export default LocalSearch
