import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { API_URL } from "../../../constants/env";
import { useModal } from "../../../context/ModalProvider";

export function FeedbackModal() {
  const { setModalType } = useModal();
  const [textInput, setTextInput] = useState("");
  const [clickedtype, setClickedType] = useState("");

  const handleSubmit = async () => {
    if (textInput.length <= 0) return;

    const body = {
      text: textInput,
      type: clickedtype,
      userId: null,
    };

    try {
      const res = await fetch(`${API_URL}/api/feedback/add-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to send feedback");

      setTextInput("");
      setClickedType("");
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit feedback");
    }
  };

  return (
    <div className="w-full h-full flex flex-col border text-twitterText rounded-4xl p-8 items-center gap-8 bg-(--background-main)">
      <>
        <div className="w-full flex flex-col justify-center gap-4">
          <p className="text-xl font-bold text-center">
            Submit feedback or bug
          </p>
          <div className="w-full h-fit flex border border-(--color-main) rounded-2xl p-2 min-h-20">
            <TextareaAutosize
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full resize-none min-h-12 p-1 focus:outline-none focus:ring-0 focus:border-transparent text-white placeholder:text-twitterTextAlt"
              placeholder="Enter your comment here (this field can not be empty)"
            />
          </div>
        </div>

        <hr className="w-full text-twitterBorder" />

        <div className="w-full flex flex-col justify-center gap-4">
          <p className="text-xl font-bold text-center">Select Category</p>

          <div className="w-full flex gap-6 items-center justify-between">
            <div
              onClick={() => setClickedType("Bug")}
              className={`p-2 hover:bg-twitterTextAlt/20 hover:cursor-pointer w-full ${
                clickedtype == "Bug"
                  ? "shadow-[0_0_5px_2px_orange] border-orange-300"
                  : "border-twitterText"
              } rounded-2xl border `}
            >
              <p className="text-center">Bug</p>
            </div>

            <div
              onClick={() => setClickedType("Feedback")}
              className={`hover:bg-twitterTextAlt/20 hover:cursor-pointer p-2 w-full rounded-2xl ${
                clickedtype == "Feedback"
                  ? "shadow-[0_0_5px_2px_green] border-green-500"
                  : "border-twitterText"
              } border`}
            >
              <p className="text-center">Feedback</p>
            </div>
          </div>
        </div>

        <hr className="w-full text-twitterBorder" />

        <div
          onClick={() => handleSubmit()}
          className={`py-3 w-2/3 ${
            textInput.length > 0
              ? "hover:cursor-pointer border-(--color-main)"
              : "hover:cursor-not-allowed text-twitterText/30 border-(--color-main)/60"
          } hover:bg-twitterTextAlt/20 rounded-full justify-center flex border items-center`}
        >
          <p className="text-xl font-bold text-center">Submit</p>
        </div>
      </>
    </div>
  );
}
