import { describe, it, expect } from 'vitest';
import {
  DEFAULT_INTERVAL,
  DEFAULT_SERVER_ADDRESS,
  DEFAULT_TCP_PORT,
  DEFAULT_UDP_PORTS,
} from '../utils';
import {
  Action,
  formReducer,
  initialState,
  ValidationError,
} from './useFormReducer';

describe('formReducer', () => {
  it('should set field and validate', () => {
    const action: Action = {
      type: 'SET_FIELD',
      field: 'serverAddress',
      value: '',
    };
    const newState = formReducer(initialState, action);

    expect(newState.formData.serverAddress).toBe('');
    expect(newState.errors.serverAddress).toBe('Server address is required');
  });

  it('should set errors', () => {
    const errors: ValidationError = { serverAddress: 'Invalid address' };
    const action: Action = { type: 'SET_ERRORS', errors };
    const newState = formReducer(initialState, action);

    expect(newState.errors).toEqual(errors);
  });

  it('should handle multiple fields correctly', () => {
    let newState = formReducer(initialState, {
      type: 'SET_FIELD',
      field: 'serverAddress',
      value: '192.168.0.1',
    });
    expect(newState.formData.serverAddress).toBe('192.168.0.1');
    expect(newState.errors.serverAddress).toBeUndefined();

    newState = formReducer(newState, {
      type: 'SET_FIELD',
      field: 'interval',
      value: 50,
    });
    expect(newState.formData.interval).toBe(50);
    expect(newState.errors.interval).toBe(
      'Interval must be between 100 and 10000',
    );

    newState = formReducer(newState, {
      type: 'SET_FIELD',
      field: 'interval',
      value: 500,
    });
    expect(newState.formData.interval).toBe(500);
    expect(newState.errors.interval).toBeUndefined();
  });

  it('should handle initial state correctly', () => {
    expect(initialState.formData.serverAddress).toBe(DEFAULT_SERVER_ADDRESS);
    expect(initialState.formData.udpPorts).toBe(DEFAULT_UDP_PORTS);
    expect(initialState.formData.interval).toBe(DEFAULT_INTERVAL);
    expect(initialState.formData.tcpPort).toBe(DEFAULT_TCP_PORT);
    expect(initialState.errors).toEqual({});
  });
});
