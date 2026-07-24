import '@playground/theme/theme.css';
import '@playground/theme/components.css';
import './style.css';
import { mountApp } from './ui/app';

const root = document.querySelector<HTMLDivElement>('#app');
if (root) {
  mountApp(root);
}
