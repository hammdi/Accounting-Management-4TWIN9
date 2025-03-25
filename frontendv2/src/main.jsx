import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/error/ErrorBoundary.jsx'
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXmhKYVB2WmFZfVtgfV9DYlZVRGYuP1ZhSXxWdkZhWn9XdXZRRmRYWUI=');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
)
