/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  if (data === 'start') {
    setInterval(() => {
      postMessage('tick');
    }, 1000);
  }
});
