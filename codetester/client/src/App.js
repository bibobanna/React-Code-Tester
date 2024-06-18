import React, { useState, useEffect } from 'react';
import axios from 'axios';
import questions from './questions.json';
// import tests from './tests.json';
import languages from './languages.json';
import Editor from '@monaco-editor/react';


function App() {
    const [code, setCode] = useState('');  // Code entered by the user
    const [output, setOutput] = useState('');  // Output from the code execution
    const [currentQuestion, setCurrentQuestion] = useState({});  // Currently selected question
    const [testResults] = useState([]);  // Results from running tests on the code: setTestResults
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);  // Currently selected programming language

    useEffect(() => {
        // Set the first question as the current question when the app loads
        setCurrentQuestion(questions[0]);
    }, []);

    const handleEditorChange = (value) => {
        // Update the code state whenever the user changes the code in the editor
        setCode(value);
    };

    const handleLanguageChange = (event) => {
      // Update the selected language based on user selection from the dropdown
      const selected = languages.find(lang => lang.name === event.target.value);
      setSelectedLanguage(selected);
  };
  
    <Editor
        height="50vh"
        theme="vs-dark"
        language={selectedLanguage.value}  // This should now correctly change the syntax highlighting
        value={code}
        onChange={handleEditorChange}
    />
  

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log("Sending language name:", selectedLanguage.name);  // Ensure this logs the correct language name
      try {
          const response = await axios.post('http://localhost:3000/run-code', {
              code,
              languageName: selectedLanguage.name
          });
          setOutput(response.data.output);
      } catch (error) {
          console.error('Error submitting code:', error);
          setOutput(`Error executing code: ${error.response ? error.response.data : 'Server not reachable'}`);
      }
    };
  
    return (
        <div className="App">
            <h1>{currentQuestion.title}</h1>  {/* Display the title of the current question */}
            <p>{currentQuestion.description}</p>  {/* Display the description of the current question */}
            <select value={selectedLanguage.name} onChange={handleLanguageChange}>
                {languages.map(lang => (
                    <option key={lang.name} value={lang.name}>{lang.name}</option>
                ))}
            </select>
            <Editor
                height="50vh"
                theme="vs-dark"
                language={selectedLanguage.value}
                value={code}
                onChange={handleEditorChange}
            />
            <button onClick={handleSubmit}>Run Code</button>
            <h2>Output:</h2>
            <pre>{output}</pre>
            <div>
                {testResults.map(test => (
                    <p key={test.name} style={{ color: test.result ? 'green' : 'red' }}>
                        {test.name}: {test.result ? 'Passed' : 'Failed'}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default App;
