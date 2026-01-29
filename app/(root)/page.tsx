import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter"
import QuestionCard from "@/components/cards/QuestionCard";


interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>
}

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I want to learn React, help",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "JavaScript" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      imgUrl: "https://static.wikia.nocookie.net/doomspire-defense/images/3/33/John_Doe.png/revision/latest?cb=20241031204507",
    },
    upvotes: 15,
    answers: 88,
    views: 123378,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn Next?",
    description: "I want to learn Next, help",
    tags: [
      { _id: "1", name: "Next" },
      { _id: "2", name: "Fullstack" },
    ],
    author: {
      _id: "2",
      name: "John Wayne",
      imgUrl: "https://cdn.britannica.com/82/136182-050-6BB308B7/John-Wayne.jpg?w=400&h=300&c=crop",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  }
]

const Home = async ( {searchParams}: SearchParams ) => {
  const {query = "", filter = ""} =  await searchParams;  // by setting a default value as empty string, we will see all the questions instead of nothing

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter
      ? question.tags[0].name?.toLowerCase() === filter.
      toLowerCase()
      : true
    return matchesQuery && matchesFilter;
  })


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
        <HomeFilter />

        <div className="mt-10 flex w-full flex-col gap-6">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))}
        </div>
    </>
  );
}

export default Home;