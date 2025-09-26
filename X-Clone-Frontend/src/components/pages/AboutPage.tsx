import { useContext, useEffect } from "react";
import { HeaderContentContext } from "../../context/HeaderContentProvider.tsx";

function AboutPage() {
  const { setHeaderContent } = useContext(HeaderContentContext);

  useEffect(() => {
    setHeaderContent(<p>About</p>);
  }, []);

  return (
    <div className="flex xl:border-x border-twitterBorder w-full h-full gap-4 flex-col px-4 py-2 mb-4 scrollbar-blue overflow-y-auto">
      <div className="w-full gap-1 flex flex-col">
        <p className="font-bold text-white text-xl">Why X?</p>
        <p className="text-twitterText">
          I chose to build an X clone because it’s less image-focused than
          Instagram and offers a cleaner desktop experience. It also keeps
          things simpler than Facebook, which made the feature scope easier to
          manage.
        </p>
      </div>

      <div className="w-full gap-1 flex flex-col">
        <p className="font-bold text-white text-xl">About me</p>
        <p className="text-twitterText">
          I am a 21 year old International Studies student based in the
          Netherlands, currently teaching myself programming alongside my
          degree. I built this project as a way to improve my understanding on
          creating and deploying a functioning full stack project. I'm always
          open to feedback, collaboration, or new opportunities. You can contact
          me at{" "}
          <span className="text-twitterBlue font-bold underline">
            thejokerhut@gmail.com
          </span>
        </p>
      </div>

      <div className="w-full gap-2 flex flex-col">
        <p className="font-bold text-white text-xl">Key Features 🎯</p>
        <ul className="text-twitterText list-disc list-inside space-y-1">
          <li>Google OAuth login with secure JWT authentication</li>
          <li>
            Image and video upload with preview and cloud storage integration
          </li>
          <li>
            “For You” feed powered by a custom feed-ranking algorithm inspired
            by Facebook’s EdgeRank
          </li>
          <li>
            Client-side caching using TanStack Query for optimized performance
            and reduced load times
          </li>
          <li>Infinite scrolling across feeds with seamless pagination</li>
          <li>
            Live user search with predictive autosuggest and profile linking
          </li>
          <li>Full notifications system with unseen indicators</li>
          <li>Bookmark and Retweet functionality</li>
          <li>Light/dark mode and user theme preferences</li>
        </ul>
      </div>

      <div className="w-full gap-1 flex flex-col">
        <p className="font-bold text-white text-xl">What tools?</p>
        <ul className="text-twitterText list-disc list-inside space-y-1">
          <li>
            <strong>Frontend:</strong> React, TypeScript, TanStack Query,
            Tailwind CSS
          </li>
          <li>
            <strong>Backend:</strong> Java Spring Boot
          </li>
          <li>
            <strong>Database:</strong> MySQL
          </li>
          <li>
            <strong>Hosting:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Netlify (Frontend)</li>
              <li>Google Cloud VM + Docker (Backend)</li>
              <li>Google Cloud SQL (DB)</li>
              <li>Google Cloud Storage (Media)</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
