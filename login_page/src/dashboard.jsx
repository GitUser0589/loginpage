import { useState } from 'react'
import './calculator.css'

const Calculator = () => {
  const [history, setHistory] = useState('');
  const [output, setOutput] = useState('');

  const getHistory = () => history;
  const printHistory = (num) => setHistory(num);

  const getOutput = () => output;
  const printOutput = (num) => {
    if (num === '') {
      setOutput(num);
    } else {
      setOutput(getFormattedNumber(num));
    }
  };

  const getFormattedNumber = (num) => {
    if (num === '-') {
      return '';
    }
    const n = Number(num);
    return n.toLocaleString('en');
  };

  const reverseNumberFormat = (num) => {
    return Number(num.replace(/,/g, ''));
  };

  const handleOperatorClick = (id) => {
    if (id === 'clear') {
      printHistory('');
      setOutput('');
    } else if (id === 'backspace') {
      const currentOutput = reverseNumberFormat(getOutput()).toString();
      if (currentOutput) {
        setOutput(currentOutput.substr(0, currentOutput.length - 1));
      }
    } else {
      const currentOutput = getOutput();
      const currentHistory = getHistory();
      if (currentOutput === '' && currentHistory !== '') {
        if (isNaN(currentHistory[currentHistory.length - 1])) {
          setHistory(currentHistory.substr(0, currentHistory.length - 1));
        }
      }
      if (currentOutput !== '' || currentHistory !== '') {
        const formattedOutput = currentOutput === '' ? currentOutput : reverseNumberFormat(currentOutput);
        const newHistory = currentHistory + formattedOutput;
        if (id === '=') {
          try {
            const result = eval(newHistory);
            setOutput(result);
            setHistory('');
          } catch (error) {
            setOutput('Error');
          }
        } else {
          setHistory(newHistory + id);
          setOutput('');
        }
      }
    }
  };

  const handleNumberClick = (id) => {
    const currentOutput = reverseNumberFormat(getOutput());
    if (!isNaN(currentOutput)) {
      setOutput(currentOutput + id);
    }
  };
  const buttons = [
    { id: 'clear', value: 'C', className: 'operator' },
    { id: 'backspace', value: 'CE', className: 'operator' },
    { id: '%', value: '%', className: 'operator' },
    { id: '/', value: '/', className: 'operator' },
    { id: '7', value: '7', className: 'number' },
    { id: '8', value: '8', className: 'number' },
    { id: '9', value: '9', className: 'number' },
    { id: '*', value: 'x', className: 'operator' },
    { id: '4', value: '4', className: 'number' },
    { id: '5', value: '5', className: 'number' },
    { id: '6', value: '6', className: 'number' },
    { id: '-', value: '-', className: 'operator' },
    { id: '1', value: '1', className: 'number' },
    { id: '2', value: '2', className: 'number' },
    { id: '3', value: '3', className: 'number' },
    { id: '+', value: '+', className: 'operator' },
    { id: '0', value: '0', className: 'number' },
    { id: '.', value: '.', className: 'number' }, // Add decimal button
    { id: '=', value: '=', className: 'operator' },
  ];

  return (
    <div id="container" className="calculator-container">
      <div id="calculator" className="calculator">
        <div id="result" className="result">
          <div id="history">
            <p>{getHistory()}</p>
          </div>
          <div id="output">
            <p>{getOutput()}</p>
          </div>
        </div>
        <div id="keyboard" className="keyboard">
          {buttons.map((button) => (
            <button
              key={button.id}
              className={button.className}
              id={button.id}
              onClick={() => (button.className === 'operator' ? handleOperatorClick(button.id) : handleNumberClick(button.id))}
            >
              {button.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;