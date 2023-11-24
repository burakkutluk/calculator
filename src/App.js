import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EQUAL: "equal"
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperator: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperator === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperator === ".") {
        return state
      }

      return {
        ...state,
        currentOperator: `${state.currentOperator || ""}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperator == null && state.previousOperator == null) {
        return state
      }

      if (state.currentOperator == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperator == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperator: state.currentOperator,
          currentOperator: null,
        }
      }

      return {
        ...state,
        previousOperator: evaluate(state),
        operation: payload.operation,
        currentOperator: null,
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperator == null) {
        return state
      }
      return {
        ...state,
        currentOperator: state.currentOperator.slice(0, -1),
      }

    case ACTIONS.EQUAL:
      if (state.operation == null || state.previousOperator == null || state.currentOperator == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperator: null,
        operation: null,
        currentOperator: evaluate(state),
      }

  }
}

function evaluate({ currentOperator, previousOperator, operation }) {
  const prev = parseFloat(previousOperator)
  const current = parseFloat(currentOperator)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    default:
      return
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{ currentOperator, previousOperator, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  return (
    <div className="App">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperator)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperator)}</div>
      </div>
      <button className='ac-btn' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button className='ac-btn' onClick={() => dispatch({ type: ACTIONS.EQUAL })}>=</button>
    </div>
  );
}

export default App;
