import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const renderTitleStr = `
const renderTitle = (title: string, navbar: boolean = false) => {
  if (title.includes('-')) {
    const parts = title.split('-');
    const firstPart = parts[0];
    const rest = parts.slice(1).join('-');
    
    if (navbar) {
      return (
        <>
          {firstPart}-
          <span className="text-tactical-red group-hover:text-white transition-colors">
            {rest}
          </span>
        </>
      );
    }
    
    return (
      <>
        {firstPart}-<span className="text-tactical-red">{rest}</span>
      </>
    );
  }
  return title;
};
`;

// Insert the renderTitleStr before the "return" of the component?
// No, better to just put the helper function outside the App component.
const topLevelImportIndex = code.indexOf('export default function App() {');
code = code.slice(0, topLevelImportIndex) + renderTitleStr + '\n' + code.slice(topLevelImportIndex);

// Replace in navbar
code = code.replace(
  '<span className="font-display font-bold text-2xl tracking-tighter text-white group-hover:text-tactical-red transition-colors">\n                  {siteSettings.title}\n                </span>',
  '<span className="font-display font-bold text-2xl tracking-tighter text-white group-hover:text-tactical-red transition-colors">\n                  {renderTitle(siteSettings.title, true)}\n                </span>'
);

// Replace in footer
code = code.replace(
  '<span className="font-display font-bold text-xl tracking-tighter text-white">\n              {siteSettings.title}\n            </span>',
  '<span className="font-display font-bold text-xl tracking-tighter text-white">\n              {renderTitle(siteSettings.title)}\n            </span>'
);

fs.writeFileSync('src/App.tsx', code);
