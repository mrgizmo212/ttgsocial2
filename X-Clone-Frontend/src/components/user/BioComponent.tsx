import type { User } from "../../types/User.ts";

type BioComponentProps = {
  user?: User | null;
};

//Todo clean the != "null"

function BioComponent({ user }: BioComponentProps) {
  if (user && user.bio && user.bio != "null") {
    return <p>{user.bio}</p>;
  } else {
    return <p></p>;
  }
}

export default BioComponent;
