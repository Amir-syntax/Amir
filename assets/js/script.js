// مقداردهی اولیه با کلید عمومی که از EmailJS گرفتی
emailjs.init("fstUDp-N7fhxo4SNR");

// تابع ارسال ایمیل
const sendEmail = (event) => {
  event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه

  const form = event.target;
  const submitBtn = form.querySelector(".sub"); // دکمه ارسال

  // ذخیره متن اصلی دکمه برای برگردوندن بعداً
  const originalText = submitBtn.textContent;

  // غیرفعال کردن دکمه و تغییر متن
  submitBtn.disabled = true;
  submitBtn.textContent = "در حال ارسال...";

  // ارسال اطلاعات فرم به EmailJS
  emailjs
    .sendForm(
      "service_brbqn8p", // شناسه سرویس EmailJS
      "template_0038hma", // شناسه قالب EmailJS
      event.target, // خود فرم به عنوان target
    )
    .then(
      (response) => {
        console.log(
          "ایمیل با موفقیت ارسال شد!",
          response.status,
          response.text,
        );
        alert("پیام شما با موفقیت ارسال شد!");
        form.reset(); // پاک کردن فرم بعد از ارسال موفق
      },
      (error) => {
        console.error("خطا در ارسال ایمیل:", error);
        alert("متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.");
      },
    )
    .finally(() => {
      // این بخش همیشه اجرا میشه (چه موفق، چه ناموفق)
      // فعال کردن مجدد دکمه و برگردوندن متن اصلی
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
};

// متصل کردن تابع به رویداد submit فرم
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contact-form").addEventListener("submit", sendEmail);
});
