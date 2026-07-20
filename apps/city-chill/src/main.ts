import '@playground/theme/theme.css';
import './style.css';
import { mountApp } from './ui/app';

const root = document.querySelector<HTMLDivElement>('#app');
if (root) {
  void mountApp(root).catch((err) => {
    console.error(err);
    root.textContent = '建物モデルの読み込みに失敗しました。npm run generate:buildings を実行してください。';
  });
}
