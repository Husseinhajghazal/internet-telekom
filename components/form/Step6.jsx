"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Field } from "formik";
import { MdPhoneInTalk } from "react-icons/md";
import { TbFileInvoiceFilled } from "react-icons/tb";
import { formatPhoneNumber } from "../../utils/general";
import FormFieldBlock from "../FormFieldBlock";
import StepHeader from "../StepHeader";

const Step6 = ({ values, errors, touched, setFieldValue }) => {
  const isInquiry = values.serviceType === "inquiry";
  const invoiceFiles = values.invoiceFiles || [];
  const invoiceFileUrls = values.invoiceFileUrls || [];
  const totalImages = invoiceFiles.length + invoiceFileUrls.length;
  const canAddMore = totalImages < 5;

  // Memoize blob URLs to prevent memory leaks from URL.createObjectURL
  const blobUrls = useMemo(() => {
    return invoiceFiles.map((file) => URL.createObjectURL(file));
  }, [invoiceFiles]);

  // Revoke blob URLs on cleanup / when files change
  useEffect(() => {
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [blobUrls]);

  const [turkeyData, setTurkeyData] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [newDistricts, setNewDistricts] = useState([]);
  const [newNeighborhoods, setNewNeighborhoods] = useState([]);

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

    const insidePart = insideDoorNo ? `, iç kapı no: ${insideDoorNo}` : "";

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

  useEffect(() => {
    if (!turkeyData || isInquiry) return;
    const cityCode = values.newAddressProvinceCode;
    if (!cityCode) {
      setNewDistricts([]);
      return;
    }
    setNewDistricts(turkeyData.getDistrictsByCity(cityCode));
  }, [turkeyData, values.newAddressProvinceCode, isInquiry]);

  useEffect(() => {
    if (!turkeyData || isInquiry) return;
    const districtCode = values.newAddressDistrictCode;
    if (!districtCode) {
      setNewNeighborhoods([]);
      return;
    }
    setNewNeighborhoods(turkeyData.getNeighborhoodsByDistrict(districtCode));
  }, [turkeyData, values.newAddressDistrictCode, isInquiry]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-4 pt-0 md:space-y-8">
      <StepHeader
        title="أكمل إدخال معلوماتك"
        subTitle="يرجى إكمال البيانات المطلوبة لمعالجة طلبك"
      >
        {/* <LottieAnimation
          path="/animations/registration.json"
          width={150}
          height={150}
          className="inline-block"
        /> */}
      </StepHeader>

      <div className="space-y-4 md:space-y-8 md:px-6">

        {values?.serviceType === "services" && (
          <FormFieldBlock label="شركة الإنترنت" name="internetCompany">
            <Field
              type="text"
              name="internetCompany"
              id="internetCompany"
              className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                errors.internetCompany && touched.internetCompany
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="اكتب اسم شركة الإنترنت التي تستخدمها حالياً"
            />
          </FormFieldBlock>
        )}
        {values?.serviceType === "services" && values?.selectedService === "change-phone" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 text-right">
                تغيير رقم الموبايل المثبت
              </h3>
              <p className="text-sm text-gray-500 text-right">
                سيتم استبدال رقمك الحالي بالرقم الجديد الذي ستدخله
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldBlock label="رقم الموبايل الحالي" name="phone">
                <div className="relative">
                  <Field
                    type="tel"
                    name="phone"
                    id="phone"
                    className={`w-full outline-0 pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
                      errors.phone && touched.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0 (5XX) XXX XX XX"
                    dir="ltr"
                    onChange={(e) => {
                      setFieldValue("phone", formatPhoneNumber(e.target.value));
                    }}
                  />
                  <MdPhoneInTalk
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#18a2e3]"
                    size={20}
                  />
                </div>
              </FormFieldBlock>

              <FormFieldBlock label="رقم الموبايل الجديد" name="newPhone">
                <div className="relative">
                  <Field
                    type="tel"
                    name="newPhone"
                    id="newPhone"
                    className={`w-full outline-0 pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
                      errors.newPhone && touched.newPhone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0 (5XX) XXX XX XX"
                    dir="ltr"
                    onChange={(e) => {
                      setFieldValue("newPhone", formatPhoneNumber(e.target.value));
                    }}
                  />
                  <MdPhoneInTalk
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#18a2e3]"
                    size={20}
                  />
                </div>
              </FormFieldBlock>
            </div>
          </div>
        )}

        {values?.serviceType === "services" && values?.selectedService === "transfer-name" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 text-right">
                نقل ملكية خط الإنترنت
              </h3>
              <p className="text-sm text-gray-500 text-right">
                سيتم نقل ملكية الخط من المالك الحالي إلى المالك الجديد
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldBlock label="إسم المالك الحالي" name="name">
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
                    errors.name && touched.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أكتب الإسم الكامل هنا"
                />
              </FormFieldBlock>

              <FormFieldBlock label="إسم المالك الجديد" name="newName">
                <Field
                  type="text"
                  name="newName"
                  id="newName"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
                    errors.newName && touched.newName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أكتب الإسم الكامل هنا"
                />
              </FormFieldBlock>

              <FormFieldBlock label="رقم موبايل المالك الحالي" name="phone">
                <div className="relative">
                  <Field
                    type="tel"
                    name="phone"
                    id="phone"
                    className={`w-full outline-0 pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
                      errors.phone && touched.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0 (5XX) XXX XX XX"
                    dir="ltr"
                    onChange={(e) => {
                      setFieldValue("phone", formatPhoneNumber(e.target.value));
                    }}
                  />
                  <MdPhoneInTalk
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#18a2e3]"
                    size={20}
                  />
                </div>
              </FormFieldBlock>

              <FormFieldBlock label="رقم موبايل المالك الجديد" name="newPhone">
                <div className="relative">
                  <Field
                    type="tel"
                    name="newPhone"
                    id="newPhone"
                    className={`w-full outline-0 pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right ${
                      errors.newPhone && touched.newPhone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0 (5XX) XXX XX XX"
                    dir="ltr"
                    onChange={(e) => {
                      setFieldValue("newPhone", formatPhoneNumber(e.target.value));
                    }}
                  />
                  <MdPhoneInTalk
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#18a2e3]"
                    size={20}
                  />
                </div>
              </FormFieldBlock>
            </div>
          </div>
        )}

        {values?.serviceType === "services" && (
          <>
            <FormFieldBlock
              label="رقم أشتراك او فاتورة الإنترنت"
              name="subscriptionNo"
            >
              <Field
                type="text"
                name="subscriptionNo"
                id="subscriptionNo"
                className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                  errors.subscriptionNo && touched.subscriptionNo
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="رقم أشتراك او فاتورة الإنترنت"
              />
            </FormFieldBlock>

            <FormFieldBlock
              label="قيمة أخر فاتورة"
              name="lastInvoiceAmount"
            >
              <Field
                type="text"
                name="lastInvoiceAmount"
                id="lastInvoiceAmount"
                className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                  errors.lastInvoiceAmount && touched.lastInvoiceAmount
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="مثال: 500 ليرة"
              />
            </FormFieldBlock>
          </>
        )}

        {!isInquiry && (
          <>
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 text-right">
                اختر {values.selectedService === "transfer-address" ? "عنوانك الحالي" : "عنوانك"}
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
              <FormFieldBlock label="الولاية" name="addressProvinceCode">
                <select
                  name="addressProvinceCode"
                  id="addressProvinceCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressProvinceCode && touched.addressProvinceCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={values.addressProvinceCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const city = cities.find(
                      (c) => String(c.cityCode) === String(code),
                    );
                    setFieldValue("addressProvinceCode", code);
                    setFieldValue("addressProvinceName", city?.cityName || "");

                    setFieldValue("addressDistrictCode", "");
                    setFieldValue("addressDistrictName", "");
                    setFieldValue("addressNeighborhoodCode", "");
                    setFieldValue("addressNeighborhoodName", "");
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

              <FormFieldBlock label="المنطقة" name="addressDistrictCode">
                <select
                  disabled={!values.addressProvinceCode}
                  name="addressDistrictCode"
                  id="addressDistrictCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressDistrictCode && touched.addressDistrictCode
                      ? "border-red-500"
                      : "border-gray-300"
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

              <FormFieldBlock label="المحلة" name="addressNeighborhoodCode">
                <select
                  disabled={!values.addressDistrictCode}
                  name="addressNeighborhoodCode"
                  id="addressNeighborhoodCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressNeighborhoodCode &&
                    touched.addressNeighborhoodCode
                      ? "border-red-500"
                      : "border-gray-300"
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

              <FormFieldBlock label="الشارع" name="addressStreetName">
                <Field
                  type="text"
                  name="addressStreetName"
                  id="addressStreetName"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressStreetName && touched.addressStreetName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="اكتب إسم الشارع"
                  onChange={(e) => {
                    const streetName = e.target.value;
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

              <FormFieldBlock label="رقم البناء" name="addressOutsideDoorNo">
                <Field
                  type="text"
                  name="addressOutsideDoorNo"
                  id="addressOutsideDoorNo"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressOutsideDoorNo && touched.addressOutsideDoorNo
                      ? "border-red-500"
                      : "border-gray-300"
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

              <FormFieldBlock label="رقم الشقة" name="addressInsideDoorNo">
                <Field
                  type="text"
                  name="addressInsideDoorNo"
                  id="addressInsideDoorNo"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.addressInsideDoorNo && touched.addressInsideDoorNo
                      ? "border-red-500"
                      : "border-gray-300"
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

        {values.selectedService === "transfer-address" && (
          <>
            <div className="space-y-1 mt-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 text-right">
                اختر عنوانك الجديد
              </h3>
              <p className="text-sm text-gray-500 text-right">
                الوجهة التي تريد نقل الخط إليها
              </p>
            </div>

            {errors.newAddress && touched.newAddress && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-right text-red-800 text-sm">
                {errors.newAddress}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldBlock label="الولاية الجديدة" name="newAddressProvinceCode">
                <select
                  name="newAddressProvinceCode"
                  id="newAddressProvinceCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.newAddressProvinceCode && touched.newAddressProvinceCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={values.newAddressProvinceCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const city = cities.find(
                      (c) => String(c.cityCode) === String(code),
                    );
                    setFieldValue("newAddressProvinceCode", code);
                    setFieldValue("newAddressProvinceName", city?.cityName || "");
                    setFieldValue("newAddressDistrictCode", "");
                    setFieldValue("newAddressDistrictName", "");
                    setFieldValue("newAddressNeighborhoodCode", "");
                    setFieldValue("newAddressNeighborhoodName", "");
                    setFieldValue("newAddressStreetName", "");
                    setFieldValue("newAddressOutsideDoorNo", "");
                    setFieldValue("newAddressInsideDoorNo", "");
                    setFieldValue("newAddress", "");
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

              <FormFieldBlock label="المنطقة الجديدة" name="newAddressDistrictCode">
                <select
                  disabled={!values.newAddressProvinceCode}
                  name="newAddressDistrictCode"
                  id="newAddressDistrictCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.newAddressDistrictCode && touched.newAddressDistrictCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={values.newAddressDistrictCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const district = newDistricts.find(
                      (d) => String(d.districtCode) === String(code),
                    );
                    setFieldValue("newAddressDistrictCode", code);
                    setFieldValue(
                      "newAddressDistrictName",
                      district?.districtName || "",
                    );
                    setFieldValue("newAddressNeighborhoodCode", "");
                    setFieldValue("newAddressNeighborhoodName", "");
                    setFieldValue("newAddressStreetName", "");
                    setFieldValue("newAddressOutsideDoorNo", "");
                    setFieldValue("newAddressInsideDoorNo", "");
                    setFieldValue("newAddress", "");
                  }}
                >
                  <option value="">يرجى اختيار المنطقة</option>
                  {newDistricts.map((d) => (
                    <option key={d.districtCode} value={d.districtCode}>
                      {d.districtName}
                    </option>
                  ))}
                </select>
              </FormFieldBlock>

              <FormFieldBlock label="المحلة الجديدة" name="newAddressNeighborhoodCode">
                <select
                  disabled={!values.newAddressDistrictCode}
                  name="newAddressNeighborhoodCode"
                  id="newAddressNeighborhoodCode"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.newAddressNeighborhoodCode &&
                    touched.newAddressNeighborhoodCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={values.newAddressNeighborhoodCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    const nh = newNeighborhoods.find(
                      (n) => String(n.neighborhoodCode) === String(code),
                    );
                    setFieldValue("newAddressNeighborhoodCode", code);
                    setFieldValue(
                      "newAddressNeighborhoodName",
                      nh?.neighborhoodName || "",
                    );
                    setFieldValue("newAddressStreetName", "");
                    setFieldValue("newAddressOutsideDoorNo", "");
                    setFieldValue("newAddressInsideDoorNo", "");
                    setFieldValue("newAddress", "");
                  }}
                >
                  <option value="">يرجى اختيار المحلة</option>
                  {newNeighborhoods.map((n) => (
                    <option key={n.neighborhoodCode} value={n.neighborhoodCode}>
                      {n.neighborhoodName}
                    </option>
                  ))}
                </select>
              </FormFieldBlock>

              <FormFieldBlock label="الشارع الجديد" name="newAddressStreetName">
                <Field
                  type="text"
                  name="newAddressStreetName"
                  id="newAddressStreetName"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.newAddressStreetName && touched.newAddressStreetName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="اكتب إسم الشارع"
                  onChange={(e) => {
                    const streetName = e.target.value;
                    setFieldValue("newAddressStreetName", streetName);
                    const nextAddress = buildAddressString({
                      addressProvinceName: values.newAddressProvinceName,
                      addressDistrictName: values.newAddressDistrictName,
                      addressNeighborhoodName: values.newAddressNeighborhoodName,
                      addressStreetName: streetName,
                      addressOutsideDoorNo: values.newAddressOutsideDoorNo,
                      addressInsideDoorNo: values.newAddressInsideDoorNo,
                    });
                    setFieldValue("newAddress", nextAddress);
                  }}
                />
              </FormFieldBlock>

              <FormFieldBlock label="رقم البناء الجديد" name="newAddressOutsideDoorNo">
                <Field
                  type="text"
                  name="newAddressOutsideDoorNo"
                  id="newAddressOutsideDoorNo"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.newAddressOutsideDoorNo && touched.newAddressOutsideDoorNo
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="اكتب رقم البناء"
                  onChange={(e) => {
                    const nextOutside = e.target.value;
                    setFieldValue("newAddressOutsideDoorNo", nextOutside);
                    const nextAddress = buildAddressString({
                      addressProvinceName: values.newAddressProvinceName,
                      addressDistrictName: values.newAddressDistrictName,
                      addressNeighborhoodName: values.newAddressNeighborhoodName,
                      addressStreetName: values.newAddressStreetName,
                      addressOutsideDoorNo: nextOutside,
                      addressInsideDoorNo: values.newAddressInsideDoorNo,
                    });
                    setFieldValue("newAddress", nextAddress);
                  }}
                />
              </FormFieldBlock>

              <FormFieldBlock label="رقم الشقة الجديد" name="newAddressInsideDoorNo">
                <Field
                  type="text"
                  name="newAddressInsideDoorNo"
                  id="newAddressInsideDoorNo"
                  className={`w-full outline-0 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-start ${
                    errors.newAddressInsideDoorNo && touched.newAddressInsideDoorNo
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="اكتب رقم الباب الداخلي (الشقة)"
                  onChange={(e) => {
                    const nextInside = e.target.value;
                    setFieldValue("newAddressInsideDoorNo", nextInside);
                    const nextAddress = buildAddressString({
                      addressProvinceName: values.newAddressProvinceName,
                      addressDistrictName: values.newAddressDistrictName,
                      addressNeighborhoodName: values.newAddressNeighborhoodName,
                      addressStreetName: values.newAddressStreetName,
                      addressOutsideDoorNo: values.newAddressOutsideDoorNo,
                      addressInsideDoorNo: nextInside,
                    });
                    setFieldValue("newAddress", nextAddress);
                  }}
                />
              </FormFieldBlock>
            </div>
          </>
        )}

        <FormFieldBlock
          label="ملاحظة إضافية (إختياري)"
          labelClassName="md:text-lg"
          wrapperClassName="space-y-4"
        >
          <Field
            as="textarea"
            name="note"
            id="note"
            rows={3}
            className="w-full outline-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18a2e3] focus:border-transparent text-right resize-none"
            placeholder="أكتب هنا أي ملاحظات ٱخرى تريد إخبارنا بها؟"
          />
        </FormFieldBlock>

        {!isInquiry && (
          <div className="space-y-4">
            <label className="block text-right text-gray-700 font-medium md:text-lg">
              أرفق صورة عن عنوانك
              <p className="text-sm text-gray-600">
                (عقد ايجار, أو فاتورة ماء أو فاتورة غاز, أو فاتورة كهرباء)
              </p>
            </label>

            {/* Gallery of Uploaded / Saved Images */}
            {totalImages > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Saved Images */}
                {invoiceFileUrls.map((url, idx) => (
                  <div
                    key={`saved-${idx}`}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-50 flex flex-col justify-between"
                  >
                    <img
                      src={url}
                      alt={`Invoice saved ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newUrls = [...invoiceFileUrls];
                          newUrls.splice(idx, 1);
                          setFieldValue("invoiceFileUrls", newUrls);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="إزالة الصورة"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Newly Added Local Files */}
                {invoiceFiles.map((file, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative group rounded-xl overflow-hidden border-2 border-green-400 shadow-sm aspect-square bg-green-50 flex flex-col justify-between"
                  >
                    <img
                      src={blobUrls[idx]}
                      alt={`Invoice preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newFiles = [...invoiceFiles];
                          newFiles.splice(idx, 1);
                          setFieldValue("invoiceFiles", newFiles);
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="إزالة الصورة"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone for more files */}
            {canAddMore && (
              <label
                htmlFor="invoice-upload"
                className="block relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group border-gray-300 hover:border-[#18a2e3] hover:bg-blue-50"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(
                    "border-[#18a2e3]",
                    "bg-blue-50",
                  );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-[#18a2e3]",
                    "bg-blue-50",
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-[#18a2e3]",
                    "bg-blue-50",
                  );

                  const droppedFiles = Array.from(e.dataTransfer.files).filter(
                    (f) => f.type.startsWith("image/"),
                  );
                  if (droppedFiles.length === 0) return;

                  const availableSlots = 5 - totalImages;
                  const newFiles = droppedFiles.slice(0, availableSlots);

                  setFieldValue("invoiceFiles", [...invoiceFiles, ...newFiles]);
                }}
              >
                <div className="space-y-4">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 rounded-full">
                      <TbFileInvoiceFilled className="text-3xl text-blue-600" />
                    </div>
                  </div>
                  <div className="text-gray-600">
                    <p className="font-semibold text-lg">
                      اضغط هنا أو اسحب الصور للإضافة
                    </p>
                    <p className="text-sm mt-1 text-gray-500">
                      يمكنك إضافة {5 - totalImages} صور أخرى كحد أقصى
                    </p>
                  </div>
                  <input
                    type="file"
                    name="invoiceFiles"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="invoice-upload"
                    onChange={(e) => {
                      const selected = Array.from(e.target.files);
                      if (selected.length > 0) {
                        const availableSlots = 5 - totalImages;
                        const newFiles = selected.slice(0, availableSlots);
                        setFieldValue("invoiceFiles", [
                          ...invoiceFiles,
                          ...newFiles,
                        ]);
                      }
                      e.target.value = ""; // Reset input to allow selecting the same file again if removed
                    }}
                  />
                </div>
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6;
