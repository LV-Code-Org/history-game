import React, { useState, useEffect, Fragment } from "react";
import data from "./timeline.json";
import "./TimelineComponent.css";

type HistoricalData = Record<string, Array<Array<string>>>;

const selectItem = (data: HistoricalData): Array<string> | null => {
  const units: string[] = Object.keys(data);

  const randomUnitIndex: number = Math.floor(Math.random() * units.length);
  const randomUnit: string = units[randomUnitIndex];

  const selectedArray: Array<Array<string>> | undefined = data[randomUnit];

  const randomEntryIndex: number = Math.floor(
    Math.random() * selectedArray.length
  );
  const selectedEntry: Array<string> = selectedArray[randomEntryIndex];

  return selectedEntry;
};

const TimelineComponent: React.FC = () => {
  const [record, setRecord] = useState(selectItem(data));
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [recentScore, setRecentScore] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const MAX_QUESTIONS = 5;

  const handleClick = () => {
    if (record !== null && questions < MAX_QUESTIONS) {
      const distance: number = Math.abs(Number(record[0]) - Number(guess));
      setScore(score + (1000 - distance * 25 > 0 ? 1000 - distance * 25 : 0));
      setRecentScore(1000 - distance * 25 > 0 ? 1000 - distance * 25 : 0);
      setRecord(selectItem(data));
      setQuestions(questions + 1);
      setGuess("");
    }
  };

  useEffect(() => {
    async function searchImages(searchInput: string) {
      const apiKey = "AIzaSyCyXmzYSJK6VxZAyGX84mZmO4-v_W3zzuo";
      const cx = "47864378b548d4381";

      const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
        searchInput
      )}&key=${apiKey}&cx=${cx}&searchType=image`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const foundUrl = data.items[0].link;
          setImageUrl(foundUrl);
        } else {
          console.log("No images found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (record !== null) {
      searchImages(record[1]);
    }
  }, [record]);

  return (
    <div className="content">
      <h1>AP United States History: Timeline Quiz</h1>

      {questions !== MAX_QUESTIONS ? (
        <Fragment>
          <div>
            <strong>
              ({questions + 1}/{MAX_QUESTIONS})
            </strong>{" "}
            {record ? record[1] : ""}
          </div>
          <input
            type="text"
            onChange={(e) => setGuess(e.target.value)}
            value={guess}
            className="year_input"
          />
          <button onClick={handleClick} className="submit">
            submit
          </button>
          <div>
            Score: {score} {questions != 0 ? <i>(+{recentScore})</i> : ""}
          </div>
          <img src={imageUrl} />
        </Fragment>
      ) : (
        <Fragment>
          <div style={{ marginTop: "10vh" }}>
            <strong>Final Score:</strong>
          </div>
          <div className="finalScore">{score}</div>
          <div className="percentage">
            {(score / (MAX_QUESTIONS * 1000)) * 100}%
          </div>
          <button
            className="playAgain"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default TimelineComponent;
