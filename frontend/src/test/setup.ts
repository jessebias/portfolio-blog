import '@testing-library/jest-dom';

// Node 26 exposes localStorage as undefined (experimental feature without --localstorage-file).
// Replace it with a proper in-memory Storage implementation so jsdom tests work correctly.
class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

if (typeof localStorage === 'undefined' || localStorage === null) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  });
}

if (typeof sessionStorage === 'undefined' || sessionStorage === null) {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  });
}
