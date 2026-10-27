import React, { useState } from 'react';
import { playCyberClick, playCyberSuccess } from '../../../../lib/audioSynth';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export function CyberpunkMinigame() {
  const questions: Question[] = [
    {
      id: 1,
      question: 'Cô dâu và Chú rể đã gặp nhau lần đầu tiên ở đâu?',
      options: ['Quán Cafe Công Nghệ', 'Thư Viện Đại Học', 'Triển Lãm Nghệ Thuật 3D', 'Chuyến Du Lịch Đà Lạt'],
      correctIndex: 0,
      hint: 'Nơi có hương vị cafe đậm đà và không gian yên tĩnh!',
    },
    {
      id: 2,
      question: 'Món ăn yêu thích nhất mà hai người thường cùng nhau thưởng thức?',
      options: ['Bún Đậu Mắm Tôm', 'Phở Bò Hà Nội', 'Lẩu Nấm Băng Chuyền', 'Pizza Hải Sản'],
      correctIndex: 1,
      hint: 'Món ăn truyền thống nức tiếng đất Hà Thành!',
    },
    {
      id: 3,
      question: 'Chú rể đã tỏ tình cô dâu vào thời điểm đặc biệt nào?',
      options: ['Đêm Giao Thừa Đón Năm Mới', 'Ngày Sinh Nhật Cô Dâu', 'Chuyến Du Lịch Biển Hoàng Hôn', 'Ngày Kỷ Niệm 1 Năm Quen Nhau'],
      correctIndex: 0,
      hint: 'Khoảnh khắc pháo hoa rực rỡ chào năm mới!',
    },
    {
      id: 4,
      question: 'Địa điểm hai người mong muốn đi hưởng tuần trăng mật nhất?',
      options: ['Đảo Phú Quốc', 'Nhật Bản Mùa Hoa Anh Đào', 'Thụy Sĩ Mùa Tuyết Trắng', 'Paris Nước Pháp'],
      correctIndex: 1,
      hint: 'Xứ sở Phù Tang rực rỡ sắc hồng!',
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (optionIndex: number) => {
    playCyberClick();
    const q = questions[currentStep];
    const isCorrect = optionIndex === q.correctIndex;
    const newAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(newAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 25);
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      playCyberSuccess();
      setIsCompleted(true);
    }
  };

  const handleResetGame = () => {
    playCyberClick();
    setCurrentStep(0);
    setScore(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };

  return (
    <section className="relative py-20 px-6 bg-[#050714] text-slate-100 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono text-pink-400 border border-pink-500/30 uppercase bg-pink-950/30">
            MINI GAME TƯƠNG TÁC (GEN Z LOVE QUEST)
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono uppercase text-white tracking-tight holo-glitch">
            THỬ THÁCH HIỂU Ý CẶP ĐÔI
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Khám phá 4 câu hỏi bí mật về cô dâu & chú rể để tích lũy điểm thưởng Love Points!
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-cyan-400 mx-auto rounded-full" />
        </div>

        {/* Game Box */}
        <div className="bg-[#0B1026]/90 backdrop-blur-2xl border border-pink-500/40 rounded-3xl p-6 md:p-10 space-y-8 shadow-[0_0_40px_rgba(255,0,122,0.15)] relative">
          {/* Progress Bar & Score Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/20 pb-4 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-pink-400 font-bold">CÂU HỎI {currentStep + 1}/4</span>
              <div className="w-24 bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-pink-500 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-pink-950/60 border border-pink-500/30 px-3 py-1 rounded-full text-pink-300">
              <span>💖 TỔNG ĐIỂM:</span>
              <span className="text-sm font-bold text-white tabular-nums">{score} PTS</span>
            </div>
          </div>

          {!isCompleted ? (
            <div className="space-y-6">
              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-mono font-bold text-white">
                  {questions[currentStep].question}
                </h3>
                <p className="text-xs text-slate-400 italic">
                  💡 Gợi ý: {questions[currentStep].hint}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-pink-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-left font-mono text-xs text-slate-200 hover:text-white transition-all duration-200 flex items-center space-x-3 group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-pink-950/80 border border-pink-500/40 text-pink-400 flex items-center justify-center font-bold shrink-0 group-hover:border-cyan-400 group-hover:text-cyan-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Game Completed Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-pink-500/20 border-2 border-pink-400 text-pink-400 flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_rgba(255,0,122,0.4)] animate-bounce">
                👑
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-mono font-bold text-white uppercase">
                  HOÀN THÀNH LOVE QUEST!
                </h3>
                <p className="text-sm font-mono text-cyan-300">
                  Bạn đạt tổng số điểm: <strong className="text-pink-400 text-xl">{score}/100 PTS</strong>
                </p>
                <p className="text-xs font-sans text-slate-300 max-w-md mx-auto font-light">
                  Cảm ơn quý khách đã đồng hành và khám phá những cột mốc kỷ niệm tuyệt vời cùng Minh Anh & Ngọc Mai!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetGame}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  ⚡ CHƠI LẠI MINI GAME
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
