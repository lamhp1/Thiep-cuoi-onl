import React from 'react';
import { WeddingData, CouplePerson } from '../../types';
import { User, Heart } from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';
import { slugifyVietnamese } from '../../services/siteConfigService';

interface CoupleTabProps {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
}

export function CoupleTab({ data, onChange }: CoupleTabProps) {
  const updatePerson = (role: 'groom' | 'bride', updated: CouplePerson) => {
    const isGroom = role === 'groom';
    const fullName = updated.fullName;
    const shortName = updated.name?.trim() || (fullName ? fullName.trim().split(' ').filter(Boolean).pop() : '') || '';

    const newGroom = isGroom ? fullName : (data.groom?.fullName || data.groomName || '');
    const newBride = !isGroom ? fullName : (data.bride?.fullName || data.brideName || '');

    const currentSlug = data.slug || '';
    const isDefaultSlug =
      !currentSlug ||
      currentSlug === 'minh-anh' ||
      currentSlug === 'wedding' ||
      currentSlug.includes('mai-van-hien') ||
      currentSlug.includes('nguyen-hong-nhung') ||
      currentSlug === 'chu-re-co-dau';

    let updatedSlug = currentSlug;
    if (isDefaultSlug && newGroom && newBride && newGroom !== 'Chú Rể' && newBride !== 'Cô Dâu') {
      const gen = slugifyVietnamese(`${newGroom}-${newBride}`);
      if (gen) updatedSlug = gen;
    }

    onChange({
      ...data,
      slug: updatedSlug,
      id: updatedSlug !== currentSlug ? `wedding-${updatedSlug}` : data.id,
      groomName: newGroom,
      brideName: newBride,
      groom: isGroom
        ? { ...updated, fullName, name: shortName || updated.name }
        : data.groom,
      bride: !isGroom
        ? { ...updated, fullName, name: shortName || updated.name }
        : data.bride,
    });
  };

  const renderPersonForm = (role: 'groom' | 'bride', title: string) => {
    const person = data[role];

    return (
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#8C7335]">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold font-serif-title text-neutral-900">
            Thông Tin {title}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Họ và tên đầy đủ (Hiển thị trang trọng & thiệp chính)
            </label>
            <input
              type="text"
              value={person.fullName}
              placeholder={role === 'groom' ? 'Nguyễn Minh Anh' : 'Trần Ngọc Mai'}
              onChange={(e) => {
                const newFull = e.target.value;
                const derivedShort = newFull.trim().split(' ').filter(Boolean).pop() || '';
                updatePerson(role, {
                  ...person,
                  fullName: newFull,
                  name: derivedShort || person.name,
                });
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Tên gọi ngắn (Chữ lồng)
            </label>
            <input
              type="text"
              value={person.name}
              placeholder={role === 'groom' ? 'Minh Anh' : 'Ngọc Mai'}
              onChange={(e) => updatePerson(role, { ...person, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
            />
          </div>
        </div>

        <ImageUploadField
          id={`avatar-upload-${role}`}
          label={`Ảnh đại diện ${role === 'groom' ? 'Chú rể' : 'Cô dâu'}`}
          value={person.avatar}
          onChange={(newAvatar) => updatePerson(role, { ...person, avatar: newAvatar })}
          shape="circle"
          helperText="Chọn ảnh chân dung hoặc ảnh cưới chụp cận cảnh từ máy tính hoặc điện thoại."
        />

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
            Lời giới thiệu (Bio)
          </label>
          <textarea
            rows={3}
            value={person.bio}
            onChange={(e) => updatePerson(role, { ...person, bio: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none resize-none"
          />
        </div>

        {/* Parents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Họ tên Bố
            </label>
            <input
              type="text"
              value={person.parents?.father || ''}
              onChange={(e) =>
                updatePerson(role, {
                  ...person,
                  parents: {
                    father: e.target.value,
                    mother: person.parents?.mother || '',
                  },
                })
              }
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Họ tên Mẹ
            </label>
            <input
              type="text"
              value={person.parents?.mother || ''}
              onChange={(e) =>
                updatePerson(role, {
                  ...person,
                  parents: {
                    father: person.parents?.father || '',
                    mother: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>

        {/* Socials & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Facebook Link
            </label>
            <input
              type="url"
              value={person.socials?.facebook || ''}
              onChange={(e) =>
                updatePerson(role, {
                  ...person,
                  socials: { ...person.socials, facebook: e.target.value },
                })
              }
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={person.socials?.phone || ''}
              onChange={(e) =>
                updatePerson(role, {
                  ...person,
                  socials: { ...person.socials, phone: e.target.value },
                })
              }
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-body">
      {renderPersonForm('groom', 'Chú Rể')}
      {renderPersonForm('bride', 'Cô Dâu')}
    </div>
  );
}
