import { add } from './add';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 1)).toBe(2);
  });
});
