import ReactTimeAgo from "react-time-ago";

type CreatedAtDisplayProps = {
  createdAt: string;
  typeOfCreatedAt: string;
};

function CreatedAtDisplay({
  createdAt,
  typeOfCreatedAt,
}: CreatedAtDisplayProps) {
  const date = createdAt ? parseDate(createdAt) : "";
  const timeAgo = new Date(createdAt);

  function parseDate(toFormat: string): string {
    const year = toFormat.slice(0, 4);
    let month = toFormat.slice(5, 7);
    let day = toFormat.slice(8, 10);

    const dayNum = parseInt(day, 10);

    const getSuffix = (d: number) => {
      if (d >= 11 && d <= 13) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = parseInt(month, 10) - 1;

    return `${dayNum}${getSuffix(dayNum)} ${months[monthIndex]} ${year}`;
  }

  return (
    <>
      {typeOfCreatedAt == "timeago" ? (
        <div className="text-twitterTextAlt">
          <ReactTimeAgo date={timeAgo} timeStyle={"twitter"} />
        </div>
      ) : (
        <div className="text-twitterTextAlt">
          <p>Joined {date}</p>
        </div>
      )}
    </>
  );
}

export default CreatedAtDisplay;
