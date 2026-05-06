import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove the useEffect blocks for auth
const toReplace = `  useEffect(() => {
    localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
  }, [userPasswords]);

  useEffect(() => {
    if (user) {
      const existingSession = localStorage.getItem('userSession');
      if (rememberMe || existingSession) {
        const expiresAt = Date.now() + 21 * 24 * 60 * 60 * 1000; // 3 weeks
        localStorage.setItem('userSession', JSON.stringify({ email: user.email, expiresAt }));
      }
    } else {
      localStorage.removeItem('userSession');
    }
  }, [user, rememberMe]);

  useEffect(() => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer("");
    setCaptchaError(false);
  }, [authMode]);`;

code = code.replace(toReplace, '');

// remove user condition from chicken
code = code.replace(`if (chickenEffectEnabled && !isSettingsOpen && user) {`, `if (chickenEffectEnabled && !isSettingsOpen) {`);

// Remove the Profile/Orders Modal entirely
const startModal = code.indexOf('{/* Profile/Orders Modal */}');
const endModalStr = '    </AnimatePresence>';
// Make sure to find the closing tag for the modal. Since there are multiple AnimatePresence, we need to match carefully.
// From previous grep, it was 1167 to 1260
if (startModal !== -1) {
  let depth = 0;
  let remaining = code.substring(startModal);
  const endModal = remaining.indexOf('</AnimatePresence>') + '</AnimatePresence>'.length;
  code = code.substring(0, startModal) + remaining.substring(endModal);
  console.log('Removed modal');
}

fs.writeFileSync('src/App.tsx', code);
console.log('Done script');
