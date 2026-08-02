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
        grecaptcha.reset(); // ریست کردن کپچا بعد از ارسال موفق
      },
      (error) => {
        console.error("خطا در ارسال ایمیل:", error);
        alert("❌ متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.");
        grecaptcha.reset(); // ریست کردن کپچا در صورت خطا
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
