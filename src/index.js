import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TextInput,
  Button
} from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export const App = ({ sdk }) => {
  const [specialDate, setSpecialDate] = useState('');
  const [specialClosed, setSpecialClosed] = useState(false);
  const [specialOpeningTime, setSpecialOpeningTime] = useState('');
  const [specialClosingTime, setSpecialClosingTime] = useState('');
  const [value, setValue] = useState(sdk.field.getValue() || []);

  const handleAdd = () => {
    const newObj = {
      specialDate,
      specialClosed,
      specialOpeningTime,
      specialClosingTime
    }

    setValue([...value, newObj])

    if (value) {
      sdk.field.setValue([...value, newObj]);
    } else {
      sdk.field.removeValue();
    }

    setSpecialDate('')
    setSpecialClosed(false)
    setSpecialOpeningTime('')
    setSpecialClosingTime('')
  }

  const removeSpecialDate = (index) => {
    const currentState = [ ...value ];
    currentState.splice(index, 1)
    setValue(currentState)
    if (currentState) {
      sdk.field.setValue(currentState);
    } else {
      sdk.field.removeValue();
    }
  }

  const onExternalChange = value => {
    if (value) {
      setValue(value);
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return detatchValueChangeHandler;
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <strong>Special Date</strong>
          </TableCell>
          <TableCell><strong>Closed</strong></TableCell>
          <TableCell><strong>Opening time</strong></TableCell>
          <TableCell><strong>Closing time</strong></TableCell>
          <TableCell><strong>Add</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <TextInput
              id="specialDate"
              width="medium"
              name="specialDate"
              value={specialDate}
              onChange={(e) => setSpecialDate(e.currentTarget.value)}
            />
          </TableCell>
          <TableCell>
            <Checkbox
              labelText=""
              id="specialClosed"
              name="specialClosed"
              checked={specialClosed}
              onChange={e => setSpecialClosed(e.currentTarget.checked)}
            />
          </TableCell>
          <TableCell>
            <input
              id="specialOpeningTime"
              type="time"
              name="specialOpeningTime"
              value={specialOpeningTime}
              onChange={(e) => setSpecialOpeningTime(e.currentTarget.value)}
            />
          </TableCell>
          <TableCell>
            <input
              id="specialClosingTime"
              type="time"
              name="specialClosingTime"
              value={specialClosingTime}
              onChange={(e) => setSpecialClosingTime(e.currentTarget.value)}
            />
          </TableCell>
          <TableCell>
            <Button buttonType="positive" icon="Plus" title="Add" size="small" type="submit" onClick={handleAdd} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell><strong>Special Dates:</strong></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        {value.map((date, index) => {
          return (
          <TableRow key={index}>
            <TableCell>{date.specialDate}</TableCell>
            <TableCell></TableCell>
            {date.specialClosed ?
              <><TableCell><strong>Closed</strong></TableCell><TableCell></TableCell></>:
              <>
                <TableCell>{date.specialOpeningTime !== '' ? date.specialOpeningTime : '-'}</TableCell>
                <TableCell>{date.specialClosingTime !== '' ? date.specialClosingTime : '-'}</TableCell>
              </>
            }
            <TableCell>
              <Button buttonType="negative" icon="HorizontalRule" title="Remove" size="small" onClick={() => removeSpecialDate(index)} />
            </TableCell>
          </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
