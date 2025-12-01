import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App';
import "/src/style.css";
import { reactiveModel } from './mobxReactiveModel';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App model={reactiveModel}/>
  </StrictMode>,
)
