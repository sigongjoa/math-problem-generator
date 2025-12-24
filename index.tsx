
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MathJaxContext } from 'better-react-mathjax';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

// Configuration for MathJax to recognize standard LaTeX delimiters
const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
   chtml: {
    // This helps MathJax match the font size of the surrounding text.
    matchFontHeight: true
  }
};

const root = ReactDOM.createRoot(rootElement);
root.render(
    <MathJaxContext config={mathJaxConfig}>
        <App />
    </MathJaxContext>
);
