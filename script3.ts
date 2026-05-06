import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace states
code = code.replace(
  `const [authMode, setAuthMode] = useState<"login" | "register">("login");`,
  `const [rememberMe, setRememberMe] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot_password" | "email_sent" | "reset_password">("login");
  const [captchaNum1, setCaptchaNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaNum2, setCaptchaNum2] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);`
);

// Insert useEffect after userPasswords useEffect
const userPasswordsEffect = `  useEffect(() => {
    localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
  }, [userPasswords]);`;
const newEffect = `
  useEffect(() => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer("");
    setCaptchaError(false);
  }, [authMode]);
`;
code = code.replace(userPasswordsEffect, userPasswordsEffect + newEffect);

const formLogic = `
          <form onSubmit={(e) => {
            e.preventDefault();
            
            const resetCurrentCaptcha = () => {
              setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
              setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
              setCaptchaAnswer("");
            };

            if (authMode !== 'email_sent') {
              if (parseInt(captchaAnswer) !== captchaNum1 + captchaNum2) {
                setCaptchaError(true);
                resetCurrentCaptcha();
                return;
              }
            }
            
            if (authMode === 'forgot_password') {
              if (userPasswords[loginEmail] === undefined) {
                setAuthError("ไม่พบอีเมลนี้ในระบบ");
                resetCurrentCaptcha();
                return;
              }
              setAuthMode('email_sent');
              return;
            }

            if (authMode === 'reset_password') {
              if (loginPassword.length < 6) {
                setAuthError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                return;
              }
              setUserPasswords({ ...userPasswords, [loginEmail]: loginPassword });
              setAuthMode('login');
              setAuthError("เปลี่ยนรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบ");
              setLoginPassword("");
              resetCurrentCaptcha();
              return;
            }
            
            if (loginEmail && loginPassword) {
              if (authMode === 'login') {
                if (userPasswords[loginEmail] === undefined) {
                  setAuthError("ไม่พบบัญชีผู้ใช้นี้ กรุณาสมัครสมาชิก");
                  resetCurrentCaptcha();
                  return;
                }
                if (userPasswords[loginEmail] !== loginPassword) {
                  setAuthError("รหัสผ่านไม่ถูกต้อง");
                  resetCurrentCaptcha();
                  return;
                }
                handleLoginSuccess(loginEmail);
              } else if (authMode === 'register') {
                if (userPasswords[loginEmail] !== undefined) {
                  setAuthError("อีเมลนี้ถูกใช้งานแล้ว");
                  resetCurrentCaptcha();
                  return;
                }
                if (loginPassword.length < 6) {
                  setAuthError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
                  resetCurrentCaptcha();
                  return;
                }
                setUserPasswords({ ...userPasswords, [loginEmail]: loginPassword });
                handleLoginSuccess(loginEmail);
              }
              
              setLoginEmail("");
              setLoginPassword("");
            }
          }} className="flex flex-col gap-4">
`;

// Replace the <form> content
const startForm = code.indexOf('<form onSubmit={(e) => {');
const endForm = code.indexOf('</form>', startForm) + '</form>'.length;

const newFormContent = formLogic + `
            {authMode !== 'email_sent' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-300">อีเมล</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all"
                  placeholder="อีเมลของคุณ"
                />
              </div>
            )}
            
            {(authMode === 'login' || authMode === 'register' || authMode === 'reset_password') && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">
                    {authMode === 'reset_password' ? 'รหัสผ่านใหม่' : 'รหัสผ่าน'}
                  </label>
                  {authMode === 'login' && <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('forgot_password'); setAuthError(''); }} className="flex-shrink-0 text-xs text-tactical-red hover:underline">ลืมรหัสผ่าน?</a>}
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all"
                  placeholder={authMode === 'reset_password' ? "รหัสผ่านใหม่" : "รหัสผ่านของคุณ"}
                />
              </div>
            )}
            
            {(authMode === 'login' || authMode === 'register') && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-tactical-red focus:ring-tactical-red focus:ring-offset-zinc-900"
                />
                <label htmlFor="rememberMe" className="text-sm text-zinc-400 select-none cursor-pointer">
                  จดจำการเข้าสู่ระบบ
                </label>
              </div>
            )}

            {authMode !== 'email_sent' && (
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-sm font-medium text-zinc-300">ยืนยันตัวตน (บวกเลข)</label>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono font-bold flex items-center justify-center min-w-[80px]">
                    {captchaNum1} + {captchaNum2}
                  </div>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={e => {
                      setCaptchaAnswer(e.target.value);
                      setCaptchaError(false);
                    }}
                    className={\`w-full px-4 py-3 bg-zinc-900 border \${captchaError ? 'border-red-500' : 'border-zinc-800'} rounded-xl text-white outline-none focus:outline-none focus:border-tactical-red focus:ring-1 focus:ring-tactical-red transition-all font-mono\`}
                    placeholder="="
                  />
                </div>
                {captchaError && (
                  <span className="text-xs text-red-500 font-medium">คำตอบไม่ถูกต้อง กรุณาลองใหม่</span>
                )}
              </div>
            )}

            {authMode === 'email_sent' ? (
              <div className="flex flex-col gap-3 mt-2">
                <button type="button" onClick={() => setAuthMode('reset_password')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3.5 px-4 rounded-xl border border-zinc-700 transition-colors cursor-pointer">
                  จำลองการคลิกลิงก์ในอีเมล
                </button>
                <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="w-full text-zinc-400 hover:text-white font-medium py-2 transition-colors cursor-pointer">
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            ) : (
              <>
                <button
                  type="submit"
                  className="mt-2 w-full bg-tactical-red hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_15px_rgba(230,57,70,0.3)] hover:shadow-[0_0_25px_rgba(230,57,70,0.5)] transition-all active:scale-[0.98] cursor-pointer"
                >
                  {authMode === 'login' ? 'เข้าสู่ระบบ' : 
                   authMode === 'register' ? 'สมัครสมาชิก' : 
                   authMode === 'forgot_password' ? 'ส่งลิงก์ยืนยัน' : 'ตั้งรหัสผ่านใหม่'}
                </button>
                
                {authMode !== 'reset_password' && (
                  <div className="text-center mt-2">
                    <p className="text-sm text-zinc-500">
                      {authMode === 'login' ? (
                        <>ยังไม่มีบัญชีใช่หรือไม่? <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className="text-tactical-red hover:underline focus:outline-none font-medium ml-1 cursor-pointer">สมัครสมาชิก</button></>
                      ) : authMode === 'register' ? (
                        <>มีบัญชีอยู่แล้วใช่หรือไม่? <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-tactical-red hover:underline focus:outline-none font-medium ml-1 cursor-pointer">เข้าสู่ระบบ</button></>
                      ) : (
                        <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-zinc-400 hover:text-white hover:underline focus:outline-none font-medium mt-2 cursor-pointer">กลับไปหน้าเข้าสู่ระบบ</button>
                      )}
                    </p>
                  </div>
                )}
              </>
            )}
          </form>
`;

code = code.substring(0, startForm) + newFormContent + code.substring(endForm);

const h3Str = `{authMode === 'login' ? 'เข้าสู่ระบบ' : 
               authMode === 'register' ? 'สมัครสมาชิก' : 
               authMode === 'forgot_password' ? 'ลืมรหัสผ่าน' : 
               authMode === 'email_sent' ? 'ตรวจสอบอีเมล' : 'ตั้งรหัสผ่านใหม่'}`;
const pStr = `{authMode === 'login' ? 'กรุณาเข้าสู่ระบบเพื่อใช้งาน KooK-RSiam' : 
               authMode === 'register' ? 'สมัครสมาชิกเพื่อเริ่มต้นใช้งานระบบ' : 
               authMode === 'forgot_password' ? 'กรุณากรอกอีเมลที่ใช้สมัครสมาชิก' :
               authMode === 'email_sent' ? 'เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณแล้ว (จำลอง)' :
               'กรุณากรอกรหัสผ่านใหม่ของคุณ'}`;

code = code.replace(
  /{authMode === 'login' \? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}/,
  h3Str
);
code = code.replace(
  /{authMode === 'login' \? 'กรุณาเข้าสู่ระบบเพื่อใช้งาน KooK-RSiam' : 'สมัครสมาชิกเพื่อเริ่มต้นใช้งานระบบ'}/,
  pStr
);

// update useEffect regarding session and rememberMe
code = code.replace(
  `if (user) {
      const expiresAt = Date.now() + 21 * 24 * 60 * 60 * 1000;
      localStorage.setItem('userSession', JSON.stringify({ email: user.email, expiresAt }));
    } else {
      localStorage.removeItem('userSession');
    }
  }, [user]);`,
  `if (user) {
      const existingSession = localStorage.getItem('userSession');
      if (rememberMe || existingSession) {
        const expiresAt = Date.now() + 21 * 24 * 60 * 60 * 1000; // 3 weeks
        localStorage.setItem('userSession', JSON.stringify({ email: user.email, expiresAt }));
      }
    } else {
      localStorage.removeItem('userSession');
    }
  }, [user, rememberMe]);`
);


fs.writeFileSync('src/App.tsx', code);
