import React, { useEffect, useState } from 'react';

import './main.css';

const randomCommands = [
  {
    main: 'docker start',
    options: [
      'container-abc',
      'container-123',
      'container-qwert',
      'container-abc container-123',
      'container-qwert container-123',
      'container-qwert container-abc',
    ]
  },
  {
    main: 'docker ps',
  },
  {
    main: 'docker kill',
    options: [
      'container-abc',
      'container-123'
    ]
  },
  {
    main: 'docker build',
    options: [
      'container-abc',
      'container-123'
    ]
  },
]

const MainPage = () => {
  const [historic, setHistoric] = useState([]);
  const [rightLetters, setRightLetters] = useState(0);
  const [wrongLetters, setWrongLetters] = useState(0);
  const [hasFailed, setHasFailed] = useState();
  const [currentTest, setCurrentTest] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const changeToRandomTest = () => {
    const commandKey = Math.floor(Math.random() * randomCommands.length);
    const newCommand = randomCommands[commandKey];

    const optionKey = newCommand.options
    ? Math.floor(Math.random() * newCommand.options.length)
    : undefined;

    const newTest = `${newCommand.main}${optionKey ? ` ${newCommand.options[optionKey]}` : ''}`
    setCurrentTest(newTest);
  }

  const finishCurrentTest = (newValue, newWrongLetters, newRightLetters) => {
    setHistoric([
      {
        test: currentTest,
        value: newValue,
        wrong: newWrongLetters,
        right: newRightLetters,
      },
      ...historic,
    ])
    changeToRandomTest();
    setCurrentValue('');
    setWrongLetters(0);
    setRightLetters(0);
  }

  const handleInputChange = (event) => {
    const { value: newValue } = event.target;
    const position = newValue.length - 1;
    const hasFailed = newValue[position] !== currentTest[position];

    setHasFailed(hasFailed);
    const newWrongLetters = hasFailed ? wrongLetters + 1 : wrongLetters;
    const newRightLetters = !hasFailed ? rightLetters + 1 : rightLetters;
    hasFailed ? setWrongLetters(newWrongLetters) : setRightLetters(newRightLetters);

    newValue.length > currentValue.length && setCurrentValue(newValue);
    newValue.length === currentTest.length && finishCurrentTest(newValue, newWrongLetters, newRightLetters);
  }

  useEffect(() => {
    changeToRandomTest();
  }, []);

  return (
    <div id="main-container">
      <h3 id="test-label">{currentTest}</h3>

      {
        hasFailed !== undefined &&
        <h4 className={hasFailed ? 'fail' : 'success'}>{hasFailed ? 'Letra errada!' : 'Letra certa!'}</h4>
      }

      <input value={currentValue} onChange={handleInputChange} />

      {
        historic.length > 0 &&
        <table id="historic-table">
          <tr>
            <th>Teste</th>
            <th>Digitado</th>
            <th>Acertos</th>
            <th>Erros</th>
          </tr>
          {
            historic.map((item, index) => (
            <tr key={index}>
              <td>{item.test}</td>
              <td>{item.value}</td>
              <td>{item.right}</td>
              <td>{item.wrong}</td>
            </tr>
            ))
          }
        </table>
      }
    </div>
  );
}

export default MainPage;