import React from 'react';
import { WeddingData, BankAccount } from '../../types';
import { CreditCard, QrCode, Sparkles } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { ImageUploadField } from '../common/ImageUploadField';

interface GiftTabProps {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
}

export function GiftTab({ data, onChange }: GiftTabProps) {
  const { showToast } = useToast();

  const updateBank = (role: 'groomBank' | 'brideBank', updated: BankAccount) => {
    onChange({
      ...data,
      gift: {
        ...data.gift,
        [role]: updated,
      },
    });
  };

  const handleGenerateVietQR = (role: 'groomBank' | 'brideBank') => {
    const bank = data.gift[role];
    if (!bank?.accountNumber) {
      showToast('Vui lòng nhập số tài khoản trước', 'error');
      return;
    }

    // Map common bank names to VietQR shortcodes
    const bankMap: Record<string, string> = {
      vcb: 'vietcombank',
      vietcombank: 'vietcombank',
      tcb: 'techcombank',
      techcombank: 'techcombank',
      mb: 'mbbank',
      mbbank: 'mbbank',
      acb: 'acb',
      bidv: 'bidv',
      vpb: 'vpbank',
      vpbank: 'vpbank',
      tpbank: 'tpbank',
      tpb: 'tpbank',
      viettin: 'vietinbank',
      vietinbank: 'vietinbank',
    };

    const queryKey = bank.bankName.toLowerCase().replace(/[^a-z]/g, '');
    const bankCode = bankMap[queryKey] || 'vietcombank';
    const accNumber = bank.accountNumber.trim().replace(/\s+/g, '');
    const holder = encodeURIComponent(bank.accountHolder || '');
    const memo = encodeURIComponent(`Mung cuoi ${data.groomName} ${data.brideName}`);

    const generatedUrl = `https://img.vietqr.io/image/${bankCode}-${accNumber}-compact2.png?amount=0&addInfo=${memo}&accountName=${holder}`;

    updateBank(role, {
      ...bank,
      qrCodeUrl: generatedUrl,
    });

    showToast('Đã tự động tạo mã VietQR chuẩn ngân hàng!', 'success');
  };

  const renderBankForm = (role: 'groomBank' | 'brideBank', title: string) => {
    const bank = data.gift?.[role] || {
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      qrCodeUrl: '',
    };

    return (
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-semibold font-serif-title text-neutral-900">
              Tài Khoản {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleGenerateVietQR(role)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#D4AF37]/15 text-[#8C7335] hover:bg-[#D4AF37]/25 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo VietQR tự động</span>
          </button>
        </div>

        <div>
          <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
            Tên ngân hàng
          </label>
          <input
            type="text"
            value={bank.bankName}
            onChange={(e) => updateBank(role, { ...bank, bankName: e.target.value })}
            placeholder="VD: Vietcombank, Techcombank, MBBank..."
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
            Chủ tài khoản
          </label>
          <input
            type="text"
            value={bank.accountHolder}
            onChange={(e) => updateBank(role, { ...bank, accountHolder: e.target.value.toUpperCase() })}
            placeholder="VD: NGUYEN VAN A"
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none uppercase"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
            Số tài khoản
          </label>
          <input
            type="text"
            value={bank.accountNumber}
            onChange={(e) => updateBank(role, { ...bank, accountNumber: e.target.value })}
            placeholder="VD: 1012345678"
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none font-mono"
          />
        </div>

        <ImageUploadField
          id={`qr-upload-${role}`}
          label="Mã QR Chuyển Khoản Mừng Cưới"
          value={bank.qrCodeUrl}
          onChange={(newQr) => updateBank(role, { ...bank, qrCodeUrl: newQr })}
          shape="qr"
          helperText="Chọn ảnh chụp màn hình mã QR ngân hàng trong máy của bạn, hoặc dùng nút 'Tạo VietQR Tự Động' ở trên."
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 font-body">
      {/* Greeting message */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
          Lời nhắn phần mừng cưới (Lời cảm tạ)
        </label>
        <textarea
          rows={2}
          value={data.gift.message || ''}
          onChange={(e) =>
            onChange({
              ...data,
              gift: { ...data.gift, message: e.target.value },
            })
          }
          className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderBankForm('groomBank', 'Chú Rể')}
        {renderBankForm('brideBank', 'Cô Dâu')}
      </div>
    </div>
  );
}
