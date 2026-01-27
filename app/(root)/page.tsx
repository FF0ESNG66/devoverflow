import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";


interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>
}

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I want to learn React, help",
  },
  {
    _id: "2",
    title: "How to learn Next?",
    description: "I want to learn Next, help",
  }
]

const Home = async ( {searchParams}: SearchParams ) => {
  const {query = ""} =  await searchParams;  // by setting a default value as empty string, we will see all the questions instead of nothing

  const filteredQuestions = questions.filter((question) => 
    question.title.toLowerCase().includes(query?.toLowerCase())
  )


  return (
    <>
        <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="h1-bold text-dark100_light900">All Questions</h1>

          <Button className="primary-gradient min-h-11.5 px-4 py-3 text-light-900!" asChild>
            <Link href={ROUTES.ASK_QUESTION}>
              Ask a Question
            </Link>
          </Button>
        </section>

        <section className="mt-11">
          <LocalSearch 
            route="/"
            imgSrc="/icons/search.svg"
            placeholder="Search questions..."
            otherClasses="flex-1"
          />
        </section>
        {/* HomeFilter Component */}

        <div className="mt-10 flex w-full flex-col gap-6">
          {filteredQuestions.map((question) => (
            <h1 key={question._id}>{question.title}</h1>
          ))}
        </div>
    </>
  );
}

export default Home;