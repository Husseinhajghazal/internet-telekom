"use client";

import React, { useEffect, useState } from "react";
import { Field } from "formik";
import { MdPhoneInTalk } from "react-icons/md";
import { TbFileInvoiceFilled } from "react-icons/tb";
import FormFieldBlock from "../FormFieldBlock";
import StepHeader from "../StepHeader";
import LottieAnimation from "../LottieAnimation";

const Step6 = ({ values, errors, touched, setFieldValue }) => {
  const isInquiry = values.serviceType === "inquiry";
  const hasSavedInvoice = Boolean(values.invoiceFileUrl);
  const hasNewInvoice = Boolean(values.invoiceFile);
  const showInvoicePreview = hasNewInvoice || hasSavedInvoice;

  const [turkeyData, setTurkeyData] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  const buildAddressString = ({
    addressProvinceName,
    addressDistrictName,
    addressNeighborhoodName,
    addressStreetName,
    addressOutsideDoorNo,
    addressInsideDoorNo,
  }) => {
    const outsideDoorNo = String(addressOutsideDoorNo ?? "").trim();
    const insideDoorNo = String(addressInsideDoorNo ?? "").trim();

    if (
      !addressProvinceName ||
      !addressDistrictName ||
      !addressNeighborhoodName ||
      !addressStreetName ||
      outsideDoorNo.length === 0
    ) {
      return "";
    }

    const insidePart = insideDoorNo
      ? `, iç kapı no: ${insideDoorNo}`
      : "";

    return `${addressProvinceName}, ${addressDistrictName}, ${addressNeighborhoodName}, ${addressStreetName}, bina no: ${outsideDoorNo}${insidePart}`;
  };

  useEffect(() => {
    if (isInquiry) return;

    let active = true;
    import("turkey_province_image")
      .then((mod) => {
        if (!active) return;
        const data = mod?.default ?? mod;
        setTurkeyData(data);
        setCities(data.getAllCities());
      })
      .catch(() => {
        if (!active) return;
        setCities([]);
      });

    return () => {
      active = false;
    };
  }, [isInquiry]);

  useEffect(() => {
    if (!turkeyData || isInquiry) return;
    const cityCode = values.addressProvinceCode;
    if (!cityCode) {
      setDistricts([]);
      return;
    }
    setDistricts(turkeyData.getDistrictsByCity(cityCode));
  }, [turkeyData, values.addressProvinceCode, isInquiry]);

  useEffect(() => {
    if (!turkeyData || isInquiry) return;
    const districtCode = values.addressDistrictCode;
    if (!districtCode) {
      setNeighborhoods([]);
      return;
    }
    setNeighborhoods(turkeyData.getNeighborhoodsByDistrict(districtCode));
  }, [turkeyData, values.addressDistrictCode, isInquiry]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title="أكمل إدخال معلوماتك"
        subTitle="يرجى إكمال البيانات المطلوبة لمعالجة طلبك"
      >
        <LottieAnimation
          path="/animations/registration.json"
          width={150}
          height={150}
          className="inline-block"
        />
      </StepHeader>

      <div className="space-y-4 md:space-y-8 md:px-6">
        {!isInquiry && (
          <>
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 text-right">
                اختر عنوانك
              </h3>
              <p className="text-sm text-gray-500 text-right">
                الولاية، المنطقة، المحلة، الشارع، رقم البناء، رقم الشقة
              </p>
            </div>

            {errors.address && touched.address && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-right text-red-800 text-sm">
                {errors.address}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldBlock
                label="الولاية"
                name="addressProvinceCode"
              >
                <select
                  name="addressProvinceCode"
                  id="addressProvinceCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressProvinceCode && touched.addressProvinceCode ? "border-red-500" : "border-gray-300"
                  }`}
                  value={values.addressProvinceCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const city = cities.find((c) => String(c.cityCode) === String(code));
                    setFieldValue("addressProvinceCode", code);
                    setFieldValue("addressProvinceName", city?.cityName || "");

                    setFieldValue("addressDistrictCode", "");
                    setFieldValue("addressDistrictName", "");
                    setFieldValue("addressNeighborhoodCode", "");
                    setFieldValue("addressNeighborhoodName", "");
                    setFieldValue("addressStreetCode", "");
                    setFieldValue("addressStreetName", "");
                    setFieldValue("addressOutsideDoorNo", "");
                    setFieldValue("addressInsideDoorNo", "");
                    setFieldValue("address", "");
                  }}
                >
                  <option value="">يرجى اختيار الولاية</option>
                  {cities.map((c) => (
                    <option key={c.cityCode} value={c.cityCode}>
                      {c.cityName}
                    </option>
                  ))}
                </select>
              </FormFieldBlock>

              <FormFieldBlock
                label="المنطقة"
                name="addressDistrictCode"
              >
                <select
                  disabled={!values.addressProvinceCode}
                  name="addressDistrictCode"
                  id="addressDistrictCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressDistrictCode && touched.addressDistrictCode ? "border-red-500" : "border-gray-300"
                  }`}
                  value={values.addressDistrictCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const district = districts.find(
                      (d) => String(d.districtCode) === String(code),
                    );
                    setFieldValue("addressDistrictCode", code);
                    setFieldValue(
                      "addressDistrictName",
                      district?.districtName || "",
                    );

                    setFieldValue("addressNeighborhoodCode", "");
                    setFieldValue("addressNeighborhoodName", "");
                    setFieldValue("addressStreetCode", "");
                    setFieldValue("addressStreetName", "");
                    setFieldValue("addressOutsideDoorNo", "");
                    setFieldValue("addressInsideDoorNo", "");
                    setFieldValue("address", "");
                  }}
                >
                  <option value="">يرجى اختيار المنطقة</option>
                  {districts.map((d) => (
                    <option key={d.districtCode} value={d.districtCode}>
                      {d.districtName}
                    </option>
                  ))}
                </select>
              </FormFieldBlock>

              <FormFieldBlock
                label="المحلة"
                name="addressDistrictCode"
              >
                <select
                  disabled={!values.addressDistrictCode}
                  name="addressNeighborhoodCode"
                  id="addressNeighborhoodCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressNeighborhoodCode && touched.addressNeighborhoodCode ? "border-red-500" : "border-gray-300"
                  }`}
                  value={values.addressNeighborhoodCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const nh = neighborhoods.find(
                      (n) => String(n.neighborhoodCode) === String(code),
                    );
                    setFieldValue("addressNeighborhoodCode", code);
                    setFieldValue(
                      "addressNeighborhoodName",
                      nh?.neighborhoodName || "",
                    );

                    setFieldValue("addressStreetCode", "");
                    setFieldValue("addressStreetName", "");
                    setFieldValue("addressOutsideDoorNo", "");
                    setFieldValue("addressInsideDoorNo", "");
                    setFieldValue("address", "");
                  }}
                >
                  <option value="">يرجى اختيار المحلة</option>
                  {neighborhoods.map((n) => (
                    <option key={n.neighborhoodCode} value={n.neighborhoodCode}>
                      {n.neighborhoodName}
                    </option>
                  ))}
                </select>
              </FormFieldBlock>

              <FormFieldBlock
                label="الشارع"
                name="addressStreetName"
              >
                <Field
                  type="text"
                  name="addressStreetName"
                  id="addressStreetName"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressStreetName && touched.addressStreetName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="اكتب اسم الشارع"
                  onChange={(e) => {
                    const streetName = e.target.value;
                    setFieldValue("addressStreetCode", "");
                    setFieldValue("addressStreetName", streetName);

                    const nextAddress = buildAddressString({
                      addressProvinceName: values.addressProvinceName,
                      addressDistrictName: values.addressDistrictName,
                      addressNeighborhoodName: values.addressNeighborhoodName,
                      addressStreetName: streetName,
                      addressOutsideDoorNo: values.addressOutsideDoorNo,
                      addressInsideDoorNo: values.addressInsideDoorNo,
                    });
                    setFieldValue("address", nextAddress);
                  }}
                />
              </FormFieldBlock>

              <FormFieldBlock
                label="رقم البناء"
                name="addressOutsideDoorNo"
              >
                <Field
                  type="text"
                  name="addressOutsideDoorNo"
                  id="addressOutsideDoorNo"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressOutsideDoorNo && touched.addressOutsideDoorNo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="اكتب رقم البناء"
                  onChange={(e) => {
                    const nextOutside = e.target.value;
                    setFieldValue("addressOutsideDoorNo", nextOutside);

                    const nextAddress = buildAddressString({
                      addressProvinceName: values.addressProvinceName,
                      addressDistrictName: values.addressDistrictName,
                      addressNeighborhoodName: values.addressNeighborhoodName,
                      addressStreetName: values.addressStreetName,
                      addressOutsideDoorNo: nextOutside,
                      addressInsideDoorNo: values.addressInsideDoorNo,
                    });
                    setFieldValue("address", nextAddress);
                  }}
                />
              </FormFieldBlock>

              <FormFieldBlock
                label="رقم الشقة"
                name="addressInsideDoorNo"
              >
                <Field
                  type="text"
                  name="addressInsideDoorNo"
                  id="addressInsideDoorNo"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressInsideDoorNo && touched.addressInsideDoorNo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="اكتب رقم الباب الداخلي (الشقة)"
                  onChange={(e) => {
                    const nextInside = e.target.value;
                    setFieldValue("addressInsideDoorNo", nextInside);

                    const nextAddress = buildAddressString({
                      addressProvinceName: values.addressProvinceName,
                      addressDistrictName: values.addressDistrictName,
                      addressNeighborhoodName: values.addressNeighborhoodName,
                      addressStreetName: values.addressStreetName,
                      addressOutsideDoorNo: values.addressOutsideDoorNo,
                      addressInsideDoorNo: nextInside,
                    });
                    setFieldValue("address", nextAddress);
                  }}
                />
              </FormFieldBlock>
            </div>
          </>
        )}

        {values?.serviceType === "services" &&
              <FormFieldBlock
                label="شركة الأنترنت"
                name="internetCompany"
              >
                <Field
                  type="text"
                  name="internetCompany"
                  id="internetCompany"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.internetCompany && touched.internetCompany ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="اكتب اسم شركة الأنترنت التي تستخدمها حالياً"
                />
              </FormFieldBlock>
}
        {values?.serviceType === "services" &&
              <FormFieldBlock
                label="رقم أشتراك او فاتورة الأنترنت"
                name="subscriptionNo"
              >
                <Field
                  type="text"
                  name="subscriptionNo"
                  id="subscriptionNo"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.subscriptionNo && touched.subscriptionNo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="رقم أشتراك او فاتورة الأنترنت"
                />
              </FormFieldBlock>
}

        <FormFieldBlock
          label="ملاحظة إضافية (اختياري)"
          labelClassName="md:text-lg"
          wrapperClassName="space-y-4"
        >
          <Field
            as="textarea"
            name="note"
            id="note"
            rows={3}
            className="w-full outline-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right resize-none"
            placeholder="اكتب هنا اي ملاحظات اخرى تريد اضافتها لنا..."
          />
        </FormFieldBlock>

        {!isInquiry && (
          <div className="space-y-4">
          <label className="block text-right text-gray-700 font-medium md:text-lg">
            أرفق صورة عن عنوانك (عقد ايجار, أو فاتورة ماء أو فاتورة غاز, أو فاتورة كهرباء...)
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${
              showInvoicePreview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-[#18a2e3] hover:bg-blue-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-[#18a2e3]", "bg-blue-50");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              if (!showInvoicePreview) {
                e.currentTarget.classList.remove(
                  "border-[#18a2e3]",
                  "bg-blue-50",
                );
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) {
                setFieldValue("invoiceFile", file);
              }
              e.currentTarget.classList.remove(
                "border-[#18a2e3]",
                "bg-blue-50",
              );
            }}
            onClick={() => {
              if (!showInvoicePreview) {
                document.getElementById("invoice-upload").click();
              }
            }}
          >
            {hasNewInvoice ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(values.invoiceFile)}
                    alt="Invoice preview"
                    className="max-w-full max-h-32 rounded-lg shadow-md object-cover"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-green-700">
                  <p className="font-semibold">تم رفع الصورة بنجاح</p>
                  <p className="text-sm">{values.invoiceFile.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("invoiceFile", null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
                >
                  إزالة الصورة
                </button>
              </div>
            ) : hasSavedInvoice ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={values.invoiceFileUrl}
                    alt="Invoice saved"
                    className="max-w-full max-h-32 rounded-lg shadow-md object-cover"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-green-700">
                  <p className="font-semibold">صورة محفوظة مسبقاً</p>
                  <p className="text-sm break-all">{values.invoiceFileUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFieldValue("invoiceFileUrl", "")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm font-medium"
                >
                  إزالة الصورة
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 rounded-full">
                    <TbFileInvoiceFilled className="text-3xl text-blue-600" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-full opacity-0 transition-opacity duration-300"></div>
                </div>
                <div className="text-gray-600">
                  <p className="font-semibold text-lg">اضغط هنا لتحميل الصورة</p>
                </div>
                <input
                  type="file"
                  name="invoiceFile"
                  accept="image/*"
                  className="hidden"
                  id="invoice-upload"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFieldValue("invoiceFile", file);
                      setFieldValue("invoiceFileUrl", "");
                    }
                  }}
                />
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6;
