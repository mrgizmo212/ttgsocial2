import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function DevLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      localStorage.setItem("jwt", "dev-mock-token");
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      window.location.reload();
    } else {
      setError("Invalid dev credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        className="w-full rounded-md bg-black border border-twitterBorder p-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="w-full rounded-md bg-black border border-twitterBorder p-2"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full hover:cursor-pointer hover:bg-(--color-main)/75 bg-(--color-main) text-twitterText flex items-center justify-center h-10 rounded-full"
      >
        Dev login (admin/admin)
      </button>
    </form>
  );
}


