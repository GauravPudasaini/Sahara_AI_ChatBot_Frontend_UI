import './search_bar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faStop } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';

const SearchBar = ({ onSend, isFetching, stopFetching, currentSessionId }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="input-wrapper">
            <input 
                type="text"
                id="userInput" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
            />
            
            {isFetching ? (
                <button className="stop-btn" onClick={() => stopFetching(currentSessionId)}>
                    <FontAwesomeIcon icon={faStop} />
                </button>
            ) : (
                <button className="submit-btn" onClick={handleSend}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
