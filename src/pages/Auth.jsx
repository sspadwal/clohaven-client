// import React, { useState } from 'react';
// import '../styles/Auth.css';

// function Auth({ login, signup, view, setView }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => login(email, password);
//   const handleSignup = () => signup(email, password);

//   return (
//     <div className="auth">
//       {view === 'login' ? (
//         <>
//           <h2>Login</h2>
//           <input 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             placeholder="Email" 
//           />
//           <input 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             placeholder="Password" 
//           />
//           <button onClick={handleLogin}>Login</button>
//           <p>Need an account? <span onClick={() => setView('signup')}>Sign Up</span></p>
//         </>
//       ) : (
//         <>
//           <h2>Sign Up</h2>
//           <input 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             placeholder="Email" 
//           />
//           <input 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             placeholder="Password" 
//           />
//           <button onClick={handleSignup}>Sign Up</button>
//           <p>Already have an account? <span onClick={() => setView('login')}>Login</span></p>
//         </>
//       )}
//     </div>
//   );
// }

// export default Auth;