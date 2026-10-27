import React from 'react';
import { motion } from 'motion/react';
import { CouplePerson } from '../../../../types';
import { Heart, Facebook, Instagram, Phone } from 'lucide-react';
import { LoveLetterWashiTape, BotanicalSketch } from './LoveLetterOrnaments';

interface LoveLetterCoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
}

export function LoveLetterCoupleSection({
  groom,
  bride,
}: LoveLetterCoupleSectionProps) {
  const groomAvatar =
    groom?.avatar ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
  const brideAvatar =
    bride?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="couple" className="relative py-16 sm:py-20 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#C8A96B]/35 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
          <Heart className="w-3 h-3 fill-current text-[#7A2638]" />
          <span>THE AUTHORS</span>
        </div>
        <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] tracking-tight">
          Và Đây Là Hai Người Viết Bức Thư Này
        </h2>
        <p className="font-handwriting text-xl sm:text-2xl text-[#7A2638] mt-2">
          Hai tâm hồn, một hành trình yêu thương bất tận
        </p>
      </div>

      {/* Couple Polaroid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-start">
        {/* GROOM POLAROID */}
        <motion.div
          initial={{ opacity: 0, y: -80, rotate: -8 }}
          whileInView={{ opacity: 1, y: 0, rotate: -2 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 14,
            mass: 0.9,
            delay: 0.1,
          }}
          className="relative bg-[#FFFDF8] p-4 sm:p-5 pb-8 sm:pb-10 rounded-2xl border border-[#C8A96B]/35 shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center text-center"
          style={{
            boxShadow: '0 15px 35px -10px rgba(89,72,62,0.18)',
          }}
        >
          {/* Washi Tape Pinning */}
          <LoveLetterWashiTape className="-top-3 left-1/2 -translate-x-1/2" color="beige" angle={-2} />

          {/* Photo Frame */}
          <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#F7F1E7] border border-[#C8A96B]/20 relative shadow-inner">
            <img
              src={groomAvatar}
              alt={groom?.fullName || 'Chú rể'}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          {/* Handwritten Caption */}
          <div className="w-full mt-5 px-2">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C8A96B] font-semibold uppercase block">
              CHÚ RỂ
            </span>
            <h3 className="font-handwriting text-3xl sm:text-4xl font-bold text-[#59483E] mt-0.5">
              {groom?.fullName || groom?.name || 'Chú Rể'}
            </h3>
            <p className="font-handwriting text-xl text-[#7A2638] mt-0.5">
              {groom?.name ? `"${groom.name}"` : 'Tác giả bức thư'}
            </p>

            <p className="text-base sm:text-lg text-[#59483E]/85 font-handwriting leading-relaxed mt-2 max-w-sm mx-auto">
              {groom?.bio ||
                'Người luôn kiên nhẫn lắng nghe, thấu hiểu và mang lại sự bình yên, chở che cho cô dâu trong từng ngày bình dị.'}
            </p>

            {/* Parents Info */}
            {groom?.parents && (groom.parents.father || groom.parents.mother) && (
              <div className="mt-4 pt-3 border-t border-[#C8A96B]/20 text-[11px] text-[#59483E]/70 space-y-0.5">
                {groom.parents.father && <div>Thân phụ: {groom.parents.father}</div>}
                {groom.parents.mother && <div>Thân mẫu: {groom.parents.mother}</div>}
              </div>
            )}

            {/* Socials */}
            <div className="mt-4 flex items-center justify-center gap-3 text-[#7A2638]">
              {groom?.socials?.facebook && (
                <a
                  href={groom.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#F7F1E7] hover:bg-[#EADECE] transition-colors"
                  aria-label="Facebook chú rể"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {groom?.socials?.instagram && (
                <a
                  href={groom.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#F7F1E7] hover:bg-[#EADECE] transition-colors"
                  aria-label="Instagram chú rể"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {groom?.socials?.phone && (
                <a
                  href={`tel:${groom.socials.phone}`}
                  className="p-2 rounded-full bg-[#F7F1E7] hover:bg-[#EADECE] transition-colors"
                  aria-label="Gọi điện chú rể"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* BRIDE POLAROID */}
        <motion.div
          initial={{ opacity: 0, y: -80, rotate: 8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 2 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 14,
            mass: 0.9,
            delay: 0.28, // 180ms delay for staggered fall
          }}
          className="relative bg-[#FFFDF8] p-4 sm:p-5 pb-8 sm:pb-10 rounded-2xl border border-[#C8A96B]/35 shadow-xl hover:shadow-2xl transition-shadow flex flex-col items-center text-center"
          style={{
            boxShadow: '0 15px 35px -10px rgba(89,72,62,0.18)',
          }}
        >
          {/* Washi Tape Pinning */}
          <LoveLetterWashiTape className="-top-3 left-1/2 -translate-x-1/2" color="dusty-rose" angle={2} />

          {/* Photo Frame */}
          <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#F7F1E7] border border-[#C8A96B]/20 relative shadow-inner">
            <img
              src={brideAvatar}
              alt={bride?.fullName || 'Cô dâu'}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          {/* Handwritten Caption */}
          <div className="w-full mt-5 px-2">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C8A96B] font-semibold uppercase block">
              CÔ DÂU
            </span>
            <h3 className="font-handwriting text-3xl sm:text-4xl font-bold text-[#59483E] mt-0.5">
              {bride?.fullName || bride?.name || 'Cô Dâu'}
            </h3>
            <p className="font-handwriting text-xl text-[#7A2638] mt-0.5">
              {bride?.name ? `"${bride.name}"` : 'Tác giả bức thư'}
            </p>

            <p className="text-base sm:text-lg text-[#59483E]/85 font-handwriting leading-relaxed mt-2 max-w-sm mx-auto">
              {bride?.bio ||
                'Tâm hồn dịu dàng, ấm áp, thích lưu giữ những khoảnh khắc giản đơn và cùng chú rể vun đắp ước mơ chung đôi.'}
            </p>

            {/* Parents Info */}
            {bride?.parents && (bride.parents.father || bride.parents.mother) && (
              <div className="mt-4 pt-3 border-t border-[#C8A96B]/20 text-[11px] text-[#59483E]/70 space-y-0.5">
                {bride.parents.father && <div>Thân phụ: {bride.parents.father}</div>}
                {bride.parents.mother && <div>Thân mẫu: {bride.parents.mother}</div>}
              </div>
            )}

            {/* Socials */}
            <div className="mt-4 flex items-center justify-center gap-3 text-[#7A2638]">
              {bride?.socials?.facebook && (
                <a
                  href={bride.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#F7F1E7] hover:bg-[#EADECE] transition-colors"
                  aria-label="Facebook cô dâu"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {bride?.socials?.instagram && (
                <a
                  href={bride.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#F7F1E7] hover:bg-[#EADECE] transition-colors"
                  aria-label="Instagram cô dâu"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {bride?.socials?.phone && (
                <a
                  href={`tel:${bride.socials.phone}`}
                  className="p-2 rounded-full bg-[#F7F1E7] hover:bg-[#EADECE] transition-colors"
                  aria-label="Gọi điện cô dâu"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
