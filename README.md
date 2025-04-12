# @tfpkgr/wait

## Usage

`@tfpkgr/wait` provides utility functions for handling promises, delays, and retries. Below are examples of how to use the package:

### 1. Wrapping a Promise

```typescript
import Wait from '@tfpkgr/wait';

const [error, data] = await Wait.promise(fetchData());
if (error) {
	console.error('Failed to fetch data:', error);
} else {
	console.log('Fetched data:', data);
}
```

### 2. Executing Multiple Promises

```typescript
const [error, result1, result2] = await Wait.all([fetchData1(), fetchData2()]);
if (error) {
	console.error('Failed to fetch data:', error);
} else {
	console.log('Results:', result1, result2);
}
```

### 3. Delaying Execution

```typescript
await Wait.time(1000); // Waits for 1 second
```

### 4. Retrying a Function

```typescript
const result = await Wait.retry(() => fetchData(), 3, 1000);
console.log('Fetched data after retries:', result);
```

### Installation

Install the package using npm or yarn:

```bash
npm install @tfpkgr/wait
```

```bash
yarn add @tfpkgr/wait
```
