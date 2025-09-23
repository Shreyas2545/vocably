import React, { useState } from "react";

function App() {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (word.trim() === "") {
      setError("Please enter a word");
      setDetails(null);
      return;
    }

    setError("");
    setLoading(true);
    setDetails(null);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await res.json();

      if (!res.ok || !data[0]) {
        setError("Word not found. Try another one.");
        setLoading(false);
        return;
      }

      const wordData = data[0];
      const meaning = wordData.meanings[0];
      const synonyms = meaning.synonyms || [];

      setDetails({
        word: wordData.word,
        type: meaning.partOfSpeech,
        synonyms: synonyms,
        definition: meaning.definitions[0].definition,
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-700 to-purple-600 p-5 pt-10">
      <div className="flex flex-col items-center text-center space-y-6 w-full max-w-sm">
        {/* Title */}
        <h1 className="text-5xl font-bold text-white">Dictionary</h1>

        {/* Search Form */}
        <form
          className="flex flex-col items-center w-full space-y-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search a word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full p-4 rounded-lg text-center text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="w-full bg-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-purple-500 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Loading */}
        {loading && <p className="text-white">Loading...</p>}

        {/* Error */}
        {error && <p className="text-red-400">{error}</p>}

        {/* Result */}
        {details && (
          <div className="bg-black bg-opacity-30 p-8 rounded-2xl shadow-lg space-y-4 w-full">
            <h2 className="text-4xl font-bold text-white">{details.word}</h2>
            <p className="text-lg italic text-white">{details.type}</p>
            {details.synonyms.length > 0 && (
              <p className="text-green-300">
                <span className="font-semibold">Synonyms:</span>{" "}
                {details.synonyms.join(", ")}
              </p>
            )}
            <p className="text-white">{details.definition}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;