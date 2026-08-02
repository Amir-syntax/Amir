// مقداردهی اولیه با کلید عمومی
emailjs.init("fstUDp-N7fhxo4SNR");

// تابع ارسال ایمیل
const sendEmail = (event) => {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector(".sub");
  const originalText = submitBtn.textContent;

  // بررسی اینکه کاربر reCAPTCHA رو انجام داده
  const recaptchaResponse = grecaptcha.getResponse();

  if (!recaptchaResponse) {
    alert("❌ لطفاً ابتدا تیک 'من ربات نیستم' را بزنید!");
    return;
  }

  // غیرفعال کردن دکمه
  submitBtn.disabled = true;
  submitBtn.textContent = "در حال ارسال...";

  // ارسال اطلاعات فرم به EmailJS
  emailjs
    .sendForm("service_brbqn8p", "template_0038hma", event.target)
    .then(
      (response) => {
        console.log(
          "ایمیل با موفقیت ارسال شد!",
          response.status,
          response.text,
        );
        alert("✅ پیام شما با موفقیت ارسال شد!");
        form.reset();
        grecaptcha.reset();
      },
      (error) => {
        console.error("خطا در ارسال ایمیل:", error);

        // مدیریت انواع خطاها
        let errorMessage = "❌ متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.";

        if (error.status === 403) {
          errorMessage =
            "❌ اعتبارسنجی امنیتی ناموفق بود. لطفاً تیک 'من ربات نیستم' را بزنید و دوباره تلاش کنید.";
        } else if (error.text) {
          // بررسی محتوای خطا
          if (
            error.text.includes("reCAPTCHA") ||
            error.text.includes("captcha") ||
            error.text.includes("recaptcha")
          ) {
            errorMessage = "❌ لطفاً ابتدا تیک 'من ربات نیستم' را بزنید!";
          } else if (
            error.text.includes("limit") ||
            error.text.includes("Rate")
          ) {
            errorMessage =
              "❌ شما بیش از حد مجاز درخواست ارسال کرده‌اید. لطفاً چند دقیقه بعد تلاش کنید.";
          } else if (
            error.text.includes("service") ||
            error.text.includes("template")
          ) {
            errorMessage =
              "❌ مشکل در تنظیمات سرویس ارسال ایمیل. لطفاً بعداً تلاش کنید.";
          }
        }

        alert(errorMessage);
        grecaptcha.reset();
      },
    )
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
};

// متصل کردن تابع به رویداد submit فرم
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contact-form").addEventListener("submit", sendEmail);
});
