import { useReducer } from 'react';
import {
  DEFAULT_SERVER_ADDRESS,
  DEFAULT_UDP_PORTS,
  DEFAULT_INTERVAL,
  DEFAULT_TCP_PORT,
} from '../utils';

// Define the shape of form data using TypeScript interface
export interface FormData {
  serverAddress: string;
  udpPorts: string;
  interval: number;
  tcpPort: number;
}

export type ValidationError = {
  [key in keyof FormData]?: string;
};

// Define action types for the reducer
export type Action =
  | { type: 'SET_FIELD'; field: keyof FormData; value: string | number }
  | { type: 'SET_ERRORS'; errors: ValidationError }
  | { type: 'LOAD_CONFIG'; config: FormData };

// Define the initial state
export const initialState: {
  formData: FormData;
  errors: ValidationError;
} = {
  formData: {
    serverAddress: DEFAULT_SERVER_ADDRESS,
    udpPorts: DEFAULT_UDP_PORTS,
    interval: DEFAULT_INTERVAL,
    tcpPort: DEFAULT_TCP_PORT,
  },
  errors: {},
};

// Validation function
const validate = (formData: FormData): ValidationError => {
  const newErrors: ValidationError = {};

  if (!formData.serverAddress)
    newErrors.serverAddress = 'Server address is required';
  if (!formData.udpPorts) newErrors.udpPorts = 'UDP ports are required';
  if (formData.interval < 100 || formData.interval > 10000)
    newErrors.interval = 'Interval must be between 100 and 10000';
  if (formData.tcpPort <= 0)
    newErrors.tcpPort = 'TCP port must be greater than 0';

  return newErrors;
};

// Define the reducer function
export const formReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'SET_FIELD': {
      const newFormData = { ...state.formData, [action.field]: action.value };
      const newErrors = validate(newFormData);

      return {
        ...state,
        formData: newFormData,
        errors: newErrors,
      };
    }
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'LOAD_CONFIG':
      return {
        ...state,
        formData: action.config,
        errors: {},
      };
    default:
      return state;
  }
};

// Custom hook to use the form reducer
export const useFormReducer = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Function to validate form and dispatch errors
  const validateForm = () => {
    const errors = validate(state.formData);

    dispatch({ type: 'SET_ERRORS', errors });

    return Object.keys(errors).length === 0;
  };

  return [state, dispatch, validateForm] as const;
};
