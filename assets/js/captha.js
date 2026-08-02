// مقداردهی اولیه Notyf
const notyf = new Notyf({
  duration: 4000,
  position: {
    x: "center",
    y: "top",
  },
  dismissible: true,
  ripple: true,
  types: [
    {
      type: "success",
      background: "linear-gradient(135deg, #00b09b, #91ce27)",
      icon: "",
    },
    {
      type: "error",
      background: "linear-gradient(135deg, #ff192c, #ffb44b)",
      icon: "",
    },
    {
      type: "warning",
      background: "linear-gradient(135deg, #f7f01e, #ff823a)",
      icon: "",
    },
  ],
});

// تابع نمایش نوتیفیکیشن
function showNotification(message, type = "success") {
  notyf.open({
    type: type,
    message: message,
    duration: 4000,
  });
}

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
    showNotification("لطفاً ابتدا تیک 'من ربات نیستم' را بزنید!", "warning");
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
        showNotification("پیام شما با موفقیت ارسال شد!", "success");
        form.reset();
        grecaptcha.reset();
      },
      (error) => {
        console.error("خطا در ارسال ایمیل:", error);

        // مدیریت انواع خطاها
        let errorMessage = "متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.";

        if (error.status === 403) {
          errorMessage =
            "اعتبارسنجی امنیتی ناموفق بود. لطفاً تیک 'من ربات نیستم' را بزنید و دوباره تلاش کنید.";
        } else if (error.text) {
          if (
            error.text.includes("reCAPTCHA") ||
            error.text.includes("captcha") ||
            error.text.includes("recaptcha")
          ) {
            errorMessage = "لطفاً ابتدا تیک 'من ربات نیستم' را بزنید!";
          } else if (
            error.text.includes("limit") ||
            error.text.includes("Rate")
          ) {
            errorMessage =
              "شما بیش از حد مجاز درخواست ارسال کرده‌اید. لطفاً چند دقیقه بعد تلاش کنید.";
          } else if (
            error.text.includes("service") ||
            error.text.includes("template")
          ) {
            errorMessage =
              "مشکل در تنظیمات سرویس ارسال ایمیل. لطفاً بعداً تلاش کنید.";
          }
        }

        showNotification(errorMessage, "error");
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
