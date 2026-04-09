/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { Timer, Star, ArrowLeft, Trophy, Play, User, Medal, RotateCcw, Home, Crown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

type View = "home" | "game" | "result";

interface Problem {
  a: number;
  b: number;
  op: string;
  ans: number;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [nickname, setNickname] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [problem, setProblem] = useState<Problem>({ a: 0, b: 0, op: "+", ans: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Mock Leaderboard
  const leaderboard = [
    { name: "สุดยอดนักคำนวณ", score: 450 },
    { name: nickname || "คุณ", score: score },
    { name: "สายฟ้าแลบ", score: 320 },
  ].sort((a, b) => b.score - a.score);

  // Load nickname from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("playerNickname");
    if (savedName) {
      setNickname(savedName);
    }
  }, []);

  // Confetti effect when result view is triggered
  useEffect(() => {
    if (view === "result") {
      localStorage.setItem("finalScore", score.toString());
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#A855F7", "#EC4899", "#F59E0B"]
      });
    }
  }, [view, score]);

  // Generate a random math problem
  const generateProblem = useCallback(() => {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;

    if (op === "+") {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      ans = a + b;
    } else if (op === "-") {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a) + 1;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      ans = a * b;
    }
    setProblem({ a, b, op, ans });
    setUserAnswer("");
  }, []);

  // Timer logic
  useEffect(() => {
    if (view !== "game") return;

    if (timeLeft <= 0) {
      setView("result");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const startGame = () => {
    if (!nickname.trim()) return;
    localStorage.setItem("playerNickname", nickname);
    setScore(0);
    setTimeLeft(300);
    generateProblem();
    setView("game");
  };

  const handleNumberClick = (num: string) => {
    setFeedback(null);
    setUserAnswer((prev) => prev + num);
  };

  const checkAnswer = () => {
    if (userAnswer === "") return;
    
    if (parseInt(userAnswer) === problem.ans) {
      setScore((prev) => prev + 10);
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        generateProblem();
      }, 600);
    } else {
      setFeedback("wrong");
      setUserAnswer("");
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#F3F0FF] font-sans text-slate-800 flex flex-col overflow-hidden selection:bg-purple-200">
      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative"
          >
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-50" />
            
            <div className="z-10 text-center max-w-md w-full">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              
              <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">MATH DASH</h1>
              <p className="text-slate-500 mb-12 font-medium">ท้าทายสมอง ประลองความไว!</p>
              
              <div className="bg-white p-8 rounded-[32px] shadow-2xl border-4 border-white mb-8">
                <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <User className="w-5 h-5 text-purple-500" />
                  <input
                    type="text"
                    placeholder="ใส่ชื่อเล่นของคุณ..."
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-transparent border-none outline-none w-full font-bold text-slate-700 placeholder:text-slate-300"
                  />
                </div>
                
                <button
                  onClick={startGame}
                  disabled={!nickname.trim()}
                  className="w-full py-5 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  <Play className="w-6 h-6 fill-current" />
                  เริ่มเกมเลย!
                </button>
              </div>
              
              <p className="text-slate-400 text-sm font-medium">ตอบถูก 1 ข้อ รับไปเลย 10 คะแนน!</p>
            </div>
          </motion.div>
        )}

        {view === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative"
          >
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-50" />

            {/* Top Navigation */}
            <div className="relative z-10 p-6 flex justify-between items-center">
              <button 
                onClick={() => setView("home")} 
                className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm text-slate-400 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white flex items-center gap-3">
                <Timer className="w-5 h-5 text-purple-600" />
                <span className="font-black text-xl text-slate-700 tabular-nums">{formatTime(timeLeft)}</span>
              </div>
              <div className="bg-yellow-400 px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-white">
                <Star className="w-5 h-5 fill-white" />
                <span className="font-black text-xl">{score}</span>
              </div>
            </div>

            {/* Main Game Card */}
            <div className="relative z-10 px-6 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full pb-12">
              <motion.div 
                animate={feedback === "wrong" ? { x: [-10, 10, -10, 10, 0] } : {}}
                className={`
                  bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 text-center border-4 transition-all duration-300
                  ${feedback === "correct" ? "scale-105 border-green-400 shadow-green-100" : "border-white"}
                  ${feedback === "wrong" ? "border-red-400 shadow-red-100" : ""}
                `}
              >
                <p className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-xs">แก้โจทย์นี้ให้ไวที่สุด!</p>
                <div className="text-7xl font-black text-slate-800 mb-10 flex items-center justify-center gap-6">
                  <span>{problem.a}</span>
                  <span className="text-purple-500">{problem.op === "*" ? "×" : problem.op}</span>
                  <span>{problem.b}</span>
                  <span className="text-slate-300">=</span>
                </div>
                
                <div className="h-24 flex items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                  {userAnswer ? (
                    <motion.span 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-black text-purple-600 tracking-tighter"
                    >
                      {userAnswer}
                    </motion.span>
                  ) : (
                    <span className="text-slate-200 text-6xl font-black italic">?</span>
                  )}
                </div>
              </motion.div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === "C") setUserAnswer("");
                      else if (btn === "OK") checkAnswer();
                      else handleNumberClick(btn.toString());
                    }}
                    className={`
                      h-20 rounded-3xl font-black text-2xl shadow-md transition-all active:scale-90
                      ${btn === "OK" ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}
                      ${btn === "C" ? "text-red-400" : ""}
                    `}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative min-h-screen"
          >
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-50" />

            <div className="z-10 text-center max-w-md w-full">
              <div className="bg-white p-8 rounded-[48px] shadow-2xl border-4 border-white relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-br from-yellow-300 to-orange-500 p-6 rounded-[32px] shadow-2xl shadow-orange-200 border-4 border-white">
                    <Trophy className="w-12 h-12 text-white fill-current" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-2 rounded-full shadow-lg">
                    <Crown className="w-5 h-5" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 mt-12 mb-1 tracking-tight">ยินดีด้วย! {nickname}</h2>
                <p className="text-slate-500 mb-6 font-medium">คุณทำคะแนนได้ยอดเยี่ยมมาก</p>
                
                <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">คะแนนรวมของคุณ</p>
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">{score}</p>
                </div>

                {/* Leaderboard Section */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-slate-100 p-6 mb-8 shadow-inner">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Medal className="text-orange-400 w-4 h-4" />
                    อันดับสูงสุดในตอนนี้
                  </h3>

                  <div className="space-y-3">
                    {leaderboard.map((player, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                          player.name === nickname ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "bg-white/50 border border-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                            index === 0 ? "bg-yellow-400 text-white" : "bg-slate-200 text-slate-500"
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-bold text-sm">{player.name}</span>
                        </div>
                        <span className="font-black text-sm">{player.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setView("home")}
                    className="flex items-center justify-center gap-2 py-4 bg-white text-slate-600 font-black rounded-2xl shadow-md border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <Home className="w-5 h-5" />
                    หน้าแรก
                  </button>
                  <button
                    onClick={startGame}
                    className="flex items-center justify-center gap-2 py-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white font-black rounded-2xl shadow-lg shadow-purple-200 hover:shadow-xl active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    เล่นอีกครั้ง
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
