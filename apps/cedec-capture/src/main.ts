import '@playground/theme/theme.css';
import '@playground/theme/components.css';
import './style.css';
import catalog from './content/sessions.json';
import { mountApp } from './ui/app';
import type { Catalog } from './types';

const root = document.querySelector<HTMLDivElement>('#app');
if (root) {
  mountApp(root, catalog as Catalog);
}
