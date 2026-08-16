// ========================================
// Notyf
// ========================================

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

// ========================================
// Notification
// ========================================

function showNotification(message, type = "success") {
  notyf.open({
    type: type,
    message: message,
    duration: 4000,
  });
}

// ========================================
// EmailJS
// ========================================

emailjs.init("fstUDp-N7fhxo4SNR");

// ========================================
// reCAPTCHA
// ========================================

const RECAPTCHA_SITE_KEY = "6LflhHEtAAAAAG5Vh-SSSx6zJvIobsGE0TVKvwLR";

let recaptchaLoaded = false;
let recaptchaLoading = false;
let recaptchaWidgetId = null;

// ========================================
// Load reCAPTCHA
// ========================================

function loadRecaptcha() {
  return new Promise((resolve, reject) => {
    // قبلاً لود شده
    if (recaptchaLoaded && window.grecaptcha) {
      resolve();
      return;
    }

    // در حال لود شدن
    if (recaptchaLoading) {
      const interval = setInterval(() => {
        if (recaptchaLoaded && window.grecaptcha) {
          clearInterval(interval);
          resolve();
        }
      }, 50);

      return;
    }

    recaptchaLoading = true;

    // callback
    window.onRecaptchaLoaded = function () {
      recaptchaLoaded = true;
      recaptchaLoading = false;

      recaptchaWidgetId = grecaptcha.render("recaptcha", {
        sitekey: RECAPTCHA_SITE_KEY,
      });

      resolve();
    };

    // ساخت script
    const script = document.createElement("script");

    script.src =
      "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit";

    script.async = true;
    script.defer = true;

    script.onload = function () {
      console.log("reCAPTCHA script loaded");
    };

    script.onerror = function () {
      recaptchaLoading = false;

      reject(new Error("Failed to load reCAPTCHA"));
    };

    document.head.appendChild(script);
  });
}

// ========================================
// وقتی کاربر به فرم نزدیک شد
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        console.log("Loading reCAPTCHA...");

        loadRecaptcha().catch((error) => {
          console.error("reCAPTCHA error:", error);
        });

        observer.disconnect();
      }
    },
    {
      rootMargin: "500px",
    },
  );

  observer.observe(contactForm);

  // Submit
  contactForm.addEventListener("submit", sendEmail5);
});

// ========================================
// Send Email
// ========================================

async function sendEmail5(event) {
  event.preventDefault();

  const form = event.target;

  const submitBtn = form.querySelector(".sub");

  const originalText = submitBtn.textContent;

  // اگر reCAPTCHA هنوز لود نشده
  if (!recaptchaLoaded || !window.grecaptcha) {
    try {
      submitBtn.disabled = true;

      submitBtn.textContent = "در حال آماده‌سازی...";

      await loadRecaptcha();

      submitBtn.disabled = false;

      submitBtn.textContent = originalText;

      showNotification("لطفاً ابتدا تیک «من ربات نیستم» را بزنید.", "warning");

      return;
    } catch (error) {
      console.error(error);

      submitBtn.disabled = false;

      submitBtn.textContent = originalText;

      showNotification("بارگذاری reCAPTCHA ناموفق بود.", "error");

      return;
    }
  }

  // ========================================
  // بررسی reCAPTCHA
  // ========================================

  const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);

  if (!recaptchaResponse) {
    showNotification("لطفاً ابتدا تیک «من ربات نیستم» را بزنید!", "warning");

    return;
  }

  // ========================================
  // ارسال
  // ========================================

  submitBtn.disabled = true;

  submitBtn.textContent = "در حال ارسال...";

  try {
    const response = await emailjs.sendForm(
      "service_brbqn8p",
      "template_0038hma",
      form,
    );

    console.log("ایمیل با موفقیت ارسال شد!", response.status, response.text);

    showNotification("پیام شما با موفقیت ارسال شد!", "success");

    form.reset();

    if (recaptchaWidgetId !== null) {
      grecaptcha.reset(recaptchaWidgetId);
    }
  } catch (error) {
    console.error("خطا در ارسال ایمیل:", error);

    let errorMessage = "متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.";

    if (error.status === 403) {
      errorMessage =
        "اعتبارسنجی امنیتی ناموفق بود. لطفاً تیک «من ربات نیستم» را بزنید و دوباره تلاش کنید.";
    } else if (error.text) {
      if (
        error.text.includes("reCAPTCHA") ||
        error.text.includes("captcha") ||
        error.text.includes("recaptcha")
      ) {
        errorMessage = "لطفاً ابتدا تیک «من ربات نیستم» را بزنید!";
      } else if (error.text.includes("limit") || error.text.includes("Rate")) {
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

    if (window.grecaptcha && recaptchaWidgetId !== null) {
      grecaptcha.reset(recaptchaWidgetId);
    }
  } finally {
    submitBtn.disabled = false;

    submitBtn.textContent = originalText;
  }
}
