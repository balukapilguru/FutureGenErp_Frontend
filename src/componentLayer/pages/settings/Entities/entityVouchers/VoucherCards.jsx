import { useLoaderData } from 'react-router-dom';
import React, { useState } from "react";
import { FaGraduationCap } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import { SiTarget } from 'react-icons/si';
import { BiCalendar, BiMedal } from 'react-icons/bi';

// import tekslogo from '../../assets/images/'

const VoucherCard = ({
  data,
  variant = 'percent',
  watermark = "FUTUREGEN",
  watermarkDesign = 'diploma',
  watermarkOpacity = 0.15
}) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isAmount = data.valueType === 'amount';
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(data.amount || 0);

  const displayValue = isAmount ? formattedAmount : `${data.percentage}%`;
  const displayLabel = isAmount ? 'Course Credit' : 'Scholarship';

  const variants = {
    percent: "bg-danger text-white",
    amount: "bg-primary text-white",
  };

  const getIcon = () => {
    return variant === 'percent'
      ? <GiSparkles className="w-5 h-5 text-white" />
      : <SiTarget className="w-5 h-5 text-white" />;
  };

  const renderWatermark = () => {
    const baseStyle = "position-absolute w-100 h-100 d-flex justify-content-center align-items-center";
    const style = { opacity: watermarkOpacity };

    switch (watermarkDesign) {
      case 'diploma':
        return (
          <div className="position-absolute" style={style}>
            <div className="d-flex justify-content-center align-items-center position-relative w-100 h-100 border border-white rounded-circle">
              <FaGraduationCap className="w-32 h-32 text-white" />
              <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center border-2 border-dashed border-white/40 rounded-circle scale-90"></div>
              <span className="position-absolute text-uppercase font-weight-bold text-white px-4">OFFICIAL • {watermark}</span>
            </div>
          </div>
        );
      case 'academic':
        return (
          <div className={baseStyle} style={style}>
            <div className="d-grid gap-3">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="d-flex flex-column align-items-center">
                  {/* <img src={tekslogo} alt="" className="w-18 h-18" /> */}
                  <span className="text-uppercase text-white">{watermark}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'scholarship':
        return (
          <div className={baseStyle} style={style}>
            <div className="w-100 h-24 bg-white/10 rotate-[-25deg] d-flex justify-content-around">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="d-flex align-items-center gap-4">
                  <BiMedal className="w-10 h-10" />
                  {/* <img src={tekslogo} alt="" className="w-10 h-10" /> */}
                  <span className="text-4xl text-uppercase font-weight-bold text-white">{watermark}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'stamp':
      default:
        return (
          <div className={baseStyle} style={style}>
            <span className="text-10xl font-weight-bold text-uppercase text-white">{watermark}</span>
          </div>
        );
    }
  };

  return (
    <div className={`relative flex flex-col md:flex-row w-full border rounded-2xl overflow-hidden transition-all shadow-lg ${variants[variant] || variants.percent}`}>
      {renderWatermark()}

      {/* Left Section */}
      <div className={`d-flex flex-column justify-content-center p-3 ${variant === 'percent' ? 'border-end border-white/40' : 'border-end border-white/30'}`}>
        <div className="text-center">
          <span className="text-muted text-uppercase font-weight-bold mb-1">{displayLabel}</span>
          <h2 className="text-3xl font-weight-bold">{displayValue}</h2>
          <p className="text-muted font-weight-bold text-uppercase">Limited Offer</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between mb-4">
          <div className="min-w-0">
            <h3 className="h5 d-flex align-items-center gap-2 text-uppercase">
              {getIcon()}
              {'Special Offer'}
            </h3>
            {data.voucherDescription ? (
              <p className="text-muted text-xs mt-1">{data.voucherDescription}</p>
            ) : (
              <p className="text-muted text-xs mt-1">Authorized benefit</p>
            )}
            <div className="d-flex align-items-center gap-2 mt-3 text-muted">
              <BiCalendar className="w-3.5 h-3.5" />
              <span className="text-xs font-weight-bold text-uppercase">
                Expires: {formatDate(data.validity_end_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Code Redemption Area */}
        <div className={`d-flex justify-content-between p-3 rounded-xl border-2 ${variant === 'percent' ? 'bg-white/10 border-white/20' : 'bg-black/15 border-white/20'}`}>
          <div className="d-flex flex-column">
            <span className="text-xs font-weight-bold text-uppercase text-muted">Coupon Code</span>
            <span className="font-mono text-lg font-weight-bold text-uppercase truncate">
              {data.voucherCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VoucherGrid = ({ items, loading }) => {

  const designs = [
    'diploma',
    'scholarship',
    'academic'
  ];

  const SkeletonCard = () => (
    <div className="relative flex flex-col md:flex-row w-full h-180px border rounded-2xl overflow-hidden bg-white border-slate-200 animate-pulse">
      <div className="d-flex flex-column justify-content-center p-8 md:w-1/3 border-end">
        <div className="w-12 h-3 bg-slate-100 rounded mb-2" />
        <div className="w-20 h-8 bg-slate-100 rounded" />
        <div className="w-16 h-3 bg-slate-100 rounded mt-3" />
      </div>
      <div className="flex-1 p-6 flex flex-column justify-between">
        <div className="space-y-3">
          <div className="d-flex gap-2 align-items-center">
            <div className="w-6 h-6 rounded-circle bg-slate-100" />
            <div className="w-32 h-5 bg-slate-100 rounded" />
          </div>
          <div className="w-full h-3 bg-slate-100 rounded" />
          <div className="w-24 h-3 bg-slate-100 rounded" />
        </div>
        <div className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl mt-4" />
      </div>
    </div>
  );

  const VoucherLoadingGrid = () => (
    <div className="d-flex gap-3 p-2">
      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  return (
    <div className={`d-grid gap-4 ${loading !== "loading" ? "lg:grid-cols-2 xl:grid-cols-3" : ""}`}>
      {loading === "loading" ?
        <VoucherLoadingGrid />
        : items?.map((voucher, index) => {
          const selectedVariant = voucher.valueType === 'amount' ? 'amount' : 'percent';
          return (
            <VoucherCard
              key={index}
              data={voucher}
              variant={selectedVariant}
              watermarkDesign={designs[Math.floor(Math.random() * designs.length)]}
            />
          );
        })}

    </div>
  );
};
