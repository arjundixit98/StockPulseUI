import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ScreenerFrame } from './components/portfolio/ScreenerFrame.tsx';
createRoot(document.getElementById("root")!).render(<App />);

//createRoot(document.getElementById("root")!).render(<ScreenerFrame />);
