import { useState } from 'react';
import './calculator.css';

const Calculator = () => {
  const [history, setHistory] = useState('');
  const [output, setOutput] = useState('');

  const getFormattedNumber = (num) => {
    if (num === '-') {
      return '';
    }
    const n = Number(num);
    const value = n.toLocaleString('en');
    return value;
  };

  const reverseNumberFormat = (num) => {
    return Number(num.replace(/,/g, ''));
  };

  const handleClick = (event) => {
    const value = event.target.innerText;
    switch (value) {
      case 'C':
        setHistory('');
        setOutput('');
        break;
      case 'CE':
        const newOutput = output.slice(0, -1);
        setOutput(newOutput);
        break;
      case '=':
        const result = eval(history);
        setOutput(result);
        setHistory('');
        break;
      default:
        if (!isNaN(value) || value === '.') {
          setOutput(output + value);
        } else {
          const newHistory = history + ' ' + output + ' ' + value;
          setHistory(newHistory);
          setOutput('');
        }
    }
  };

  return (
    <div id="calculator">
      <div id="result">
        <div id="history">
          <p>{history}</p>
        </div>
        <div id="output">
          <p>{getFormattedNumber(output)}</p>
        </div>
      </div>
      <div id="keyboard" onClick={handleClick}>
        <button className="operator">C</button>
        <button className="operator">CE</button>
        <button className="operator">%</button>
        <button className="operator">/</button>
        <button className="number">7</button>
        <button className="number">8</button>
        <button className="number">9</button>
        <button className="operator">*</button>
        <button className="number">4</button>
        <button className="number">5</button>
        <button className="number">6</button>
        <button className="operator">-</button>
        <button className="number">1</button>
        <button className="number">2</button>
        <button className="number">3</button>
        <button className="operator">+</button>
        <button className="number">0</button>
        <button className="operator">=</button>
      </div>
    </div>
  );
};

export default Calculator;