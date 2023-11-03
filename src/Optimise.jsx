import React, { useState, useCallback, useMemo, useRef } from "react";

function generatePassword(length, numChecked, charChecked) {
  let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (numChecked) charset += "0123456789";
  if (charChecked) charset += "!@#$%^&*()";

  const charsetArray = charset.split("");
  const passwordArray = new Uint8Array(length);

  window.crypto.getRandomValues(passwordArray);

  const password = Array.from(
    passwordArray,
    (value) => charsetArray[value % charsetArray.length]
  ).join("");

  return password;
}

function PasswordGenerator() {
  const [length, setLength] = useState(8);
  const [numChecked, setNumChecked] = useState(false);
  const [charChecked, setCharChecked] = useState(false);
  const [password, setPassword] = useState("");
  
  const passwordRef = useRef(null);

  const copyPassToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password).catch((error) => {
      console.error("Error copying password to clipboard:", error);
    });
  }, [password]);

  const handleLengthChange = (e) => {
    setLength(e.target.value);
  };

  const handleNumCheckedChange = () => {
    setNumChecked((prev) => !prev);
  };

  const handleCharCheckedChange = () => {
    setCharChecked((prev) => !prev);
  };

  useMemo(() => {
    const newPassword = generatePassword(length, numChecked, charChecked);
    setPassword(newPassword);
  }, [length, numChecked, charChecked]);

  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
        <h1 className="text-white text-center my-3">Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly
            value={password}
            ref={passwordRef}
          />
          <button
            className="outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0"
            onClick={copyPassToClipboard}
          >
            Copy
          </button>
        </div>

        <div className="flex text-sm gap-x-2">
          <div className="flex items-center gap-x-1">
            <input
              type="range"
              className="cursor-pointer"
              min={8}
              max={15}
              value={length}
              onChange={handleLengthChange}
            />
            <label>Length: {length}</label>
          </div>

          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={numChecked}
              id="numInput"
              onChange={handleNumCheckedChange}
            />
            <label htmlFor="numInput">Numbers</label>
          </div>

          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={charChecked}
              id="charInput"
              onChange={handleCharCheckedChange}
            />
            <label htmlFor="charInput">Characters</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default PasswordGenerator;
