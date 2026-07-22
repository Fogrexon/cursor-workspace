import '@playground/theme/theme.css';
import './style.css';
import { mountApp } from './ui/app';

const app = document.querySelector<HTMLDivElement>('#app')!;
void mountApp(app);
